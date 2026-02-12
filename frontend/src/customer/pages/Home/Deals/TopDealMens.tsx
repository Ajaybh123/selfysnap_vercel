import { Box, Typography } from "@mui/material";

export default function TopDealMens() {
    const topDealsMen = [
        {
            id: 1,
            title: "Men Solid T-Shirt",
            image: "https://rukminim2.flixcart.com/image/480/640/xif0q/t-shirt/g/1/x/l-su23ltsscn01beige-max-original-imagzcmw8n4ctbnu.jpeg?q=90",
            discount: "20% OFF",
        },
        {
            id: 2,
            title: "Men Slim Fit Jeans",
            image: "https://www.urbanofashion.com/cdn/shop/files/eps-iceblue-2.jpg?v=1761626266",
            discount: "30% OFF",
        },
        {
            id: 3,
            title: "Casual Shirt",
            image: "https://imagescdn.pantaloons.com/img/app/product/1/1025135-14118191.jpg?auto=format&w=450",
            discount: "40% OFF",
        },
        {
            id: 4,
            title: "Men Sneakers",
            image: "https://www.campusshoes.com/cdn/shop/files/LEVEL_LEVEL_WHT-L.GRY_07_831c7a2c-ff1b-4011-9268-b11f984219c6.webp?v=1757580207",
            discount: "25% OFF",
        },
        {
            id: 5,
            title: "Men Analog Watch",
            image: "https://www.maximawatches.com/cdn/shop/files/69390LMGB-A.jpg?v=1719559677",
            discount: "35% OFF",
        },
        {
            id: 6,
            title: "Men Fragrance",
            image: "https://img.kwcdn.com/product/open/f84cc6bf6f7e48d8ae65a17703fff4bb-goods.jpeg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp",
            discount: "35% OFF",
        },
    ];

    return (
        <Box className="w-full relative lg:px-20">
            {/* Header */}
            <Box className="flex mb-4">
                <Typography variant="h5" fontWeight="bold" textAlign="center">
                    Top Deals On Men
                </Typography>
            </Box>

            {/* Cards */}
            <Box className="flex gap-0 overflow-hidden">
                {topDealsMen.map((item) => (
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
