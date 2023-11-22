import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText, Box } from "@mui/material";

function SideNavbar({ setQuestionsPage, setTagsPage }) {
  const [activeLink, setActiveLink] = useState("questions");

  const handleQuestionsLinkClick = () => {
    setTagsPage(true);
    setQuestionsPage(false);
    setActiveLink("questions");
  };

  const handleTagsLinkClick = () => {
    setQuestionsPage(true);
    setTagsPage(false);
    setActiveLink("tags");
  };

  const getListItemStyle = (buttonName) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: "16px",
    height: "56px",
    cursor: "pointer",
    color: "blue",
    backgroundColor: activeLink === buttonName ? "grey.200" : "inherit",
    "&:hover": {
      backgroundColor: "grey.100",
    },
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 60,
        "& .MuiDrawer-paper": {
          width: 275,
          borderRight: "1px dotted grey.400",
          top: 80,
        },
      }}
    >
      <Box sx={{ width: 275 }}>
        <List>
          <ListItem
            button
            sx={getListItemStyle("questions")}
            onClick={handleQuestionsLinkClick}
          >
            <ListItemText primary="Questions" />
          </ListItem>
          <ListItem
            button
            sx={getListItemStyle("tags")}
            onClick={handleTagsLinkClick}
          >
            <ListItemText primary="Tags" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default SideNavbar;
