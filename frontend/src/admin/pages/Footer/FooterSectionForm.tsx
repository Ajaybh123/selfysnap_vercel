import { Button, TextField } from "@mui/material";

// ================= TYPES =================
interface FooterSectionLink {
  label: string;
  url: string;
}

interface FooterSection {
  title: string;
  links: FooterSectionLink[];
}

interface FooterSectionFormProps {
  sections: FooterSection[];
  setSections: React.Dispatch<React.SetStateAction<FooterSection[]>>;
}

const FooterSectionForm: React.FC<FooterSectionFormProps> = ({
  sections,
  setSections,
}) => {

  /* ================= SECTION ================= */

  const addSection = () => {
    setSections(prev => [
      ...prev,
      { title: "", links: [{ label: "", url: "" }] },
    ]);
  };

  const updateSectionTitle = (i: number, value: string) => {
    setSections(prev =>
      prev.map((sec, idx) =>
        idx === i ? { ...sec, title: value } : sec
      )
    );
  };

  /* ================= LINKS ================= */

  const addLink = (i: number) => {
    setSections(prev =>
      prev.map((sec, idx) =>
        idx === i
          ? { ...sec, links: [...sec.links, { label: "", url: "" }] }
          : sec
      )
    );
  };

  const updateLink = (
    i: number,
    j: number,
    key: keyof FooterSectionLink,
    value: string
  ) => {
    setSections(prev =>
      prev.map((sec, idx) =>
        idx === i
          ? {
              ...sec,
              links: sec.links.map((link, lIdx) =>
                lIdx === j ? { ...link, [key]: value } : link
              ),
            }
          : sec
      )
    );
  };

  const removeLink = (i: number, j: number) => {
    setSections(prev =>
      prev.map((sec, idx) =>
        idx === i
          ? {
              ...sec,
              links: sec.links.filter((_, lIdx) => lIdx !== j),
            }
          : sec
      )
    );
  };

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h4 className="font-semibold">Footer Sections</h4>
        <Button onClick={addSection}>Add Section</Button>
      </div>

      {sections.map((section, i) => (
        <div key={i} className="border p-4 rounded mb-4">
          <TextField
            label="Section Title"
            fullWidth
            value={section.title}
            onChange={(e) =>
              updateSectionTitle(i, e.target.value)
            }
          />

          {section.links.map((link, j) => (
            <div key={j} className="grid grid-cols-2 gap-2 mt-3">
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
                Remove Link
              </Button>
            </div>
          ))}

          <Button size="small" onClick={() => addLink(i)} className="mt-2">
            Add Link
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FooterSectionForm;
