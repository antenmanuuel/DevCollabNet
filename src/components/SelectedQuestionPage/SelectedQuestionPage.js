import React, { useState } from "react";
import QuestionDetailTop from "./QuestionDetailTop";
import QuestionDetail from "./QuestionDetail";
import AnswersTable from "./AnswersTable";
import AnswerButton from "./AnswerButton";
import QuestionsForm from "../QuestionsForm/QuestionsForm";
const SelectedQuestionPage = ({ questionId }) => {

  const [showQuestionsForm, setShowQuestionsForm] = useState(false);

  const handleAskQuestionPress = () => {
    setShowQuestionsForm(true);
  };

  if (showQuestionsForm) {
    return <QuestionsForm />;
  }
  return (
    <div>
      <QuestionDetailTop questionId={questionId} onAskQuestionPress={handleAskQuestionPress} />
      <QuestionDetail questionId={questionId} />
      <AnswersTable questionId={questionId} />
      <AnswerButton />
    </div>
  );
};

export default SelectedQuestionPage;