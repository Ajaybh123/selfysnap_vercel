// src/components/Customer/HomePreview.tsx
import { useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchHomeSections } from "../../../Redux Toolkit/Customer/HomeSectionSlice";

/* ---------- Types ---------- */
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
  category?: string; // optional for "See more" link
}

export default function HomePreview() {
  const dispatch = useAppDispatch();
  const sections: Section[] = useAppSelector(
    (state) => state.homepreview.sections ?? []
  );
  const sliderRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchHomeSections());
  }, [dispatch]);

  const scroll = (id: string, dir: "left" | "right") => {
    const slider = sliderRefs.current[id];
    if (!slider) return;

    slider.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  const sliderSections = sections.filter((s) => s.layout === "slider");
  const gridSections = sections.filter((s) => s.layout === "grid");

  return (
    <div className="p-4 space-y-6 mx-16">
      {/* ===== SLIDER SECTIONS ===== */}
      {sliderSections.map((sec) => (
        <div
          key={sec._id}
          className="bg-white p-4 rounded border-2 border-orange-400"
        >
          <h2 className="font-semibold mb-3 text-2xl">{sec.title ?? "Untitled"}</h2>

          <div className="relative">
            <IconButton
              onClick={() => scroll(sec._id, "left")}
              className="!absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow"
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <div
              ref={(el: HTMLDivElement | null) => {
                sliderRefs.current[sec._id] = el;
              }}
              className="flex gap-4 overflow-x-auto scrollbar-hide px-10 scroll-smooth"
            >
              {sec.products?.map((item) => (
                <img
                  key={item._id}
                  src={item.images?.[0] ?? "/placeholder.png"}
                  alt={item.title ?? "Product"}
                  className="h-[260px] min-w-[160px] object-contain cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/product-details/${item.category}/${item.title ?? "product"}/${item._id}`
                    )
                  }
                />
              ))}
            </div>

            <IconButton
              onClick={() => scroll(sec._id, "right")}
              className="!absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow"
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      ))}

      {/* ===== GRID SECTIONS ===== */}
      {gridSections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {gridSections.map((sec) => (
            <div
              key={sec._id}
              className="bg-white p-4 rounded border-2 border-orange-400"
            >
              <h3 className="font-semibold mb-3 text-lg">{sec.title ?? "Untitled"}</h3>

              <div className="grid grid-cols-2 gap-3">
                {sec.products?.slice(0, 4).map((item) => (
                  <div
                    key={item._id}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/products/${item.category}`)
                    }
                  >
                    <img
                      src={item.images?.[0] ?? "/placeholder.png"}
                      alt={item.title ?? "Product"}
                      className="h-[150px] w-full object-contain"
                    />
                    <p className="text-sm mt-1 line-clamp-1">{item.title ?? "Unnamed"}</p>
                  </div>
                ))}
              </div>

              {sec.category && (
                <p
                  className="text-xs text-orange-600 mt-3 cursor-pointer"
                  onClick={() => navigate(`/products/${sec.category}`)}
                >
                  See more
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
