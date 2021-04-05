var mongoose =require("mongoose")


var newCustomQuizSchema = new mongoose.Schema({
    mcqs : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Mcq"
        }
    ],
    solvedBy : [],
    madeBy : String ,
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
    ],
    shareWith : {type : String , default : "public"},
    description : {type : String , default : ""},
    lectureVideoURL : {type : String , default : ""},
    discussionVideoURL : {type : String , default : ""} ,
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("NewCustomQuiz" , newCustomQuizSchema)