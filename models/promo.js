var mongoose = require("mongoose")

var promoSchema = new mongoose.Schema ({
    title : String,
    usageLimit : Number ,
    value : Number,
	usedBy : [],
    status : {type : Boolean , default:true},
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Promo" , promoSchema)