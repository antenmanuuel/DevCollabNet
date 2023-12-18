import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText, Box } from "@mui/material";

function SideNavbar({ setQuestionsPage, setTagsPage, setProfilePage, setAdminPage, isAdmin }) {
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

  const handleProfileLinkClick = () => {
    setQuestionsPage(true);
    setTagsPage(true);
    setProfilePage(false);
    setActiveLink("users");
  };

  const handleAdminLink = () => {
    setQuestionsPage(true);
    setTagsPage(true);
    setProfilePage(true);
    setAdminPage(false);
    setActiveLink("admins");

  }


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
          {isAdmin  && (
            <ListItem
            button
            sx={getListItemStyle("admin")}
            onClick={handleAdminLink}
          >
            <ListItemText primary="Admin" />
          </ListItem>
          )}
        <ListItem
            button
            sx={getListItemStyle("users")}
            onClick={handleProfileLinkClick}
          >
            <ListItemText primary="User" />
          </ListItem>

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
