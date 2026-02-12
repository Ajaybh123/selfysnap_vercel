import { Box, Tab, Tabs, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import { fetchHomePageData } from "../../../Redux Toolkit/Customer/Customer/AsyncThunk";
import AddHomeCategoryForm from "./AddHomeCategoryForm";
import HomeCategoryTable from "./HomeCategoryTable";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HomePageManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useAppDispatch();

  // Load home page data on component mount
  useEffect(() => {
    dispatch(fetchHomePageData() as any);
  }, [dispatch]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Home Page Management
      </Typography>

      <Paper>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="home page tabs"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Add Home Category" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Electronics Categories" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Shop By Categories" id="tab-2" aria-controls="tabpanel-2" />
          <Tab label="Grid Categories" id="tab-3" aria-controls="tabpanel-3" />
          <Tab label="Deals Categories" id="tab-4" aria-controls="tabpanel-4" />
        </Tabs>

        {/* Add Home Category */}
        <TabPanel value={activeTab} index={0}>
          <AddHomeCategoryForm />
        </TabPanel>

        {/* Electronics Categories */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Electronics Categories
          </Typography>
          <HomeCategoryTable section="electricCategories" />
        </TabPanel>

        {/* Shop By Categories */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Shop By Categories
          </Typography>
          <HomeCategoryTable section="shopByCategories" />
        </TabPanel>

        {/* Grid Categories */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Grid Categories
          </Typography>
          <HomeCategoryTable section="grid" />
        </TabPanel>

        {/* Deals Categories */}
        <TabPanel value={activeTab} index={4}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Deals Categories
          </Typography>
          <HomeCategoryTable section="dealCategories" />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default HomePageManagement;
