var mongoose = require("mongoose")

var tidSchema = new mongoose.Schema ({
    amount : {type : Number, default : 0},
    used : {type : Boolean, default: false},
    TID : {type : Number, default : 0},
    createdAt: {type: Date, default: Date.now}
})


module.exports = mongoose.model("Tid" , tidSchema)