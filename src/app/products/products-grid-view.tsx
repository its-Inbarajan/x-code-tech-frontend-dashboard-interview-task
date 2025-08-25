import { IProduct } from "@/@types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import React from "react";

export const ProductsGridView: React.FC<{
  products: IProduct[];
  handleToggleViewModal: (_id: string) => void;
}> = ({ products, handleToggleViewModal }) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products &&
          products.length > 0 &&
          products.map((product) => (
            // <Link key={product._id as string} href={`/products/${product._id}`}>
            <Card
              key={product._id}
              className="h-[18rem] py-2 overflow-hidden hover:shadow hover:shadow-gray-500 transition duration-500 ease-in-out"
              role="button"
              onClick={() => handleToggleViewModal(product._id)}
            >
              <CardHeader className="p-0">
                <div className="w-full h-44 overflow-hidden relative">
                  {/* <Image
                    src={
                      "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                    }
                    alt={product.name}
                    width={200}
                    height={150}
                    className="object-cover transition scale-0 duration-300 hover:scale-100 rounded"
                    loading="lazy"
                  /> */}
                  <div className="w-full dark:bg-black bg-white"></div>
                  {product.status === "active" && (
                    <span
                      title={product.status}
                      className="top-2 right-6 absolute w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"
                    />
                  )}
                  {product.status === "inactive" && (
                    <span
                      title={product.status}
                      className="top-0 right-6 absolute w-3.5 h-3.5 bg-yellow-500 border-2 border-white dark:border-gray-800 rounded-full"
                    />
                  )}
                  {product.status === "out-of-stock" && (
                    <span
                      title={product.status}
                      className="top-0 right-6 absolute w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-2.5 px-2.5 flex flex-col items-start dark:bg-gray-500 bg-gray-300 rounded-b-xl">
                <CardTitle className="font-medium mb-0 line-clamp-1 leading-6 tracking-wide text-lg dark:text-gray-50 text-black">
                  {product.name}
                </CardTitle>
                <CardDescription>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Category: {product.category}
                  </div>
                </CardDescription>
              </CardContent>
            </Card>
            // </Link>
          ))}
      </div>
      {!products ||
        (products.length === 0 && (
          <div className="flex justify-center items-center  text-white font-medium capitalize">
            product not found!
          </div>
        ))}
    </div>
  );
};
