import { IProduct } from "@/@types/product";
import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is must not empty."],
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "out-of-stock"],
      required: true,
    },
    vendor: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PRODUCT =
  models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default PRODUCT;
