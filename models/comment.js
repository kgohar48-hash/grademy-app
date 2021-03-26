var mongoose = require("mongoose")

var commentSchema =  mongoose.Schema({
    text : String ,
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User"
        } ,
        username : String
    },
    replies : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "Comment"
        }
    ],
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Comment" , commentSchema )
