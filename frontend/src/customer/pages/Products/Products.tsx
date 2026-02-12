import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard/ProductCard";
import FilterSection from "./FilterSection";
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { getAllProducts } from "../../../Redux Toolkit/Customer/ProductSlice";

const Products: React.FC = () => {
  const [sort, setSort] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

  const { categoryId } = useParams<{ categoryId: string }>();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store) => store);
  const [searchParams] = useSearchParams();

  const handleSortProduct = (event: any) => setSort(event.target.value);
  const handleShowFilter = () => setShowFilter((prev) => !prev);
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => setPage(value);

  useEffect(() => {
    const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];
    const filters = {
      brand: searchParams.get("brand") || "",
      color: searchParams.get("color") || "",
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      pageNumber: page - 1,
      minDiscount: searchParams.get("discount")
        ? Number(searchParams.get("discount"))
        : undefined,
    };

    if (categoryId) {
      dispatch(getAllProducts({ category: categoryId, sort, ...filters }));
    }
  }, [searchParams, categoryId, sort, page, dispatch]);

  return (
    <div className="-z-10 mt-10">
      <h1 className="text-3xl text-center font-bold text-gray-700 pb-5 px-9 uppercase space-x-2">
        {categoryId?.split("_").map((item, idx) => (
          <span key={idx}>{item}</span>
        ))}
      </h1>

      <div className="lg:flex">
        <section className="hidden lg:block w-[20%]">
          <FilterSection />
        </section>

        <div className="w-full lg:w-[80%] space-y-5">
          <div className="flex justify-between items-center px-9 h-[40px]">
            <div className="relative w-[50%]">
              {!isLarge && (
                <IconButton onClick={handleShowFilter}>
                  <FilterAltIcon />
                </IconButton>
              )}
              {showFilter && !isLarge && (
                <Box sx={{ zIndex: 3 }} className="absolute top-[60px]">
                  <FilterSection />
                </Box>
              )}
            </div>

            <FormControl size="small" sx={{ width: "200px" }}>
              <InputLabel id="sort">Sort</InputLabel>
              <Select labelId="sort" id="sort" value={sort} onChange={handleSortProduct}>
                <MenuItem value="price_low">Price: Low - High</MenuItem>
                <MenuItem value="price_high">Price: High - Low</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Divider />

          {products.products?.length ? (
            <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 px-5 justify-center">
              {products.products.map((item: any) =>
                categoryId ? (
                  <ProductCard key={item._id} item={item} categoryId={categoryId} />
                ) : null
              )}
            </section>
          ) : (
            <section className="items-center flex flex-col gap-5 justify-center h-[67vh] border">
              <img
                className="w-80"
                src="https://cdn.pixabay.com/photo/2022/05/28/10/45/oops-7227010_960_720.png"
                alt="not-found"
              />
              <h1 className="font-bold text-xl text-center flex items-center gap-2">
                Product Not Found For{" "}
                <p className="text-primary-color flex gap-2 uppercase">
                  {categoryId?.split("_").map((item, idx) => (
                    <span key={idx}>{item}</span>
                  ))}
                </p>
              </h1>
            </section>
          )}

          <div className="flex justify-center pt-10">
            <Pagination
              page={page}
              onChange={handlePageChange}
              color="primary"
              count={products?.totalPages || 1}
              shape="rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
