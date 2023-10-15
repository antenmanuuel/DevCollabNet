import React from "react";
import "../../stylesheets/Filter.css";
const Filter = () => {
  return (
    <div className="nau">
      <table id="nau-table">
        <tbody>
          <tr>
            <th id="nauth1">
              <button id="NauB1">Newest</button>
            </th>
            <th id="nauth2">
              <button id="NauB2">Active</button>
            </th>
            <th id="nauth3">
              <button id="NauB3">Unanswered</button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Filter;
