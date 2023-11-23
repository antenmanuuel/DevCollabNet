import React from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function Header({ setSearchTerm, currentPage }) {
  const handleSearch = (value) => {
    setSearchTerm(value.trim(), currentPage === "TagsPage");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e.target.value);
    }
  };

  const handleClick = () => {
    const value = document.getElementById('search-field').value;
    handleSearch(value);
  };

  return (
    <Box sx={{ display: "flex", width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          border: 2,
          borderColor: "black",
          backgroundColor: "grey.300",
          height: "70px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          id="search-field"
          type="text"
          variant="outlined"
          size="small"
          placeholder="Search ..."
          onKeyPress={handleKeyPress}
          sx={{
            position: "absolute",
            right: 16,
            top: 10,
            zIndex: 10,
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

        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: "extrabold",
            fontSize: { xs: "2rem", md: "4rem", lg: "45px", xl: "60px" },
          }}
        >
          Fake Stack OverFlow
        </Typography>
      </Box>
    </Box>
  );
}

export default Header;
