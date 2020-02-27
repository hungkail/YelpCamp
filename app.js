const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const port = 3000;

var campgrounds = [
    {name: "Salmon Creek", image:"https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"},
    {name: "Granite Hill", image:"https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"},
    {name: "Mountain Goat's Rest", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"},
    {name: "Salmon Creek", image:"https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"},
    {name: "Granite Hill", image:"https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"},
    {name: "Mountain Goat's Rest", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"},
    {name: "Salmon Creek", image:"https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"},
    {name: "Granite Hill", image:"https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"},
    {name: "Mountain Goat's Rest", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"},
    {name: "Salmon Creek", image:"https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"},
    {name: "Granite Hill", image:"https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"},
    {name: "Mountain Goat's Rest", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"}
];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {

    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function (req, res) {
    //get data from from and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var campground = {name: name, image:image};
    campgrounds.push(campground);
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

app.listen(port, () => console.log(`YelpCamp listening on port ${port}`));
