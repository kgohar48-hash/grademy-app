var mongoose =require("mongoose")


var quizcategorySchema = new mongoose.Schema({
    owner : {
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User"
        } ,
        username : String
    },
    academy : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Academy"
    },
    title : {type : String , default : "Quizzes"},
    description :  {type : String , default : "Quizzes"},
    quizzes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Newcustomquiz"
        }
    ],
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Quizcategory" , quizcategorySchema)