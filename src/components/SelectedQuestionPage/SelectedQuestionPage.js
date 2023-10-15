import React, { useState } from "react";
import QuestionDetailTop from "./QuestionDetailTop";
import QuestionDetail from "./QuestionDetail";
import AnswersTable from "./AnswersTable";
import AnswerButton from "./AnswerButton";
import QuestionsForm from "../QuestionsForm/QuestionsForm";
import AnswerForm from "../AnswerForm/AnswerForm";
const SelectedQuestionPage = ({ questionId }) => {

  const [showQuestionsForm, setShowQuestionsForm] = useState(false);

  const [showAnswersForm, setShowAnswersForm] = useState(false);

  const handleAskQuestionPress = () => {
    setShowQuestionsForm(true);
  };

  const handleAnswerPress = () => {
    setShowAnswersForm(true);
  };

  if (showQuestionsForm) {
    return <QuestionsForm />;
  }

  if(showAnswersForm) {
    return <AnswerForm />
  }
  return (
    <div>
      <QuestionDetailTop questionId={questionId} onAskQuestionPress={handleAskQuestionPress} />
      <QuestionDetail questionId={questionId} />
      <AnswersTable questionId={questionId} />
      <AnswerButton onPress={handleAnswerPress} />
    </div>
  );
};

export default SelectedQuestionPage;