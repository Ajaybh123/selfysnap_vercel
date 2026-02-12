import { useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react"; // ✅ type-only import
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { searchProduct } from "../../../Redux Toolkit/Customer/ProductSlice";
import ProductCard from "../Products/ProductCard/ProductCard";

// ✅ type-only import for Product
import type { Product } from "../../../types/productTypes";

const SearchProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();

  // ✅ Typed selector
  const searchedProducts = useAppSelector(
    (state) => state.products.searchProduct as Product[]
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProductSearch = () => {
    if (!searchQuery.trim()) return;
    dispatch(searchProduct(searchQuery));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleProductSearch();
    }
  };

  return (
    <div className="min-h-screen px-6 lg:px-20">
      {/* Search Input */}
      <div className="flex justify-center py-5">
        <input
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="border-none outline-none bg-slate-100 px-10 py-3 w-full lg:w-1/2 rounded"
          type="text"
          placeholder="Search Product..."
        />
      </div>

      {/* Results */}
      <section>
        {searchedProducts?.length > 0 ? (
          <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-5">
            {searchedProducts.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </section>
        ) : searchQuery ? (
          <div className="h-[70vh] flex flex-col justify-center items-center gap-4">
            <h1 className="font-bold text-2xl text-center">
              Product not found for
              <span className="text-primary-color ml-2 uppercase">
                {searchQuery}
              </span>
            </h1>
          </div>
        ) : (
          <div className="h-[70vh] flex flex-col justify-center items-center">
            <h1 className="font-bold text-4xl lg:text-6xl">
              Search Product Here
            </h1>
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchProducts;
