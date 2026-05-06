document.addEventListener("DOMContentLoaded", function () {

    console.log("Script kategori aktif");

    const tombolKategori = document.querySelectorAll(".btnKategori");

    if (tombolKategori.length === 0) {
        console.error("Tombol kategori tidak ditemukan! Periksa class HTML.");
        return;
    }

    tombolKategori.forEach(function (btn) {
        btn.addEventListener("click", function () {

            const idTopik = btn.getAttribute("data-id");

            if (!idTopik) {
                alert("Kategori tidak valid!");
                return;
            }

            localStorage.setItem("kategori", idTopik);

            console.log("Kategori dipilih:", idTopik);

            window.location.href = "MainGame.html";
        });
    });

});