import React, { useState } from "react";
import "../../stylesheets/NavLink.css";
import "../../stylesheets/SideNavbar.css";

function SideNavbar({ setQuestionsPage, setTagsPage }) {
  const handleQuestionsLinkClick = () => {
    setQuestionsPage(true);
    setTagsPage(false);
  };

  const handleTagsLinkClick = () => {
    setTagsPage(true);
    setQuestionsPage(false);
  };

  return (
    <div className="sideNavbar">
      <button className='btn-link' onClick={handleTagsLinkClick}>Questions</button>
      <button className='btn-link' onClick={handleQuestionsLinkClick}>Tags</button>
    </div>
  );
}

export default SideNavbar;
