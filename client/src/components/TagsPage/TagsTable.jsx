import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Grid, Typography, Card } from "@mui/material";

const TagsTable = ({ onTagSelected, sessionData }) => {
  const [tagsData, setTagsData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/posts/tags")
      .then((response) => {
        const tags = response.data;

        const fetchCounts = tags.map(async (tag) => {
          const questionsResponse = await axios
            .get(`http://localhost:8000/posts/tags/tag_id/${tag._id}/questions`);
          return { name: tag.name, count: questionsResponse.data.length };
        });

        Promise.all(fetchCounts).then((preparedTags) => {
          const filteredTags = preparedTags.filter((tag) => tag.count > 0 || tag.count == 0);
          setTagsData(filteredTags);
        });
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  }, [sessionData]);

  const handleTagClick = (tagName) => {
    if (onTagSelected) {
      onTagSelected(tagName);
    }
  };

  const rows = [];
  for (let i = 0; i < tagsData.length; i += 3) {
    rows.push(tagsData.slice(i, i + 3));
  }

  return (
    <Box sx={{ marginTop: "80px", width: "90%", position: "absolute" }}>
      <Grid container spacing={4} sx={{ paddingLeft: "100px" }}>
        {tagsData.map((tag, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                width: "55%",
              }}
            >
              <Box
                sx={{
                  padding: "25px",
                  textAlign: "center",
                  border: "2px dashed",
                  borderColor: "gray",
                }}
              >
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleTagClick(tag.name)}
                >
                  {tag.name}
                </Typography>
                <Typography variant="body2">{tag.count} Questions</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TagsTable;
