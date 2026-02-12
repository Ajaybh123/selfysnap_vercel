import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchAdminOrders,
  assignDeliveryPartner,
  updateDeliveryStatus,
} from "../../../Redux Toolkit/Admin/orderSlice";

import {
  fetchDeliveryPartners,
} from "../../../Redux Toolkit/Admin/deliveryPartnerSlice";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled, Select, MenuItem } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 600,
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

const AdminOrdersTable = () => {
  const dispatch = useAppDispatch();

  const { orders } = useAppSelector((store) => store.adminOrders);
  const { partners } = useAppSelector((store) => store.adminDeliveryPartners);

  useEffect(() => {
    dispatch(fetchAdminOrders());
    dispatch(fetchDeliveryPartners());
  }, [dispatch]);


  const handleAssignPartner = (partnerId: string, orderId: string) => {
    dispatch(assignDeliveryPartner({ orderId, deliveryPartnerId: partnerId }));
  };

  const handleStatusUpdate = (orderId: string, status: string) => {
    dispatch(updateDeliveryStatus({ orderId, status }));
  };




  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Order ID</StyledTableCell>
            <StyledTableCell>Seller</StyledTableCell>
            <StyledTableCell>Customer</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>Commission</StyledTableCell>
            <StyledTableCell>Net Earnings</StyledTableCell>
            <StyledTableCell>Assign Delivery</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders?.map((order: any) => (
            <StyledTableRow key={order._id}>
              <StyledTableCell>{order._id}</StyledTableCell>

              <StyledTableCell>
                {order.seller?.sellerName || "-"}
              </StyledTableCell>

              <StyledTableCell>
                {order.user?.fullName || "-"}
              </StyledTableCell>

              <StyledTableCell>
                {order.orderStatus}
              </StyledTableCell>

              <StyledTableCell>
                ₹{order.commission}
              </StyledTableCell>

              <StyledTableCell>
                ₹{(order.totalSellingPrice || 0) - (order.commission || 0)}
              </StyledTableCell>

              {/* ✅ Assign Delivery */}
              <StyledTableCell>
                {order.orderStatus !== "PLACED" ? (
                  <Select
                    size="small"
                    value={order.deliveryPartner?._id || ""}
                    disabled={!!order.deliveryPartner?._id}
                    renderValue={() =>
                      order.deliveryPartner
                        ? `${order.deliveryPartner.name} (${order.deliveryPartner.vehicleType})`
                        : "Assign Partner"
                    }
                    onChange={(e) =>
                      handleAssignPartner(
                        e.target.value as string,
                        order._id
                      )
                    }
                  >
                    <MenuItem value="">Assign Partner</MenuItem>

                    {/* ✅ already assigned partner bhi include karo */}
                    {order.deliveryPartner && (
                      <MenuItem
                        key={order.deliveryPartner._id}
                        value={order.deliveryPartner._id}
                      >
                        {order.deliveryPartner.name} ({order.deliveryPartner.vehicleType})
                      </MenuItem>
                    )}

                    {/* ✅ available partners */}
                    {partners
                      ?.filter((partner: any) => partner?.isAvailable === true)
                      ?.map((partner: any) => (
                        <MenuItem key={partner._id} value={partner._id}>
                          {partner.name} ({partner.vehicleType})
                        </MenuItem>
                      ))}
                  </Select>
                ) : (
                  "-"
                )}
              </StyledTableCell>



              {/* ✅ Actions / Status Update */}
              <StyledTableCell>
                <Select
                  size="small"
                  value={order.orderStatus}
                  disabled={order.orderStatus === "DELIVERED"} // ✅ lock when delivered
                  onChange={(e) =>
                    handleStatusUpdate(
                      order._id,
                      e.target.value as string
                    )
                  }
                >
                  <MenuItem value="ASSIGNED">Assigned</MenuItem>
                  <MenuItem value="PICKED">Picked</MenuItem>
                  <MenuItem value="SHIPPED">Shipped</MenuItem>
                  <MenuItem value="DELIVERED">Delivered</MenuItem>
                </Select>
              </StyledTableCell>


            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminOrdersTable;
