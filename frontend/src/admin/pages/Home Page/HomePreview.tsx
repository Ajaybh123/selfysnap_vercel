import { useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchHomeSections } from "../../../Redux Toolkit/Customer/HomeSectionSlice";

// Define types for sections and products
interface Product {
  _id: string;
  title: string;
  category: string;
  images?: string[];
}

interface Section {
  _id: string;
  title: string;
  layout: "slider" | "grid";
  products?: Product[];
}

export default function HomePreview() {
  const dispatch = useAppDispatch();
  const { sections, loading, error } = useAppSelector(
    (store) => store.homepreview // ensure slice name is correct
  );

  const sliderRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchHomeSections());
  }, [dispatch]);

  const scroll = (id: string, direction: "left" | "right") => {
    const slider = sliderRefs.current[id];
    if (!slider) return;
    slider.scrollLeft += direction === "left" ? -400 : 400;
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="bg-[#eaeded] space-y-6 py-6">
      {sections.map((sec: Section) => (
        <div key={sec._id} className="bg-white px-4 py-4 mx-4">
          <h2 className="text-lg font-semibold mb-3">{sec.title}</h2>

          {/* Slider Layout */}
          {sec.layout === "slider" && (
            <div className="relative">
              <IconButton
                onClick={() => scroll(sec._id, "left")}
                className="!absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow"
              >
                <ArrowBackIosNewIcon />
              </IconButton>

              <div
                ref={(el: HTMLDivElement | null) => {
                  sliderRefs.current[sec._id] = el;
                }}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-10"
              >
                {sec.products?.map((p: Product) => (
                  <div
                    key={p._id}
                    className="min-w-[160px] cursor-pointer"
                    onClick={() => navigate(`/category/${p.category}`)}
                  >
                    <img
                      src={p.images?.[0] || "/placeholder.png"}
                      alt={p.title}
                      className="h-[160px] w-full object-contain"
                    />
                  </div>
                ))}
              </div>

              <IconButton
                onClick={() => scroll(sec._id, "right")}
                className="!absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow"
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </div>
          )}

          {/* Grid Layout */}
          {sec.layout === "grid" && (
            <div className="grid grid-cols-2 gap-4">
              {sec.products?.slice(0, 4).map((p: Product) => (
                <div
                  key={p._id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/category/${p.category}`)}
                >
                  <img
                    src={p.images?.[0] || "/placeholder.png"}
                    alt={p.title}
                    className="h-[120px] w-full object-contain"
                  />
                  <p className="text-xs mt-1">{p.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
