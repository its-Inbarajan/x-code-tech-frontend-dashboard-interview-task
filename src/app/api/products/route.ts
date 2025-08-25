import { IProduct } from "@/@types/product";
import { IApiResponse } from "@/@types/types";
import { connectDB } from "@/lib/database";
import PRODUCT from "@/models/products.model";
import { FilterQuery } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const query: FilterQuery<IProduct> = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { vendor: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page.toString());
    const pageLimit = parseInt(limit.toString());

    const total = await PRODUCT.countDocuments(query);

    const products = await PRODUCT.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    const response: IApiResponse<IProduct[]> = {
      message: "Product Fetched successfully.",
      status: true,
      response: products,
      statusCode: 200,
      pagination: {
        limit: pageLimit,
        page: pageNum,
        totalCount: total,
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      price,
      stock,
      category,
      status,
      vendor,
      createdAt,
    }: IProduct = body;

    if (!name || !price || !stock || !category || !status || !vendor) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 404 }
      );
    }

    const product = await PRODUCT.create({
      name,
      price,
      stock,
      category,
      status,
      vendor,
      createdAt,
    });

    if (!product) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 404 }
      );
    }

    const response: IApiResponse<IProduct> = {
      message: "Product Created Sccessfully.",
      response: product,
      status: true,
      statusCode: 201,
    };

    return NextResponse.json(response, { status: response.statusCode });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error,
      },
      { status: 500 }
    );
  }
}
