import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  createFooter,
  updateFooter,
} from "../../../Redux Toolkit/Admin/FooterSlice";

import type {
  Footer,
  FooterPayload,
  FooterSection,
  FooterSectionLink,
  FooterAddress,
} from "../../../types/footerTypes";

/* ================= PROPS ================= */
interface FooterFormProps {
  open: boolean;
  onClose: () => void;
}

const FooterForm: React.FC<FooterFormProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const footer = useAppSelector(
    (state) => state.footer.list[0] as Footer | undefined
  );

  /* ================= STATE ================= */
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [bottomLinks, setBottomLinks] = useState<FooterSectionLink[]>([]);
  const [copyrightText, setCopyrightText] = useState("");

  const [address, setAddress] = useState<FooterAddress>({
    company: "",
    line1: "", // required
    line2: "",
    line3: "",
    country: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!footer) return;

    setSections(footer.sections);
    setBottomLinks(footer.bottomLinks);
    setCopyrightText(footer.copyrightText);
    setAddress({
      company: footer.address.company,
      line1: footer.address.line1,
      line2: footer.address.line2 ?? "",
      line3: footer.address.line3 ?? "",
      country: footer.address.country ?? "",
    });
  }, [footer]);

  /* ================= SECTION HANDLERS ================= */
  const addSection = () => {
    setSections([
      ...sections,
      { title: "", links: [{ label: "", url: "" }] },
    ]);
  };

  const removeSection = (i: number) => {
    setSections(sections.filter((_, idx) => idx !== i));
  };

  const updateSectionTitle = (i: number, value: string) => {
    const copy = [...sections];
    copy[i] = { ...copy[i], title: value };
    setSections(copy);
  };

  const addLink = (i: number) => {
    const copy = [...sections];
    copy[i] = {
      ...copy[i],
      links: [...copy[i].links, { label: "", url: "" }],
    };
    setSections(copy);
  };

  const removeLink = (i: number, j: number) => {
    const copy = [...sections];
    copy[i] = {
      ...copy[i],
      links: copy[i].links.filter((_, idx) => idx !== j),
    };
    setSections(copy);
  };

  const updateLink = (
    i: number,
    j: number,
    key: "label" | "url",
    value: string
  ) => {
    const copy = [...sections];
    copy[i].links[j] = {
      ...copy[i].links[j],
      [key]: value,
    };
    setSections(copy);
  };

  /* ================= BOTTOM LINKS ================= */
  const addBottomLink = () => {
    setBottomLinks([...bottomLinks, { label: "", url: "" }]);
  };

  const removeBottomLink = (i: number) => {
    setBottomLinks(bottomLinks.filter((_, idx) => idx !== i));
  };

  const updateBottomLink = (
    i: number,
    key: "label" | "url",
    value: string
  ) => {
    const copy = [...bottomLinks];
    copy[i] = { ...copy[i], [key]: value };
    setBottomLinks(copy);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    const payload: FooterPayload = {
      sections,
      bottomLinks,
      address,
      copyrightText,
    };

    footer
      ? dispatch(updateFooter({ id: footer._id, data: payload }))
      : dispatch(createFooter(payload));

    onClose();
  };

  /* ================= UI ================= */
  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogContent className="space-y-6">
        <h2 className="text-2xl font-semibold">Footer Management</h2>

        {/* ADDRESS */}
        <div>
          <h3 className="font-semibold mb-2">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["company", "line1", "line2", "line3", "country"].map((field) => (
              <TextField
                key={field}
                label={field.toUpperCase()}
                value={(address as any)[field]}
                onChange={(e) =>
                  setAddress({ ...address, [field]: e.target.value })
                }
              />
            ))}
          </div>
        </div>

        {/* SECTIONS */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Footer Sections</h3>
            <Button startIcon={<Add />} onClick={addSection}>
              Add Section
            </Button>
          </div>

          {sections.map((section, i) => (
            <div key={i} className="border rounded p-4 mb-4 bg-gray-50">
              <div className="flex gap-2 mb-2">
                <TextField
                  label="Section Title"
                  fullWidth
                  value={section.title}
                  onChange={(e) =>
                    updateSectionTitle(i, e.target.value)
                  }
                />
                <IconButton color="error" onClick={() => removeSection(i)}>
                  <Delete />
                </IconButton>
              </div>

              {section.links.map((link, j) => (
                <div key={j} className="grid grid-cols-2 gap-2 mt-2">
                  <TextField
                    label="Label"
                    value={link.label}
                    onChange={(e) =>
                      updateLink(i, j, "label", e.target.value)
                    }
                  />
                  <TextField
                    label="URL"
                    value={link.url}
                    onChange={(e) =>
                      updateLink(i, j, "url", e.target.value)
                    }
                  />
                  <Button
                    color="error"
                    size="small"
                    onClick={() => removeLink(i, j)}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button size="small" startIcon={<Add />} onClick={() => addLink(i)}>
                Add Link
              </Button>
            </div>
          ))}
        </div>

        {/* BOTTOM LINKS */}
        <div>
          <h3 className="font-semibold mb-2">Bottom Links</h3>
          <Button startIcon={<Add />} onClick={addBottomLink}>
            Add Link
          </Button>

          {bottomLinks.map((link, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mt-2">
              <TextField
                label="Label"
                value={link.label}
                onChange={(e) =>
                  updateBottomLink(i, "label", e.target.value)
                }
              />
              <TextField
                label="URL"
                value={link.url}
                onChange={(e) =>
                  updateBottomLink(i, "url", e.target.value)
                }
              />
              <Button
                color="error"
                size="small"
                onClick={() => removeBottomLink(i)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {/* COPYRIGHT */}
        <TextField
          label="Copyright"
          fullWidth
          value={copyrightText}
          onChange={(e) => setCopyrightText(e.target.value)}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save Footer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FooterForm;
