import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "inactive" | "out-of-stock";
  vendor: string;
  createdAt: Date;
}
