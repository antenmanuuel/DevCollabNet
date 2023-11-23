import React, { useState } from "react";
import "../../stylesheets/NavLink.css";
import "../../stylesheets/SideNavbar.css";

function SideNavbar({ setQuestionsPage, setTagsPage }) {

  const [activeLink, setActiveLink] = useState('questions');

  const handleQuestionsLinkClick = () => {
    setTagsPage(true);
    setQuestionsPage(false);
    setActiveLink('questions');
  };

  const handleTagsLinkClick = () => {
    setQuestionsPage(true);
    setTagsPage(false);
    setActiveLink('tags');
  };

  const getButtonClass = (buttonName) => {
    return activeLink === buttonName ? 'btn-link active' : 'btn-link';
  };

  return (
    <div className="sideNavbar">
      <button className={getButtonClass('questions')} onClick={handleQuestionsLinkClick}>Questions</button>
      <button className={getButtonClass('tags')} onClick={handleTagsLinkClick}>Tags</button>
    </div>
  );
}

export default SideNavbar;
