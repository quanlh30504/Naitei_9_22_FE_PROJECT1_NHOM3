"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import connectToDB from "@/lib/db";
import User, { IUser } from "@/models/User";
import Product, { IProduct } from "@/models/Product";
import Address, { IAddress } from "@/models/Address";
import Order, { PaymentMethod, IOrderItem, OrderStatus } from "@/models/Order";
import Cart from "@/models/Cart";
import CartItem, { ICartItem } from "@/models/CartItem";

type ActionResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

interface PlaceOrderInput {
  selectedCartItemIds: string[];
  shippingAddressId: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export async function placeOrder(
  input: PlaceOrderInput
): Promise<{ success: boolean; message: string; orderId?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Bạn cần đăng nhập để đặt hàng." };
  }

  const { selectedCartItemIds, shippingAddressId, paymentMethod } = input;
  if (
    !selectedCartItemIds ||
    selectedCartItemIds.length === 0 ||
    !shippingAddressId ||
    !paymentMethod
  ) {
    return { success: false, message: "Thông tin đặt hàng không hợp lệ." };
  }

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    await connectToDB();

    // --- Lấy dữ liệu gốc ---
    const userCart = await Cart.findOne({ user: session.user.id }).session(
      mongoSession
    );
    if (!userCart) throw new Error("Không tìm thấy giỏ hàng.");

    const validCartItemIds = selectedCartItemIds.filter((id) =>
      userCart.items.some((itemId) => itemId.toString() === id)
    );
    if (validCartItemIds.length === 0)
      throw new Error("Không có sản phẩm hợp lệ nào được chọn.");

    const cartItemsToOrder = await CartItem.find({
      _id: { $in: validCartItemIds },
    })
      .populate<{ product: IProduct }>("product")
      .session(mongoSession);
    const userAddress = await Address.findOne({
      _id: shippingAddressId,
      userId: session.user.id,
    }).session(mongoSession);
    if (!userAddress) throw new Error("Địa chỉ giao hàng không hợp lệ.");

    // --- Tính toán và kiểm tra tồn kho ---
    let subtotal = 0;
    let subdiscount = 0;
    const orderItems: IOrderItem[] = [];
    const stockUpdates = [];

    for (const item of cartItemsToOrder) {
      // Kiểm tra ban đầu để cung cấp thông báo lỗi sớm nếu có thể
      if (!item.product)
        throw new Error("Một sản phẩm trong giỏ hàng không tồn tại.");
      if (item.product.stock < item.quantity)
        throw new Error(`Sản phẩm "${item.product.name}" không đủ hàng.`);

      const price = item.product.price;
      const priceSale = item.product.salePrice ?? item.product.price;
      subtotal += price * item.quantity;
      subdiscount += (price - priceSale) * item.quantity;

      orderItems.push({
        productId: item.product._id,
        name: item.product.name,
        sku: item.product.sku,
        image: item.product.images[0] || "",
        price: priceSale,
        quantity: item.quantity,
        attributes: {
          color: undefined,
          size: undefined,
        },
      });

      stockUpdates.push({
        updateOne: {
          filter: {
            _id: item.product._id,
            stock: { $gte: item.quantity },
          },
          update: { $inc: { stock: -item.quantity } },
        },
      });
    }
    const shippingFee = 30000;
    const grandTotal = subtotal - subdiscount + shippingFee;

    // --- LOGIC THANH TOÁN THEO TỪNG PHƯƠNG THỨC ---
    let paymentStatus: "pending" | "paid" = "pending";
    let transactionId: string | undefined = undefined;

    switch (paymentMethod) {
      case "COD":
        break;
      case "CreditCard":
        paymentStatus = "paid";
        transactionId = `card_demo_${Date.now()}`;
        break;
      case "MandalaPay":
        const user = await User.findById(session.user.id).session(mongoSession);
        if (!user) throw new Error("Không tìm thấy người dùng.");
        if (user.mandalaPayBalance < grandTotal) {
          throw new Error(
            "Số dư trong ví MandalaPay không đủ để thực hiện thanh toán."
          );
        }
        user.mandalaPayBalance -= grandTotal;
        await user.save({ session: mongoSession });
        paymentStatus = "paid";
        transactionId = `mandala_pay_demo_${Date.now()}`;
        break;
      default:
        throw new Error("Phương thức thanh toán không được hỗ trợ.");
    }

    // --- Cập nhật tồn kho hàng  TRƯỚC KHI tạo đơn hàng ---
    const stockUpdateResult = await Product.bulkWrite(stockUpdates, {
      session: mongoSession,
    });

    if (stockUpdateResult.modifiedCount < stockUpdates.length) {
      throw new Error(
        "Rất tiếc, một sản phẩm trong giỏ hàng của bạn vừa hết hàng. Vui lòng thử lại."
      );
    }

    // --- Tạo đơn hàng với trạng thái thanh toán tương ứng ---
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
      payment: {
        method: paymentMethod,
        status: paymentStatus,
        transactionId: transactionId,
      },
      status: "processing",
      shipping: { fee: shippingFee },
      totals: {
        subtotal,
        shippingTotal: shippingFee,
        discount: subdiscount,
        grandTotal,
      },
      notes: input.notes,
    });

    await newOrder.save({ session: mongoSession });

    // --- Hoàn tất các thao tác ---
    await Cart.updateOne(
      { _id: userCart._id },
      { $pull: { items: { $in: validCartItemIds } } },
      { session: mongoSession }
    );
    await CartItem.deleteMany(
      { _id: { $in: validCartItemIds } },
      { session: mongoSession }
    );

    await mongoSession.commitTransaction();

    revalidatePath("/cart");
    revalidatePath("/profile/orders");

    console.log("order id " +  newOrder._id.toString());
    return {
      success: true,
      message: "Đặt hàng thành công!",
      orderId: newOrder._id.toString(),
    };
  } catch (error: any) {
    await mongoSession.abortTransaction();
    console.error("[PLACE_ORDER_ERROR]", error);
    return {
      success: false,
      message: error.message || "Đã xảy ra lỗi khi đặt hàng.",
    };
  } finally {
    mongoSession.endSession();
  }
}

/**
 * Lấy danh sách các đơn hàng của người dùng đang đăng nhập.
 * Có thể lọc theo trạng thái đơn hàng.
 * @param {OrderStatus} [status] - Trạng thái đơn hàng tùy chọn để lọc.
 * @returns {Promise<ActionResponse<IOrder[]>>} Danh sách đơn hàng.
 */
export async function getMyOrders(
  status?: OrderStatus
): Promise<ActionResponse<IOrder[]>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Vui lòng đăng nhập." };
  }

  try {
    await connectToDB();

    const filter: { userId: string; status?: OrderStatus } = {
      userId: session.user.id,
    };

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 }) // Sắp xếp đơn hàng mới nhất lên đầu
      .lean();

    return {
      success: true,
      message: "Lấy danh sách đơn hàng thành công.",
      data: orders,
    };
  } catch (error) {
    console.error("[GET_MY_ORDERS_ERROR]", error);
    return { success: false, message: "Lỗi khi lấy danh sách đơn hàng." };
  }
}

/**
 * Lấy thông tin chi tiết của một đơn hàng bằng ID.
 * Đảm bảo đơn hàng thuộc về người dùng đang đăng nhập.
 * @param {string} orderId - ID của đơn hàng cần lấy.
 * @returns {Promise<ActionResponse<IOrder>>} Chi tiết đơn hàng.
 */
export async function getOrderDetails(
  orderId: string
): Promise<ActionResponse<IOrder>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Vui lòng đăng nhập." };
  }

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return { success: false, message: "ID đơn hàng không hợp lệ." };
  }

  try {
    await connectToDB();
    const order = await Order.findOne({
      _id: orderId,
      userId: session.user.id,
    }).lean();

    if (!order) {
      return { success: false, message: "Không tìm thấy đơn hàng." };
    }

    return {
      success: true,
      message: "Lấy chi tiết đơn hàng thành công.",
      data: order,
    };
  } catch (error) {
    console.error("[GET_ORDER_DETAILS_ERROR]", error);
    return { success: false, message: "Lỗi khi lấy chi tiết đơn hàng." };
  }
}

/**
 * Hủy một đơn hàng của người dùng.
 * Chỉ có thể hủy các đơn hàng đang ở trạng thái 'processing'.
 * Sẽ hoàn trả lại số lượng tồn kho cho các sản phẩm trong đơn hàng.
 * @param {string} orderId - ID của đơn hàng cần hủy.
 * @returns {Promise<ActionResponse>} Kết quả của hành động.
 */
export async function cancelOrder(orderId: string): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Vui lòng đăng nhập." };
  }

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return { success: false, message: "ID đơn hàng không hợp lệ." };
  }

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    await connectToDB();

    // Tìm đơn hàng và đảm bảo nó thuộc về user và có thể hủy
    const order = await Order.findOne({
      _id: orderId,
      userId: session.user.id,
    }).session(mongoSession);

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng.");
    }
    if (order.status !== "processing") {
      throw new Error(
        "Chỉ có thể hủy đơn hàng đang ở trạng thái 'Chờ xác nhận'."
      );
    }

    // Chuẩn bị các thao tác hoàn trả tồn kho
    const stockUpdates = order.items.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stock: item.quantity } },
      },
    }));

    // Thực hiện hoàn trả tồn kho
    if (stockUpdates.length > 0) {
      await Product.bulkWrite(stockUpdates, { session: mongoSession });
    }

    // Cập nhật trạng thái đơn hàng
    order.status = "cancelled";
    await order.save({ session: mongoSession });

    await mongoSession.commitTransaction();

    revalidatePath(`/profile/orders`);
    revalidatePath(`/profile/orders/${orderId}`);

    return { success: true, message: "Hủy đơn hàng thành công." };
  } catch (error: any) {
    await mongoSession.abortTransaction();
    console.error("[CANCEL_ORDER_ERROR]", error);
    return {
      success: false,
      message: error.message || "Lỗi khi hủy đơn hàng.",
    };
  } finally {
    mongoSession.endSession();
  }
}
