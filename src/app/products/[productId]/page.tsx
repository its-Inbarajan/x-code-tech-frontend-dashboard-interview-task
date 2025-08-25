import { IProduct } from "@/@types/product";
import PRODUCT from "@/models/products.model";
import React from "react";

export default async function SingleProduct({
  params,
}: {
  params: { productId: string };
}) {
  const product = (await PRODUCT.findById(params.productId).lean()) as IProduct;
  return (
    <div className="">
      {params.productId}-{product.name}
    </div>
  );
}
