import React, { useState, useEffect, useCallback } from "react";
import "../../stylesheets/QuestionsPage.css";
import QuestionTop from "./QuestionTop";
import QuestionTable from "./QuestionTable";
import Model from "../../models/model";
import QuestionsForm from "../QuestionsForm/QuestionsForm";
import SelectedQuestionPage from "../SelectedQuestionPage/SelectedQuestionPage";
import Helper from "../../utils/Helper";

const QuestionsPage = ({ questions, searchTerm, setSearchTerm }) => {
  const model = Model.getInstance();
  const helper = new Helper();
  
  const [numOfQuestions, setNumOfQuestions] = useState(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [updateKey, setUpdateKey] = useState(0);
  const [filter, setFilter] = useState('newest');
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const fetchQuestions = useCallback(() => {
    const allQuestions = questions || model.getAllQuestions();
    let fetchedQuestions = [...allQuestions];

    if (searchTerm) {
      const parsedTerms = helper.parseSearchTerm(searchTerm);
      const tags = parsedTerms.tags.map((tag) => tag.slice(1, -1).toLowerCase());

      fetchedQuestions = fetchedQuestions.filter((question) => {
        const title = question.title.toLowerCase();
        const text = question.text.toLowerCase();
        const tagNames = question.tagIds.map((tagId) => model.getTagNameById(tagId).toLowerCase());
        const matchesSearchWords = parsedTerms.nonTags.some((word) => title.includes(word) || text.includes(word));
        const matchesTags = tags.some((tag) => tagNames.includes(tag));
        return matchesSearchWords || matchesTags;
      });
    }

    setFilteredQuestions(fetchedQuestions);
    setNumOfQuestions(fetchedQuestions.length);
  }, [questions, searchTerm]);

  useEffect(fetchQuestions, [fetchQuestions]);

  const [isQuestionPageVisible, setIsQuestionPageVisible] = useState(true);
  const [showQuestionsForm, setShowQuestionsForm] = useState(false);

  const handleAskQuestionPress = useCallback(() => {
    setIsQuestionPageVisible(false);
    setShowQuestionsForm((prev) => !prev);
  }, []);

  const handleQuestionTitleClick = useCallback((questionId) => {
    setIsQuestionPageVisible(false);
    setSelectedQuestionId(questionId);
  }, []);

  const handleFilterChange = useCallback((selectedFilter) => {
    setFilter(selectedFilter);
  }, []);

  const handleQuestionAdded = useCallback(() => {
    setUpdateKey((prevKey) => prevKey + 1);
  }, []);

  if (!isQuestionPageVisible) {
    if (showQuestionsForm) {
      return (
        <QuestionsForm 
          onQuestionAdded={handleQuestionAdded}
          setSearchTerm={setSearchTerm}
        />
      );
    }
    if (selectedQuestionId) {
      return <SelectedQuestionPage questionId={selectedQuestionId} />;
    }
  }

  return (
    <div className="questionContainer">
      <QuestionTop 
        numOfQuestions={numOfQuestions} 
        onAskQuestionPress={handleAskQuestionPress} 
        setFilter={handleFilterChange}
        searchTerm={searchTerm}
      />
      <QuestionTable 
        updateKey={updateKey} 
        onQuestionTitleClick={handleQuestionTitleClick} 
        filter={filter}
        questions={filteredQuestions}
      />
    </div>
  );
};

export default QuestionsPage;