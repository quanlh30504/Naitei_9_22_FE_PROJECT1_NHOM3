"use client";
import Image from "next/image";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import QuantitySelector from "./QuantitySelector";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export type CartProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  quantity: number;
  stock: number;
};

interface CartItemProps {
  item: CartProduct;
}

export default function CartItem({ item }: CartItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const { selectedItemIds, toggleItemSelected, removeItem } = useCart();
  const isSelected = selectedItemIds.includes(item.id);
  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="grid grid-cols-12 items-center gap-4 pt-4">
        <div className="col-span-1 flex justify-center">
          <Checkbox
            id={`item-${item.id}`}
            checked={isSelected}
            onCheckedChange={() => toggleItemSelected(item.id)}
          />
        </div>
        <div className="col-span-2">
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
        </div>
        <div className="col-span-3">
          <p className="font-medium text-sm line-clamp-2">{item.name}</p>
        </div>
        <div className="col-span-2 text-center">
          <p className="font-semibold text-sm text-red-600">
            {formatPrice(item.salePrice || item.price)}
          </p>
          {item.price && (
            <p className="text-xs text-gray-400 line-through">
              {formatPrice(item.price)}
            </p>
          )}
        </div>
        <div className="col-span-2 flex flex-col items-center">
          <QuantitySelector productId={item.id} />
          {typeof item.stock === "number" && item.stock > 0 ? (
            <p className="text-xs text-green-600 mt-1">
              Còn {item.stock} sản phẩm
            </p>
          ) : (
            <p className="text-xs text-red-600 mt-1">Hết hàng</p>
          )}
        </div>
        <div className="col-span-1 text-center font-semibold text-red-600 text-sm">
          {formatPrice((item.salePrice ?? item.price) * item.quantity)}
        </div>
        <div className="col-span-1 flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onclick={() => removeItem(item.id)}
          >
            <Trash2 className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
