import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../stylesheets/TagsTable.css";

const TagsTable = ({ onTagSelected }) => {
  const [tagsData, setTagsData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/posts/tags')
      .then(response => {
        const tags = response.data;

        // Fetch count of questions for each tag
        const fetchCounts = tags.map(tag => {
          return axios.get(`http://localhost:8000/posts/tags/tag_id/${tag._id}/questions`)
            .then(questionsResponse => {
              return { name: tag.name, count: questionsResponse.data.length };
            });
        });

        Promise.all(fetchCounts).then(preparedTags => {
          setTagsData(preparedTags);
        });
      })
      .catch(error => {
        console.error('Error fetching tags:', error);
      });
  }, []);

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
    <div className="TagsPage">
      <table id="TagsTable">
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((tag, tagIndex) => (
              <td key={tagIndex} className="tag-container">
                <ul className="tag-list">
                  <li className="tag-name">
                    <a 
                      href="#" 
                      className="tag-link" 
                      onClick={(e) => {
                        e.preventDefault(); 
                        handleTagClick(tag.name);
                      }}
                    >
                      {tag.name}
                    </a>
                  </li>
                  <li className="tag-count">{tag.count} Questions</li>
                </ul>
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
};

export default TagsTable;