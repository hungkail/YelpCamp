const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose"),
        flash       = require("connect-flash"),
        passport    = require("passport"),
        LocalStrategy = require("passport-local"),
        methodOverride = require("method-override"),
        Campground  = require("./models/campground"),
        Comment     = require("./models/comment"),
        User        = require("./models/user"),
        seedDB      =require("./seeds");

// requiring routes
const   campgroundRoutes    = require("./routes/campgrounds"),
        commentRoutes       = require("./routes/comments"),
        indexRoutes         = require("./routes/index");
// seedDB(); //seed the database
const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yelp_camp';
const port = process.env.PORT || 3000;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "YelpCamp is not a real Yelp!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(port, () => console.log(`YelpCamp listening on port ${port}`));
