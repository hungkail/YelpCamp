const   express     = require("express"),
        router      = express.Router({mergeParams: true}),
        Campground  = require("../models/campground"),
        Comment     = require("../models/comment");
// ===================
// COMMENTS ROUTES
// ===================

// Comment New
router.get("/new",isLoggedIn, function (req, res) {
    // find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.send("no such post");
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// Comment Create
router.post("",isLoggedIn, function (req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //create new comment
            //connect new comment to campground
            Comment.create(req.body.comment, function (err, newComment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    //save comment
                    newComment.save();
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                }
            })
        }
    });
    //redirect campground show page
    res.redirect("/campgrounds/"+req.params.id);
});

// Comment Edit Route
router.get("/:comment_id/edit",checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
        }
    });
});

// Comment Update
router.put("/:comment_id",checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Comment Destroy Route
router.delete("/:comment_id",checkCommentOwnership, function (req, res) {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err){
            res.redirect("back");
        } else {
            // remove comment reference inside current campground
            Campground.findByIdAndUpdate(req.params.id,{
                $pull: {
                    comments: req.params.comment_id
                }
            }, function (err) {
                if (err) {
                    res.redirect("back");
                } else {
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.returnTo = req._parsedOriginalUrl.path;
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
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
}

module.exports = router;