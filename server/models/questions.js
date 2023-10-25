// Question Document Schema
let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let QuestionSchema = new Schema(
    {
        title : {type: String , maxLength: 100, required: true},
        text : {type: String , required: true},
        tags : {type: [Schema.Types.ObjectId], ref : "Tag", required: true, validate: v => Array.isArray(v) && v.length > 0}, 
        answers : {type: [Schema.Types.ObjectId], ref : "Answer"},
        asked_by : {type: String, default: "Anonymous"},
        ask_date_time: {type: Date, default: Date.now},
        views: {type: Number, default : 0}
    }
);

// Virtual for Answer's URL
QuestionSchema
.virtual('url')
.get(function () {
  return 'posts/question/_id/' + this._id;
});

//Export model
module.exports = mongoose.model('Question', QuestionSchema);