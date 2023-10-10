import React from "react";
import "../../stylesheets/SideNavbar.css";
import QuestionsLink from "../Links/QuestionsLink";
import TagsLink from "../Links/TagsLink";
function SideNavbar() {
  return (
    <div className="sideNavbar">
      <QuestionsLink />
      <TagsLink />
    </div>
  );
}

export default SideNavbar;
