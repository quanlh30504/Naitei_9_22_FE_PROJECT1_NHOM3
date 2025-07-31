"use client";

import React from 'react';
import { Card } from '@/Components/ui/card';
import { Star } from 'lucide-react';

interface ProductAttribute {
  brand?: string;
  spf?: string;
  skinType?: string[];
  volume?: string;
  type?: string;
  concentration?: string;
  benefits?: string[];
  usage?: string;
  material?: string;
  color?: string | string[];
}

interface ProductRating {
  average: number;
  count: number;
  details?: {
    [key: string]: number;
  };
}

interface ProductTabsProps {
  description: string;
  attributes?: ProductAttribute;
  rating: ProductRating;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ description, attributes, rating }) => {
  const [activeTab, setActiveTab] = React.useState('features');

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const totalReviews = rating.details ? Object.values(rating.details).reduce((sum, count) => sum + count, 0) : rating.count;

  const tabs = [
    { id: 'features', label: 'ĐẶC ĐIỂM NỔI BẬT' },
    { id: 'info', label: 'THÔNG TIN SẢN PHẨM' },
    { id: 'reviews', label: 'ĐÁNH GIÁ' }
  ];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-[#8BC34A] text-[#8BC34A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'features' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Đặc điểm nổi bật</h3>
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
              
              {attributes?.benefits && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Lợi ích chính:</h4>
                  <ul className="space-y-2">
                    {attributes.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-[#8BC34A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}
        
        {activeTab === 'info' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Thông tin sản phẩm</h3>
            {attributes && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(attributes).map(([key, value]) => {
                  if (!value) return null;
                  
                  if (Array.isArray(value)) {
                    return (
                      <div key={key} className="flex flex-col">
                        <span className="font-medium capitalize mb-1">
                          {key === 'skinType' ? 'Loại da' : 
                           key === 'benefits' ? 'Lợi ích' : 
                           key === 'usage' ? 'Cách sử dụng' :
                           key}:
                        </span>
                        <span className="text-muted-foreground">
                          {value.join(', ')}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div key={key} className="flex flex-col">
                      <span className="font-medium capitalize mb-1">
                        {key === 'brand' ? 'Thương hiệu' :
                         key === 'volume' ? 'Dung tích' :
                         key === 'type' ? 'Loại sản phẩm' :
                         key === 'spf' ? 'Chỉ số SPF' :
                         key === 'concentration' ? 'Nồng độ' :
                         key === 'material' ? 'Chất liệu' :
                         key === 'color' ? 'Màu sắc' :
                         key}:
                      </span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
        
        {activeTab === 'reviews' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Đánh giá khách hàng</h3>
            
            {/* Rating Summary */}
            <div className="flex items-center space-x-6 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold">{rating.average.toFixed(1)}</div>
                <div className="flex items-center justify-center mt-1">
                  {renderStars(Math.floor(rating.average))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {rating.count} đánh giá
                </div>
              </div>
              
              {rating.details && (
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center space-x-2">
                      <span className="text-sm w-6">{stars}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${((rating.details![stars] || 0) / totalReviews) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {rating.details?.[stars] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sample Reviews */}
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">{renderStars(5)}</div>
                  <span className="font-medium">Nguyễn Thị A</span>
                  <span className="text-sm text-muted-foreground">2 ngày trước</span>
                </div>
                <p className="text-muted-foreground">
                  Sản phẩm rất tốt, chống nắng hiệu quả và không gây bết dính. Mình đã sử dụng được 1 tháng và thấy da không bị sạm đen.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">{renderStars(4)}</div>
                  <span className="font-medium">Trần Văn B</span>
                  <span className="text-sm text-muted-foreground">1 tuần trước</span>
                </div>
                <p className="text-muted-foreground">
                  Chất lượng tốt, đóng gói cẩn thận. Giao hàng nhanh. Sẽ mua lại lần sau.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
