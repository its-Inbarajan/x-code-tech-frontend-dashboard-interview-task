import { clsx, type ClassValue } from "clsx";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay = 300
) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function buildQuery(
  params: Record<string, string | number | undefined>
) {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    if (params[key] !== undefined && params[key] !== "") {
      searchParams.append(key, String(params[key]));
    }
  }

  return searchParams.toString();
}

export const updateURLParams = (
  updates: Record<string, string | number | undefined>,
  searchParams: ReadonlyURLSearchParams,
  router: AppRouterInstance
) => {
  const params = new URLSearchParams(searchParams.toString());
  for (const key in updates) {
    if (updates[key] === undefined || updates[key] === "") {
      params.delete(key);
    } else {
      params.set(key, String(updates[key]));
    }
  }

  router.replace(`?${params.toString()}`);
};
