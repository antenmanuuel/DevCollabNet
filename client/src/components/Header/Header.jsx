import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

function Header({ setSearchTerm, currentPage, isLoggedIn, onLoginLogout }) {
  const handleSearch = (value) => {
    setSearchTerm(value.trim(), currentPage === "TagsPage");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e.target.value);
    }
  };

  const handleClick = () => {
    const value = document.getElementById("search-field").value;
    handleSearch(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "#F4F6F8",
        borderBottom: "1px solid #ddd",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
        }}
      >
        {/* Login/Logout Button */}
        <Button
          variant="contained"
          color={isLoggedIn ? "error" : "primary"}
          startIcon={isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
          onClick={onLoginLogout}
          sx={{ fontWeight: "bold", textTransform: "capitalize" }}
        >
          {isLoggedIn ? "Logout" : "Login"}
        </Button>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", md: "2rem", lg: "2.5rem" },
            textAlign: "center",
            flex: 1,
            color: "#333",
          }}
        >
          DevCollabNet
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TextField
            id="search-field"
            type="text"
            variant="outlined"
            size="small"
            placeholder="Search..."
            onKeyPress={handleKeyPress}
            sx={{
              backgroundColor: "white",
              borderRadius: "4px",
              width: { xs: "200px", md: "300px", lg: "400px" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={handleClick}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
