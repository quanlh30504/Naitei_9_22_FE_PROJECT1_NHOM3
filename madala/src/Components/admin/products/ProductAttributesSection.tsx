import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import React from "react";

interface ProductAttributesSectionProps {
    attributes: {
        brand?: string;
        type?: string;
        material?: string;
        color?: string;
        size?: string;
        weight?: string;
    };
    handleAttributeChange: (key: string, value: string) => void;
}

const ProductAttributesSection: React.FC<ProductAttributesSectionProps> = ({ attributes, handleAttributeChange }) => (
    <Card>
        <CardHeader>
            <CardTitle>Thuộc tính sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="brand">Thương hiệu</Label>
                    <Input
                        id="brand"
                        value={attributes.brand || ''}
                        onChange={(e) => handleAttributeChange('brand', e.target.value)}
                        placeholder="Ví dụ: Lancôme"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Loại sản phẩm</Label>
                    <Input
                        id="type"
                        value={attributes.type || ''}
                        onChange={(e) => handleAttributeChange('type', e.target.value)}
                        placeholder="Ví dụ: Kem dưỡng ẩm"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="material">Chất liệu</Label>
                    <Input
                        id="material"
                        value={attributes.material || ''}
                        onChange={(e) => handleAttributeChange('material', e.target.value)}
                        placeholder="Ví dụ: Cotton"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="color">Màu sắc</Label>
                    <Input
                        id="color"
                        value={attributes.color || ''}
                        onChange={(e) => handleAttributeChange('color', e.target.value)}
                        placeholder="Ví dụ: Đỏ, Xanh"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="size">Kích thước</Label>
                    <Input
                        id="size"
                        value={attributes.size || ''}
                        onChange={(e) => handleAttributeChange('size', e.target.value)}
                        placeholder="Ví dụ: S, M, L, XL"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="weight">Trọng lượng</Label>
                    <Input
                        id="weight"
                        value={attributes.weight || ''}
                        onChange={(e) => handleAttributeChange('weight', e.target.value)}
                        placeholder="Ví dụ: 50ml, 100g"
                    />
                </div>
            </div>
        </CardContent>
    </Card>
);

export default ProductAttributesSection;
