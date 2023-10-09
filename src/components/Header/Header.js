import React from "react";
import Search from "../Search/Search";
import "../../stylesheets/Header.css";
function Header() {
  return (
    <div className="container">
      <div className="header">
        <Search />
        <h1 id="title">Fake Stack OverFlow</h1>
      </div>
    </div>
  );
}

export default Header;
