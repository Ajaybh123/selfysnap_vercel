import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Switch,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import {
  fetchHomeSections,
  reorderSections,
  updateHomeSection,
  deleteHomeSection,
} from "../../../Redux Toolkit/Admin/HomeSectionSlice";

import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";

// ---------------- Tab Panel ----------------
interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}
function TabPanel({ children, value, index }: TabPanelProps) {
  return <div hidden={value !== index}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>;
}

// ---------------- Component ----------------
export default function HomeSectionList() {
  const dispatch = useAppDispatch();
  const { sections, loading } = useAppSelector((state) => state.homeSection);

  const [activeTab, setActiveTab] = useState(0);

  const JWT = "YOUR_JWT_HERE"; // 👈 Replace with actual JWT from state or cookie

  // Fetch sections
  useEffect(() => {
    dispatch(fetchHomeSections(JWT));
  }, [dispatch]);

  const handleTabChange = (_: any, newValue: number) => setActiveTab(newValue);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    const updated: typeof sections = items.map((item, idx) => ({
      ...item,
      order: idx + 1,
      category: item.category || "", // make sure required fields exist
      limit: item.limit || 0,
    }));

    dispatch(reorderSections(updated));

    // Update backend
    updated.forEach((item) =>
      dispatch(
        updateHomeSection({
          sectionId: item._id,
          data: { order: item.order },
          jwt: JWT,
        })
      )
    );
  };

  const renderList = (data: typeof sections) => {
    if (loading) return <Typography>Loading...</Typography>;
    if (!data.length) return <Typography>No sections found</Typography>;

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {data.map((section, index) => (
                <Draggable key={section._id} draggableId={section._id} index={index}>
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        p: 2,
                        mb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography fontWeight={600}>{section.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {section.tag} • {section.layout}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Switch
                          checked={section.isActive}
                          onChange={() =>
                            dispatch(
                              updateHomeSection({
                                sectionId: section._id,
                                data: { isActive: !section.isActive },
                                jwt: JWT,
                              })
                            )
                          }
                        />

                        <IconButton
                          color="error"
                          onClick={() =>
                            dispatch(deleteHomeSection({ id: section._id, jwt: JWT }))
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Home Section Management
      </Typography>

      <Paper>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tab label="All Sections" />
          <Tab label="Active Sections" />
          <Tab label="Inactive Sections" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {renderList(sections)}
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          {renderList(sections.filter((s) => s.isActive))}
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          {renderList(sections.filter((s) => !s.isActive))}
        </TabPanel>
      </Paper>
    </Box>
  );
}
