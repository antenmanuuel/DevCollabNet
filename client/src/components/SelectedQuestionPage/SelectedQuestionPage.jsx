import React, { useState } from "react";
import QuestionDetailTop from "./QuestionDetailTop";
import QuestionDetail from "./QuestionDetail";
import AnswersTable from "./AnswersTable";
import QuestionsForm from "../QuestionsForm/QuestionsForm";
import AnswerForm from "../AnswerForm/AnswerForm";

const SelectedQuestionPage = ({ questionId, sessionData }) => {
  const [showQuestionsForm, setShowQuestionsForm] = useState(false);
  const [showAnswersForm, setShowAnswersForm] = useState(false);

  const handleAskQuestionPress = () => {
    setShowQuestionsForm(true);
  };

  const handleAnswerPress = () => {
    setShowAnswersForm(true);
  };

  const handleAnswerAdded = () => {
    setShowAnswersForm(false);
  };

  if (showQuestionsForm) {
    return <QuestionsForm sessionData={sessionData} />;
  }

  if(showAnswersForm) {
    return <AnswerForm onAnswerAdded={handleAnswerAdded} questionId={questionId} sessionData={sessionData} />;
  }

  return (
    <div>
      <QuestionDetailTop 
        questionId={questionId} 
        onAskQuestionPress={handleAskQuestionPress} 
        sessionData={sessionData}
      />
      <QuestionDetail questionId={questionId} sessionData={sessionData}/>
      <AnswersTable questionId={questionId} onAnswerPress={handleAnswerPress} sessionData={sessionData} />
    </div>
  );
};

export default SelectedQuestionPage;
