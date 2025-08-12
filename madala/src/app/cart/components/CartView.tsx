"use client";

import { useState, useEffect } from "react";
import CartItemsList from "./CartItemsList";
import OrderSummary from "./OrderSummary";
import AddressSelectionModal from "@/Components/Profile/AddressSelectionModal";
import { useCartStore } from '@/store/useCartStore';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';



type AddressType = {
    _id: string;
    fullName: string;
    phoneNumber: string;
    street: string;
    city: string;
    district: string;
    ward: string;
    isDefault: boolean;
};

interface CartViewProps {
    initialAddresses: AddressType[];
}

export default function CartView({ initialAddresses }: CartViewProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [selectedAddress, setSelectedAddress] = useState<AddressType | undefined>(() => {
        return initialAddresses.find(addr => addr.isDefault) || initialAddresses[0];
    });

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { items, selectedItemIds, toggleItemSelected } = useCartStore();

    useEffect(() => {
        const selectItemId = searchParams.get('selectItemId');
        
        if (selectItemId) {
            const itemExists = items.some(item => item._id === selectItemId);
            const isAlreadySelected = selectedItemIds.includes(selectItemId);

            if (itemExists && !isAlreadySelected) {
                toggleItemSelected(selectItemId);
            }

            // Xóa param khỏi URL sau khi xử lý
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete('selectItemId');
            router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
        }
    }, [items, searchParams, selectedItemIds, pathname, router, toggleItemSelected]);


    const handleAddressSelect = (address: AddressType) => {
        setSelectedAddress(address);
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <CartItemsList />
                <OrderSummary 
                    selectedAddress={selectedAddress}
                    onOpenAddressModal={() => setIsModalOpen(true)}
                />
            </div>
            
            <AddressSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddressSelect={handleAddressSelect}
                currentAddressId={selectedAddress?._id}
            />
        </>
    );
}
