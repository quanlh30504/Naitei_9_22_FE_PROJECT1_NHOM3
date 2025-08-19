import mongoose, { Schema, Document, Types } from 'mongoose';

export const TOPUP_METHODS = ['VIETQR', 'GATEWAY'] as const;
export const TOPUP_STATUSES = [
  'PENDING',
  'COMPLETED',
  'EXPIRED',
  'FAILED',
] as const;

export interface ITopUpRequest extends Document {
  userId: Types.ObjectId;
  walletId: Types.ObjectId;
  amount: number;
  method: (typeof TOPUP_METHODS)[number];
  status: (typeof TOPUP_STATUSES)[number];
  requestCode: string; // Mã định danh duy nhất cho yêu cầu, dùng làm nội dung chuyển khoản
  expiresAt: Date; // Thời gian yêu cầu hết hạn
  qrCodeUrl?: string;
  qrContent?: string;
  bankTransactionId?: string; // Mã giao dịch từ ngân hàng
  cassoTransactionId?: string; // Mã giao dịch từ Casso
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TopUpRequestSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
    amount: { type: Number, required: true, min: 10000 },
    method: { type: String, enum: TOPUP_METHODS, required: true },
    status: { type: String, enum: TOPUP_STATUSES, default: 'PENDING' },
    requestCode: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true },
    qrCodeUrl: { type: String },
    qrContent: { type: String },
    bankTransactionId: { type: String },
    cassoTransactionId: { type: String },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.TopUpRequest ||
  mongoose.model<ITopUpRequest>('TopUpRequest', TopUpRequestSchema);
