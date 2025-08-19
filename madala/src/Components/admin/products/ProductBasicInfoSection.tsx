import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';

interface ProductBasicInfoSectionProps {
    name: string;
    sku: string;
    shortDescription: string;
    description: string;
    handleInputChange: (field: string, value: any) => void;
}

const ProductBasicInfoSection: React.FC<ProductBasicInfoSectionProps> = ({
    name,
    sku,
    shortDescription,
    description,
    handleInputChange,
}) => (
    <Card>
        <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Tên sản phẩm *</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Nhập tên sản phẩm"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sku">Mã SKU *</Label>
                    <Input
                        id="sku"
                        value={sku}
                        onChange={(e) => handleInputChange('sku', e.target.value)}
                        placeholder="Ví dụ: MYPHAM-001"
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="shortDescription">Mô tả ngắn</Label>
                <Input
                    id="shortDescription"
                    value={shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    placeholder="Mô tả ngắn về sản phẩm"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Mô tả chi tiết về sản phẩm"
                    rows={4}
                />
            </div>
        </CardContent>
    </Card>
);

export default ProductBasicInfoSection;
