import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Helper from "../../utils/Helper";

const QuestionTop = ({
  onAskQuestionPress,
  setFilter,
  searchTerm,
  selectedTag,
  sessionData,
}) => {
  const [questionCount, setQuestionCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState("newest");

  const fetchQuestionCount = useCallback(
    async (filter) => {
      const helper = new Helper();
      let endpoint = "http://localhost:8000/posts/questions";
      if (selectedTag) {
        endpoint = `http://localhost:8000/posts/tags/tag_id/${selectedTag}/questions`;
      }
      if (filter) {
        endpoint += `/${filter}`;
      }

      try {
        const response = await axios.get(endpoint, {
          withCredentials: true
        });
        let filteredQuestions = response.data;
        if (searchTerm) {
          filteredQuestions = await helper.filterQuestionsBySearchTerm(
            searchTerm,
            filteredQuestions
          );
        }
        setQuestionCount(filteredQuestions.length);
      } catch (error) {
        console.error("Error fetching questions count:", error);
      }
    },
    [selectedTag, searchTerm, sessionData]
  );

  useEffect(() => {
    fetchQuestionCount();
  }, [selectedTag, searchTerm, fetchQuestionCount]);

  const handleFilterChange = useCallback(
    (newFilter) => {
      setActiveFilter(newFilter);
      setFilter(newFilter);
      fetchQuestionCount(newFilter);
    },
    [setFilter, fetchQuestionCount]
  );

  const isActiveButton = (filterName) => activeFilter === filterName;
  const getButtonClasses = (filterName) => {
    return `mr-2 px-4 py-2 text-white rounded border-none transition-colors ${
      isActiveButton(filterName)
        ? "bg-black hover:bg-gray-700"
        : "bg-gray-500 hover:bg-gray-700"
    }`;
  };

  return (
    <div className="relative w-full pb-5">
      <h1 className="absolute top-[-40px] left-[30px] text-[25px] font-bold">
        {searchTerm ? "Search Results" : "All Questions"}
      </h1>

      {sessionData.loggedIn && (
        <button
          onClick={onAskQuestionPress}
          className="absolute top-[-50px] right-10 bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700"
        >
          Ask Question
        </button>
      )}

      <p className="absolute top-[20px] left-[30px] text-lg">
        {`${questionCount} Questions`}
      </p>

      <div className="flex flex-row w-[300px] border-2 border-gray-300 p-1 absolute top-[20px] right-10">
        <button
          className={getButtonClasses("newest")}
          onClick={() => handleFilterChange("newest")}
        >
          Newest
        </button>
        <button
          className={getButtonClasses("active")}
          onClick={() => handleFilterChange("active")}
        >
          Active
        </button>
        <button
          className={getButtonClasses("unanswered")}
          onClick={() => handleFilterChange("unanswered")}
        >
          Unanswered
        </button>
      </div>
    </div>
  );
};

export default QuestionTop;
