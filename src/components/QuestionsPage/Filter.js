import React from "react";
import "../../stylesheets/Filter.css";
const Filter = ({ onSetFilter }) => {
  return (
    <div className="nau">
      <table id="nau-table">
        <tbody>
          <tr>
            <th id="nauth1">
              <button id="NauB1" onClick={() => onSetFilter('newest')}>Newest</button>
            </th>
            <th id="nauth2">
              <button id="NauB2" onClick={() => onSetFilter('active')}>Active</button>
            </th>
            <th id="nauth3">
              <button id="NauB3" onClick={() => onSetFilter('unanswered')}>Unanswered</button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Filter;