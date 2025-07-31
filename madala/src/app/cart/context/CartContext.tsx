"use client";

import { createContext, useState, useContext, ReactNode, useEffect, useTransition, useMemo } from "react";
import { 
  updateItemQuantity, 
  removeItemsFromCart 
} from "@/lib/actions/cart";
import { toast } from "react-hot-toast";

export interface PopulatedCartItem {
  _id: string; 
  quantity: number;
  product: {
    _id: string; 
    name: string;
    images: string[];
    price: number;
    salePrice?: number;
    stock: number;
    slug: string;
  };
}

export interface PopulatedCart {
  _id: string;
  user: string;
  items: PopulatedCartItem[];
  totalItems: number;
}

interface CartContextType {
  items: PopulatedCartItem[];
  totalItems: number;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeItems: (cartItemIds: string[]) => void;
  selectedItemIds: string[];
  toggleItemSelected: (cartItemId: string) => void;
  toggleSelectAll: () => void;
  isPending: boolean; // Trạng thái chờ cho các action
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, initialCart }: { children: ReactNode, initialCart: PopulatedCart | null }) {
  const [items, setItems] = useState<PopulatedCartItem[]>(initialCart?.items || []);
  const [totalItems, setTotalItems] = useState<number>(initialCart?.totalItems || 0);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();


  useEffect(() => {
    setItems(initialCart?.items || []);
    setTotalItems(initialCart?.totalItems || 0);
  }, [initialCart]);

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    startTransition(async () => {
      const result = await updateItemQuantity(cartItemId, newQuantity);
      if (!result.success) {
        toast.error(result.message);
      }
    });
  };

  const removeItems = (cartItemIds: string[]) => {
    startTransition(async () => {
      const result = await removeItemsFromCart(cartItemIds);
      if (result.success) {
        toast.success(result.message);
        setSelectedItemIds(prev => prev.filter(id => !cartItemIds.includes(id)));
      } else {
        toast.error(result.message);
      }
    });
  };

  const toggleItemSelected = (cartItemId: string) => {
    setSelectedItemIds((current) =>
      current.includes(cartItemId)
        ? current.filter((id) => id !== cartItemId)
        : [...current, cartItemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.length === items.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(items.map((item) => item._id));
    }
  };

  const contextValue = useMemo(() => ({
    items,
    totalItems,
    selectedItemIds,
    isPending,
    updateQuantity,
    removeItems,
    toggleItemSelected,
    toggleSelectAll,
  }), [items, totalItems, selectedItemIds, isPending]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
