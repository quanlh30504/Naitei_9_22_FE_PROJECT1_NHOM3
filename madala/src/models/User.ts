import mongoose, { Schema, Document } from 'mongoose';


export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string;
  image?: string;
  roles?: string; 
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  isActive?: boolean;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    roles: {
      type: String, 
      default: 'user',
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    fullName: {
      type: String,
    },
    phone: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

// Xuất model
// tránh lỗi biên dịch lại model đã có trong môi trường dev (do Hot Reload).
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
