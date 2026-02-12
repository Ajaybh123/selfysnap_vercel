import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, IconButton, Modal, styled, Typography, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import type { HomeCategory } from "../../../types/homeDataTypes";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateHomeCategoryForm from "./UpdateHomeCategoryForm";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { deleteHomeCategory, fetchHomePageData } from "../../../Redux Toolkit/Customer/Customer/AsyncThunk";

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

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

// Restrict section to only category arrays in HomeData
type HomeCategorySection = "grid" | "shopByCategories" | "electricCategories" | "dealCategories";

interface HomeCategoryTableProps {
  section?: HomeCategorySection;
  categories?: HomeCategory[];
}

function HomeCategoryTable({ section, categories: externalCategories }: HomeCategoryTableProps) {
  const dispatch = useAppDispatch();
  const homePage = useAppSelector((store) => store.homePage);

  // Determine which categories to display
  let categoriesToDisplay = externalCategories;
  if (section && homePage.homePageData) {
    categoriesToDisplay = (homePage.homePageData[section] || []) as HomeCategory[];
  }

  const [selectedCategory, setSelectedCategory] = React.useState<HomeCategory>();
  const [open, setOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState<HomeCategory | null>(null);

  const handleOpen = (category: HomeCategory | undefined) => () => {
    setSelectedCategory(category);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleDeleteClick = (category: HomeCategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete?._id !== undefined) {
      try {
        // Convert number to string if backend expects string ID
        await dispatch(deleteHomeCategory(categoryToDelete._id.toString())).unwrap();

        // Refresh data after deletion
        setTimeout(() => {
          dispatch(fetchHomePageData() as any);
        }, 500);

        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  if (!categoriesToDisplay || categoriesToDisplay.length === 0) {
    return (
      <Alert severity="info">
        No categories added to this section yet. Use the "Add Home Category" tab to add one.
      </Alert>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>No</StyledTableCell>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell align="right">Category ID</StyledTableCell>
              <StyledTableCell align="right">Name</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoriesToDisplay.map((category, index) => (
              <StyledTableRow key={category._id}>
                <StyledTableCell component="th" scope="row">{index + 1}</StyledTableCell>
                <StyledTableCell component="th" scope="row">{category._id}</StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  <img
                    className="w-20 rounded-md"
                    src={category.image}
                    alt={category.name}
                    onError={(e) => ((e.target as HTMLImageElement).src = "https://via.placeholder.com/80")}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">{category.categoryId}</StyledTableCell>
                <StyledTableCell align="right">{category.name}</StyledTableCell>
                <StyledTableCell align="center">
                  <IconButton onClick={handleOpen(category)} title="Edit category" size="small">
                    <EditIcon className="text-orange-400 cursor-pointer" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(category)} title="Delete category" size="small">
                    <DeleteIcon className="text-red-500 cursor-pointer" />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <UpdateHomeCategoryForm category={selectedCategory} handleClose={handleClose} />
        </Box>
      </Modal>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} aria-labelledby="delete-dialog-title">
        <DialogTitle id="delete-dialog-title">Delete Category</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete "<strong>{categoryToDelete?.name}</strong>"?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default HomeCategoryTable;
