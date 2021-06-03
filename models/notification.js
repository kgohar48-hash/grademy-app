var mongoose =require("mongoose")


var notificationSchema = new mongoose.Schema({
    message : {type : String , default : ""},
    link : {type : String, default:""},
    recipient : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Notification" , notificationSchema)