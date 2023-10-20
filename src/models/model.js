export default class Model {
  static instance = null;
  constructor() {
    if (Model.instance) {
      return Model.instance;
    }
    this.data = {
      questions: [
        {
          qid: "q1",
          title: "Programmatically navigate using React router",
          text: "the alert shows the proper index for the li clicked, and when I alert the variable within the last function I'm calling, moveToNextImage(stepClicked), the same value shows but the animation isn't happening. This works many other ways, but I'm trying to pass the index value of the list item clicked to use for the math to calculate.",
          tagIds: ["t1", "t2"],
          askedBy: "JoJi John",
          askDate: new Date("December 17, 2020 03:24:00"),
          ansIds: ["a1", "a2"],
          views: 10,
        },
        {
          qid: "q2",
          title:
            "android studio save string shared preference, start activity and load the saved string",
          text: "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.",
          tagIds: ["t3", "t4", "t2"],
          askedBy: "saltyPeter",
          askDate: new Date("January 01, 2022 21:06:12"),
          ansIds: ["a3", "a4", "a5"],
          views: 121,
        },
      ],
      tags: [
        {
          tid: "t1",
          name: "react",
        },
        {
          tid: "t2",
          name: "javascript",
        },
        {
          tid: "t3",
          name: "android-studio",
        },
        {
          tid: "t4",
          name: "shared-preferences",
        },
      ],

      answers: [
        {
          aid: "a1",
          text: "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
          ansBy: "hamkalo",
          ansDate: new Date("March 02, 2022 15:30:00"),
        },
        {
          aid: "a2",
          text: "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
          ansBy: "azad",
          ansDate: new Date("January 31, 2022 15:30:00"),
        },
        {
          aid: "a3",
          text: "Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.",
          ansBy: "abaya",
          ansDate: new Date("April 21, 2022 15:25:22"),
        },
        {
          aid: "a4",
          text: "YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);",
          ansBy: "alia",
          ansDate: new Date("December 02, 2022 02:20:59"),
        },
        {
          aid: "a5",
          text: "I just found all the above examples just too confusing, so I wrote my own. ",
          ansBy: "sana",
          ansDate: new Date("December 31, 2022 20:20:59"),
        },
      ],
    };
    Model.instance = this;
  }

  // Method to get a shared instance
  static getInstance() {
    if (!Model.instance) {
      Model.instance = new Model();
    }
    return Model.instance;
  }

  // QUESTIONS METHODS

  // Return all questions
  getAllQuestions() {
    return this.data.questions;
  }

  // Return a question by its ID
  getQuestionById(qid) {
    return this.data.questions.find((q) => q.qid === qid);
  }

  // Add a new question to the list
  addQuestion(question) {
    this.data.questions.push(question);
  }

  // Return the count of unanswered questions
  getUnansweredQuestionsCount() {
    return this.data.questions.filter(
      (question) => question.ansIds.length === 0
    ).length;
  }

  // TAGS METHODS

  // Return all tags
  getAllTags() {
    return this.data.tags;
  }

  // Return a tag by its ID
  getTagById(tid) {
    return this.data.tags.find((t) => t.tid === tid);
  }

  // Get a tag ID by its name
  getTagIdByName(name) {
    const tag = this.data.tags.find((t) => t.name === name);
    if (tag) {
      return tag.tid;
    } else {
      // If the tag doesn't exist, create a new one
      const newTagId = "t" + (this.data.tags.length + 1);
      this.addTag({ tid: newTagId, name: name });
      return newTagId;
    }
  }

  // Return tag name by its ID
  getTagNameById(tid) {
    const tag = this.data.tags.find((t) => t.tid === tid);
    return tag ? tag.name : null;
  }

  // Add a new tag to the list
  addTag(tag) {
    this.data.tags.push(tag);
  }

  // gets the count of questions associated with a given tagName.
  getQuestionsCountForTag(tagName) {
    const tagId = this.getTagIdByName(tagName);
    return this.data.questions.filter((question) =>
      question.tagIds.includes(tagId)
    ).length;
  }

  // Increments the views for a specific question by 1
  incrementViewsForQuestion(qid) {
    const question = this.getQuestionById(qid);
    if (question) {
      question.views += 1;
    }
  }

  // Checks if a given tagName exists in the 'tags' data.
  isValidTag(tagName) {
    return this.data.tags.some(
      (t) => t.name.toLowerCase() === tagName.toLowerCase()
    );
  }

  // ANSWERS METHODS

  // Return all answers
  getAllAnswers() {
    return this.data.answers;
  }

  // Return an answer by its ID
  getAnswerById(aid) {
    return this.data.answers.find((a) => a.aid === aid);
  }

  // Add a new answer to the list
  addAnswer(answer) {
    this.data.answers.push(answer);
  }

  // gets the most recent answer date for a given question.
  getMostRecentAnswerDateForQuestion(question) {
    const answers = question.ansIds.map((ansId) => this.getAnswerById(ansId));
    if (!answers.length) return new Date(0);
    answers.sort((a, b) => new Date(b.ansDate) - new Date(a.ansDate));
    return new Date(answers[0].ansDate);
  }
}
