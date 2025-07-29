"use client";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { CartProduct } from "./CartItem";
import { useCart } from "../context/CartContext";
import { useMemo } from "react";

interface OrderSummaryProps {
  address: { name: string; phone: string; location: string };
}

export default function OrderSummary({ address }: OrderSummaryProps) {
  const { items, selectedItemIds } = useCart();

  const { selectedItems, totalOriginal, totalDiscount, totalFinal } =
    useMemo(() => {
      const selected = items.filter((item) =>
        selectedItemIds.includes(item.id)
      );

      const original = selected.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const final = selected.reduce(
        (acc, item) => acc + (item.salePrice ?? item.price) * item.quantity,
        0
      );

      return {
        selectedItems: selected,
        totalOriginal: original,
        totalFinal: final,
        totalDiscount: original - final,
      };
    }, [items, selectedItemIds]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="w-full lg:w-1/3">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Giao tới</CardTitle>
            <Button variant="link" className="p-0 h-auto">
              Thay đổi
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="font-semibold text-sm mb-4">
            <p>{address.name}</p>
            <p>{address.phone}</p>
          </div>
          <p className="text-sm text-gray-600">{address.location}</p>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <p>Tạm tính</p>
              <p>{formatPrice(totalOriginal)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p>Giảm giá</p>
              <p>-{formatPrice(totalDiscount)}</p>
            </div>
          </div>
          <div className="border-t my-4"></div>
          <div className="flex justify-between font-semibold">
            <p>Tổng tiền thanh toán</p>
            <p className="text-red-600 text-lg">{formatPrice(totalFinal)}</p>
          </div>
          <p className="text-xs text-gray-500 text-right">
            (Đã bao gồm VAT nếu có)
          </p>
          <Button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-lg h-12">
            Mua Hàng ({selectedItemIds.length})
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
