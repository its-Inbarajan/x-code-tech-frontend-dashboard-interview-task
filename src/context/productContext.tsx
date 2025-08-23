"use client";
import { IProduct } from "@/@types/product";
import React from "react";
import { toast } from "sonner";

type Query = {
  page: number;
  limit: number;
  filter: string;
  sort: string;
};

interface InitialState {
  products: IProduct[];
  query: Query | null;
  singleProducts: IProduct | null;
  getProducts: (search?: string) => Promise<void>;
  getProductsById: (id: string) => void;
  updateProductsById: (id: string, data: IProduct) => void;
  deleteProductsById: (id: string) => void;
  createProduct: (data: IProduct) => void;
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
  setQuery: React.Dispatch<
    React.SetStateAction<{
      page: number;
      limit: number;
      filter: string;
      sort: string;
    }>
  >;
}

const InitialState: InitialState = {
  products: [],
  query: null,
  singleProducts: null,
  createProduct: () => {},
  getProducts: async () => {},
  getProductsById: () => {},
  deleteProductsById: () => {},
  updateProductsById: () => {},
  setProducts: () => {},
  setQuery: () => {},
};

export const ProductContext = React.createContext<InitialState>(InitialState);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [singleProducts, setSingleProduct] = React.useState<IProduct | null>(
    null
  );
  const [query, setQuery] = React.useState<{
    page: number;
    limit: number;
    filter: string;
    sort: string;
  }>({
    limit: 10,
    page: 1,
    filter: "",
    sort: "",
  });
  async function createProduct(data: IProduct): Promise<void> {
    try {
      const response = await fetch(`/api/products`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success(result.message);
      setProducts((preve) => [result?.response, ...preve]);
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function getProducts(search?: string): Promise<void> {
    try {
      const response = await fetch(
        `/api/products?page=${query.page}&limit=${
          query.limit
        }&search=${search?.toString()}&filter=${query.filter}&sort=${
          query.sort
        }`,
        {
          method: "GET",
          cache: "no-cache",
        }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }
      console.log(result);
      setProducts(result?.response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  }

  async function getProductsById(id: string) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "GET",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }
      toast.success(result.message);
      setSingleProduct(result);
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deleteProductsById() {
    try {
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateProductsById() {
    try {
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  const value = {
    products,
    singleProducts,
    setProducts,
    setQuery,
    query,
    createProduct,
    getProducts,
    getProductsById,
    deleteProductsById,
    updateProductsById,
  };

  return <ProductContext value={value}>{children}</ProductContext>;
};

export const useProducts = () => {
  const product = React.useContext(ProductContext);

  if (!product) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return product;
};
