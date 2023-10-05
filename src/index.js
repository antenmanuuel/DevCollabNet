import Model from "./model.js";

const model = new Model();
window.onload = function () {
  
  /**
   * Formats a date into a more readable format, indicating the difference
   * from the current time to the provided post time.
   **/
  function formatDate(postTime) {
    const now = new Date();
    const diffInSeconds = (now - postTime) / 1000;

    if (diffInSeconds < 60) {
      return `${Math.round(diffInSeconds)} seconds ago`;
    }
    if (diffInSeconds < 3600) {
      return `${Math.round(diffInSeconds / 60)} minutes ago`;
    }
    if (diffInSeconds < 86400) {
      return `${Math.round(diffInSeconds / 3600)} hours ago`;
    }
    const timeString = postTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12 : false,
    });

    if (diffInSeconds < 31536000) {
      return `${postTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} at ${timeString}`;
    }
    return `${postTime.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} at ${timeString}`;
  }

  /**
   * Sorts two date strings in descending order.
   **/
  function sortNewestToOldest(a, b) {
    const dateA = new Date(a.askDate);
    const dateB = new Date(b.askDate);
    return dateB - dateA; 
  }

  const topDiv = document.querySelector(".top"); // ask question button + Newst,active,unanswered
  const mainForm = document.querySelector(".main"); // Question form
  const answerForm = document.querySelector(".mainForAnswer"); // Answer Form
  const questionSection = document.querySelector(".question"); //question section
  const askQuestionButton = document.getElementById("askQuestionButton"); // question button
  const clickQuestionTitle = document.getElementById("question-table"); // table for questions
  const clickableTag = document.getElementById("tagsLink"); // sidebar navigation button for tags
  const clickableQuestion = document.getElementById("questionsLink"); // sidebar navigation button for questions
  const ansSection = document.querySelector(".main_ans"); // table for answers of a question
  const nauSection = document.querySelector(".nau"); // sorting section
  const askAnswerButton = document.getElementById("askAnswerButton"); // answer button
  const tagsPage = document.querySelector(".TagsPage"); // Tags Page
  const newest = document.getElementById("NauB1"); // newest button
  const active = document.getElementById("NauB2"); // active button
  const unanswered = document.getElementById("NauB3"); // unanswered button

  let currentSortFunc = null;

  /**
   * Attach an event listener to the "newest" element.
   * When clicked, questions will be sorted from newest to oldest based on their ask date.
   **/
  newest.addEventListener("click", function (event) {
    event.preventDefault();
    currentSortFunc = (a, b) => new Date(b.askDate) - new Date(a.askDate);
    displayQuestions(null, currentSortFunc);
  });

  /**
   * Attach an event listener to the "active" element.
   * When clicked, questions will be sorted based on the most recent answers they received.
   **/
  active.addEventListener("click", function (event) {
    event.preventDefault();
    currentSortFunc = (a, b) => {
      const aLastAnswerDate = model.getMostRecentAnswerDateForQuestion(a);
      const bLastAnswerDate = model.getMostRecentAnswerDateForQuestion(b);

      if (aLastAnswerDate.getTime() === bLastAnswerDate.getTime()) {
        return new Date(b.askDate) - new Date(a.askDate);
      }
      return bLastAnswerDate - aLastAnswerDate;
    };
    displayQuestions(null, currentSortFunc);
  });

  /**
   * Attach an event listener to the "unanswered" element.
   * When clicked, only questions without answers will be displayed.
   **/
  unanswered.addEventListener("click", function (event) {
    event.preventDefault();
    currentSortFunc = null;

    const unansweredFilterFunc = (question) => {
      return question.ansIds.length === 0;
    };

    displayQuestions(unansweredFilterFunc);
    document.getElementById("border2").style.display = "flex";
  });

  /**
   * Resets the view to display the question list and hide related sections.
   */

  function resetToQuestionListView() {
    document.getElementById("th2-ans").innerText = "";
    document.getElementById("th3-ans").innerText = "";
    document.getElementById("th4-ans").innerText = "";
    document.getElementById("th1-ans").innerText = "";

    topDiv.style.display = "flex";
    topDiv.style.flexDirection = "column";
    questionSection.style.display = "flex";
    nauSection.style.display = "flex";
    ansSection.style.display = "none";
    mainForm.style.display = "none";
    answerForm.style.display = "none";
    document.getElementById("titleofquestion").style.display = "none";
  }

  /**
   * Displays the details of a specific question including its text, who asked it, the ask date,
   * the number of views, and the answers associated with it.
   **/
  function displayQuestionDetails(question) {
    document.getElementById("th2-ans").innerText = question.text;
    document.getElementById("th3-ans").innerText = question.askedBy;
    document.getElementById("th4-ans").innerText =
      "asked " + formatDate(new Date(question.askDate));

    document.getElementById("th1-ans").innerText = `${question.views} views`;

    const answerIds = question.ansIds;
    const answers = answerIds
      .map((ansId) => model.getAnswerById(ansId))
      .sort((a, b) => new Date(b.ansDate) - new Date(a.ansDate));

    const answersTable = document.getElementById("ans_table2");
    answersTable.innerHTML = "";
    answers.forEach((answer) => {
      const formattedDate = formatDate(new Date(answer.ansDate));
      const rowHTML = `
      <tr id="tr2-ans">
        <td id="th1-ans2"><p>${answer.text}</p></td>
        <td id="th3-ans2">
          <ul style="list-style:none;">
            <li style="color:green;">${answer.ansBy}</li>
            <li style="color:gray;">answered ${formattedDate}</li>
          </ul>
        </td>
      </tr>
    `;
      answersTable.innerHTML += rowHTML;
    });
  }

  /**
   * Displays detailed information about the question that was clicked on.
   **/
  function displaySelectedQuestionDetails(targetElement) {
    answerForm.style.display = "none";
    const clickedTitle = targetElement.textContent;
    const titleOfQuestionElement = document.getElementById("titleofquestion");
    titleOfQuestionElement.innerText = clickedTitle;

    const clickedRow = targetElement.closest("tr");
    const clickedQid = clickedRow.dataset.qid;
    const clickedQuestion = model.getQuestionById(clickedQid);

    document.getElementById("th2-ans").innerText = clickedQuestion.text;
    document.getElementById("th3-ans").innerText = clickedQuestion.askedBy;
    const formattedDate = formatDate(new Date(clickedQuestion.askDate));
    document.getElementById("th4-ans").innerText = "asked " + formattedDate;

    if (clickedQuestion) {
      clickedQuestion.views += 1;
      document.getElementById(
        "th1-ans"
      ).innerText = `${clickedQuestion.views} views`;
    }

    const answerIds = clickedQuestion.ansIds;
    const answers = answerIds
      .map((ansId) => model.getAnswerById(ansId))
      .sort((a, b) => new Date(b.ansDate) - new Date(a.ansDate));
    const answersTable = document.getElementById("ans_table2");

    answersTable.innerHTML = "";

    answers.forEach((answer) => {
      const formattedDate = formatDate(new Date(answer.ansDate));
      const rowHTML = `
      <tr id="tr2-ans">
          <td id="th1-ans2"><p>${answer.text}</p></td>
          <td id="th3-ans2">
              <ul style="list-style:none;">
                  <li style="color:green;">${answer.ansBy}</li>
                  <li style="color:gray;">answered ${formattedDate}</li>
              </ul>
          </td>
      </tr>
    `;
      answersTable.innerHTML += rowHTML;
    });

    topDiv.style.display = "flex";
    topDiv.style.flexDirection = "column";
    questionSection.style.display = "none";
    nauSection.style.display = "none";
    ansSection.style.display = "flex";
    ansSection.style.flexDirection = "column";

    document.querySelector(".top").setAttribute("style", "height:0px");
    document.querySelector(".top").style.borderBottom = "none";
    document.getElementById("titleofquestion").style.display = "flex";
    document.getElementById("allQuesID").innerText =
      `${clickedQuestion.ansIds.length}` + " Answers";
    document.getElementById("allQuesID").style.display = "flex";
    document.getElementById("allQuesID").style.flexDirection = "column";
    document.getElementById("numQuestion").innerText = "";
    document.getElementById("askAnswerButton").style.display = "flex";
  }

  /**
   * Display questions in the table, optionally applying a filter and sort function.
   **/
  function displayQuestions(filterFunc = null, sortFunc = sortNewestToOldest) {
    tagsPage.style.display = "none";
    const questionTable = document.getElementById("question-table");
    questionTable.innerHTML = "";

    const allQuesHeading = document.getElementById("allQuesID");

    let questions = model.getAllQuestions();

    if (sortFunc) {
      questions.sort(sortFunc);
    }

    if (filterFunc) {
      questions = questions.filter(filterFunc);
      allQuesHeading.textContent = "Search Results";
    } else {
      allQuesHeading.textContent = "All Questions";
    }

    if (!questions.length) {
      questionTable.innerHTML = `<tr><td style="font-size:20px; padding-left:40px; font-weight:bolder;">No Questions Found</td></tr>`;
      document.getElementById("numQuestion").textContent = "0 Questions";
      return;
    }

    questions.forEach((question) => {
      const tagNames = question.tagIds.map((tagId) =>
        model.getTagNameById(tagId)
      );

      const tagsHTML = tagNames
        .map(
          (tagName, index) => `<li id="keyword-${index + 1}">${tagName}</li>`
        )
        .join("");
      const formattedDate = formatDate(new Date(question.askDate));
      const rowHTML = `
              <tr data-qid="${question.qid}" id="tr1">
              <td id="td1">
                      <ul> 
                          <li id="num_ans">${question.ansIds.length} answers</li>
                          <li id="num_ques">${question.views} views</li>
                      </ul>
                  </td>
                  <td id="td2">
                      <ul id="ulrow2"> 
                          <li id="title_questions">
                              <button id="link_ans"><p id="paraf">${question.title}</p></button>
                          </li>
                          <li>
                          <ul id="ulrow3">${tagsHTML}</ul>
                          </li>
                      </ul>
                  </td>
                  <td id="who_asked">
                  <p><span style="color:red;">${question.askedBy}</span><span style="color:gray;"> asked ${formattedDate}</span></p>
                  </td>
              </tr>
          `;

      const totalQuestionsElement = document.getElementById("numQuestion");
      totalQuestionsElement.style.display = "block";
      totalQuestionsElement.textContent = `${questions.length} Questions`;

      questionTable.insertAdjacentHTML("beforeend", rowHTML);
      document.getElementById("border2").style.display = "none";
    });
  }
  answerForm.style.display = "none";
  clickQuestionTitle.addEventListener("click", function () {
    if (event.target && event.target.id === "paraf") {
      displaySelectedQuestionDetails(event.target);
    }
  });

  if (window.location.href.includes("index.html")) {
    clickableQuestion.classList.add("highlighted-link");
  } else {
    clickableTag.classList.add("highlighted-link");
  }

/**
 * Attach an event listener to make the question title clickable.
 * When a question title is clicked, it displays details and related answers for that question.
**/
  clickableQuestion.addEventListener("click", function (event) {
    event.preventDefault();
    displayQuestions();
    clickableQuestion.classList.add("highlighted-link");
    clickableTag.classList.remove("highlighted-link");
    resetToQuestionListView();
  });


/**
 * Attach an event listener to the tag element to make it clickable.
 * When a tag is clicked, it displays a list of all tags.
**/
  clickableTag.addEventListener("click", function (event) {
    event.preventDefault();
    topDiv.style.display = "flex";
    questionSection.style.display = "none";
    ansSection.style.display = "none";
    document.getElementById("numQuestion").innerText = "";
    document.getElementById("titleofquestion").style.display = "flex";
    document.getElementById("titleofquestion").innerText = "All Tags";
    mainForm.style.display = "none";
    answerForm.style.display = "none";
    askQuestionButton.style.display = "flex";
    nauSection.style.display = "none";
    document.querySelector(".top").style.borderBottom = "none";
    document.getElementById("allQuesID").style.display = "flex";
    document.getElementById("allQuesID").innerText = `${
      model.getAllTags().length
    } Tags`;
    tagsPage.style.display = "block";
    document.getElementById("border2").style.display = "none";

    const tags = model.getAllTags();
    const tagsTable = document.getElementById("TagsTable");
    tagsTable.innerHTML = ""; 

    for (let i = 0; i < tags.length; i += 3) {
      let rowHTML = "<tr>";
      let j;

      for (j = 0; j < 3 && i + j < tags.length; j++) {
        const tag = tags[i + j];
        const questionsCount = model.getQuestionsCountForTag(tag.name);
        rowHTML += `
          <td class="tag-container">
              <ul class="tag-list">  
                  <li class="tag-name"><a href="#" class="tag-link">${tag.name}</a></li>
                  <li class="tag-count">${questionsCount} Questions</li>
              </ul> 
          </td>
        `;
      }
      while ((i + j) % 3 !== 0) {
        rowHTML += "<td></td>";
        j++;
      }
      rowHTML += "</tr>";
      tagsTable.insertAdjacentHTML("beforeend", rowHTML);
    }

    // Query and iterate over all elements with the class "tag-link".
    document.querySelectorAll(".tag-link").forEach((tagElement) => {

    // Attach an event listener each tag element and display the questions for that tag
      tagElement.addEventListener("click", function (tagEvent) {
        tagEvent.preventDefault();
        const clickedTagName = tagElement.textContent.trim();
        const clickedTagId = model.getTagIdByName(clickedTagName); 

        const filterFunc = (question) => question.tagIds.includes(clickedTagId);
        displayQuestions(filterFunc);
        document.getElementById("titleofquestion").style.display = "none";

        nauSection.style.display = "flex";
        questionSection.style.display = "flex";
      });
    });
    clickableTag.classList.add("highlighted-link");
    clickableQuestion.classList.remove("highlighted-link");
  });

  displayQuestions();
  console.log(model);

  /**
 * Parses a given search term into separate arrays for tags and non-tag text.
 **/
  function parseSearchTerm(searchTerm) {
    const tags = [];
    const nonTags = [];
    let buffer = "";

    for (let i = 0; i < searchTerm.length; i++) {
      const char = searchTerm[i];
      if (char === "[") {
        if (buffer) {
          nonTags.push(buffer.trim());
          buffer = "";
        }
        buffer += char;
      } else if (char === "]") {
        buffer += char;
        if (model.isValidTag(buffer.slice(1, -1).toLowerCase())) {
          tags.push(buffer);
        } else {
          nonTags.push(buffer); 
        }
        buffer = "";
      } else {
        buffer += char;
        if (i === searchTerm.length - 1) {
          nonTags.push(buffer.trim());
        }
      }
    }

    return { tags, nonTags };
  }

  /*
   Add an event listener for key-up events on the element with the id "searchInput".
   if the user enters an input it will display the question for that search
   otherwise if the user does enter anything and clicks enter on search it will show no results
   */
  document
    .getElementById("searchInput")
    .addEventListener("keyup", function (event) {
      event.preventDefault();
      if (event.key === "Enter") {
        resetToQuestionListView();
        const searchTerm = event.target.value.trim().toLowerCase();

        const parsedTerms = parseSearchTerm(searchTerm);
        const tags = parsedTerms.tags.map((tag) =>
          tag.slice(1, -1).toLowerCase()
        );

        const filterFunc = (question) => {
          const title = question.title.toLowerCase();
          const text = question.text.toLowerCase();
          const tagNames = question.tagIds.map((tagId) =>
            model.getTagNameById(tagId).toLowerCase()
          );

          const matchesSearchWords = parsedTerms.nonTags.some(
            (word) => title.includes(word) || text.includes(word)
          );

          const matchesTags = tags.some((tag) => tagNames.includes(tag));

          return matchesSearchWords || matchesTags;
        };

        topDiv.style.display = "flex";
        questionSection.style.display = "flex";
        nauSection.style.display = "flex";
        ansSection.style.display = "none";
        mainForm.style.display = "none";
        answerForm.style.display = "none";

        const titleOfQuestionElement =
          document.getElementById("titleofquestion");
        titleOfQuestionElement.innerText = "";
        const answersTable = document.getElementById("ans_table2");
        answersTable.innerHTML = "";
        document.getElementById("border2").style.display = "block";

        displayQuestions(filterFunc);
      }
    });

  /**
   * function that clears error messages after the user has entered in valid inputs
   */
  function clearErrorMessages() {
    const errorIds = [
      "questionTitleError",
      "questionTextError",
      "tagsError",
      "usernameError",
      "usernameErrorForAnswer",
      "answerTextError",
    ];
    errorIds.forEach((id) => {
      const errorElement = document.getElementById(id);
      if (errorElement) {
        errorElement.style.display = "none";
        errorElement.textContent = ""; 
      }
    });
  }

  // Function to validate question title input
  const validateQuestionTitle = function () {
    const questionTitleBox = document.getElementById("questionTitleBox");
    const questionTitleError = document.getElementById("questionTitleError");
    const titleLength = questionTitleBox.value.trim().length;
    questionTitleError.style.display = "none";
    if (titleLength === 0 || titleLength > 100) {
      questionTitleError.textContent =
        "Title should be between 1 and 100 characters.";
      questionTitleError.style.display = "block";
      return false;
    }
    return true;
  };

  // Function to validate question text input
  const validateQuestionText = function () {
    const questionTextBox = document.getElementById("questionTextBox");
    const questionTextError = document.getElementById("questionTextError");
    questionTextError.style.display = "none";
    if (questionTextBox.value.trim() === "") {
      questionTextError.textContent = "Question text cannot be empty.";
      questionTextError.style.display = "block";
      return false;
    }
    return true;
  };

  // Function to validate tags input
  const validateTags = function () {
    const tagsTextBox = document.getElementById("tagsTextBox");
    const tagsError = document.getElementById("tagsError");
    let tags = tagsTextBox.value.trim().split(/\s+/);
    tagsError.style.display = "none";

    if (tagsTextBox.value.trim() == "") {
      tagsError.textContent = "Tags text cannot be empty.";
      tagsError.style.display = "block";
      return false;
    }

    if (tags.length > 5) {
      tagsError.textContent = "There can be at most 5 tags.";
      tagsError.style.display = "block";
      return false;
    }

    for (let tag of tags) {
      if (tag.length > 10) {
        tagsError.textContent = "Each tag should be 10 characters or less.";
        tagsError.style.display = "block";
        return false;
      }
    }
    return true;
  };

  // Function to validate username input
  const validateUsername = function () {
    const usernameTextBox = document.getElementById("usernameTextBox");
    const usernameError = document.getElementById("usernameError");

    usernameError.style.display = "none";

    if (usernameTextBox.value.trim() === "") {
      usernameError.textContent = "Username cannot be empty.";
      usernameError.style.display = "block";
      return false;
    }
    return true;
  };

  /*
  Attach event listener to the "Ask Question" button
  When the user clicks it will show the question form
  */
  askQuestionButton.addEventListener("click", function (event) {
    event.preventDefault();
    topDiv.style.display = "none";
    questionSection.style.display = "none";
    nauSection.style.display = "none";
    mainForm.style.display = "flex";
    answerForm.style.display = "none";
    ansSection.style.display = "none";
    clearErrorMessages();
    tagsPage.style.display = "none";
  });

  document
    .getElementById("questionTitleBox")
    .addEventListener("input", validateQuestionTitle);
  document
    .getElementById("questionTextBox")
    .addEventListener("input", validateQuestionText);
  document
    .getElementById("tagsTextBox")
    .addEventListener("input", validateTags);
  document
    .getElementById("usernameTextBox")
    .addEventListener("input", validateUsername);

  // Handle form submission for question
  document
    .querySelector(".questionForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrorMessages();
      let isValidTitle = validateQuestionTitle();
      let isValidText = validateQuestionText();
      let isValidTags = validateTags();
      let isValidUsername = validateUsername();

      if (!(isValidTitle && isValidText && isValidTags && isValidUsername)) {
        return;
      }

      const tagNames = document
        .getElementById("tagsTextBox")
        .value.trim()
        .split(/\s+/);
      const tagIds = tagNames.map((tagName) => model.getTagIdByName(tagName));

      const newQuestion = {
        qid: "q" + (model.getAllQuestions().length + 1),
        title: document.getElementById("questionTitleBox").value.trim(),
        text: document.getElementById("questionTextBox").value.trim(),
        tagIds: tagIds,
        askedBy: document.getElementById("usernameTextBox").value.trim(),
        askDate: new Date(),
        ansIds: [],
        views: 0,
      };
      model.addQuestion(newQuestion);

      document.getElementById("questionTitleBox").value = "";
      document.getElementById("questionTextBox").value = "";
      document.getElementById("tagsTextBox").value = "";
      document.getElementById("usernameTextBox").value = "";

      console.log(model);
      topDiv.style.display = "flex";
      questionSection.style.display = "flex";
      nauSection.style.display = "flex";
      mainForm.style.display = "none";
      answerForm.style.display = "none";

      const titleOfQuestionElement = document.getElementById("titleofquestion");
      titleOfQuestionElement.innerText = "";
      const answersTable = document.getElementById("ans_table2");
      answersTable.innerHTML = "";

      displayQuestions();
    });

  // function to validate answer input
  const validateAnswerText = function () {
    const answerTextBox = document.getElementById("answerTextBox");
    const answerTextError = document.getElementById("answerTextError");

    answerTextError.style.display = "none";

    if (answerTextBox.value.trim() === "") {
      answerTextError.textContent = "Answer text cannot be empty.";
      answerTextError.style.display = "block";
      return false;
    }
    return true;
  };

  // function to validate username input for answer form
  const validateUsernameForAnswer = function () {
    const usernameTextBoxForAnswer = document.getElementById(
      "usernameTextBoxForAnswer"
    );
    const usernameErrorForAnswer = document.getElementById(
      "usernameErrorForAnswer"
    );

    usernameErrorForAnswer.style.display = "none";

    if (usernameTextBoxForAnswer.value.trim() === "") {
      usernameErrorForAnswer.textContent = "Username cannot be empty.";
      usernameErrorForAnswer.style.display = "block";
      return false;
    }
    return true;
  };

  /*
  Attach event listener to the "Ask Answer" button
  When the user clicks it will show the answer form
  */
  askAnswerButton.addEventListener("click", function () {
    topDiv.style.display = "flex";
    questionSection.style.display = "none";
    nauSection.style.display = "none";
    ansSection.style.display = "none";
    document.getElementById("titleofquestion").style.display = "none";
    document.getElementById("allQuesID").style.display = "none";
    askQuestionButton.style.display = "none";
    answerForm.style.display = "flex";
    clearErrorMessages();
  });

  document
    .getElementById("answerTextBox")
    .addEventListener("input", validateAnswerText);
  document
    .getElementById("usernameTextBoxForAnswer")
    .addEventListener("input", validateUsernameForAnswer);

  // Handling form submission for answer
  document
    .querySelector(".answersForm")
    .addEventListener("submit", function (event) {
      answerForm.style.display = "block";
      event.preventDefault();

      clearErrorMessages();

      let isValidAnswerText = validateAnswerText();
      let isValidUsernameForAnswer = validateUsernameForAnswer();

      if (!(isValidAnswerText && isValidUsernameForAnswer)) {
        return;
      }

      const currentQuestionTitleElement =
        document.getElementById("titleofquestion");
      const currentQuestionTitle = currentQuestionTitleElement.innerText;
      const currentQuestion = model
        .getAllQuestions()
        .find((q) => q.title === currentQuestionTitle);

      const newAnswer = {
        aid: "a" + (model.getAllAnswers().length + 1),
        text: document.getElementById("answerTextBox").value.trim(),
        ansBy: document.getElementById("usernameTextBoxForAnswer").value.trim(),
        ansDate: new Date(),
      };

      model.addAnswer(newAnswer);

      currentQuestion.ansIds.push(newAnswer.aid);

      const answersTable = document.getElementById("ans_table2");
      const formattedDate = formatDate(new Date(newAnswer.ansDate));
      const rowHTML = `
          <tr id="tr2-ans">
              <td id="th1-ans2"><p>${newAnswer.text}</p></td>
              <td id="th3-ans2">
                  <ul style="list-style:none;">
                      <li style="color:lime;">${newAnswer.ansBy}</li>
                      <li style="color:gray;">answered ${formattedDate}</li>
                  </ul>
              </td>
          </tr>
      `;
      answersTable.insertAdjacentHTML("beforeend", rowHTML);

      document.getElementById("answerTextBox").value = "";
      document.getElementById("usernameTextBoxForAnswer").value = "";

      topDiv.style.display = "flex";
      answerForm.style.display = "none";
      questionSection.style.display = "none";
      nauSection.style.display = "none";
      ansSection.style.display = "flex";
      mainForm.style.display = "none";

      document.getElementById("titleofquestion").style.display = "flex";
      askQuestionButton.style.display = "flex";
      document.getElementById("allQuesID").innerText =
        `${currentQuestion.ansIds.length}` + " Answers";
      document.getElementById("allQuesID").style.display = "flex";

      displayQuestionDetails(currentQuestion);
    });
};
