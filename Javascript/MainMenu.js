const classes = ["bg1", "bg2", "bg3"];
let index = 0;

document.body.className = classes[index];

setInterval(() => {
    index = (index + 1) % classes.length;
    document.body.className = classes[index];
}, 2000);
