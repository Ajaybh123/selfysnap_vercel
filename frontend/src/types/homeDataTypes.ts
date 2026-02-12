// types.ts

interface Deal {
  category: HomeCategory;
  discount: number;
}

export interface HomeData {
  _id: string; // <-- changed from number to string
  grid: HomeCategory[];
  shopByCategories: HomeCategory[];
  electricCategories: HomeCategory[];
  deals: Deal[];
  dealCategories: HomeCategory[];
}

export interface HomeCategory {
  _id?: string; // <-- changed from number to string
  categoryId: string;
  section?: string;
  name?: string;
  image: string;
  parentCategoryId?: string;
}
