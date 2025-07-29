import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  image?: string;
  roles?: string;
  nickname?: string;
  gender?: string;
  country?: string;
  birthDate?: Date; 
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
    phone: {
      type: String,
      required: false,
    },
    image: {
      type: String,
    },
    roles: {
      type: String,
      default: 'user',
    },
    nickname: {
      type: String,
    },
    gender: {
      type: String,
    },
    country: {
      type: String,
    },
    birthDate: {
      type: Date, 
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
