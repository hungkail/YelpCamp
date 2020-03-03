const   express     = require("express"),
        router      = express.Router({mergeParams: true}),
        Campground  = require("../models/campground"),
        Comment     = require("../models/comment"),
        middleware = require("../middleware");
// ===================
// COMMENTS ROUTES
// ===================

// Comment New
router.get("/new",middleware.isLoggedIn, function (req, res) {
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
router.post("",middleware.isLoggedIn, function (req, res) {
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
                    req.flash("success", "Successfully added comment!!!");
                }
            })
        }
    });
    //redirect campground show page
    res.redirect("/campgrounds/"+req.params.id);
});

// Comment Edit Route
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        // handel mongoDB issue for return null object for valid but not exist id
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                if (err) {
                    res.redirect("back");
                } else {
                    res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
                }
            });
        }
    });

});

// Comment Update
router.put("/:comment_id",middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Comment Destroy Route
router.delete("/:comment_id",middleware.checkCommentOwnership, function (req, res) {
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
                    req.flash("success", "Comment deleted");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

module.exports = router;