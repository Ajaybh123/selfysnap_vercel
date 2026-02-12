import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchMainCategories } from "../../../Redux Toolkit/Admin/MainCategorySlice";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import CategoryAccordionTree from "./CategoryAccordionTree";
import CategoryModal from "./CategoryModal";

const AdminMainCategoryPage = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.mainCategory);
  const [open, setOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);

  useEffect(() => {
    const jwt = localStorage.getItem("token") || ""; // ya jahan se bhi JWT le rahe ho
    dispatch(fetchMainCategories(jwt));
  }, [dispatch]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Main Categories</h2>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditCategory(null);
            setOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>

      <CategoryAccordionTree
        categories={categories}  // <- pass karo yaha
        onEdit={(cat) => {
          setEditCategory(cat);
          setOpen(true);
        }}
      />

      <CategoryModal
        open={open}
        handleClose={() => setOpen(false)}
        editCategory={editCategory}
      />
    </div>
  );
};

export default AdminMainCategoryPage;