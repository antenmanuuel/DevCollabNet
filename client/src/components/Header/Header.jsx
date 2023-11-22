import React from "react";
import Search from "../Search/Search";
import { Box, Typography } from "@mui/material";

function Header({ setSearchTerm, currentPage }) {
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
        <Search setSearchTerm={setSearchTerm} currentPage={currentPage} />
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
