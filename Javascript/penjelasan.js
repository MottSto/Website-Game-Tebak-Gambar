document.addEventListener("DOMContentLoaded", () => {

    const penjelasan = localStorage.getItem("penjelasan");
    const box = document.getElementById("penjelasan");
    const skipBtn = document.getElementById("skipBtn");

    box.innerHTML = `
        <div style="margin-top:20px;">
            ${penjelasan ? penjelasan : "Penjelasan tidak tersedia"}
        </div>
    `;

    function lanjut() {

        const indexSoal = parseInt(localStorage.getItem("indexSoal")) || 0;
        const soalList = JSON.parse(localStorage.getItem("soalList")) || [];

        if (indexSoal < soalList.length) {
            window.location.href = "MainGame.html";
        } else {
            window.location.href = "Selesai.html";
        }
    }

    skipBtn.addEventListener("click", lanjut);
});u