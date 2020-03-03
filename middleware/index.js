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
            // handel mongoDB issue for return null object for valid but not exist id
            if (err || !foundCampground) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // check if user is the author
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    // if not redirect back to the post
                    res.redirect("back")
                }
            }
        });

    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // check if user is logged in
    // if not redirect user to login page
    if (req.isAuthenticated()) {
        // if user logged in, get comment object
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            // handel mongoDB issue for return null object for valid but not exist id
            if (err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // check if user is the author
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    // if not redirect back to the post
                    res.redirect("back")
                }
            }
        });

    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;