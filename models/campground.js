var mongoose = require("mongoose");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectID,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Campground", campgroundSchema);