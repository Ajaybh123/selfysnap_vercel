import { useState } from "react";
import { Box, Paper, Tabs, Tab, Typography } from "@mui/material";

import HomeSectionForm from "./HomeSectionForm";
import HomeSectionList from "./HomeSectionList";
import HomePagePreview from "./HomePreview";

export default function HomeSectionPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Home Page Management
      </Typography>

      <Paper>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Add Home Section" />
          <Tab label="Manage Sections" />
          <Tab label="Home Preview" />
        </Tabs>

        {/* ADD FORM */}
        {tab === 0 && (
          <Box p={3}>
            <HomeSectionForm />
          </Box>
        )}

        {/* LIST */}
        {tab === 1 && (
          <Box p={3}>
            <HomeSectionList />
          </Box>
        )}

        {/* PREVIEW */}
        {tab === 2 && (
          <Box p={3}>
            <HomePagePreview />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
