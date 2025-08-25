import { Document } from "mongoose";

export interface IProduct extends Document {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "inactive" | "out-of-stock";
  vendor: string;
  imageUrl?: string;
  createdAt: Date;
  __v: number;
}
