const   express = require("express"),
        router  = express.Router(),
        passport= require("passport"),
        User    = require("../models/user");

// root route
router.get("/", function (req, res) {
    res.render("landing");
});

//=============
// AUTH ROUTES
//=============

// show register form
router.get("/register", function (req, res) {
    res.render("register");
});

//handel sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,function (err, user) {
        if(err){
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect(req.session.returnTo || "/campgrounds");
            });
        }
    });
});

// show login form
router.get("/login", function (req, res) {
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local",{
    failureRedirect: "login"
}),function (req, res) {
    res.redirect(req.session.returnTo || '/campgrounds');
    delete req.session.returnTo;
});

// logout route
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

// middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.returnTo = req._parsedOriginalUrl.path;
    res.redirect("/login");
}

module.exports = router;