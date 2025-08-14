import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import React from "react";

interface ProductSettingsSectionProps {
    isActive: boolean;
    isFeatured: boolean;
    isHotTrend: boolean;
    handleInputChange: (field: string, value: any) => void;
}

const ProductSettingsSection: React.FC<ProductSettingsSectionProps> = ({
    isActive,
    isFeatured,
    isHotTrend,
    handleInputChange,
}) => (
    <Card>
        <CardHeader>
            <CardTitle>Cài đặt sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label>Kích hoạt sản phẩm</Label>
                    <p className="text-sm text-muted-foreground">
                        Sản phẩm sẽ hiển thị trên website
                    </p>
                </div>
                <Switch
                    checked={isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label>Sản phẩm nổi bật</Label>
                    <p className="text-sm text-muted-foreground">
                        Hiển thị trong danh sách sản phẩm nổi bật
                    </p>
                </div>
                <Switch
                    checked={isFeatured}
                    onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label>Xu hướng hot</Label>
                    <p className="text-sm text-muted-foreground">
                        Hiển thị trong danh sách xu hướng hot
                    </p>
                </div>
                <Switch
                    checked={isHotTrend}
                    onCheckedChange={(checked) => handleInputChange('isHotTrend', checked)}
                />
            </div>
        </CardContent>
    </Card>
);

export default ProductSettingsSection;
