var mongoose = require("mongoose")

var transactionSchema = new mongoose.Schema ({
    amount : {type : Number, default : 0},
    statement : {type : String, default : ""},
    varified : {type : Boolean, default: false},
    isPromo  : {type : Boolean, default: false}, 
    from : {
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User"
        } ,
        username : String 
    },
    to : {
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User"
        } ,
        username : String 
    },
    TID : {type : Number, default : 0},
    createdAt: {type: Date, default: Date.now}
})


module.exports = mongoose.model("Transaction" , transactionSchema)