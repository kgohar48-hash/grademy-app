var mongoose                = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
var passportLocalMongoose   = require("passport-local-mongoose")


// for database i have set is verified true , wipp change it later
var UserSchema = new mongoose.Schema({
    name : String,
    email : { type : String , unique : true },
    bio :  { type : String , default :"" },
    password : String,
    category : String ,
    phone : { type : String , unique : true}  ,
    city : String,
    ref : String ,
    invitations : {type: Number , default : 0},
    token : String,
    isAdmin :  {
        type : Boolean ,
        default : false 
    },
    isPaid : {
        type : Boolean ,
        default : true 
    },
    isVerified : {
        type : Boolean ,
        default : true 
    },
    isModerator : {
        type : Boolean,
        default : false
    },
    isAcademy :  {
        type : Boolean ,
        default : false 
    },
    myPosts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Post"
        }
    ],
    myAcademies : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Academy"
        }
    ],
    myQuizzes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Newcustomquiz"
        }
    ],
    score : {
        attempted : {type : Number , default : 0},
        history : [],
        score : {type :Number , default : 0 } ,
        position : {type :Number , default : 0 } ,
        math : {
            attempted : {type : Number , default : 0},
            history : [],
            keyOfCorrectness : [] ,
            score : {type :Number , default : 0 } ,
            position : {type :Number , default : 0 } ,
            chapters : {}
        },
        biology : {
            attempted : {type : Number , default : 0},
            history : [],
            keyOfCorrectness : [] ,
            score : {type :Number , default : 0 } ,
            position : {type :Number , default : 0 } ,
            chapters : {}
        },
        physics : {
            attempted : {type : Number , default : 0},
            history : [],
            keyOfCorrectness : [] ,
            score : {type :Number , default : 0 },
            position : {type :Number , default : 0 },
            chapters : {}
        },
        chemistry : {
            attempted : {type : Number , default : 0},
            history : [],
            keyOfCorrectness : [] ,
            score : {type :Number , default : 0 },
            position : {type :Number , default : 0 },
            chapters : {}
        },
        english : {
            attempted : {type : Number , default : 0},
            history : [],
            keyOfCorrectness : [] ,
            score : {type :Number , default : 0 },
            position : {type :Number , default : 0 },
            chapters : {}
        },
        intelligence : {
            attempted : {type : Number , default : 0},
            history : [],
            keyOfCorrectness : [] ,
            score : {type :Number , default : 0 },
            position : {type :Number , default : 0 },
            chapters : {}
        }
    },
    incorrect : [
        {
            id : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "Mcq"
            } ,
            attempted : []
        }
    ],
    skipped : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Mcq"
        }
    ],
    correct : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Mcq"
        }
    ],
    notification : [
        {
            id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Notification"
            },
            read : {type : Boolean, default : false}
        }

    ],
    createdAt: {type: Date, default: Date.now}
})

UserSchema.plugin(passportLocalMongoose)
UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User" , UserSchema)