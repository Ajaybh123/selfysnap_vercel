import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/Store";
import { fetchBanners } from "../../../../Redux Toolkit/Admin/BannerSlice";

// Swiper CSS
import "swiper/swiper-bundle.css";

const BannerCarousel = () => {
  const dispatch = useAppDispatch();
  const { banners, loading } = useAppSelector((state) => state.banner);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const activeBanners =
    banners?.filter((b) => b.isActive !== false)?.sort((a, b) => a.order - b.order) || [];

  if (loading || activeBanners.length === 0) return null;

  return (
    <div className="w-full px-3 md:px-8 lg:px-20">
      <div className="relative z-0 w-full aspect-[4000/1300] rounded-xl overflow-hidden shadow-lg">

        {/* Navigation Buttons */}
        <button className="banner-prev hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 text-orange-400 text-5xl font-light select-none">
          ‹
        </button>
        <button className="banner-next hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 text-orange-400 text-5xl font-light select-none">
          ›
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          navigation={{
            prevEl: ".banner-prev",
            nextEl: ".banner-next",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            renderBullet: ( className) => {
              return `<span class="${className} w-2 h-2 md:w-2 md:h-2 rounded-full bg-white opacity-50 transition-all duration-300"></span>`;
            },
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          speed={1000}
          loop
          className="h-full"
        >
          {activeBanners.map((banner) => (
            <SwiperSlide key={banner._id}>
              <img
                src={banner.image}
                alt="home-banner"
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination container centered using flex justify-center */}
        <div className="swiper-pagination absolute bottom-4 w-full flex justify-center gap-2 z-10"></div>

        {/* Active bullet extra size + orange */}
        <style>
          {`
            .swiper-pagination-bullet-active {
              width: 14px !important;
              height: 14px !important;
              background-color: #ff864a !important;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default BannerCarousel;
