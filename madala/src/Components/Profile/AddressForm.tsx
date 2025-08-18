"use client";

import { useState, useTransition, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createAddress, updateAddress } from "@/lib/actions/address";

import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { Loader2 } from "lucide-react";

type AddressDataType = {
    _id?: string;
    fullName: string;
    phoneNumber: string;
    street: string;
    city: string;
    district: string;
    ward: string;
    isDefault: boolean;
};


interface AddressFormProps {
    initialData?: AddressDataType;
    onSuccess?: () => void; // Callback xử lý khi thành công (dùng trong giao diện AddressSelectModal)
}

function AddressForm({ initialData, onSuccess }: AddressFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const isEditMode = !!initialData;

    const [formData, setFormData] = useState<AddressDataType>({
        fullName: initialData?.fullName || "",
        phoneNumber: initialData?.phoneNumber || "",
        street: initialData?.street || "",
        city: initialData?.city || "",
        district: initialData?.district || "",
        ward: initialData?.ward || "",
        isDefault: initialData?.isDefault || false,
    });

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSwitchChange = useCallback((checked: boolean) => {
        setFormData(prev => ({ ...prev, isDefault: checked }));
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(async () => {
            const result = isEditMode
                ? await updateAddress(initialData!._id!, formData)
                : await createAddress(formData);

            if (result.success) {
                toast.success(result.message);

                // **LOGIC ĐIỀU HƯỚNG **
                if (onSuccess) {
                    // Nếu có callback (tức là đang trong giao diện AddressSelectModel), gọi callback (modal chuyển view về 'LIST')
                    onSuccess();
                } else {
                    // Nếu không, quay lại trang trước
                    router.back();
                }
            } else {
                toast.error(result.message);
            }
        });
    }, [isEditMode, initialData, formData, onSuccess, router]);

    // Logic route tương tự như submit
    const handleCancel = useCallback(() => {
        if (onSuccess) {
            onSuccess();
        } else {
            router.back();
        }
    }, [onSuccess, router]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Nguyễn Văn A" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Số điện thoại</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="09xxxxxxxx" required />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="street">Địa chỉ cụ thể</Label>
                <Input id="street" name="street" value={formData.street} onChange={handleInputChange} placeholder="Số nhà, tên đường..." required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">Tỉnh / Thành phố</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="TP. Hồ Chí Minh" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="district">Quận / Huyện</Label>
                    <Input id="district" name="district" value={formData.district} onChange={handleInputChange} placeholder="Quận 1" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ward">Phường / Xã</Label>
                    <Input id="ward" name="ward" value={formData.ward} onChange={handleInputChange} placeholder="Phường Bến Nghé" required />
                </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Switch
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isPending}
                >
                    Hủy
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        isEditMode ? "Lưu thay đổi" : "Tạo địa chỉ"
                    )}
                </Button>
            </div>
        </form>
    );
}

export default memo(AddressForm);
