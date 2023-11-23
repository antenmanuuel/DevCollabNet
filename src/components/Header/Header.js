import React from "react";
import Search from "../Search/Search";
import "../../stylesheets/Header.css";
function Header({ setSearchTerm, currentPage }) {
  return (
    <div className="container">
      <div className="header">
        <Search setSearchTerm={setSearchTerm} currentPage={currentPage} />
        <h1 id="title">Fake Stack OverFlow</h1>
      </div>
    </div>
  );
}

export default Header;