import { Request, Response } from 'express';
import OrderModel from '../models/order.model';
import ProductModel from '../models/products.model'; // Sesuaikan jalur dengan model produk Anda
import { IRequestWithUser } from '../middlewares/auth.middleware';
import UserModel from '../models/user.model';
import { sendOrderInvoice } from '../services/email.service';

export const createOrder = async (req: IRequestWithUser, res: Response) => {

  try {

    const { grandTotal, orderItems, status } = req.body;

    const createdBy = req.user?.id; // Pastikan user telah diinisialisasi di middleware autentikasi

    if (!grandTotal || !orderItems || !createdBy) {

      return res.status(400).json({ message: 'grandTotal, orderItems, and createdBy are required' });

    }

    for (const item of orderItems) {

      const product = await ProductModel.findById(item.productId);

      if (!product) {

        return res.status(400).json({ message: `Product with ID ${item.productId} not found` });

      }

      if (item.quantity > product.qty) {

        return res.status(400).json({ message: `Quantity for product ${item.name} exceeds available stock` });

      }

    }

    const newOrder = new OrderModel({

      grandTotal,

      orderItems,

      createdBy,

      status,

    });

    const savedOrder = await newOrder.save();

    // Update product quantities

    for (const item of orderItems) {

      await ProductModel.findByIdAndUpdate(item.productId, {

        $inc: { qty: -item.quantity }

      });

    }

    res.status(201).json({ message: 'Order created successfully', data: savedOrder });

  } catch (error) {

    const err = error as Error;

    res.status(500).json({ message: err.message });

  }

};

export const getOrderHistory = async (req: IRequestWithUser, res: Response) => {

  try {

    const userId = req.user?.id; // Pastikan user telah diinisialisasi di middleware autentikasi

    const { page = 1, limit = 10 } = req.query;

    const orders = await OrderModel.find({ createdBy: userId })

      .skip((Number(page) - 1) * Number(limit))

      .limit(Number(limit))

      .populate('orderItems.productId', 'name');

    res.status(200).json({ message: 'Order history retrieved successfully', data: orders });

  } catch (error) {

    const err = error as Error;

    res.status(500).json({ message: err.message });

  }

};