import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const Filter = ({ onSetFilter }) => {
  const [activeFilter, setActiveFilter] = useState("newest");

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    onSetFilter(filter);
  };

  const getButtonVariant = (filterName) => {
    return activeFilter === filterName ? "contained" : "outlined";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: 300,
        marginLeft: "1025px",
        marginTop: "-5px",
        border: 3,
        borderColor: "grey.300",
        borderStyle: "solid",
        p: 1,
      }}
    >
      <Button
        variant={getButtonVariant("newest")}
        onClick={() => handleFilterClick("newest")}
        sx={{
          marginRight: 1,
          color: "white", 
          bgcolor: activeFilter === "newest" ? "black" : "grey",
          "&:hover": {
            bgcolor: "grey.700",
            border:"none"
          },
          border:"none"
        }}
      >
        Newest
      </Button>
      <Button
        variant={getButtonVariant("active")}
        onClick={() => handleFilterClick("active")}
        sx={{
          marginRight: 1,
          color: "white",
          bgcolor: activeFilter === "active" ? "black" : "grey",
          "&:hover": {
            bgcolor: "grey.700",
            border:"none"
          },
          border:"none"
        }}
      >
        Active
      </Button>
      <Button
        variant={getButtonVariant("unanswered")}
        onClick={() => handleFilterClick("unanswered")}
        sx={{
          marginRight: 1,
          color: "white",
          bgcolor: activeFilter === "unanswered" ? "black" : "grey",
          "&:hover": {
            bgcolor: "grey.700",
            border:"none"
          },
          border:"none"
        }}
      >
        Unanswered
      </Button>
    </Box>
  );
};

export default Filter;
