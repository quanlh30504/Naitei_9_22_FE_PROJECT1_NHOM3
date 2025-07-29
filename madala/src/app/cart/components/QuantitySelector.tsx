"use client";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";


interface QuantitySelectorProps {
  productId: string;
}

export default function QuantitySelector({ productId }: QuantitySelectorProps) {

  const { items, updateQuantity } = useCart();
  const item = items.find((i) => i.id === productId);

  if (!item) return null;

  const handleDecrement = () => {
    updateQuantity(productId, Math.max(1, item.quantity - 1));
  };

  const handleIncrement = () => {
    updateQuantity(productId, item.quantity + 1);
  };
  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleDecrement}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        className="h-8 w-14 text-center border-x-0 rounded-none focus-visible:ring-0"
        value={item.quantity}
        readOnly
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleIncrement}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
