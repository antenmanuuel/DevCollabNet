import React from 'react'
import "../../stylesheets/TagsTop.css"
import AskQuestionButton from '../QuestionsPage/AskQuestionButton'
const TagsTop = () => {
  return (
    <div className='tagsTop'>
      <h1 id='numTags'># Tags</h1>
      <h2 id='allTags'>All Tags</h2>
      <AskQuestionButton />
    </div>
  )
}

export default TagsTop
