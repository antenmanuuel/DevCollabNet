import React from "react";
import "../../stylesheets/Search.css";

function Search({ setSearchTerm, currentPage }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            setSearchTerm(e.target.value.trim(), currentPage === "TagsPage");
        }
    };


    return (
        <input 
            type="text" 
            id="searchInput" 
            placeholder="Search ..." 
            onKeyPress={handleKeyPress} 
            
        />
    );
}

export default Search;