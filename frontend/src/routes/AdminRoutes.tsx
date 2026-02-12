import { Route, Routes } from 'react-router-dom'
import SellersTable from '../admin/pages/sellers/SellersTable'
import Coupon from '../admin/pages/Coupon/Coupon'
import CouponForm from '../admin/pages/Coupon/CreateCouponForm'
import GridTable from '../admin/pages/Home Page/GridTable'
import ElectronicsTable from '../admin/pages/Home Page/ElectronicsTable'
import ShopByCategoryTable from '../admin/pages/Home Page/ShopByCategoryTable'
import Deal from '../admin/pages/Home Page/Deal'
import AdminMainCategoryPage from '../admin/pages/Maincategory/MainCategoryPage'
import AddBanner from '../admin/pages/Banner/AdminBannerPage'
import HomePageManagement from '../admin/pages/Home Page/HomePageManagement'
import FooterAdmin from '../admin/pages/Footer/FooterAdmin'
import HomeSection from '../admin/pages/HomeSection/HomeSectionPage'
import AdminOrdersTable from '../admin/pages/Dashboard/AdminOrdersTable'
import AdminPayoutsTable from '../admin/pages/Dashboard/AdminPayoutsTable'
import AdminDeliveryPartnersTable from '../admin/pages/Dashboard/AdminDeliveryPartnersTable'
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<SellersTable/>}/>
      <Route path='/orders' element={<AdminOrdersTable/>}/>
      <Route path='/payouts' element={<AdminPayoutsTable/>}/>
      <Route path='/delivery-partners' element={<AdminDeliveryPartnersTable/>}/>
      <Route path='/coupon' element={<Coupon/>}/>
      <Route path='/add-coupon' element={<CouponForm/>}/>
      <Route path='/home-page' element={<HomePageManagement/>}/>
      <Route path='/home-grid' element={<GridTable/>}/>
      <Route path='/electronics-category' element={<ElectronicsTable/>}/>
      <Route path='/main-category' element={<AdminMainCategoryPage/>}/>
      <Route path='/banners' element={<AddBanner/>}/>
      <Route path='/shop-by-category' element={<ShopByCategoryTable/>}/>
      <Route path='/deals' element={<Deal/>}/>
      <Route path='/footer' element={<FooterAdmin/>}/>
      <Route path='/home-section' element={<HomeSection/>}/>
    </Routes>
  )
}

export default AdminRoutes