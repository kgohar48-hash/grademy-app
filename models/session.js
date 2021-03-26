var mongoose =require("mongoose")


var sessionSchema = new mongoose.Schema({
    instructor : {
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User"
        } ,
        username : String
    },
    progress : {type : String , default : ""},
    takenBy : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    createdAt: {type: Date, default: Date.now},
    isActive : {type : Boolean , default : false}
})

module.exports = mongoose.model("Session" , sessionSchema)