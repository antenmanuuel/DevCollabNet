import React, { useState } from "react";
import "../../stylesheets/NavLink.css";
import "../../stylesheets/SideNavbar.css";

function SideNavbar({ setQuestionsPage, setTagsPage }) {
  const handleQuestionsLinkClick = () => {
    setTagsPage(true);
    setQuestionsPage(false);
  };

  const handleTagsLinkClick = () => {
    setQuestionsPage(true);
    setTagsPage(false);;
  };

  return (
    <div className="sideNavbar">
      <button className='btn-link' onClick={handleQuestionsLinkClick}>Questions</button>
      <button className='btn-link' onClick={handleTagsLinkClick}>Tags</button>
    </div>
  );
}

export default SideNavbar;
