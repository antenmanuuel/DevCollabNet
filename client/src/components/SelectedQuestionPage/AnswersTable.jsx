import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Helper from "../../utils/Helper";
import AnswerForm from "../AnswerForm/AnswerForm";

const AnswersTable = ({
  questionId,
  onAnswerPress,
  sessionData,
  filteredAnswers,
  onBack,
}) => {
  const [answers, setAnswers] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [commentsData, setCommentsData] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [currentCommentPage, setCurrentCommentPage] = useState({});
  const [commentError, setCommentError] = useState({});
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [userReputation, setUserReputation] = useState(null);

  const answersPerPage = 5;
  const commentsPerPage = 3;
  const helper = new Helper();
  const isFilteredView = filteredAnswers && filteredAnswers.length > 0;

  useEffect(() => {
    if (isFilteredView) {
      axios
        .get(
          `http://localhost:8000/posts/answers/${questionId}/current-user-answers-comments`
        )
        .then((response) => {
          setAnswers(response.data);
          const newCommentsData = {};
          response.data.forEach((answer) => {
            newCommentsData[answer._id] = answer.comments;
          });
          setCommentsData(newCommentsData);
        })
        .catch((error) => {
          console.error("Error fetching filtered answers:", error);
        });
    } else {
      axios
        .get(`http://localhost:8000/posts/answers/${questionId}`)
        .then((response) => {
          setAnswers(response.data);
          fetchCommentsForAnswers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching answers:", error);
        });
    }
  }, [questionId, filteredAnswers, isFilteredView]);

  const fetchCommentsForAnswers = async (answersList) => {
    for (const answer of answersList) {
      try {
        const response = await axios.get(
          `http://localhost:8000/posts/comments/byAnswer/${answer._id}`
        );
        const sortedComments = response.data.sort(
          (a, b) => new Date(b.com_date_time) - new Date(a.com_date_time)
        );
        setCommentsData((prev) => ({
          ...prev,
          [answer._id]: sortedComments,
        }));
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

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


  const isUserLoggedIn = sessionData && sessionData.loggedIn;

  const postCommentOnAnswer = async (answerId) => {
    const commentText = newCommentText[answerId] || "";
    if (userReputation < 50) {
      setCommentError({
        ...commentError,
        [answerId]: "You need a reputation of at least 50 to post comments.",
      });
      return;
    }
    if (!commentText.trim()) {
      setCommentError({
        ...commentError,
        [answerId]: "Comment cannot be empty.",
      });
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8000/posts/comments/commentAnswer`,
        {
          text: commentText,
          username: sessionData.username,
          answerId: answerId,
        }
      );
      if (response.status === 201) {
        const newCommentWithUsername = {
          ...response.data,
          com_by: { username: sessionData.username },
        };
        const updatedComments = [
          newCommentWithUsername,
          ...(commentsData[answerId] || []),
        ];
        setCommentsData({ ...commentsData, [answerId]: updatedComments });
        setNewCommentText({ ...newCommentText, [answerId]: "" });
        setCommentError({ ...commentError, [answerId]: "" });
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleUpvoteComment = async (commentId, answerId) => {
    if (!isUserLoggedIn) return;
    try {
      const response = await axios.patch(
        `http://localhost:8000/posts/comments/upvoteComment/${commentId}`,
        { username: sessionData.username }
      );
      if (response.status === 200) {
        const updatedComments = commentsData[answerId].map((comment) => {
          if (comment._id === commentId) {
            return { ...comment, votes: response.data.votes };
          }
          return comment;
        });
        setCommentsData({ ...commentsData, [answerId]: updatedComments });
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleVote = async (answerId, voteType) => {
    if (!isUserLoggedIn) return;
    try {
      const response = await axios.patch(
        `http://localhost:8000/posts/answers/${voteType}/${answerId}`,
        { username: sessionData.username }
      );
      if (response.status === 200) {
        setAnswers((prev) =>
          prev.map((a) =>
            a._id === answerId ? { ...a, votes: response.data.votes } : a
          )
        );
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleEditAnswer = (answerId) => {
    setEditingAnswerId(answerId);
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      await axios.delete(
        `http://localhost:8000/posts/answers/deleteAnswer/${answerId}`,
        { data: { questionId: questionId } }
      );
      setAnswers(answers.filter((a) => a._id !== answerId));
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  const handleNext = () => {
    setStartIndex((prev) => {
      const nextIndex = prev + answersPerPage;
      return nextIndex < answers.length ? nextIndex : prev;
    });
  };

  const handlePrev = () => {
    setStartIndex((prev) => {
      const prevIndex = prev - answersPerPage;
      return prevIndex >= 0 ? prevIndex : prev;
    });
  };

  const displayedAnswers = answers.slice(startIndex, startIndex + answersPerPage);
  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = startIndex + answersPerPage >= answers.length;

  const handleAnswerEditComplete = (answerId, newText) => {
    setAnswers(
      answers.map((answer) => {
        if (answer._id === answerId) {
          return { ...answer, text: newText };
        }
        return answer;
      })
    );
  };

  if (editingAnswerId) {
    const existingAnswer = answers.find((a) => a._id === editingAnswerId);
    return (
      <AnswerForm
        sessionData={sessionData}
        questionId={questionId}
        editMode={true}
        existingAnswer={existingAnswer}
        onAnswerUpdated={() => setEditingAnswerId(null)}
        onEditComplete={handleAnswerEditComplete}
      />
    );
  }

  return (
    <div className="w-[1580px] ml-[220px] mt-10">
      <div className="overflow-auto h-72 mb-2 border border-gray-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <tbody>
            {displayedAnswers.map((answer) => (
              <React.Fragment key={answer._id}>
                <tr className="border-b border-gray-300">
                  <td className="p-4 align-top">
                    <div className="flex items-center">
                      <div className="flex flex-col items-center mr-4">
                        <button
                          onClick={() => handleVote(answer._id, "upvote")}
                          disabled={!isUserLoggedIn || isFilteredView}
                          className="text-blue-600 hover:opacity-75 mb-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 15l6-6 6 6"
                            />
                          </svg>
                        </button>
                        <p className="text-sm font-semibold">{answer.votes}</p>
                        <button
                          onClick={() => handleVote(answer._id, "downvote")}
                          disabled={!isUserLoggedIn || isFilteredView}
                          className="text-red-600 hover:opacity-75 mt-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M18 9l-6 6-6-6"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex-grow text-sm leading-relaxed">
                        {helper.renderTextWithLinks(answer.text)}
                      </div>
                      <div className="text-right text-sm ml-8">
                        <p className="text-red-600 font-semibold mb-1">
                          {answer.ans_by.username}
                        </p>
                        <p className="text-gray-600 mb-1">
                          answered {helper.formatDate(new Date(answer.ans_date_time))}
                        </p>
                        {isFilteredView && (
                          <div className="flex space-x-2 justify-end mt-2">
                            <button
                              onClick={() => handleEditAnswer(answer._id)}
                              className="border border-blue-600 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAnswer(answer._id)}
                              className="border border-red-600 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
                {(commentsData[answer._id] || [])
                  .slice(
                    (currentCommentPage[answer._id] || 0) * commentsPerPage,
                    ((currentCommentPage[answer._id] || 0) + 1) * commentsPerPage
                  )
                  .map((comment) => (
                    <tr key={comment._id} className="border-b border-gray-300">
                      <td colSpan={1} className="p-4 bg-gray-50">
                        <div className="flex items-center space-x-3">
                          {isUserLoggedIn && (
                            <button
                              onClick={() => handleUpvoteComment(comment._id, answer._id)}
                              disabled={!isUserLoggedIn || isFilteredView}
                              className="text-blue-600 hover:opacity-75"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 15l6-6 6 6"
                                />
                              </svg>
                            </button>
                          )}
                          <p className="text-sm font-semibold">{comment.votes}</p>
                          <p className="text-sm flex-grow">{comment.text}</p>
                          <p className="text-xs text-gray-500 font-semibold">
                            commented by {comment.com_by.username}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                <tr>
                  <td className="p-4">
                    {isUserLoggedIn && (
                      <>
                        <textarea
                          className={`w-full border rounded p-2 text-sm focus:outline-none ${commentError[answer._id] ? "border-red-500" : "border-gray-300"
                            }`}
                          rows={2}
                          value={newCommentText[answer._id] || ""}
                          onChange={(e) =>
                            setNewCommentText({
                              ...newCommentText,
                              [answer._id]: e.target.value,
                            })
                          }
                          placeholder="Write a comment..."
                        />
                        {commentError[answer._id] && (
                          <p className="text-red-600 text-xs mt-1">
                            {commentError[answer._id]}
                          </p>
                        )}
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => postCommentOnAnswer(answer._id)}
                            className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Post Comment
                          </button>
                        </div>
                      </>
                    )}
                    <div className="ml-auto flex space-x-2 mt-2">
                      <button
                        onClick={() =>
                          setCurrentCommentPage({
                            ...currentCommentPage,
                            [answer._id]: Math.max(
                              0,
                              (currentCommentPage[answer._id] || 0) - 1
                            ),
                          })
                        }
                        disabled={
                          (currentCommentPage[answer._id] || 0) === 0 ||
                          (commentsData[answer._id]?.length || 0) <= commentsPerPage
                        }
                        className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() =>
                          setCurrentCommentPage({
                            ...currentCommentPage,
                            [answer._id]: (currentCommentPage[answer._id] || 0) + 1,
                          })
                        }
                        disabled={
                          (((currentCommentPage[answer._id] || 0) + 1) *
                            commentsPerPage >=
                            (commentsData[answer._id]?.length || 0)) ||
                          (commentsData[answer._id]?.length || 0) <= commentsPerPage
                        }
                        className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </td>
                </tr>

              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center mt-4">
        <div className="flex space-x-4">
          <button
            onClick={handlePrev}
            disabled={isPrevDisabled}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        {isFilteredView ? (
          <button
            onClick={onBack}
            className="w-36 px-4 py-2 mt-4 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Back
          </button>
        ) : isUserLoggedIn ? (
          <button
            onClick={onAnswerPress}
            className="w-36 px-4 py-2 mt-4 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Answer Question
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default AnswersTable;