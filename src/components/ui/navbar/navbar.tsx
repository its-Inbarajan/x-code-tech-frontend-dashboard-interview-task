"use client";
import React, { ChangeEvent } from "react";
import { Input } from "../input/input";
import Link from "next/link";
import { useTheme } from "@/context/themeContext";
import { Computer, Moon, Sun } from "lucide-react";
import { Button } from "../button/button";
import { debounce } from "@/lib/utils";
import { useProducts } from "@/context/productContext";
import { useRouter, useSearchParams } from "next/navigation";

export const Navbar = () => {
  const { setTheme, theme } = useTheme();
  const [toggle, setToggle] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const handleToggle = () => {
    setToggle((pre) => !pre);
  };

  const { getProducts } = useProducts();
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceSearch = React.useMemo(
    () => debounce((value: string) => getProducts(value), 400),
    [getProducts]
  );

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    debounceSearch(value);

    // Update URL query param
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.replace(`?${params.toString()}`);
  };
  return (
    <nav className="fixed bg-gray-200 dark:bg-gray-900 shadow-gray-500 shadow-xs top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-black dark:text-white font-bold text-2xl"
            >
              LOGO
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex-1 w-full max-w-screen">
              <Input
                type="text"
                placeholder="Search by name/vendor"
                onChange={handleSearchInputChange}
                value={search}
                className="w-full rounded-md max-w-xl ring-1 ring-gray-500 dark:ring-white focus-within:outline-0"
              />
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex gap-4 items-center md:ml-6">
              <Button className="cursor-pointer transition-all bg-[#304EA1] text-white px-6 py-1.5 rounded-lg border-blue-400 border-b-[2px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[3px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-md hover:shadow-blue-300 shadow-blue-300 active:shadow-none">
                Login
              </Button>
              <div className="flex gap-3 relative items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <div
                  role="radiogroup"
                  className=" w-fit flex gap-4 px- rounded-full ring-1"
                >
                  <button
                    type="button"
                    role="radio"
                    title="light-mode"
                    data-theme-switcher="true"
                    data-active="false"
                    className={`${
                      theme === "light" && "bg-gray-500 rounded-full "
                    } w-8 h-8  flex justify-center  cursor-pointer items-center`}
                    aria-label="Switch to light theme"
                    aria-checked="false"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="size-4" />
                  </button>
                  <button
                    type="button"
                    role="radio"
                    title="System default"
                    data-theme-switcher="true"
                    data-active="false"
                    className={`w-8 h-8  ${
                      theme === "system" &&
                      "dark:bg-gray-50 bg-gray-300 dark:text-gray-900 text-black rounded-full"
                    } flex justify-center items-center cursor-pointer`}
                    aria-label="Switch to system theme"
                    aria-checked="false"
                    onClick={() => setTheme("system")}
                  >
                    <Computer className="size-4" />
                  </button>
                  <button
                    type="button"
                    role="radio"
                    title="Dark-mode"
                    data-theme-switcher="true"
                    data-active="true"
                    className={`w-8 h-8  ${
                      theme === "dark" && "bg-gray-50 text-black rounded-full"
                    } flex justify-center items-center rounded cursor-pointer`}
                    aria-label="Switch to dark theme"
                    aria-checked="true"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <Button
              onClick={handleToggle}
              className="inline-flex items-center justify-center p-2 rounded-md dark:text-white text-gray-900"
            >
              <span className="sr-only">Open main menu</span>
              {!toggle ? (
                <svg
                  id="menu-icon"
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12h18M3 6h18M3 18h18"></path>
                </svg>
              ) : (
                <svg
                  id="close-icon"
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>
      {toggle && (
        <div id="menu" className="h-screen">
          <div className="px-2 pt-2 h-full pb-3 space-y-1 sm:px-3">
            <div className="flex items-baseline">
              <Input
                type="text"
                name="search"
                id="search"
                placeholder="Search"
                className="w-full placeholder:text-sm dark:placeholder:text-white rounded-md dark:text-white text-black focus-within:ring-0 focus-within:outline-0"
              />
            </div>
            <Link
              href="#"
              className="text-gray-900 inline-block mt-1.5 w-full text-center dark:bg-black bg-white dark:text-gray-50 px-3 py-2 rounded-md text-base font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
