import React from 'react';
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";

interface BannerDescriptionInputProps {
    value: string;
    onChange: (value: string) => void;
}

const BannerDescriptionInput: React.FC<BannerDescriptionInputProps> = ({ value, onChange }) => (
    <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
            id="description"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Nhập mô tả banner (tùy chọn)"
            maxLength={500}
            rows={3}
        />
        <p className="text-xs text-gray-500">{value.length}/500 ký tự</p>
    </div>
);

export default BannerDescriptionInput;
