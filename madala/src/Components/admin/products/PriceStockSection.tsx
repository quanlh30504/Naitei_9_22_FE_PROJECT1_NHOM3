import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import React from "react";

interface PriceStockSectionProps {
    formData: {
        price: string;
        salePrice: string;
        stock: string;
        discountPercentage: string;
    };
    handleInputChange: (field: string, value: any) => void;
}

const PriceStockSection: React.FC<PriceStockSectionProps> = ({ formData, handleInputChange }) => (
    <Card>
        <CardHeader>
            <CardTitle>Giá và kho hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Giá gốc (VND) *</Label>
                    <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0"
                        min="0"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="salePrice">Giá khuyến mãi (VND)</Label>
                    <Input
                        id="salePrice"
                        type="number"
                        value={formData.salePrice}
                        onChange={(e) => handleInputChange('salePrice', e.target.value)}
                        placeholder="0"
                        min="0"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Tồn kho</Label>
                    <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => handleInputChange('stock', e.target.value)}
                        placeholder="0"
                        min="0"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="discountPercentage">Phần trăm giảm giá (%)</Label>
                <Input
                    id="discountPercentage"
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
                    placeholder="0"
                    min="0"
                    max="100"
                />
            </div>
        </CardContent>
    </Card>
);

export default PriceStockSection;
