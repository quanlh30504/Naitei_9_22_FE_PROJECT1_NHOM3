import mongoose, { Schema, Document } from 'mongoose';

export interface ICart extends Document {

}

const CartSchema: Schema = new Schema(
  {
   
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
