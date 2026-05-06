const backgrounds = document.querySelectorAll(".bg1, .bg2, .bg3");
let index = 0;

backgrounds[index].style.opacity = "1";

setInterval(() => {
    backgrounds[index].style.opacity = "0";

    index = (index + 1) % backgrounds.length;

    backgrounds[index].style.opacity = "1";
}, 2000);