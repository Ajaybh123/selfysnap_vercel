import DrawerList from "../../admin seller/components/drawerList/DrawerList";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { ViewCarouselSharp } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
const menu = [
    {
        name: "Dashboard",
        path: "/admin",
        icon: <DashboardIcon className="text-primary-color" />, 
        activeIcon: <DashboardIcon className="text-white" />, 
    },
    {
        name: "Orders",
        path: "/admin/orders",
        icon: <DashboardIcon className="text-primary-color" />, 
        activeIcon: <DashboardIcon className="text-white" />, 
    },
    {
        name: "Payouts",
        path: "/admin/payouts",
        icon: <DashboardIcon className="text-primary-color" />, 
        activeIcon: <DashboardIcon className="text-white" />, 
    },
    {
        name: "Delivery Partners",
        path: "/admin/delivery-partners",
        icon: <DashboardIcon className="text-primary-color" />, 
        activeIcon: <DashboardIcon className="text-white" />, 
    },
    {
        name: "Coupons",
        path: "/admin/coupon",
        icon: <IntegrationInstructionsIcon className="text-primary-color" />, 
        activeIcon: <IntegrationInstructionsIcon className="text-white" />, 
    },
    {
        name: "Add New Coupon",
        path: "/admin/add-coupon",
        icon: <AddIcon className="text-primary-color" />, 
        activeIcon: <AddIcon className="text-white" />, 
    },
    {
        name: "Banners",
        path: "/admin/banners",
        icon: <ViewCarouselSharp className="text-primary-color" />, 
        activeIcon: <ViewCarouselSharp className="text-white" />, 
    },
    {
        name: "Footer",
        path: "/admin/footer",
        icon: <HomeIcon className="text-primary-color" />, 
        activeIcon: <HomeIcon className="text-white" />, 
    },
    {
        name: "Home Management",
        path: "/admin/home-page",
        icon: <HomeIcon className="text-primary-color" />, 
        activeIcon: <HomeIcon className="text-white" />, 
    },
    {
        name: "Home Sections",
        path: "/admin/home-section",
        icon: <ElectricBoltIcon className="text-primary-color" />, 
        activeIcon: <ElectricBoltIcon className="text-white" />, 
    },
    {
        name: "Main Category",
        path: "/admin/main-category",
        icon: <FolderIcon className="text-primary-color" />, 
        activeIcon: <FolderIcon className="text-white" />, 
    },
    {
        name: "Deals",
        path: "/admin/deals",
        icon: <LocalOfferIcon className="text-primary-color" />, 
        activeIcon: <LocalOfferIcon className="text-white" />, 
    },
];

const menu2 = [


    {
        name: "Logout",
        path: "/",
        icon: <LogoutIcon className="text-primary-color" />,
        activeIcon: <LogoutIcon className="text-white" />,
    },

]

interface DrawerListProps {
    toggleDrawer?: any;
}

const AdminDrawerList = ({ toggleDrawer }: DrawerListProps) => {

    return (
        <>
            <DrawerList toggleDrawer={toggleDrawer} menu={menu} menu2={menu2} />
        </>
    );
};

export default AdminDrawerList;
