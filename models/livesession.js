var mongoose =require("mongoose")


var livesessionSchema = new mongoose.Schema({
    instructor : {
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User"
        } ,
        username : String
    },
    subject : {type : String , default : ""},
    sessions : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "session"
        }
    ],
    students : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "review"
        }
    ],
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Livesession" , livesessionSchema)