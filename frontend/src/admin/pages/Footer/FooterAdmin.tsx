import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { Button, Card, CardContent } from "@mui/material";
import { fetchFooters, deleteFooter } from "../../../Redux Toolkit/Admin/FooterSlice";
import FooterForm from "./FooterForm";

// Define TypeScript interfaces for footer data
interface FooterSectionLink {
  label: string;
  url?: string;
}

interface FooterSection {
  title: string;
  links: FooterSectionLink[];
}

interface FooterAddress {
  company: string;
  street?: string;
  city?: string;
  phone?: string;
}

interface Footer {
  _id: string;
  address: FooterAddress;
  sections: FooterSection[];
}

const FooterAdmin = () => {
  const dispatch = useAppDispatch();

  // Type the state from Redux
  const { list, loading } = useAppSelector((state) => state.footer as { list: Footer[]; loading: boolean });
  const footer = list[0];

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchFooters());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Footer Management</h2>

        <Button variant="contained" onClick={() => setOpen(true)}>
          {footer ? "Edit Footer" : "Create Footer"}
        </Button>
      </div>

      {loading && <p>Loading...</p>}

      {footer && (
        <Card className="mb-6">
          <CardContent>
            <p className="font-semibold mb-2">Company</p>
            <p>{footer.address.company}</p>

            <div className="mt-4">
              <p className="font-semibold mb-2">Sections</p>
              {footer.sections.map((s, i) => (
                <div key={i} className="border p-3 rounded mb-2">
                  <p className="font-semibold">{s.title}</p>
                  <ul className="list-disc ml-5 text-sm">
                    {s.links.map((l, j) => (
                      <li key={j}>{l.label}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Button color="error" className="mt-4" onClick={() => dispatch(deleteFooter(footer._id))}>
              Delete Footer
            </Button>
          </CardContent>
        </Card>
      )}

      <FooterForm open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default FooterAdmin;
