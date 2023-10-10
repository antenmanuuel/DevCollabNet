import React from 'react'
import "../../stylesheets/NavLink.css";
import { Link } from 'react-router-dom';
const Tags = () => {
  return (
    <Link to="/tags" id='tagsLink' className='btn-link'>Tags</Link>
  );
}

export default Tags
