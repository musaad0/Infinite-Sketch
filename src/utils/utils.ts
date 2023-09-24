import { twMerge } from "tailwind-merge";

export function cn(...classes: unknown[]): string {
  return twMerge(classes.filter(Boolean).join(" "));
}

export const prettifyNumber = (number: number) => {
  return new Intl.NumberFormat("en-us").format(number);
};
