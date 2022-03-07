var mongoose = require("mongoose")

var planSchema = new mongoose.Schema ({
    plan : String,
    duration : Number,
    amountPaid : Number,
    user : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    },
    active : {type : Boolean , default:true},
    resolved :  {type : Boolean , default:false},
    refTransaction : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Transaction"
    },
    mcqsSolved : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Mcq"
        }
    ],
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Plan" , planSchema)