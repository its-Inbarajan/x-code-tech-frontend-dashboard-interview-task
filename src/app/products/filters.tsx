"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import React, { ChangeEvent } from "react";

interface FiltersProps {
  categories: { label: string; value: string }[];
  statuses: { label: string; value: string }[];
  sortOptions: { label: string; value: string }[];
  selectedCategory: string;
  selectedStatus: string;
  selectedSort: string;
  onCategoryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onStatusChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onSortChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  categories,
  statuses,
  sortOptions,
  selectedCategory,
  selectedStatus,
  selectedSort,
  onCategoryChange,
  onStatusChange,
  onSortChange,
}) => {
  return (
    <div className="flex items-center flex-col md:flex-row px-4 py-4 justify-between">
      <div className="flex flex-wrap gap-4 items-center ">
        {/* Category Filter */}
        <div>
          <Select
            name="category"
            value={selectedCategory}
            onValueChange={(value) => {
              // Create a synthetic event to match the signature
              const syntheticEvent = {
                target: { value, name: "category" },
              } as ChangeEvent<HTMLSelectElement>;
              onCategoryChange(syntheticEvent);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <Select
            value={selectedStatus}
            onValueChange={(value) => {
              // Create a synthetic event to match the signature
              const syntheticEvent = {
                target: { value, name: "status" },
              } as ChangeEvent<HTMLSelectElement>;
              onStatusChange(syntheticEvent);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Options */}
        <div>
          <Select
            name="sort"
            value={selectedSort}
            onValueChange={(value) => {
              // Create a synthetic event to match the signature
              const syntheticEvent = {
                target: { value, name: "sort" },
              } as ChangeEvent<HTMLSelectElement>;
              onSortChange(syntheticEvent);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="SortBy" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
