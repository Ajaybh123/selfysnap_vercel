import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  createMainCategory,
  updateMainCategory,
} from "../../../Redux Toolkit/Admin/MainCategorySlice";

interface Category {
  _id: string;
  name: string;
  categoryId: string;
  level: 1 | 2 | 3;
  parentCategoryId?: string | null;
}

interface CategoryModalProps {
  open: boolean;
  handleClose: () => void;
  editCategory?: Category;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  p: 4,
  borderRadius: 2,
};

const CategoryModal = ({ open, handleClose, editCategory }: CategoryModalProps) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.mainCategory);

  const [name, setName] = useState("");
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [parentCategoryId, setParentCategoryId] = useState<string>("");

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name);
      setLevel(editCategory.level);
      setParentCategoryId(editCategory.parentCategoryId || "");
    } else {
      setName("");
      setLevel(1);
      setParentCategoryId("");
    }
  }, [editCategory]);

  // ✅ Correct parent options
  const parentOptions = categories.filter((cat) => {
    if (level === 2) return cat.level === 1;
    if (level === 3) return cat.level === 2;
    return false;
  });

  const submit = () => {
    const jwt = localStorage.getItem("token") || "";
    if (!name.trim()) return;

    // ✅ BACKEND EXPECTED PAYLOAD
    const payload = {
      name,
      level,
      parentCategoryId: level === 1 ? null : parentCategoryId,
    };

    console.log("FINAL PAYLOAD ✅", payload);

    if (editCategory) {
      dispatch(
        updateMainCategory({
          categoryId: editCategory.categoryId, // ✅ FIXED
          data: payload,
          jwt,
        })
      );
    } else {
      dispatch(
        createMainCategory({
          category: payload,
          jwt,
        })
      );
    }

    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <h3 className="mb-3 font-semibold text-lg">
          {editCategory ? "Edit Category" : "Add Category"}
        </h3>

        <TextField
          fullWidth
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          fullWidth
          label="Level"
          value={level}
          onChange={(e) => {
            setLevel(Number(e.target.value) as 1 | 2 | 3);
            setParentCategoryId("");
          }}
          sx={{ mb: 2 }}
        >
          <MenuItem value={1}>Level 1</MenuItem>
          <MenuItem value={2}>Level 2</MenuItem>
          <MenuItem value={3}>Level 3</MenuItem>
        </TextField>

        {level !== 1 && (
          <TextField
            select
            fullWidth
            label="Parent Category"
            value={parentCategoryId}
            onChange={(e) => setParentCategoryId(e.target.value)}
            sx={{ mb: 2 }}
          >
            {parentOptions.map((cat) => (
              <MenuItem key={cat._id} value={cat.categoryId}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        <Button fullWidth variant="contained" onClick={submit}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default CategoryModal;
