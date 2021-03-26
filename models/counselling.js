var mongoose = require("mongoose")

var counsellingSchema = new mongoose.Schema ({
    name : String,
    phone : String ,
	category : String ,
    question : String,
    acceptedBy : String,
    status : {type : Boolean , default : false },
    createdAt: {type: Date, default: Date.now},
})

module.exports = mongoose.model("Counselling" , counsellingSchema)