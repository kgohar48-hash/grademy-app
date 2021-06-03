var mongoose = require("mongoose")


var academySchema = new mongoose.Schema({
    owner : {
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User"
        } ,
        username : String
    },
    academyName : {type : String , default : ""},
    punchLine : {type : String , default : ""},
    coverPicture : {type : String , default:""},
    overview : {type : String , default:""},
    subject : {type : String , default:""},
    test  : {type : String , default:""},
    level : {type : Number , default : 1},
    isPublic : {type : Boolean, default : true},
    feedback : {
        givenBy : [
            {
                id : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "User"
                },
                response : [],
                date : {type: Date, default: Date.now}
            }
        ],
        funFactor : {type : Array , default : []},
        // The instructor was very good at communication , The instructor’s methods helped in understanding the topic better , Clear explanation of the topic
        teachingMethod : {type : Array , default : []},
        //  how would you rate the instructor for the knowledge they possess about the topic being taught?
        subjectGrip : {type : Array , default : []},
        // well prepared & organized
        lecturesQuality : {type : Array , default : []},
        // how satisfied are you with the overall format of the class?
        studentSatisfaction : {type : Array , default : []},
        // The instructor was motivating and enthusiastic
        energy : {type : Array , default : []}
    },
    subscribers : [
        {
            id : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User"
            },
            date : {type: Date, default: Date.now}
        }
    ],
    students : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    quizcategories : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Quizcategory"
        }
    ],
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    cummunityposts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Post"
        }
    ],
    livesessions : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Livesession"
        }
    ],
    dashboardSettings : {},
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Academy" , academySchema)