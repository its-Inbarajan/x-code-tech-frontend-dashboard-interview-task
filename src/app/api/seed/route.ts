import { connectDB } from "@/lib/database";
import { PRODUCT } from "@/models/products.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    await PRODUCT.deleteMany();

    const sampleProducts = [
      {
        name: "iPhone 15 Pro",
        price: 1200,
        stock: 10,
        category: "Electronics",
        status: "active",
        vendor: "Apple",
      },
      {
        name: "Samsung Galaxy S24",
        price: 999,
        stock: 15,
        category: "Electronics",
        status: "active",
        vendor: "Samsung",
      },
      {
        name: "Nike Air Max",
        price: 150,
        stock: 50,
        category: "Fashion",
        status: "active",
        vendor: "Nike",
      },
      {
        name: "Sony WH-1000XM5 Headphones",
        price: 400,
        stock: 25,
        category: "Electronics",
        status: "active",
        vendor: "Sony",
      },
      {
        name: "Adidas Ultraboost Shoes",
        price: 180,
        stock: 40,
        category: "Fashion",
        status: "inactive",
        vendor: "Adidas",
      },
    ];

    await PRODUCT.insertMany(sampleProducts);

    return NextResponse.json({
      message: "Database seeded successfully",
      count: sampleProducts.length,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Seeding failed", error },
      { status: 500 }
    );
  }
}
