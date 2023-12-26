import UsersPageQ from "./UsersPageQ";
import UsersPageA from "./UsersPageA";
import UsersPageT from "./UsersPageT";
import React, { useState } from "react";


const UsersPage = () => {
    // Check if the user is not logged in
    const [currentPage, setCurrentPage] = useState("Questions");
    const showTags = () => setCurrentPage("Tags");
    const showQuestions = () => setCurrentPage("Questions");
    const showAnswers = () => setCurrentPage("Answers");
    

    
    if (currentPage === "Questions"){ return <UsersPageQ goTags={showTags} goQuestions={showQuestions}  goAnswers={showAnswers} current = {currentPage} />; }

    if (currentPage === "Answers"){ return <UsersPageA goTags={showTags} goQuestions={showQuestions}  goAnswers={showAnswers} current = {currentPage}/>; }

    if (currentPage === "Tags"){ return <UsersPageT goTags={showTags} goQuestions={showQuestions}  goAnswers={showAnswers} current = {currentPage} />; }

    
    


};

export default UsersPage;