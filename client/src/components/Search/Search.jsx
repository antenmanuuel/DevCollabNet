import React from 'react';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

function Search({ setSearchTerm, currentPage }) {
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
  );
}

export default Search;
