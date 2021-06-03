var mongoose = require("mongoose")

var feedbackSchema = new mongoose.Schema ({
    username : String,
    phone : String ,
	category : String ,
    feedback : String,
    date : {type: Date, default: Date.now}
})

module.exports = mongoose.model("Feedback" , feedbackSchema)