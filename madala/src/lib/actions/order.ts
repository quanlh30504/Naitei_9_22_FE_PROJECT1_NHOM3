"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth"; 
import connectToDB from "@/lib/db"; 
import Product, { IProduct } from "@/models/Product";
import Address, { IAddress } from "@/models/Address";
import Order, { PaymentMethod } from "@/models/Order";
import Cart from "@/models/Cart";
import CartItem, { ICartItem } from "@/models/CartItem";

interface CreateOrderInput {
    selectedCartItemIds: string[];
    shippingAddressId: string;
    paymentMethod: PaymentMethod;
    notes?: string;
}


/**
 * Mô tả qua về các step
 * 1. xác thực người dùng và dữ liệu đầu vào.
 * 2. xắt đầu một MongoDB transaction.
 * 3. kiểm tra quyền sở hữu các mục trong giỏ hàng và tình trạng tồn kho của sản phẩm.
 * 4. tạo một bản ghi Order mới với thông tin "snapshot" tại thời điểm đặt hàng.
 * 5. cập nhật số lượng tồn kho của các sản phẩm đã mua.
 * 6. xóa các mục đã được đặt hàng khỏi giỏ hàng của người dùng.
 * 7. hoàn tất transaction nếu tất cả các bước thành công, hoặc hủy bỏ nếu có lỗi.
 * @param {CreateOrderInput} input - Đối tượng chứa thông tin cần thiết để tạo đơn hàng.
 * @param {string[]} input.selectedCartItemIds - Mảng các ID của CartItem được người dùng chọn để thanh toán.
 * @param {string} input.shippingAddressId - ID của địa chỉ giao hàng đã chọn.
 * @param {PaymentMethod} input.paymentMethod - Phương thức thanh toán đã chọn.
 * @param {string} [input.notes] - Ghi chú tùy chọn từ khách hàng.
 * @returns {Promise<{ success: boolean; message: string; orderId?: string }>} đối tượng cho biết kết quả,
 * bao gồm trạng thái thành công, thông báo và ID của đơn hàng mới nếu thành công.
 */

export async function createOrderFromCart(input: CreateOrderInput): Promise<{ success: boolean; message: string; orderId?: string }> {
    // Step 1: Xác thực & Lấy thông tin phiên đăng nhập
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Bạn cần đăng nhập để đặt hàng." };
    }

    // Step 2: Xác thực dữ liệu đầu vào 
    const { selectedCartItemIds, shippingAddressId, paymentMethod, notes } = input;

    if (!selectedCartItemIds || !Array.isArray(selectedCartItemIds) || selectedCartItemIds.length === 0) {
        return { success: false, message: "Vui lòng chọn ít nhất một sản phẩm để thanh toán." };
    }
    if (!shippingAddressId || typeof shippingAddressId !== 'string') {
        return { success: false, message: "Vui lòng chọn địa chỉ giao hàng." };
    }
    const validPaymentMethods: PaymentMethod[] = ['COD', 'VNPAY', 'MOMO', 'CreditCard'];
    if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
        return { success: false, message: "Phương thức thanh toán không hợp lệ." };
    }

    // Step 3: Tạo Transaction
    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
        await connectToDB();

        // Step 4: Xác thực quyền sở hữu và lấy dữ liệu gốc từ DB 
        const userCart = await Cart.findOne({ user: session.user.id }).session(mongoSession);
        if (!userCart) {
            throw new Error("Không tìm thấy giỏ hàng.");
        }

        const userItemIdsSet = new Set(userCart.items.map(id => id.toString()));
        const validCartItemIds = selectedCartItemIds.filter(id => userItemIdsSet.has(id));

        if (validCartItemIds.length === 0) {
            throw new Error("Không có sản phẩm hợp lệ nào được chọn.");
        }

        const cartItemsToOrder = await CartItem.find({
            _id: { $in: validCartItemIds }
        }).populate<{ product: IProduct }>('product').session(mongoSession);

        const userAddress = await Address.findOne({ _id: shippingAddressId, userId: session.user.id }).session(mongoSession);
        if (!userAddress) {
            throw new Error("Địa chỉ giao hàng không hợp lệ.");
        }

        // Step 5: Kiểm tra tồn kho và tính toán 
        let subtotal = 0;
        const orderItems = [];
        const stockUpdates = [];

        for (const item of cartItemsToOrder) {
            if (!item.product) {
                throw new Error(`Sản phẩm cho item ${item._id} không tồn tại.`);
            }
            if (item.product.stock < item.quantity) {
                throw new Error(`Sản phẩm "${item.product.name}" không đủ số lượng tồn kho.`);
            }

            const price = item.product.salePrice > 0 ? item.product.salePrice : item.product.price;
            subtotal += price * item.quantity;

            orderItems.push({
                productId: item.product._id,
                name: item.product.name,
                sku: item.product.sku,
                image: item.product.images[0],
                price: price,
                quantity: item.quantity,
                attributes: {}, 
            });

            stockUpdates.push({
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { stock: -item.quantity } },
                },
            });
        }
        
        // Step 6: Tính toán tổng cộng 
        const shippingFee = 30000;
        const grandTotal = subtotal + shippingFee;

        // Step 7: Tạo đơn hàng mới 
        const newOrder = new Order({
            orderId: `DH-${Date.now()}`,
            userId: session.user.id,
            items: orderItems,
            shippingAddress: {
                fullName: userAddress.fullName,
                phoneNumber: userAddress.phoneNumber,
                street: userAddress.street,
                city: userAddress.city,
                district: userAddress.district,
                ward: userAddress.ward,
            },
            payment: { method: paymentMethod, status: 'pending' },
            status: 'pending',
            shipping: { fee: shippingFee },
            totals: { subtotal, shippingTotal: shippingFee, discount: 0, grandTotal },
            notes,
        });

        await newOrder.save({ session: mongoSession });
        
        // Step 8: Cập nhật tồn kho hàng loạt 
        await Product.bulkWrite(stockUpdates, { session: mongoSession });

        // Step 9: Dọn dẹp giỏ hàng 
        await Cart.updateOne(
            { _id: userCart._id },
            { $pull: { items: { $in: validCartItemIds } } },
            { session: mongoSession }
        );
        await CartItem.deleteMany({ _id: { $in: validCartItemIds } }, { session: mongoSession });

        // Step 10: Hoàn tất transaction
        await mongoSession.commitTransaction();

        revalidatePath("/profile/orders");
        revalidatePath("/cart");

        return { success: true, message: "Đặt hàng thành công!", orderId: newOrder.orderId };

    } catch (error: any) {
        await mongoSession.abortTransaction();
        console.error("[CREATE_ORDER_ERROR]", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi khi tạo đơn hàng." };
    } finally {
        mongoSession.endSession();
    }
}
