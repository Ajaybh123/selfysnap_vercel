import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchDeliveryPartners } from "../../../Redux Toolkit/Admin/deliveryPartnerSlice";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material";

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

const AdminDeliveryPartnersTable = () => {
  const dispatch = useAppDispatch();
  const { partners } = useAppSelector(
    (store) => store.adminDeliveryPartners
  );

  useEffect(() => {
    dispatch(fetchDeliveryPartners());
  }, [dispatch]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Partner ID</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Mobile</StyledTableCell>
            <StyledTableCell>Vehicle</StyledTableCell>
            <StyledTableCell>Active Order</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {partners?.map((partner: any) => (
            <StyledTableRow key={partner._id}>
              <StyledTableCell>{partner._id}</StyledTableCell>

              <StyledTableCell>{partner.name}</StyledTableCell>

              <StyledTableCell>
                {partner.email || "-"}
              </StyledTableCell>

              <StyledTableCell>
                {partner.phone || "-"}
              </StyledTableCell>

              <StyledTableCell>
                {partner.vehicleType || "-"}
              </StyledTableCell>

              <StyledTableCell>
                {partner.currentOrder ? "1 Active Order" : "0"}
              </StyledTableCell>

              <StyledTableCell>
                {partner.currentOrder ? "Busy" : "Available"}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminDeliveryPartnersTable;
