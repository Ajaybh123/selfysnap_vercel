import {
  configureStore,
  combineReducers,
} from "@reduxjs/toolkit";


import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import sellerSlice from "./Seller/sellerSlice";
import sellerAuthenticationSlice from "./Seller/sellerAuthenticationSlice";
import sellerProductSlice from "./Seller/sellerProductSlice";
import ProductSlice from "./Customer/ProductSlice";
import CartSlice from "./Customer/CartSlice";
import AuthSlice from "./Customer/AuthSlice";
import UserSlice from "./Customer/UserSlice";
import OrderSlice from "./Customer/OrderSlice";
import sellerOrderSlice from "./Seller/sellerOrderSlice";
import payoutSlice from "./Seller/payoutSlice";
import payoutRequestSlice from "./Seller/payoutRequestSlice";
import transactionSlice from "./Seller/transactionSlice";
import CouponSlice from "./Customer/CouponSlice";
import AdminCouponSlice from "./Admin/AdminCouponSlice";
import ReviewSlice from "./Customer/ReviewSlice";
import WishlistSlice from "./Customer/WishlistSlice";
import AiChatBotSlice from "./Customer/AiChatBotSlice";
import revenueChartSlice from "./Seller/revenueChartSlice";
import CustomerSlice from "./Customer/Customer/CustomerSlice";
import DealSlice from "./Admin/DealSlice";
import AdminSlice from "./Admin/AdminSlice";
import mainCategorySlice from "./Admin/MainCategorySlice";
import bannerSlice from "./Admin/BannerSlice";
import footerSlice from "./Admin/FooterSlice";
import homeSectionSlice from "./Admin/HomeSectionSlice";
import categorySlice from "./Admin/CategorySlice";
import adminOrderSlice from "./Admin/orderSlice";
import adminPayoutSlice from "./Admin/payoutSlice";
import adminDeliveryPartnerSlice from "./Admin/deliveryPartnerSlice";
import homePreviewSlice from "./Customer/HomeSectionSlice"

const rootReducer = combineReducers({
  
  // customer
  auth: AuthSlice,
  user: UserSlice,
  products: ProductSlice,
  cart: CartSlice,
  orders: OrderSlice,
  coupone: CouponSlice,
  review: ReviewSlice,
  wishlist: WishlistSlice,
  aiChatBot: AiChatBotSlice,
  homePage:CustomerSlice,

  // seller
  sellers: sellerSlice,
  sellerAuth: sellerAuthenticationSlice,
  sellerProduct: sellerProductSlice,
  sellerOrder: sellerOrderSlice,
  payouts: payoutSlice,
  transaction: transactionSlice,
  revenueChart: revenueChartSlice,
  payoutRequest: payoutRequestSlice,

  // admin
  adminCoupon:AdminCouponSlice,
  adminDeals:DealSlice,
  admin:AdminSlice,
  deal:DealSlice,
  adminOrders: adminOrderSlice,
  adminPayouts: adminPayoutSlice,
  adminDeliveryPartners: adminDeliveryPartnerSlice,

  mainCategory: mainCategorySlice,
  banner:bannerSlice,
  footer:footerSlice,
  homeSection:homeSectionSlice,
  category:categorySlice,
  homepreview:homePreviewSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
