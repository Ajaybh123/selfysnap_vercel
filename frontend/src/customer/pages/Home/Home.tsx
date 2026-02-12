import { useEffect } from 'react'
import HomeCategory from './HomeCategory/HomeCategory'
import TopBrand from './TopBrands/Grid'
import ElectronicCategory from './Electronic Category/ElectronicCategory'
import { Backdrop, Button, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store'
import { getAllProducts } from '../../../Redux Toolkit/Customer/ProductSlice'
import DealSlider from './Deals/DealSlider'
import BannerCarousel from './Banner/Banner'
// import ProductCard from '../Products/ProductCard/ProductCard'
// import TopDealMens from './Deals/TopDealMens'
// import TopDealWomens from './Deals/TopDealWomens'
import HomePreview from '../../../admin/pages/HomeSection/HomePreview'

const Home = () => {
    const dispatch = useAppDispatch()

    // ✅ FIXED SELECTORS
    const homePage = useAppSelector(store => store.homePage)
    const productsState = useAppSelector(store => store.products)

    // ✅ SAFE PRODUCTS ARRAY
    // const products = productsState?.products || []

    // const topProducts = products.slice(0, 4)
    // const middleProducts = products.slice(4, 8)

    const navigate = useNavigate()

    // ✅ FETCH PRODUCTS
    useEffect(() => {
        dispatch(getAllProducts({}));
    }, [dispatch]);

    const becomeSellerClick = () => navigate('/become-seller')

    if (homePage.loading || productsState.loading) {
        return (
            <Backdrop open>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <div className='space-y-5 lg:space-y-6 relative'>
            {homePage.homePageData?.electricCategories && <ElectronicCategory />}

            <BannerCarousel />

            {homePage.homePageData?.grid && <TopBrand />}

            {homePage.homePageData?.deals && (
                <section className='pt-10'>
                    <h1 className='text-center text-lg lg:text-4xl font-bold text-[#284797] pb-10'>
                        Today&apos;s Deals
                    </h1>
                    <DealSlider />
                </section>
            )}

            {homePage.homePageData?.shopByCategories && (
                <section className='flex flex-col items-center py-20 px-5 lg:px-10'>
                    <h1 className='text-lg lg:text-4xl font-bold text-[#284797] pb-20'>
                        SHOP BY CATEGORY
                    </h1>
                    <HomeCategory />
                </section>
            )}

            <HomePreview />

            {/* <TopDealMens /> */}

            {/* 🔥 TOP PRODUCTS */}
            {/* {topProducts.length > 0 && (
                <section className="px-5 lg:px-20 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {topProducts.map(item => (
                            <div key={item._id} className="scale-110">
                                <ProductCard item={item} categoryId={item.category?._id} isHomePage={true} />
                            </div>
                        ))}
                    </div>
                </section>
            )} */}

            {/* <TopDealWomens /> */}

            {/* 🔥 MIDDLE PRODUCTS */}
            {/* {middleProducts.length > 0 && (
                <section className="px-5 lg:px-20 py-10 ">

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {middleProducts.map(item => (
                            <div key={item._id} className="scale-110">
                                <ProductCard item={item} categoryId={item.category?._id} isHomePage={true} />
                            </div>
                        ))}
                    </div>
                </section>
            )} */}


            {/* SELLER BANNER */}
            <section className='lg:px-20 relative h-[200px] lg:h-[450px]'>
                <img className='w-full h-full' src="/seller_banner_image.jpg" alt="" />
                <div className='absolute top-1/2 left-4 lg:left-[15rem] -translate-y-1/2 font-semibold lg:text-4xl space-y-3'>
                    <h1>Sell Your Product</h1>
                    <p className='text-lg md:text-2xl'>
                        With <strong className='logo text-3xl md:text-5xl pl-2'>Selfy Snap</strong>
                    </p>
                    <Button onClick={becomeSellerClick} startIcon={<StorefrontIcon />} variant="contained">
                        Become Seller
                    </Button>
                </div>
            </section>
        </div>
    )
}

export default Home
