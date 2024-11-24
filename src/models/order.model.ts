import mongoose, { Document, Schema } from 'mongoose';

interface OrderItem {
  name: string;
  productId: mongoose.Types.ObjectId;
  price: number;
  quantity: number;
}

export interface Order extends Document {
  grandTotal: number;
  orderItems: OrderItem[];
  createdBy: mongoose.Types.ObjectId;
  status: 'pending' | 'completed' | 'cancelled';
}

const OrderItemSchema = new Schema<OrderItem>({
  name: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, max: 5 },
});

const OrderSchema = new Schema<Order>({
  grandTotal: { type: Number, required: true },
  orderItems: { type: [OrderItemSchema], required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], required: true },
}, { timestamps: true });

const OrderModel = mongoose.model<Order>('Order', OrderSchema);

export default OrderModel;
