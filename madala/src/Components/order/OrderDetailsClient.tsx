"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

import { updateShippingAddress } from "@/lib/actions/order";
import type { IOrder, OrderStatus } from "@/models/Order";
import type { AddressType } from "@/types/address";
import { formatCurrency } from "@/lib/utils";

import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import StatusBadge from "./StatusBadge";
import { Separator } from "@/Components/ui/separator";
import { ArrowLeft, Pencil, Star } from "lucide-react";
import dynamic from "next/dynamic";

const CancelOrderButton = dynamic(() => import("@/Components/order/CancelOrderButton"), { loading: () => <span>Đang tải...</span> });
const SafeImage = dynamic(() => import("@/Components/SafeImage"), { loading: () => <div className="w-20 h-20 bg-gray-100 animate-pulse rounded-md border" /> });
const AddressSelectionModal = dynamic(() => import("@/Components/Profile/AddressSelectionModal"), { loading: () => null, ssr: false });
const ProductReviewModal = dynamic(() => import("@/Components/products/ProductReviewModal"), { loading: () => null, ssr: false });



export default function OrderDetailsClient({ order }: { order: IOrder }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null);

  const handleChangeAddressClick = () => {
    // Kiểm tra trạng thái đơn hàng
    if (order.status !== 'processing') {
      toast.error("Chỉ có thể thay đổi địa chỉ cho đơn hàng đang 'Đang xử lý'.");
      return;
    }
    setIsModalOpen(true);
  };

  // Xử lý khi một địa chỉ mới được chọn từ modal
  const handleAddressSelect = (selectedAddress: AddressType) => {
    startTransition(async () => {
      const result = await updateShippingAddress({
        orderId: order._id?.toString?.() || String(order._id),
        newAddress: {
          fullName: selectedAddress.fullName,
          phoneNumber: selectedAddress.phoneNumber,
          street: selectedAddress.street,
          city: selectedAddress.city,
          district: selectedAddress.district,
          ward: selectedAddress.ward,
        },
      });

      if (result.success) {
        toast.success("Cập nhật địa chỉ thành công!");
        setIsModalOpen(false);
        // Server Action revalidate -> Next.js sẽ cập nhật lại UI
      } else {
        toast.error(result.message || "Đã có lỗi xảy ra khi cập nhật.");
      }
    });
  };

  // Xử lý mở modal đánh giá sản phẩm
  const handleReviewProduct = (item: any) => {
    // Thử sử dụng sku làm slug trước (nhiều khi chúng giống nhau)
    setSelectedProduct({
      id: item.sku,
      name: item.name,
      image: item.image
    });
    setIsReviewModalOpen(true);
  };

  // Đóng modal đánh giá
  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/profile/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          Chi tiết đơn hàng #{order.orderId}
        </h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="text-sm text-muted-foreground mb-8">
        Ngày đặt hàng: {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : "-"}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Card Địa chỉ người nhận */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Địa chỉ người nhận</CardTitle>
            <Button variant="ghost" size="sm" className="h-auto p-1 text-primary" onClick={handleChangeAddressClick}>
              <Pencil className="w-3.5 h-3.5 mr-1" />
              Thay đổi
            </Button>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-semibold">{order.shippingAddress.fullName}</p>
            <p className="text-muted-foreground">
              Địa chỉ:{" "}
              {`${order.shippingAddress.street}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.city}`}
            </p>
            <p className="text-muted-foreground">
              Điện thoại: {order.shippingAddress.phoneNumber}
            </p>
          </CardContent>
        </Card>

        {/* Card Hình thức giao hàng */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hình thức giao hàng</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-semibold">{order.shipping.method}</p>
            <p className="text-muted-foreground">
              Phí vận chuyển: {formatCurrency(order.shipping.fee)}
            </p>
          </CardContent>
        </Card>

        {/* Card Hình thức thanh toán */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hình thức thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              {order.payment.method === "COD"
                ? "Thanh toán tiền mặt khi nhận hàng"
                : `Thanh toán qua ${order.payment.method}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Card danh sách sản phẩm */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6">
            {order.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 items-center gap-4 py-4">
                <div className="col-span-2">
                  <SafeImage src={item.image} alt={item.name} width={80} height={80} className="rounded-md border" />
                </div>
                <div className="col-span-4">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                </div>
                <p className="col-span-2 text-sm text-center">{formatCurrency(item.price)}</p>
                <p className="col-span-1 text-sm text-center">x{item.quantity}</p>
                <div className="col-span-3 text-right">
                  <p className="text-sm font-semibold mb-2">{formatCurrency(item.price * item.quantity)}</p>
                  {/* Nút đánh giá - chỉ hiện khi đơn hàng đã giao */}
                  {order.status === 'delivered' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReviewProduct(item)}
                      className="text-xs"
                    >
                      Đánh giá
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className="p-6 space-y-2 text-sm w-full max-w-sm ml-auto">
            <div className="flex justify-between">
              <p>Tạm tính</p>
              <p>{formatCurrency(order.totals.subtotal)}</p>
            </div>
            <div className="flex justify-between">
              <p>Phí vận chuyển</p>
              <p>{formatCurrency(order.totals.shippingTotal)}</p>
            </div>
            <div className="flex justify-between">
              <p>Giảm giá</p>
              <p>-{formatCurrency(order.totals.discount)}</p>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-base">
              <p>Tổng cộng</p>
              <p className="text-red-600">{formatCurrency(order.totals.grandTotal)}</p>
            </div>
          </div>
        </CardContent>
        {/* Button hủy đơn hàng */}
        {(order.status === "processing" || order.status === "pending") && (
          <CardFooter className="justify-end">
            <CancelOrderButton orderId={order._id?.toString?.() || String(order._id)} />
          </CardFooter>
        )}
      </Card>

      {/* Modal address select */}
      <AddressSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddressSelect={handleAddressSelect}
      />

      {/* Modal đánh giá sản phẩm */}
      {selectedProduct && (
        <ProductReviewModal
          isOpen={isReviewModalOpen}
          onClose={handleCloseReviewModal}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          productImage={selectedProduct.image}
          orderId={order._id?.toString?.() || String(order._id)}
        />
      )}
    </>
  );
}
