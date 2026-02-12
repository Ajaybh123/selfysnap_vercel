import React, { useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Collapse,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface MainCategory {
  _id?: string;
  name: string;
  categoryId: string;
  parentCategoryId?: string | null; // 👈 parent CATEGORY ID
  parentCategoryName?: string | null;
}

export interface CategoryTree extends MainCategory {
  children: CategoryTree[];
}

interface Props {
  categories: MainCategory[];
  onEdit: (cat: MainCategory) => void;
}

const CategoryAccordionTree: React.FC<Props> = ({ categories, onEdit }) => {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 🔥 REAL TREE BUILD (categoryId → parentCategoryId)
  const treeData = useMemo(() => {
    const map: Record<string, CategoryTree> = {};
    const roots: CategoryTree[] = [];

    // Step 1: map by categoryId
    categories.forEach((cat) => {
      map[cat.categoryId] = { ...cat, children: [] };
    });

    // Step 2: attach children
    categories.forEach((cat) => {
      if (cat.parentCategoryId) {
        const parent = map[cat.parentCategoryId];
        if (parent) {
          parent.children.push(map[cat.categoryId]);
        }
      } else {
        roots.push(map[cat.categoryId]);
      }
    });

    return roots;
  }, [categories]);

  const renderNode = (node: CategoryTree, level = 0) => (
    <Box key={node.categoryId} sx={{ ml: level * 3, mt: 1 }}>
      <Paper
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: level === 0 ? "#f3f4f6" : "#fff",
        }}
        elevation={1}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {node.children.length > 0 && (
            <IconButton size="small" onClick={() => toggle(node.categoryId)}>
              <ExpandMoreIcon
                sx={{
                  transform: openMap[node.categoryId]
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "0.2s",
                }}
              />
            </IconButton>
          )}
          <Typography fontWeight={level === 0 ? "bold" : "normal"}>
            {node.name}
          </Typography>
        </Box>

        <IconButton size="small" onClick={() => onEdit(node)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Paper>

      {node.children.length > 0 && (
        <Collapse in={openMap[node.categoryId]}>
          {node.children.map((child) =>
            renderNode(child, level + 1)
          )}
        </Collapse>
      )}
    </Box>
  );

  return <Box>{treeData.map((node) => renderNode(node))}</Box>;
};

export default CategoryAccordionTree;
