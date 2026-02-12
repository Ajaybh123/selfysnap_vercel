import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../../../Redux Toolkit/Admin/BannerSlice";

import { uploadToCloudinary } from "../../../util/uploadToCloudnary";

import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import type { Banner } from "../../../types/bannerTypes";

interface BannerForm {
  name: string;
  image: string;
  order: number;
  isActive: boolean;
}

const BannerPage = () => {
  const dispatch = useAppDispatch();
  const { banners, loading } = useAppSelector(
    (state) => state.banner
  ) as { banners: Banner[]; loading: boolean };

  const [form, setForm] = useState<BannerForm>({
    name: "",
    image: "",
    order: 1,
    isActive: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ---------- FETCH ---------- */
  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    try {
      setSaving(true);

      let imageUrl = form.image;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const payload: BannerForm = {
        ...form,
        image: imageUrl,
      };

      if (editId) {
        await dispatch(updateBanner({ id: editId, data: payload })).unwrap();
      } else {
        await dispatch(createBanner(payload)).unwrap();
      }

      // reset
      setForm({ name: "", image: "", order: 1, isActive: true });
      setImageFile(null);
      setEditId(null);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- EDIT ---------- */
  const handleEdit = (banner: Banner) => {
    setForm({
      name: banner.name,
      image: banner.image,
      order: banner.order,
      isActive: banner.isActive,
    });
    setEditId(banner._id);
    setImageFile(null);
    setOpen(true);
  };

  /* ---------- DELETE ---------- */
  const handleDelete = (id: string) => {
    dispatch(deleteBanner(id));
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Banners</h1>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Banner
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {banners.map((b) => (
              <TableRow key={b._id}>
                <TableCell>{b.name}</TableCell>
                <TableCell>
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-24 h-12 object-cover rounded"
                  />
                </TableCell>
                <TableCell>{b.order}</TableCell>
                <TableCell>
                  {b.isActive ? "Active" : "Inactive"}
                </TableCell>
                <TableCell align="right" className="space-x-2">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleEdit(b)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleDelete(b._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {loading && (
          <p className="p-4 text-center text-gray-500">
            Loading...
          </p>
        )}
      </div>

      {/* MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {editId ? "Edit Banner" : "Add Banner"}
        </DialogTitle>

        <DialogContent>
          <div className="flex flex-col gap-4 mt-3">
            <TextField
              label="Banner Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              fullWidth
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files?.[0] || null)
              }
            />

            {(imageFile || form.image) && (
              <img
                src={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : form.image
                }
                className="h-28 w-full object-cover rounded"
              />
            )}

            <TextField
              label="Order"
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({
                  ...form,
                  order: Number(e.target.value),
                })
              }
              fullWidth
            />

            <div className="flex justify-end gap-2">
              <Button onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editId
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannerPage;
