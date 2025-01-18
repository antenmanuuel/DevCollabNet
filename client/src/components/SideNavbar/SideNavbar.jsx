import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import TagIcon from "@mui/icons-material/Tag";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

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
  };

  const getListItemStyle = (buttonName) => ({
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "12px 16px",
    height: "56px",
    cursor: "pointer",
    color: activeLink === buttonName ? "white" : "#333",
    backgroundColor: activeLink === buttonName ? "#007FFF" : "inherit",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 100,
        "& .MuiDrawer-paper": {
          width: 275,
          borderRight: "1px solid #ccc",
          top: 80,
          position: "sticky",
          backgroundColor: "#fff",
          paddingTop: 2,
          paddingBottom: 2,
        },
      }}
    >
      <Box sx={{ width: 275 }}>
        <List>
          {isAdmin && (
            <ListItem
              button
              sx={getListItemStyle("admins")}
              onClick={handleAdminLink}
            >
              <ListItemIcon sx={{ color: activeLink === "admins" ? "white" : "#555" }}>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Admin"
                primaryTypographyProps={{
                  fontWeight: activeLink === "admins" ? "bold" : "normal",
                }}
              />
            </ListItem>
          )}
          <ListItem
            button
            sx={getListItemStyle("users")}
            onClick={handleProfileLinkClick}
          >
            <ListItemIcon sx={{ color: activeLink === "users" ? "white" : "#555" }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primary="User"
              primaryTypographyProps={{
                fontWeight: activeLink === "users" ? "bold" : "normal",
              }}
            />
          </ListItem>
          <ListItem
            button
            sx={getListItemStyle("questions")}
            onClick={handleQuestionsLinkClick}
          >
            <ListItemIcon sx={{ color: activeLink === "questions" ? "white" : "#555" }}>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primary="Questions"
              primaryTypographyProps={{
                fontWeight: activeLink === "questions" ? "bold" : "normal",
              }}
            />
          </ListItem>
          <ListItem
            button
            sx={getListItemStyle("tags")}
            onClick={handleTagsLinkClick}
          >
            <ListItemIcon sx={{ color: activeLink === "tags" ? "white" : "#555" }}>
              <TagIcon />
            </ListItemIcon>
            <ListItemText
              primary="Tags"
              primaryTypographyProps={{
                fontWeight: activeLink === "tags" ? "bold" : "normal",
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default SideNavbar;
