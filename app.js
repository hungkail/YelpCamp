const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose"),
        Campground  = require("./models/campground"),
        seedDB      =require("./seeds");
seedDB();
const url = 'mongodb://127.0.0.1:27017/yelp_camp';
const port = 3000;

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    //get all campgrounds from database
    Campground.find({}, function (err, allCampgrounds) {
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds:allCampgrounds});
        }
    });
});

app.post("/campgrounds", function (req, res) {
    //get data from from and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image:image};
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

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

app.listen(port, () => console.log(`YelpCamp listening on port ${port}`));
