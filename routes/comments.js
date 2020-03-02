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
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                }
            })
        }
    });
    //redirect campground show page
    res.redirect("/campgrounds/"+req.params.id);
});

//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.returnTo = req._parsedOriginalUrl.path;
    res.redirect("/login");
}

module.exports = router;