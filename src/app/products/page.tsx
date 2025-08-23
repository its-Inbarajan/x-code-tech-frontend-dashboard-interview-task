"use client";

import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  vendor: string;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
      const data = await res.json();
      setProducts(data.response);
      setTotalPages(data.totalPages);
      setLoading(false);
    };
    fetchProducts();
  }, [page]);
  console.log(products);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-black">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Vendor</th>
            </tr>
          </thead>
          <tbody>
            {products?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No products found
                </td>
              </tr>
            ) : (
              products &&
              products.map((product) => (
                <tr key={product._id}>
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">${product.price}</td>
                  <td className="p-2 border">{product.stock}</td>
                  <td className="p-2 border">{product.category}</td>
                  <td className="p-2 border">{product.status}</td>
                  <td className="p-2 border">{product.vendor}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
