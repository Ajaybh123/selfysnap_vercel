import { Card, CardContent, Typography, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentsIcon from "@mui/icons-material/Payments";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useAppSelector } from "../../../Redux Toolkit/Store";

const AdminAnalyticsCards = () => {
  const { adminOrders, adminPayouts, adminDeliveryPartners } = useAppSelector(
    (store) => store
  );

  const totalOrders = adminOrders.orders.length;
  const totalPayouts = adminPayouts.payouts.length;
  const totalPartners = adminDeliveryPartners.partners.length;

  const totalCommission = adminOrders.orders.reduce(
    (sum, order) => sum + (order.commission || 0),
    0
  );

  const totalEarnings = adminOrders.orders.reduce(
    (sum, order) => sum + (order.totalSellingPrice || 0),
    0
  );

  const totalNetEarnings = totalEarnings - totalCommission;

  // Card style
  const cardStyle = {
    flex: "1 1 250px", // grow/shrink with min width
    minWidth: 250,
    height: 120,
    borderTop: "5px solid orange",
    borderRadius: 2,
    boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
  };

  const titleStyle = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    fontWeight: 600,
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2, // MUI spacing unit (2 * 8px = 16px)
      }}
    >
      {/* Total Orders */}
      <Card sx={cardStyle}>
        <CardContent>
          <Typography sx={titleStyle}>
            <ShoppingCartIcon fontSize="small" />
            Total Orders
          </Typography>
          <Typography variant="h4">{totalOrders}</Typography>
        </CardContent>
      </Card>

      {/* Total Payouts */}
      <Card sx={cardStyle}>
        <CardContent>
          <Typography sx={titleStyle}>
            <PaymentsIcon fontSize="small" />
            Total Payouts
          </Typography>
          <Typography variant="h4">{totalPayouts}</Typography>
        </CardContent>
      </Card>

      {/* Delivery Partners */}
      <Card sx={cardStyle}>
        <CardContent>
          <Typography sx={titleStyle}>
            <LocalShippingIcon fontSize="small" />
            Delivery Partners
          </Typography>
          <Typography variant="h4">{totalPartners}</Typography>
        </CardContent>
      </Card>

      {/* Total Commission */}
      <Card sx={cardStyle}>
        <CardContent>
          <Typography sx={titleStyle}>
            <CurrencyRupeeIcon fontSize="small" />
            Total Commission
          </Typography>
          <Typography variant="h4">₹{totalCommission}</Typography>
          <Typography variant="body2">
            Net Earnings: ₹{totalNetEarnings}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminAnalyticsCards;
