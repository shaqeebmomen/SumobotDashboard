const navbar = document.querySelector("nav-bar");
import("../components/nav-bar/nav-bar.js").then(() => {
    navbar.links = [
        {
            destination: "index.html",
            label: "main"
        },
        {
            destination: "gyro.html",
            label: "gyro"
        },
        {
            destination: "encoder.html",
            label: "encoder"
        },
        {
            destination: "tuning.html",
            label: "tuning"
        }
    ];
    navbar.selected = "main";
});



