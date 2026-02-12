export interface MainCategory {
  _id?: string;
  name: string;
  categoryId: string;
  level: 1 | 2 | 3;
  parentCategoryId?: string | null;
  parentCategoryName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryTree extends MainCategory {
  children?: CategoryTree[];
}
