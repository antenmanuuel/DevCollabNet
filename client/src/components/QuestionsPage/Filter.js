import React, { useState } from "react";
import "../../stylesheets/Filter.css";

const Filter = ({ onSetFilter }) => {
  const [activeFilter, setActiveFilter] = useState('newest');


  const handleFilterClick = (filter) => {
    setActiveFilter(filter); 
    onSetFilter(filter); 
  };


  const getButtonClass = (filterName) => {
    let id;
    switch (filterName) {
      case 'newest': id = 'NauB1'; break;
      case 'active': id = 'NauB2'; break;
      case 'unanswered': id = 'NauB3'; break;
      default: break;
    }
    return activeFilter === filterName ? `${id} active` : id;
  };

  return (
    <div className="nau">
      <table id="nau-table">
        <tbody>
          <tr>
            <th id="nauth1">
              <button
                id={getButtonClass('newest')}
                onClick={() => handleFilterClick('newest')}
              >
                Newest
              </button>
            </th>
            <th id="nauth2">
              <button
                id={getButtonClass('active')}
                onClick={() => handleFilterClick('active')}
              >
                Active
              </button>
            </th>
            <th id="nauth3">
              <button
                id={getButtonClass('unanswered')}
                onClick={() => handleFilterClick('unanswered')}
              >
                Unanswered
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Filter;
