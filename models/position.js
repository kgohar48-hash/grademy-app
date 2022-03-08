var mongoose = require("mongoose")

var positionSchema = new mongoose.Schema ({
	position : [],
    biologyPosition : [],
    mathPosition : [],
    physicsPosition : [],
    chemistryPosition : [],
    englishPosition : []
})

module.exports = mongoose.model("Position" , positionSchema)