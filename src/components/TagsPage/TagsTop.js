import React, { useEffect, useState } from 'react'
import "../../stylesheets/TagsTop.css"
import AskQuestionButton from '../QuestionsPage/AskQuestionButton'

import Model from '../../models/model'


const TagsTop = () => {
  const model = new Model();
  const [numOfTags, setNumOfTags] = useState(0);

  useEffect(() => {
    const tags = model.getAllTags();
    setNumOfTags(tags.length);
  })
  return (
    <div className='tagsTop'>
      <h1 id='numTags'>{numOfTags} Tags</h1>
      <h2 id='allTags'> All Tags</h2>
      <AskQuestionButton />
    </div>
  )
}

export default TagsTop
