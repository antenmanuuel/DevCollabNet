import React from 'react'
import "../../stylesheets/NavLink.css";
import { Link } from 'react-router-dom';
const QuestionsLink = () => {
  return (
    <Link to="/questions" id='questionsLink' className='btn-link'>Questions</Link>
  )
}

export default QuestionsLink
