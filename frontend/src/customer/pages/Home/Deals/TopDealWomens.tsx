import { Box, Typography } from "@mui/material";

export default function TopDealWomens() {
    const topDealsWomen = [
  {
    id: 1,
    title: "Women Solid T-Shirt",
    image: "https://www.beyoung.in/api/cache/catalog/products/plain_new_update_images_2_5_2022/seafoam_green_womens_plain_t-shirt_base_29_07_2023_400x533.jpg",
    discount: "20% OFF",
  },
  {
    id: 2,
    title: "Women Slim Fit Jeans",
    image: "https://www.globalrepublic.in/cdn/shop/products/1_1_68415ae6-5aa5-43f6-a12c-c5def7d4c0ee.webp?v=1716546428&width=1200",
    discount: "30% OFF",
  },
  {
    id: 3,
    title: "Women Casual Shirt",
    image: "https://www.hancockfashion.com/cdn/shop/files/xMNetiDM_2f42764ba0b4446cad310e13150ca869.jpg?v=1747289650",
    discount: "40% OFF",
  },
  {
    id: 4,
    title: "Women Sneakers",
    image: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/NOVEMBER/27/2Dg2fodl_5a4c5fb6bb0e4fca815bbf693346f0fd.jpg",
    discount: "25% OFF",
  },
  {
    id: 5,
    title: "Women Analog Watch",
    image: "https://assets.ajio.com/medias/sys_master/root/20231117/ZZuk/65577b60afa4cf41f59027b9/-473Wx593H-469456968-white-MODEL.jpg",
    discount: "35% OFF",
  },
  {
    id: 6,
    title: "Women Handbag",
    image: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/JULY/25/EOIG5QIZ_20e25900f8a84bf69aeaa37bda244df4.jpg",
    discount: "45% OFF",
  },
];


    return (
        <Box className="w-full relative lg:px-20 border border-gray-300 ">
            {/* Header */}
            <Box className="flex mb-4">
                <Typography variant="h5" fontWeight="bold" textAlign="center">
                    Top Deals On Women
                </Typography>
            </Box>

            {/* Cards */}
            <Box className="flex gap-0 overflow-hidden">
                {topDealsWomen.map((item) => (
                    <Box
                        key={item.id}
                        className="w-[250px] bg-white cursor-pointer"
                    >
                        {/* Image Section */}
                        <Box className="h-[200px] flex items-center justify-center p-0">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-contain block"
                            />
                        </Box>

                        {/* Content */}
                        <Box className="p-2 text-center">
                            <Typography className="text-sm line-clamp-2 mb-0">
                                {item.title}
                            </Typography>

                            <Typography className="text-orange-400 font-semibold text-sm">
                                {item.discount}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
