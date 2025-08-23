"use client";

import React from "react";
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
import { EllipsisVertical, Grid2X2Icon, Table2 } from "lucide-react";
import { useProducts } from "@/context/productContext";
import { toast } from "sonner";

export default function Home() {
  const [show, setShow] = React.useState<boolean>(false);
  const handleToggleModal = () => {
    setShow(!show);
  };
  const { products, setProducts } = useProducts();

  React.useEffect(() => {
    async function getProduct() {
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
      }
    }
    getProduct();
  }, [setProducts]);

  return (
    <div className="block">
      <Tabs defaultValue="grid-view" className="w-full max-w-full h-screen">
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
              onClick={handleToggleModal}
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
                      onClick={handleToggleModal}
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
        <div className="block px-4 w-full">
          <TabsContent value="grid-view" className="">
            <ul>
              {products &&
                products.map((item, index) => <li key={index}>{item.name}</li>)}
            </ul>
          </TabsContent>
          <TabsContent value="table-view">
            Change your password here.
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
