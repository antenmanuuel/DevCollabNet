import React from 'react'
import QuestionsPage from '../QuestionsPage/QuestionsPage';
import TagsPage from '../TagsPage/TagsPage';
import "../../stylesheets/MainPage.css"
const MainPage = ({showQuestionsPage, showTagsPage}) => {
  return (
    <div className='mainPage'>
      {showQuestionsPage && <QuestionsPage />}
      {showTagsPage && <TagsPage />}
    </div>
  )
}

export default MainPage
