var mongoose = require("mongoose")

var mcqSchema = new mongoose.Schema ({
    category : String ,
    type : {type: Number , default : 0000},
    subject : String ,
	chapter : String ,
    tags : [],
    postedBy : String,
    question : String,
    choice :[],
    answer : [],
    userResponse : [],
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
    ],
    solution : {type: String , default : ""},
    solutionVideo : {type: String , default : ""},
    avgCorrectTime : {type: Number , default : 10},
    createdAt: {type: Date, default: Date.now}
})
// work on tags
// work on multiple correct answers
// work on type

// type of an mcqs will be defined by a 4 digit number like 1234.
// 1st digit will define the type of mcq. 
// 1 = simple mqc where only one option is correct
// 2 = simple mcq where 2 options can be correct
// 4 = mcq with 2 sets(coloumbs ) of options
// 5 = mcq with 3 sets(coloumbs ) of options

// 2nd digit will define the number of choices in that mcq 
// 3rd digit is not assigned yet 
// 4th digit is not assigned yet 

module.exports = mongoose.model("Mcq" , mcqSchema)