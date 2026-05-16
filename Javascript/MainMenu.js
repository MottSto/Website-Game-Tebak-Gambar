const backgrounds = document.querySelectorAll(".bg1, .bg2, .bg3");
let index = 0;

backgrounds[index].style.opacity = "1";

setInterval(() => {
    backgrounds[index].style.opacity = "0";

    index = (index + 1) % backgrounds.length;

    backgrounds[index].style.opacity = "1";

}, 2000);


window.addEventListener("load", () => {

    const splash = document.querySelector(".splash");

    const mainLogo = document.querySelectorAll(".main-logo img");

    const splashSudahTampil = sessionStorage.getItem("splashShown");

    if (!splashSudahTampil) {

        sessionStorage.setItem("splashShown", "true");

        setTimeout(() => {

            splash.style.display = "none";

            mainLogo.forEach(logo => {
                logo.style.opacity = "1";
                logo.style.transform = "scale(1)";
            });

        }, 2000);

    } else {
        splash.style.display = "none";

        mainLogo.forEach(logo => {
            logo.style.opacity = "1";
            logo.style.transform = "scale(1)";
            logo.style.transition = "none";
        });
    }

});