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
            req.flash("error", err.message);
            res.redirect("register");
        } else {
            passport.authenticate("local")(req, res, function () {
                var returnTo = req.session.returnTo;
                delete req.session.returnTo;
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect(returnTo || "/campgrounds");

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
    var returnTo = req.session.returnTo;
    delete req.session.returnTo;
    req.flash("success", "Successfully logged in as " + req.user.username +", Welcome!!!");
    res.redirect(returnTo || '/campgrounds');
});

// logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;