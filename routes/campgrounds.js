const   express     = require("express"),
        router      = express.Router(),
        Campground  = require("../models/campground"),
        middleware = require("../middleware");
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
router.post("", middleware.isLoggedIn, function (req, res) {
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
            req.flash("success", "Successfully created a new campground!!!");
            //redirect back to campgrounds page
            res.redirect("/campgrounds/"+newlyCreated._id);
        }
    });

});

// NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// SHOW - show more info about one campground
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    //render show template with that campground
    Campground.findById(req.params.id).populate("comments").exec( function (err, foundCampground) {
        // handel mongoDB issue for return null object for valid but not exist id
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        } else {
            // render show template with that campground
            res.render("campgrounds/show",{campground: foundCampground});
        }
    })
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.render("campgrounds/edit",{campground: foundCampground});
        }
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function (req, res) {
   //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err){
            res.redirect("/campgrounds");
        } else {
            //redirect somewhere(show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds/"+req.params.id);
        } else {
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;