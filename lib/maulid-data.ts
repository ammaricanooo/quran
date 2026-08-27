import { readFileSync } from "node:fs";
import path from "node:path";

export interface MaulidReadingData {
  id: number;
  order: number;
  type: number;
  arabic: string;
  transliteration: string;
  translate: string;
}

export interface MaulidSubcategoryData {
  id: number;
  name: string;
  slug: string;
  total: number;
  readings: MaulidReadingData[];
}

export interface MaulidCategoryData {
  id: number;
  name: string;
  slug: string;
  total: number;
  subcategories: MaulidSubcategoryData[];
}

interface MaulidDataset {
  categories: MaulidCategoryData[];
}

export function getMaulidData(): MaulidDataset {
  const filePath = path.join(process.cwd(), "dataset", "maulid-nabi", "maulid-nabi.json");
  const contents = readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(contents) as MaulidDataset;
}