"use client";
import { IProduct } from "@/@types/product";
import React from "react";
import { toast } from "sonner";

export type Query = {
  page: number;
  limit: number;
  filter: string;
  totalCount: string | number;
  sortOrder: "asc" | "desc";
  sort: string;
  category: string;
  status: string;
};

interface InitialState {
  products: IProduct[];
  query: Query | null;
  loading: boolean;
  singleProducts: IProduct | null;
  getProducts: (search?: string, customQuery?: Query) => Promise<void>;
  getProductsById: (id: string) => Promise<void>;
  updateProductsById: (id: string, data: Partial<IProduct>) => Promise<void>;
  deleteProductsById: (id: string) => Promise<void>;
  createProduct: (data: Partial<IProduct>) => Promise<void>;
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setQuery: React.Dispatch<React.SetStateAction<Query>>;
}

const InitialState: InitialState = {
  products: [],
  query: null,
  loading: false,
  singleProducts: null,
  createProduct: async () => {},
  getProducts: async () => {},
  getProductsById: async () => {},
  deleteProductsById: async () => {},
  updateProductsById: async () => {},
  setProducts: () => {},
  setLoading: () => {},
  setQuery: () => {},
};

export const ProductContext = React.createContext<InitialState>(InitialState);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [singleProducts, setSingleProduct] = React.useState<IProduct | null>(
    null
  );
  const [query, setQuery] = React.useState<Query>({
    totalCount: "",
    limit: 10,
    page: 1,
    filter: "",
    sortOrder: "asc",
    sort: "",
    category: "",
    status: "",
  });
  async function createProduct(data: Partial<IProduct>): Promise<void> {
    setLoading(true);
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
      if (result.response) {
        setProducts((prev) => [result.response, ...prev]);
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function getProducts(
    search?: string,
    customQuery?: Query
  ): Promise<void> {
    setLoading(true);
    try {
      const q = customQuery || query; // Use latest state if passed
      const params = new URLSearchParams();
      if (q.category) params.append("category", q.category);
      if (q.status) params.append("status", q.status);
      if (q.sort) params.append("sortBy", q.sort);
      if (search) params.append("search", search!);
      const response = await fetch(
        `/api/products?page=${q.page}&limit=${q.limit}&${params.toString()}`,
        {
          method: "GET",
          cache: "no-cache",
        }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setLoading(true);
      setQuery((prev) => ({
        ...prev,
        totalCount: result.pagination?.totalCount,
      }));
      setProducts(result?.response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function getProductsById(id: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "GET",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }
      toast.success(result.message);
      setSingleProduct(result?.response);
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteProductsById(id: string) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }
      toast.success(result.message);
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateProductsById(id: string, data: Partial<IProduct>) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }
      toast.success(result.message);
      if (result.response) {
        const updatedProducts = products.map((product) =>
          product._id === result.response._id ? result.response : product
        );
        setProducts(updatedProducts);
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  const value = {
    loading,
    products,
    singleProducts,
    setProducts,
    setQuery,
    setLoading,
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
