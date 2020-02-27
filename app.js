const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    var campgrounds = [
        {name: "Salmon Creek", image:"https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"},
        {name: "Granite Hill", image:"https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"},
        {name: "Mountain Goat's Rest", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2d7cd3934fcd58_340.jpg"}
    ]
    res.render("campgrounds", {campgrounds:campgrounds});
});



app.listen(port, () => console.log(`YelpCamp listening on port ${port}`));
