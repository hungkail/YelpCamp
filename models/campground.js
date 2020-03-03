var mongoose = require("mongoose");
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);
//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectID,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectID,
        ref: "Comment"
    }]
});

const Comment = require('./comment');
campgroundSchema.pre('findOneAndRemove', async function() {
    let thisCampground = await this.model.findOne({
        _id: this.getQuery()._id
    });
    await Comment.deleteMany({
        _id: {
            $in: thisCampground.comments
        }
    });
});

module.exports = mongoose.model("Campground", campgroundSchema);