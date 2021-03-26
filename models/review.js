var mongoose =require("mongoose")


var reviewSchema = new mongoose.Schema({
    rating : {type :Number , default : 5},
    text : String ,
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User"
        } ,
        username : String
    },
    votes :  {type :Number , default : 0},
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Review" , reviewSchema)