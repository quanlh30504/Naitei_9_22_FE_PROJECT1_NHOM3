import React from 'react';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

interface BannerTitleInputProps {
    value: string;
    onChange: (value: string) => void;
}

const BannerTitleInput: React.FC<BannerTitleInputProps> = ({ value, onChange }) => (
    <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề *</Label>
        <Input
            id="title"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Nhập tiêu đề banner"
            maxLength={200}
            required
        />
        <p className="text-xs text-gray-500">{value.length}/200 ký tự</p>
    </div>
);

export default BannerTitleInput;
