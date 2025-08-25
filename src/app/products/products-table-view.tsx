import { IProduct } from "@/@types/product";
import { Button } from "@/components/ui/button/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";
import { useProducts } from "@/context/productContext";
import { ArrowUpDown, PencilLineIcon, Trash2Icon, View } from "lucide-react";
import React from "react";
interface ProductsTableViewProps {
  products: IProduct[];
  handleToggleViewModal: (id: string) => void;
  handleUpdateAndDeteleId: (params: "edit" | "delete", id: string) => void;
}
export const ProductsTableView: React.FC<ProductsTableViewProps> = ({
  products,
  handleToggleViewModal,
  handleUpdateAndDeteleId,
}) => {
  const { query, setQuery, getProducts } = useProducts();

  // Pagination logic
  const totalPages = Math.ceil(
    (products.length > 0 ? Number(query?.totalCount) || products.length : 0) /
      Number(query?.limit)
  );
  const currentPage = query!.page;
  console.log(query);
  const handleSort = async () => {
    setQuery((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
    await getProducts();
  };

  const handlePageChange = async (page: number) => {
    setQuery((prev) => ({ ...prev, page }));
    await getProducts();
  };

  return (
    <div className="overflow-x-auto rounded-md border dark:border-gray-600 border-black">
      <Table className="min-w-full bg-white dark:bg-gray-900 shadow">
        <TableHeader>
          <TableRow>
            <TableHead
              className="px-4 cursor-pointer py-2 text-left"
              onClick={handleSort}
            >
              <span className="flex items-center gap-2">
                Name
                <ArrowUpDown
                  className={`size-4  ${
                    query?.sortOrder === "asc"
                      ? "text-blue-500 rotate-180"
                      : "text-blue-500"
                  } transition-transform`}
                />
              </span>
            </TableHead>
            <TableHead className="px-4 py-2 text-left">Price</TableHead>
            <TableHead className="px-4 py-2 text-left">
              Stock Quantity
            </TableHead>
            <TableHead className="px-4 py-2 text-left">Category</TableHead>
            <TableHead className="px-4 py-2 text-left">Status</TableHead>
            <TableHead className="px-4 py-2 text-left">Vendor</TableHead>
            <TableHead className="px-4 py-2 text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product._id as string} className="border-b">
                <TableCell className="px-4 border dark:border-gray-600 py-2">
                  {product.name}
                </TableCell>
                <TableCell className="px-4 border dark:border-gray-600 py-2">
                  {product.price}
                </TableCell>
                <TableCell className="px-4 border dark:border-gray-600 py-2">
                  {product.stock}
                </TableCell>
                <TableCell className="px-4 border dark:border-gray-600 py-2">
                  {product.category}
                </TableCell>
                <TableCell className="px-4 border dark:border-gray-600 py-2">
                  {product.status}
                </TableCell>
                <TableCell className="px-4 border dark:border-gray-600 py-2">
                  {product.vendor}
                </TableCell>
                <TableCell className="px-4 border dark:border-gray-600 py-2">
                  <div className="flex items-center gap-4">
                    <Button
                      className="inline-block w-1 cursor-pointer"
                      title=""
                      aria-label=""
                      type="button"
                      onClick={() =>
                        handleUpdateAndDeteleId("edit", product._id)
                      }
                    >
                      <PencilLineIcon className="size-5 dark:text-blue-400 text-blue-700" />
                    </Button>
                    <Button
                      className="inline-block w-1 cursor-pointer"
                      title=""
                      aria-label=""
                      type="button"
                      onClick={() =>
                        handleUpdateAndDeteleId("delete", product._id)
                      }
                    >
                      <Trash2Icon className="size-5 dark:text-red-400 text-red-700" />
                    </Button>
                    <Button
                      className="inline-block w-1 cursor-pointer"
                      title="View Single Product"
                      aria-label=""
                      type="button"
                      onClick={() => handleToggleViewModal(product._id)}
                    >
                      <View className="size-5 dark:text-gray-400 text-gray-700" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableCaption>
          <div className="flex items-center justify-center gap-2 py-4">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                }`}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </TableCaption>
      </Table>
    </div>
  );
};
