var mongoose = require("mongoose")

var useractivitySchema =  mongoose.Schema({
    billing : [
        {
            id : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "User"
            },
            username : String,
            details : String,
            date : {type: Date, default: Date.now}
        }
    ],
    payment : [
        {
            id : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "User"
            },
            username : String,
            details : String,
            date : {type: Date, default: Date.now}
        }
    ],
    makequiz : [
        {
            id : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "User"
            },
            username : String,
            details : String,
            date : {type: Date, default: Date.now}
        }
    ],
    myquizzes : [
        {
            id : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "User"
            },
            username : String,
            details : String,
            date : {type: Date, default: Date.now}
        }
    ],
    quizAttempt : [
        {
            id : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "User"
            },
            username : String,
            details : String,
            date : {type: Date, default: Date.now}
        }
    ],
    quizView : [
        {
            id : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "User"
            },
            username : String,
            details : String,
            date : {type: Date, default: Date.now}
        }
    ],
    dashboard : [
        {
            id : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "User"
            },
            username : String,
            details : String,
            date : {type: Date, default: Date.now}
        }
    ],
    wrongmcqs : [
        {
            id : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "User"
            },
            username : String,
            details : String,
            date : {type: Date, default: Date.now}
        }
    ],
    academy : [
        {
            id : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "User"
            },
            username : String,
            details : String,
            date : {type: Date, default: Date.now}
        }
    ],
    newsfeed : [
        {
            id : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "User"
            },
            username : String,
            details : String,
            date : {type: Date, default: Date.now}
        }
    ],
    login : [{
        username : String,
        details : String,
        date : {type: Date, default: Date.now}
    }]
})

module.exports = mongoose.model("Useractivity" , useractivitySchema )
