var mongoose = require("mongoose")

var feedbackSchema = new mongoose.Schema ({
    username : String,
    phone : String ,
	category : String ,
    feedback : String
})

module.exports = mongoose.model("Feedback" , feedbackSchema)