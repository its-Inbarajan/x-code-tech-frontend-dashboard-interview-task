"use client";

import React, { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs/tab";
import { EllipsisVertical, Grid2X2Icon, Table2, X } from "lucide-react";
import { Query, useProducts } from "@/context/productContext";
import { toast } from "sonner";
import { ProductsGridView } from "./products/products-grid-view";
import { ProductsTableView } from "./products/products-table-view";
import { Loader } from "@/components/ui/loader/loader";
import { Filters } from "./products/filters";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog/alert-dialog";
import { debounce, updateURLParams } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { IProduct } from "@/@types/product";
import { Input } from "@/components/ui/input/input";

interface FormState {
  name: string;
  price: string | number;
  stock: string | number;
  category: string;
  status: "active" | "inactive" | "out-of-stock";
  vendor: string;
}

export default function Home() {
  const {
    products,
    setProducts,
    loading,
    setLoading,
    getProductsById,
    singleProducts,
    getProducts,
    query,
    setQuery,
    createProduct,
    deleteProductsById,
    updateProductsById,
  } = useProducts();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = React.useState<{
    create: boolean;
    view: boolean;
    edit: boolean;
    delete: boolean;
  }>({
    create: false,
    delete: false,
    edit: false,
    view: false,
  });
  const [formState, setFormState] = React.useState<FormState>({
    category: "",
    name: "",
    price: "",
    status: "active",
    stock: "",
    vendor: "",
  });
  const handleToggleModal = (params: "create" | "edit" | "delete" | "view") => {
    setShow((pre) => ({
      ...pre,
      [params]: !pre[params],
    }));
  };
  const handleToggleViewModal = (id: string) => {
    getProductsById(id);
    setShow((pre) => ({
      ...pre,
      view: true,
    }));
  };

  React.useEffect(() => {
    async function getProduct() {
      setLoading(true);
      try {
        const response = await fetch(`/api/products`, {
          method: "GET",
          cache: "no-cache",
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message);
        }
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
    getProduct();
  }, [setProducts, setLoading]);

  const debouncedFilter = React.useMemo(
    () =>
      debounce((newQuery: Query) => {
        updateURLParams(newQuery, searchParams, router);
        getProducts(undefined, newQuery);
      }, 400),
    [getProducts, searchParams, router]
  );

  const handleFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuery((prev) => {
      const newQuery = { ...prev, [name]: value };
      debouncedFilter(newQuery);
      return newQuery;
    });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormState((pre) => ({
      ...pre,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createProduct(formState as Partial<IProduct>);
    setFormState((pre) => ({
      ...pre,
      category: "",
      name: "",
      price: "",
      status: "active",
      stock: "",
      vendor: "",
    }));
    setShow((pre) => ({
      ...pre,
      create: false,
    }));
  }

  function handleUpdateSubmit(e: FormEvent) {
    e.preventDefault();
    const id = localStorage.getItem("productId") as string;
    updateProductsById(id, formState as Partial<IProduct>);
    setFormState((pre) => ({
      ...pre,
      category: "",
      name: "",
      price: "",
      status: "active",
      stock: "",
      vendor: "",
    }));
    setShow((pre) => ({
      ...pre,
      create: false,
    }));
    handleToggleModal("edit");
    localStorage.removeItem("productId");
  }

  const handleUpdateAndDeteleId = (params: "edit" | "delete", id: string) => {
    console.log(params);
    localStorage.setItem("productId", id);
    if (params === "edit") {
      handleToggleModal("edit");
      async function getProduct() {
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: "GET",
          });
          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message);
          }
          toast.success(result.message);
          setFormState(result?.response);
        } catch (error: unknown) {
          console.log(error);
          if (error instanceof Error) {
            toast.error(error.message);
          }
        } finally {
          setLoading(false);
        }
      }
      getProduct();
    } else if (params === "delete") {
      handleToggleModal("delete");
    }
  };

  const handleDeleteProduct = () => {
    const id = localStorage.getItem("productId");
    if (id) {
      deleteProductsById(id);
      handleToggleModal("delete");
      localStorage.removeItem("productId");
    }
  };

  return (
    <div className="block ">
      <Tabs defaultValue="grid-view" className="w-full max-w-full min-h-screen">
        <TabsList className="bg-transparent border-b w-full flex justify-between items-center px-4">
          {/* Tabs head */}
          <div className="block">
            <TabsTrigger
              className="px-4 border-b-2 dark:data-[state=active]:border-b-gray-100 data-[state=active]:border-b-gray-800 text-sm py-2"
              value="grid-view"
            >
              <Grid2X2Icon className="size-4" /> Grid View
            </TabsTrigger>
            <TabsTrigger
              className="px-4 text-sm py-2 border-b-2 dark:data-[state=active]:border-b-gray-100 data-[state=active]:border-b-gray-800"
              value="table-view"
            >
              <Table2 /> Table view
            </TabsTrigger>
          </div>
          <div className="block">
            <Button
              onClick={() => handleToggleModal("create")}
              type="button"
              className="hidden md:block cursor-pointer transition-all bg-gray-700 text-white px-6 py-1.5 rounded-lg border-green-400 border-b-[2px] hover:brightness-100 hover:-translate-y-[1px] hover:border-b-[3px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-md hover:shadow-green-300 shadow-green-300 active:shadow-none"
            >
              Create Product
            </Button>
            {/* mobile view */}
            <div className="md:hidden inline-block">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-block cursor-pointer mb-1.5 px-0 rounded-md active:ring-1">
                  {" "}
                  <EllipsisVertical className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Button
                      type="button"
                      onClick={() => handleToggleModal("create")}
                      className="w-full rounded-lg dark:text-white px-4 py-1.5"
                    >
                      Create Product
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </TabsList>
        {/* Filter components */}
        <Filters
          categories={[
            { label: "Electronics", value: "electronics" },
            { label: "Books", value: "books" },
            { label: "Clothing", value: "clothing" },
          ]}
          statuses={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Out of Stock", value: "out of stock" },
          ]}
          sortOptions={[
            { label: "Name", value: "name" },
            { label: "Price", value: "price" },
            { label: "Stock", value: "stock" },
            { label: "Created At", value: "createdAt" },
          ]}
          selectedCategory={query?.category ?? ""}
          selectedStatus={query?.status ?? ""}
          selectedSort={query?.sort ?? ""}
          onCategoryChange={handleFilter}
          onStatusChange={handleFilter}
          onSortChange={handleFilter}
        />
        <div className="block px-4 w-full">
          <TabsContent value="grid-view" className="">
            <ProductsGridView
              handleToggleViewModal={handleToggleViewModal}
              products={products}
            />
          </TabsContent>
          <TabsContent value="table-view">
            <ProductsTableView
              products={products}
              handleToggleViewModal={handleToggleViewModal}
              handleUpdateAndDeteleId={handleUpdateAndDeteleId}
            />
          </TabsContent>
        </div>
      </Tabs>
      {/* View Product Diablog */}
      {show.view && (
        <AlertDialog open={show.view}>
          {loading ? (
            <div className="flex h-1/2 items-center justify-center">
              <Loader />
            </div>
          ) : (
            <AlertDialogContent>
              <AlertDialogHeader className="flex flex-row w-full items-center justify-between px-1 py-2 md:px-4 md:py-4">
                <AlertDialogTitle className="text-sm md:text-xl">
                  View Single Product
                </AlertDialogTitle>
                <Button
                  type="button"
                  onClick={() => handleToggleModal("view")}
                  className="inline-block w-0"
                >
                  <X className="size-5  md:size-6 hover:rotate-180 transition-all ease-in-out duration-500 cursor-pointer" />
                </Button>
              </AlertDialogHeader>
              <dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                <div className="flex flex-col pb-1.5">
                  <dt className="mb-0.5 text-sm  text-gray-500 md:text-lg dark:text-gray-400">
                    Product Name
                  </dt>
                  <dd className="text-lg capitalize font-semibold">
                    {singleProducts?.name}
                  </dd>
                </div>
                <div className="flex flex-col py-1.5">
                  <dt className="mb-0.5 text-sm  text-gray-500 md:text-lg dark:text-gray-400">
                    Price
                  </dt>
                  <dd className="text-lg capitalize font-semibold">
                    {singleProducts?.price}
                  </dd>
                </div>
                <div className="flex flex-col pt-1.5">
                  <dt className="mb-0.5 text-sm  text-gray-500 md:text-lg dark:text-gray-400">
                    Stock Quantity
                  </dt>
                  <dd className="text-lg capitalize font-semibold">
                    {singleProducts?.stock}
                  </dd>
                </div>
                <div className="flex flex-col pt-1.5">
                  <dt className="mb-0.5 text-sm  text-gray-500 md:text-lg dark:text-gray-400">
                    Category
                  </dt>
                  <dd className="text-lg capitalize font-semibold">
                    {singleProducts?.category}
                  </dd>
                </div>
                <div className="flex flex-col pt-1.5">
                  <dt className="mb-0.5 text-sm  text-gray-500 md:text-lg dark:text-gray-400">
                    Status
                  </dt>
                  <dd className="text-lg capitalize font-semibold">
                    {singleProducts?.status}
                  </dd>
                </div>
              </dl>
            </AlertDialogContent>
          )}
          {!singleProducts && (
            <div className="text-red-500">Product not found.</div>
          )}
        </AlertDialog>
      )}

      {show.create && (
        <AlertDialog open={show.create}>
          <AlertDialogContent>
            <AlertDialogHeader className="flex flex-row w-full items-center justify-between">
              <AlertDialogTitle className="text-sm md:text-xl">
                Create Product
              </AlertDialogTitle>
              <Button
                type="button"
                onClick={() => handleToggleModal("create")}
                className="inline-block w-0"
              >
                <X className="size-5  md:size-6 hover:rotate-180 transition-all ease-in-out duration-500 cursor-pointer" />
              </Button>
            </AlertDialogHeader>
            <form noValidate onSubmit={handleSubmit} autoComplete="off">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3 space-y-6">
                <div className="w-full">
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    className="w-full rounded-sm text-black font-medium text-xs placeholder:text-black"
                    placeholder="Product name"
                    value={formState.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <Input
                    type="number"
                    name="price"
                    id="price"
                    className="w-full rounded-sm text-black font-medium text-xs placeholder:text-black"
                    placeholder="Price"
                    value={formState.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <Input
                    type="number"
                    name="stock"
                    id="stock"
                    className="w-full rounded-sm text-black font-medium text-xs placeholder:text-black"
                    placeholder="Product stock"
                    value={formState.stock}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <Input
                    type="text"
                    name="vendor"
                    id="vendor"
                    className="w-full rounded-sm text-black font-medium text-xs placeholder:text-black"
                    placeholder="Vendor name"
                    value={formState.vendor}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <Input
                    type="text"
                    name="category"
                    id="category"
                    className="w-full rounded-sm text-black font-medium text-xs placeholder:text-black"
                    placeholder="Category"
                    value={formState.category}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <select
                    name="status"
                    id="status"
                    className="w-full rounded-sm bg-white border px-1.5 capitalize py-2 text-black font-medium text-xs placeholder:text-black"
                    value={formState.status}
                    onChange={handleInputChange}
                  >
                    <option value="" defaultValue={""} hidden>
                      --Choose Status--
                    </option>
                    {["active", "inactive", "out of stack"].map((item) => (
                      <option value={item} key={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-full block">
                <Button className="rounded-sm hover:bg-transparent hover:ring-1 bg-blue-500 hover:ring-blue-500 hover:text-blue-500 text-white transition-all ease-in-out duration-500 text-center text-base font-medium ">
                  Submit
                </Button>
              </div>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {show.edit && (
        <AlertDialog open={show.edit}>
          <AlertDialogContent>
            <AlertDialogHeader className="flex flex-row w-full items-center justify-between">
              <AlertDialogTitle className="text-sm md:text-xl">
                Update Product
              </AlertDialogTitle>
              <Button
                type="button"
                onClick={() => handleToggleModal("edit")}
                className="inline-block w-0"
              >
                <X className="size-5  md:size-6 hover:rotate-180 transition-all ease-in-out duration-500 cursor-pointer" />
              </Button>
            </AlertDialogHeader>
            <form noValidate onSubmit={handleUpdateSubmit} autoComplete="off">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3 space-y-6">
                <div className="w-full">
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    className="w-full rounded-sm text-black font-medium text-xs placeholder:text-black"
                    placeholder="Product name"
                    value={formState.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <Input
                    type="number"
                    name="price"
                    id="price"
                    className="w-full rounded-sm text-black font-medium text-xs placeholder:text-black"
                    placeholder="Price"
                    value={formState.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <Input
                    type="number"
                    name="stock"
                    id="stock"
                    className="w-full rounded-sm text-black font-medium text-xs placeholder:text-black"
                    placeholder="Product stock"
                    value={formState.stock}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <Input
                    type="text"
                    name="vendor"
                    id="vendor"
                    className="w-full rounded-sm text-black font-medium text-xs placeholder:text-black"
                    placeholder="Vendor name"
                    value={formState.vendor}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <Input
                    type="text"
                    name="category"
                    id="category"
                    className="w-full rounded-sm text-black font-medium text-xs placeholder:text-black"
                    placeholder="Category"
                    value={formState.category}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <select
                    name="status"
                    id="status"
                    className="w-full rounded-sm bg-white border px-1.5 capitalize py-2 text-black font-medium text-xs placeholder:text-black"
                    value={formState.status}
                    onChange={handleInputChange}
                  >
                    <option value="" defaultValue={""} hidden>
                      --Choose Status--
                    </option>
                    {["active", "inactive", "out of stack"].map((item) => (
                      <option value={item} key={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-full block">
                <Button className="rounded-sm hover:bg-transparent hover:ring-1 bg-blue-500 hover:ring-blue-500 hover:text-blue-500 text-white transition-all ease-in-out duration-500 text-center text-base font-medium ">
                  Submit
                </Button>
              </div>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {show.delete && (
        <AlertDialog open={show.delete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogHeader className="flex flex-row w-full items-start justify-between">
                <div className="">
                  <AlertDialogTitle className="text-xs md:text-sm">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </div>
                <Button
                  type="button"
                  onClick={() => handleToggleModal("edit")}
                  className="inline-block w-0"
                >
                  <X className="size-5  md:size-6 hover:rotate-180 transition-all ease-in-out duration-500 cursor-pointer" />
                </Button>
              </AlertDialogHeader>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                type="button"
                onClick={() => handleToggleModal("delete")}
                className="bg-gray-500 rounded-md cursor-pointer hover:ring-1 hover:bg-transparent transition-all duration-500 ease-in-out hover:text-gray-500"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDeleteProduct}
                className="bg-red-500 rounded-md cursor-pointer hover:ring-1 hover:bg-transparent transition-all duration-500 ease-in-out hover:text-red-500"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
