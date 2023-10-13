import React from "react";
import QuestionDetailTop from "./QuestionDetailTop";
import QuestionDetail from "./QuestionDetail";
import AnswersTable from "./AnswersTable";

const SelectedQuestionPage = () => {
  return (
    <div>
      <QuestionDetailTop />
      <QuestionDetail />
      <AnswersTable />
    </div>
  );
};

export default SelectedQuestionPage;
