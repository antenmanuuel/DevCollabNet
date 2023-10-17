import React, { useState, useEffect } from 'react';
import "../../stylesheets/TagsTable.css";
import Model from '../../models/model';

const TagsTable = ({ onTagSelected }) => {
  const model = Model.getInstance();
  const [tagsData, setTagsData] = useState([]);

  useEffect(() => {
    const tags = model.getAllTags();
    const preparedTags = tags.map(tag => ({
      name: tag.name,
      count: model.getQuestionsCountForTag(tag.name)
    }));
    setTagsData(preparedTags);
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
                        e.preventDefault(); // Prevent default anchor behavior
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