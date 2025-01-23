import React, { useEffect, useState, useCallback } from "react";
import Helper from "../../utils/Helper";
import axios from "axios";

const QuestionTable = ({
  filter,
  onQuestionTitleClick,
  selectedTag,
  searchTerm,
  sessionData,
}) => {
  const [questionsData, setQuestionData] = useState([]);
  const [commentsData, setCommentsData] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [commentError, setCommentError] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [currentCommentPage, setCurrentCommentPage] = useState({});
  const [userReputation, setUserReputation] = useState(null);

  const questionsPerPage = 5;
  const commentsPerPage = 3;

  const fetchQuestions = useCallback(async () => {
    const helper = new Helper();
    let endpoint = "http://localhost:8000/posts/questions";

    if (selectedTag) {
      endpoint = `http://localhost:8000/posts/tags/tag_id/${selectedTag}/questions`;
    }
    if (filter) {
      switch (filter) {
        case "newest":
          endpoint += "/newest";
          break;
        case "active":
          endpoint += "/active";
          break;
        case "unanswered":
          endpoint += "/unanswered";
          break;
        default:
          break;
      }
    }

    try {
      const tagResponse = await axios.get("http://localhost:8000/posts/tags", {
      });
      const tagMap = {};
      tagResponse.data.forEach((tag) => {
        tagMap[tag._id] = tag.name;
      });

      const questionResponse = await axios.get(endpoint);
      let filteredQuestions = questionResponse.data;

      if (searchTerm) {
        filteredQuestions = await helper.filterQuestionsBySearchTerm(
          searchTerm,
          filteredQuestions
        );
      }

      const processedQuestions = filteredQuestions.map((question) => ({
        ...question,
        tagNames: question.tags.map((tagId) => tagMap[tagId] || "Unknown Tag"),
        formattedDate: helper.formatDate(new Date(question.ask_date_time)),
      }));

      setQuestionData(processedQuestions);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [filter, selectedTag, searchTerm]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const fetchCommentsForQuestions = async () => {
    for (const question of questionsData) {
      try {
        const response = await axios.get(
          `http://localhost:8000/posts/comments/byQuestion/${question._id}`,
        );
        const sortedComments = response.data.sort(
          (a, b) => new Date(b.com_date_time) - new Date(a.com_date_time)
        );
        setCommentsData((prev) => ({
          ...prev,
          [question._id]: sortedComments,
        }));
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  useEffect(() => {
    if (questionsData.length > 0) {
      fetchCommentsForQuestions();
    }
  }, [questionsData]);

  useEffect(() => {
    const fetchUserReputation = async () => {
      if (!sessionData.loggedIn) return; // Only proceed if the user is logged in

      try {
        const response = await axios.get(
          `http://localhost:8000/users/userReputation/${sessionData.username}`
        );
        setUserReputation(response.data.reputation);
      } catch (error) {
        console.error("Error fetching user reputation:", error);
      }
    };

    fetchUserReputation();
  }, [sessionData.loggedIn, sessionData.username]);


  const handleCommentChange = (e, questionId) => {
    setNewCommentText({
      ...newCommentText,
      [questionId]: e.target.value,
    });
    if (commentError[questionId]) {
      setCommentError({ ...commentError, [questionId]: "" });
    }
  };

  const isValidComment = (text) => {
    const trimmedText = text.trim();
    return trimmedText.length >= 1 && trimmedText.length <= 140;
  };

  const postComment = async (questionId) => {
    const commentText = newCommentText[questionId] || "";
    if (userReputation < 50) {
      setCommentError({
        ...commentError,
        [questionId]: "You need a reputation of at least 50 to post comments.",
      });
      return;
    }
    if (!isValidComment(commentText)) {
      const errorMessage =
        commentText.trim().length === 0
          ? "Comment cannot be empty"
          : "Comment must be between 1 and 140 characters";
      setCommentError({ ...commentError, [questionId]: errorMessage });
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/posts/comments/commentQuestion",
        {
          text: newCommentText[questionId],
          username: sessionData.username,
          questionId,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        const newComment = {
          ...response.data,
          com_by: { username: sessionData.username },
        };
        setCommentsData((prev) => {
          const updated = [newComment, ...(prev[questionId] || [])];
          updated.sort(
            (a, b) => new Date(b.com_date_time) - new Date(a.com_date_time)
          );
          return { ...prev, [questionId]: updated };
        });
        setNewCommentText({ ...newCommentText, [questionId]: "" });
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleQuestionTitleClickLocal = (questionId) => {
    axios
      .patch(`http://localhost:8000/posts/questions/incrementViews/${questionId}`)
      .then(() => {
        setQuestionData((prev) =>
          prev.map((q) =>
            q._id === questionId ? { ...q, views: q.views + 1 } : q
          )
        );
        if (onQuestionTitleClick) {
          onQuestionTitleClick(questionId);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % Math.ceil(questionsData.length / questionsPerPage));
  };

  const handlePrev = () => {
    setCurrentPage((prev) =>
      (prev - 1 + Math.ceil(questionsData.length / questionsPerPage)) %
      Math.ceil(questionsData.length / questionsPerPage)
    );
  };

  const isUserLoggedIn = sessionData && sessionData.loggedIn;

  const handleVote = async (questionId, voteType) => {
    if (!isUserLoggedIn) return;
    try {
      const response = await axios.patch(
        `http://localhost:8000/posts/questions/${voteType}/${questionId}`,
        { username: sessionData.username });
      if (response.status === 200) {
        setQuestionData((prev) =>
          prev.map((q) =>
            q._id === questionId ? { ...q, votes: response.data.votes } : q
          )
        );
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleUpvoteComment = async (commentId) => {
    if (!sessionData.loggedIn) return;
    try {
      const response = await axios.patch(
        `http://localhost:8000/posts/comments/upvoteComment/${commentId}`,
        { username: sessionData.username }
      );
      if (response.status === 200) {
        const questionId = Object.keys(commentsData).find((key) =>
          commentsData[key].some((c) => c._id === commentId)
        );
        if (questionId) {
          const updatedComments = commentsData[questionId].map((comment) =>
            comment._id === commentId ? { ...comment, votes: response.data.votes } : comment
          );
          setCommentsData({ ...commentsData, [questionId]: updatedComments });
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleNextCommentPage = (questionId) => {
    setCurrentCommentPage((prev) => {
      const maxPage = Math.ceil((commentsData[questionId] || []).length / commentsPerPage) - 1;
      return { ...prev, [questionId]: Math.min((prev[questionId] || 0) + 1, maxPage) };
    });
  };

  const handlePrevCommentPage = (questionId) => {
    setCurrentCommentPage((prev) => ({
      ...prev,
      [questionId]: Math.max(0, (prev[questionId] || 0) - 1),
    }));
  };

  const startIndex = currentPage * questionsPerPage;
  const displayedQuestions = questionsData.slice(startIndex, startIndex + questionsPerPage);

  return (
    <div className="w-full mt-20 ml-4 h-[600px] overflow-auto bg-white rounded-lg shadow-lg p-4">
      <table className="table-auto w-full border-collapse border border-gray-300 shadow-sm">
        <tbody>
          {displayedQuestions.length > 0 ? (
            displayedQuestions.map((question) => (
              <React.Fragment key={question._id}>
                <tr className="border-y-4 border-dotted border-gray-400">
                  <td className="p-4 align-top">
                    <div className="flex items-center">
                      <div className="flex flex-col items-center mr-4">
                        <button
                          onClick={() => handleVote(question._id, "upvote")}
                          className="text-blue-500 hover:text-blue-600"
                          title="Upvote"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 15l6-6 6 6" />
                          </svg>
                        </button>
                        <p className="my-1 text-gray-700 font-medium">{question.votes}</p>
                        <button
                          onClick={() => handleVote(question._id, "downvote")}
                          className="text-red-500 hover:text-red-600"
                          title="Downvote"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9l-6 6-6-6" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-gray-600 text-sm">
                        <p>{question.answers.length} answers</p>
                        <p>{question.views} views</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <p
                      onClick={() => handleQuestionTitleClickLocal(question._id)}
                      className="text-blue-600 text-lg font-semibold cursor-pointer hover:underline"
                    >
                      {question.title}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 ml-2">{question.summary}</p>
                    <div className="mt-2">
                      {question.tagNames.map((tagName) => (
                        <span
                          key={tagName}
                          className="inline-block bg-gray-400 text-white rounded px-2 py-1 mr-2 mb-2 text-sm"
                        >
                          {tagName}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <p className="text-red-600">{question.asked_by.username}</p>
                    <p className="text-gray-500 text-sm">{`asked ${question.formattedDate}`}</p>
                  </td>
                </tr>
                <tr>
                  <td colSpan={6} className="p-4">
                    {(commentsData[question._id] || [])
                      .slice(
                        (currentCommentPage[question._id] || 0) * commentsPerPage,
                        ((currentCommentPage[question._id] || 0) + 1) * commentsPerPage
                      )
                      .map((comment) => (
                        <div
                          key={comment._id}
                          className="border border-gray-300 p-2 mb-2 rounded bg-gray-50"
                        >
                          <div className="flex items-center">
                            <div className="flex flex-col items-center mr-2">

                              <button
                                onClick={() => handleUpvoteComment(comment._id)}
                                disabled={!isUserLoggedIn}
                                className="text-blue-500 hover:text-blue-600"
                                title="Upvote Comment"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 15l6-6 6 6"
                                  />
                                </svg>
                              </button>
                              <p className="text-sm">{comment.votes}</p>
                            </div>
                            <p className="text-gray-700 flex-1 mr-4">{comment.text}</p>
                            <p className="text-right text-gray-600 font-semibold text-sm">
                              commented by {comment.com_by.username}
                            </p>
                          </div>
                        </div>
                      ))}
                    {isUserLoggedIn && (
                      <>
                        <textarea
                          rows={2}
                          className={`w-full border p-2 rounded focus:outline-none focus:ring-2 ${commentError[question._id]
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                          value={newCommentText[question._id] || ""}
                          onChange={(e) => handleCommentChange(e, question._id)}
                          placeholder="Write a comment..."
                        />
                        {commentError[question._id] && (
                          <p className="text-red-600 text-sm">{commentError[question._id]}</p>
                        )}
                        <button
                          onClick={() => postComment(question._id)}
                          disabled={!isUserLoggedIn}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Post Comment
                        </button>
                      </>
                    )}
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={() => handlePrevCommentPage(question._id)}
                        disabled={
                          (currentCommentPage[question._id] || 0) === 0 ||
                          (commentsData[question._id]?.length || 0) <= commentsPerPage
                        }
                        className="underline text-blue-600 disabled:text-gray-400"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => handleNextCommentPage(question._id)}
                        disabled={
                          (commentsData[question._id]?.length || 0) <= commentsPerPage ||
                          (((currentCommentPage[question._id] || 0) + 1) * commentsPerPage >=
                            (commentsData[question._id]?.length || 0))
                        }
                        className="underline text-blue-600 disabled:text-gray-400"
                      >
                        Next
                      </button>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr className="border-t-4 border-dotted border-gray-400">
              <td colSpan={3} className="p-4 text-center">
                <p>No questions found</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center mt-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 mr-4 disabled:bg-gray-300"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          disabled={startIndex + questionsPerPage >= questionsData.length}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionTable;