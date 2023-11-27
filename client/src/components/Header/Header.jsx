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

function Header({
  setSearchTerm,
  currentPage,
  isLoggedIn,
  onLoginLogout,
}) {
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
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          border: 2,
          borderColor: "black",
          backgroundColor: "grey.300",
          height: "70px",
          display: "flex",
          alignItems: "center",
          px: 2,
        }}
      >
        <Button variant="contained" onClick={onLoginLogout} sx={{ mr: 30 }}>
          {isLoggedIn ? "Logout" : "Login"}
        </Button>

        <Typography
          variant="h3"
          sx={{
            fontWeight: "extrabold",
            fontSize: { xs: "2rem", md: "4rem", lg: "45px", xl: "60px" },
            textAlign: "center",
            flex: 2,
          }}
        >
          Fake Stack OverFlow
        </Typography>

        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <TextField
            id="search-field"
            type="text"
            variant="outlined"
            size="small"
            placeholder="Search ..."
            onKeyPress={handleKeyPress}
            sx={{
              backgroundColor: "white",
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
