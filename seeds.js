const   mongoose    = require("mongoose"),
        Campground  = require("./models/campground"),
        Comment     = require("./models/comment");

const seeds = [
    {
        name: "Cloud's Rest",
        image:"https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c7d2c7bd19548c65c_340.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Netus et malesuada fames ac turpis egestas sed tempus urna. Varius vel pharetra vel turpis nunc eget. Non sodales neque sodales ut etiam. Nunc non blandit massa enim nec. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. In iaculis nunc sed augue lacus viverra vitae congue. Aliquet lectus proin nibh nisl. Tristique magna sit amet purus gravida quis blandit turpis. Netus et malesuada fames ac. Vestibulum morbi blandit cursus risus at ultrices mi. Ullamcorper malesuada proin libero nunc consequat interdum varius sit amet."
    },{
        name: "Desert Mesa",
        image:"https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2c7bd19548c65c_340.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Maecenas sed enim ut sem viverra. Tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla. Faucibus purus in massa tempor nec feugiat nisl pretium. Ipsum dolor sit amet consectetur adipiscing elit. At urna condimentum mattis pellentesque id nibh tortor id aliquet. Convallis posuere morbi leo urna molestie."
    },{
        name: "Canyon Floor",
        image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2c7bd19548c65c_340.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Maecenas sed enim ut sem viverra. Tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla. Faucibus purus in massa tempor nec feugiat nisl pretium. Ipsum dolor sit amet consectetur adipiscing elit. At urna condimentum mattis pellentesque id nibh tortor id aliquet. Convallis posuere morbi leo urna molestie."
    }
];

async function seedDB() {
    try {
        await Campground.deleteMany({});
        console.log("Cleared all campgrounds!!");
        await Comment.deleteMany({});
        console.log("Cleared all comments!!");
        for (const seed of seeds) {
            let campground = await Campground.create(seed);
            console.log("Created a campground");
            let comment = await Comment.create({
                text: seed.name + " is great, but I wish there was internet",
                author: "Homer"
            });
            console.log("Created a comment");
            campground.comments.push(comment);
            campground.save();
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = seedDB;