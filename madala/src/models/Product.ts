import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    productId: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: number;
    salePrice: number;
    sku: string;
    stock: number;
    images: string[];
    categoryIds: string[];
    tags: string[];
    attributes: {
        color: string[];
        material: string;
        brand: string;
        size: string[];
        weight: string;
    };
    rating: {
        average: number;
        count: number;
    };
    details: {
        [key: string]: number;
    };
    isActive: boolean;
    isFeatured: boolean;
    isHotTrend: boolean;
    viewCount: number;
    discountPercentage: number;
}

const ProductSchema = new Schema<IProduct>(
    {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        description: { type: String },
        shortDescription: { type: String },
        price: { type: Number, required: true },
        salePrice: { type: Number, required: true },
        sku: { type: String, required: true },
        stock: { type: Number, required: true },
        images: [{ type: String }],
        categoryIds: [{ type: String }],
        tags: [{ type: String }],
        attributes: {
            color: [{ type: String }],
            material: { type: String },
            brand: { type: String },
            size: [{ type: String }],
            weight: { type: String }
        },
        rating: {
            average: { type: Number },
            count: { type: Number }
        },
        details: { type: Map, of: Number },
        isActive: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },
        isHotTrend: { type: Boolean, default: false },
        viewCount: { type: Number, default: 0 },
        discountPercentage: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
