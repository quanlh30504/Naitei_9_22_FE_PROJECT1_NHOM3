"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { CartProduct } from "../components/CartItem"; // Import kiểu dữ liệu
import image1 from "@/assets/images/Users/user-image.jpg";

// Dữ liệu test
const initialCartItems: CartProduct[] = [
  {
    id: "1",
    name: "Nồi Cơm Điện Mini Lock&Lock EJR426 Dung Tích 0.8 lít (Hàng chính hãng)",
    image: image1.src,
    salePrice: 558000,
    price: 1070000,
    quantity: 1,
    stock: 3,
  },
  {
    id: "2",
    name: "Sách Đường Mây Qua Xứ Tuyết - Nguyên Phong (Tái Bản)",
    image: image1.src,
    price: 88000,
    salePrice: 66000,
    quantity: 1,
    stock: 2,
  },
];

interface CartContextType {
  items: CartProduct[];
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeItem: (productId: string) => void;
  selectedItemIds: string[];
  toggleItemSelected: (productId: string) => void;
  toggleSelectAll: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartProduct[]>(initialCartItems);

  const updateQuantity = (productId: string, newQuantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
    // todo: Gọi Server Action để cập nhật DB 
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
    // todo: Gọi Server Action để cập nhật DB
  };

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]); 

  const toggleItemSelected = (productId: string) => {
    setSelectedItemIds((currentSelectedIds) => {
      if (currentSelectedIds.includes(productId)) {
        return currentSelectedIds.filter((id) => id !== productId);
      } else {
        return [...currentSelectedIds, productId];
      }
    });
  };

  const toggleSelectAll = () => {
    setSelectedItemIds((currentSelectedIds) => {
      if (currentSelectedIds.length === items.length) {
        return [];
      } else {
        return items.map((item) => item.id);
      }
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        selectedItemIds,
        updateQuantity,
        removeItem,
        toggleItemSelected,
        toggleSelectAll,
      }}
    >
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
