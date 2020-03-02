const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose"),
        Campground  = require("./models/campground"),
        Comment     = require("./models/comment"),
        seedDB      =require("./seeds");
// seedDB();
const url = 'mongodb://127.0.0.1:27017/yelp_camp';
const port = 3000;

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", function (req, res) {
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
app.post("/campgrounds", function (req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image:image, description: desc};
    // create a new campground and save to database.
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        }else{
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });

});

// NEW - show form to create new campground
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});

// SHOW - show more info about one campground
app.get("/campgrounds/:id", function (req, res) {
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


// ===================
// COMMENTS ROUTES
// ===================

app.get("/campgrounds/:id/comments/new", function (req, res) {
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

app.post("/campgrounds/:id/comments", function (req, res) {
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

app.listen(port, () => console.log(`YelpCamp listening on port ${port}`));
