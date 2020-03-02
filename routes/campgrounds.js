const   express     = require("express"),
        router      = express.Router(),
        Campground  = require("../models/campground");
// INDEX - show all campgrounds
router.get("", function (req, res) {
    //get all campgrounds from database
    Campground.find({}, function (err, allCampgrounds) {
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});

// CREATE - add new campground to DB
router.post("", isLoggedIn, function (req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image:image, description: desc, author: author};
    // create a new campground and save to database.
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            //redirect back to campgrounds page
            res.redirect("/campgrounds/"+newlyCreated._id);
        }
    });

});

// NEW - show form to create new campground
router.get("/new",isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// SHOW - show more info about one campground
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    //render show template with that campground
    Campground.findById(req.params.id).populate("comments").exec( function (err, foundCampground) {
        if (err) {
            res.send("This will be show page one day!!");
        } else {
            // render show template with that campground
            res.render("campgrounds/show",{campground: foundCampground});
        }
    })
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