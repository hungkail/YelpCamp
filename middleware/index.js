const Campground  = require("../models/campground"),
    Comment     = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // check if user is logged in
    // if not redirect user to login page
    if (req.isAuthenticated()) {
        // if user logged in, get campground object
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect("back");
            } else {
                // check if user is the author
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // if not redirect back to the post
                    res.redirect("back")
                }
            }
        });

    } else {
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // check if user is logged in
    // if not redirect user to login page
    if (req.isAuthenticated()) {
        // if user logged in, get comment object
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // check if user is the author
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // if not redirect back to the post
                    res.redirect("back")
                }
            }
        });

    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};

module.exports = middlewareObj;