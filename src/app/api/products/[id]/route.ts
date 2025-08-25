import { IProduct } from "@/@types/product";
import { IApiResponse } from "@/@types/types";
import { connectDB } from "@/lib/database";
import PRODUCT from "@/models/products.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const find = await PRODUCT.findById(id);

    if (!find) {
      return NextResponse.json(
        { message: "Product not found!" },
        { status: 404 }
      );
    }

    const response: IApiResponse<IProduct> = {
      message: "Product Fetched Sccessfully.",
      response: find,
      status: true,
      statusCode: 200,
    };

    return NextResponse.json(response);
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;
    const { name, price, stock, category, status, vendor } = body;
    const find = await PRODUCT.findById(id);

    if (!find) {
      return NextResponse.json(
        { message: "Product not found!." },
        { status: 404 }
      );
    }

    const findAndUpdate = await PRODUCT.findByIdAndUpdate(
      id as string,
      { name, price, stock, category, status, vendor },
      { new: true, runValidators: true }
    );

    if (!findAndUpdate)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );

    const response: IApiResponse<IProduct> = {
      message: "Product Updated successfully.",
      statusCode: 200,
      status: true,
      response: findAndUpdate,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const find = await PRODUCT.findById(id);

    if (!find) {
      return NextResponse.json({ message: "Product not found!" });
    }

    const findAndDelete = await PRODUCT.findByIdAndDelete(id);

    if (!findAndDelete) {
      return NextResponse.json({ message: "Something went wrong!" });
    }

    return NextResponse.json(
      { message: "Product deleted successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
}
