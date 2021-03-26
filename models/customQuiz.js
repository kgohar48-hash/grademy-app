var mongoose =require("mongoose")


var customQuizSchema = new mongoose.Schema({
    subjects : [],
    chapters : [],
    numberOfMcqs : [],
    questions : [],
    solvedBy : [],
    madeBy : String ,
    description : {type : String , default : "  "},
    createdAt: {type: Date, default: Date.now},
})

module.exports = mongoose.model("CustomQuiz" , customQuizSchema)