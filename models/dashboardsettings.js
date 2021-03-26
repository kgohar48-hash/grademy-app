var mongoose = require("mongoose")

var dashboardsettingsSchema = new mongoose.Schema ({
    academy : {
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "Academy"
        } ,
        academyName : String
    },
    subjects : [],
})

module.exports = mongoose.model("Dashboardsettings" , dashboardsettingsSchema)