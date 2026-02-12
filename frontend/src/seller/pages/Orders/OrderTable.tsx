import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Menu, MenuItem, styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchSellerOrders,
  updateOrderStatus,
} from "../../../Redux Toolkit/Seller/sellerOrderSlice";
import { type Order, type OrderItem, type OrderStatus } from "../../../types/orderTypes";

/* ================== STYLES ================== */

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

/* ================== ORDER STATUS ================== */

const orderStatusList: { label: OrderStatus; color: string }[] = [
  { label: "PENDING", color: "#FFA500" },
  { label: "PLACED", color: "#F5BCBA" },
  { label: "CONFIRMED", color: "#F5BCBA" },
  { label: "SHIPPED", color: "#1E90FF" },
  { label: "DELIVERED", color: "#32CD32" },
  { label: "CANCELLED", color: "#FF0000" },
];

const orderStatusColor: Record<OrderStatus, string> = {
  PENDING: "#FFA500",
  PLACED: "#F5BCBA",
  CONFIRMED: "#F5BCBA",
  SHIPPED: "#1E90FF",
  DELIVERED: "#32CD32",
  CANCELLED: "#FF0000",
};

/* ================== COMPONENT ================== */

export default function OrderTable() {
  const { sellerOrder } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = React.useState<
    Record<string, HTMLElement | null>
  >({});

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    orderId: string
  ) => {
    setAnchorEl((prev) => ({ ...prev, [orderId]: event.currentTarget }));
  };

  const handleClose = (orderId: string) => {
    setAnchorEl((prev) => ({ ...prev, [orderId]: null }));
  };

  React.useEffect(() => {
    dispatch(fetchSellerOrders(localStorage.getItem("jwt") || ""));
  }, [dispatch]);

  const handleUpdateOrder = (
    orderId: string,
    orderStatus: OrderStatus
  ) => {
    dispatch(
      updateOrderStatus({
        jwt: localStorage.getItem("jwt") || "",
        orderId,
        orderStatus,
      })
    );
    handleClose(orderId);
  };

  return (
    <>
      <h1 className="pb-5 font-bold text-xl">All Orders</h1>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Order Id</StyledTableCell>
              <StyledTableCell>Products</StyledTableCell>
              <StyledTableCell>Shipping Address</StyledTableCell>
              <StyledTableCell align="center">Order Status</StyledTableCell>
              <StyledTableCell align="right">Update</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sellerOrder.orders.map((item: Order) => (
              <StyledTableRow key={item._id}>
                <StyledTableCell>{item._id}</StyledTableCell>

                <StyledTableCell>
                  <div className="flex gap-2 flex-wrap">
                    {item.orderItems.map((orderItem: OrderItem) => (
                      <div key={orderItem._id} className="flex gap-4">
                        <img
                          className="w-20 rounded-md"
                          src={orderItem.product.images[0]}
                          alt=""
                        />
                        <div className="flex flex-col justify-between py-2">
                          <h1>{orderItem.product.title}</h1>
                          <h1>₹{orderItem.product.sellingPrice}</h1>
                          <h1>Color: {orderItem.product.color}</h1>
                          <h1>Size: {orderItem.size}</h1>
                        </div>
                      </div>
                    ))}
                  </div>
                </StyledTableCell>

                <StyledTableCell>
                  <div className="flex flex-col gap-y-1">
                    <h1>{item.shippingAddress.name}</h1>
                    <h1>
                      {item.shippingAddress.address},{" "}
                      {item.shippingAddress.city}
                    </h1>
                    <h1>
                      {item.shippingAddress.state} -{" "}
                      {item.shippingAddress.pinCode}
                    </h1>
                    <h1>
                      <strong>Mobile:</strong>{" "}
                      {item.shippingAddress.mobile}
                    </h1>
                  </div>
                </StyledTableCell>

                <StyledTableCell align="center">
                  <Box
                    sx={{
                      color: orderStatusColor[item.orderStatus],
                      borderColor: orderStatusColor[item.orderStatus],
                    }}
                    className="border px-2 py-1 rounded-full text-xs"
                  >
                    {item.orderStatus}
                  </Box>
                </StyledTableCell>

                <StyledTableCell align="right">
                  <Button
                    size="small"
                    onClick={(e) => handleClick(e, item._id)}
                    variant="contained"
                  >
                    Status
                  </Button>

                  <Menu
                    anchorEl={anchorEl[item._id]}
                    open={Boolean(anchorEl[item._id])}
                    onClose={() => handleClose(item._id)}
                  >
                    {orderStatusList.map((status) => (
                      <MenuItem
                        key={status.label}
                        onClick={() =>
                          handleUpdateOrder(item._id, status.label)
                        }
                      >
                        {status.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
