var mongoose = require("mongoose")

var postSchema = new mongoose.Schema ({
	image : String ,
    text : String,
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User"
        } ,
        username : String 
    },
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
    ],
    community : {
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "Academy"
        } ,
        academy : String 
    },
    votes : {type : Number, default : 0},
    votedBy : [
        {
            id : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "User"
            },
            username : String 
        }
    ],
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Post" , postSchema)