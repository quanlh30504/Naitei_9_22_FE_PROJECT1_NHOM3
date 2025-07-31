"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useDebounce } from "use-debounce"; 

interface QuantitySelectorProps {
  cartItemId: string;
  initialQuantity: number;
  stock: number;
  onQuantityChange: (newQuantity: number) => void; 
}

export default function QuantitySelector({
  cartItemId,
  initialQuantity,
  stock,
  onQuantityChange,
}: QuantitySelectorProps) {
  const { isPending } = useCart();
  const [quantity, setQuantity] = useState(initialQuantity);
  
  const [debouncedQuantity] = useDebounce(quantity, 500); // Trì hoãn 500ms

  useEffect(() => {
    if (debouncedQuantity !== initialQuantity) {
      onQuantityChange(debouncedQuantity);
    }
  }, [debouncedQuantity, initialQuantity, onQuantityChange]);
  
  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(stock, prev + 1));
  };

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleDecrement}
        disabled={isPending || quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        className="h-8 w-14 text-center border-x-0 rounded-none focus-visible:ring-0"
        value={quantity}
        readOnly
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleIncrement}
        disabled={isPending || quantity >= stock}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
