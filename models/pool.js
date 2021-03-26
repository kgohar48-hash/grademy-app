var mongoose =require("mongoose")


var poolSchema = new mongoose.Schema({
   biology : [
       {
        chapterNumber : String ,
        chapterName : String ,
        postedBy : String ,
        questions : [
            {
                question: String,
                choice1: String,
                choice2: String,
                choice3:String,
                choice4: String,
                answer: String,
                solution : String 
            }
        ]
   }
],
   math : [
       {
        chapterNumber : String ,
        chapterName : String ,
        postedBy : String ,
        questions : [
            {
                question: String,
                choice1: String,
                choice2: String,
                choice3:String,
                choice4: String,
                answer: String,
                solution : String 
            }
        ]
   }
] ,
   physics : [
       {
        chapterNumber : String ,
        chapterName : String ,
        postedBy : String ,
        questions : [
            {
                question: String,
                choice1: String,
                choice2: String,
                choice3:String,
                choice4: String,
                answer: String,
                solution : String 
            }
        ]
   }
],
   chemistry : [
       {
        chapterNumber : String ,
        chapterName : String ,
        postedBy : String ,
        questions : [
            {
                question: String,
                choice1: String,
                choice2: String,
                choice3:String,
                choice4: String,
                answer: String,
                solution : String 
            }
        ]
   }
],
   english : [
       {
        chapterNumber : String ,
        chapterName : String ,
        postedBy : String ,
        questions : [
            {
                question: String,
                choice1: String,
                choice2: String,
                choice3:String,
                choice4: String,
                answer: String,
                solution : String 
            }
        ]
   }
],
   intelligence : [
       {
        chapterNumber : String ,
        chapterName : String ,
        postedBy : String ,
        questions : [
            {
                question: String,
                choice1: String,
                choice2: String,
                choice3:String,
                choice4: String,
                answer: String,
                solution : String 
            }
        ]
   }
]

})

module.exports = mongoose.model("Pool" , poolSchema)