export interface HomeSection {
  _id: string;
  title: string;
  category: string; // MainCategory ObjectId
  tag: "bestseller" | "popular" | "seasonal";
  layout: "slider" | "grid";
  limit: number;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
