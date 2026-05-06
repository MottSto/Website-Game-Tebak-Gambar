document.addEventListener("DOMContentLoaded", async () => {

    const supabase = window.supabase.createClient(
        "https://lffordkymqvaoatbhjuf.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZm9yZGt5bXF2YW9hdGJoanVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDYwNDgsImV4cCI6MjA5MTk4MjA0OH0.GuhTqrLsxHZn2xmvSav-kKI0tQ9w60yjIpjbGVjtbmU"
    );

    const skor = parseInt(localStorage.getItem("skor")) || 0;
    const id_siswa = localStorage.getItem("id_siswa");
    const id_topik = localStorage.getItem("kategori"); // ✅ TAMBAHAN

    console.log("SKOR:", skor);
    console.log("ID SISWA:", id_siswa);
    console.log("ID TOPIK:", id_topik);

    document.getElementById("skorValue").innerText = skor;

    // ❗ validasi
    if (!id_siswa || !id_topik) {
        alert("Data tidak lengkap! ulangi dari awal");
        return;
    }

    const sudahSimpan = localStorage.getItem("sudah_simpan");

    if (!sudahSimpan) {
        const { data, error } = await supabase
            .from("permainan")
            .insert([
                {
                    total_skor: skor,
                    id_siswa: parseInt(id_siswa),
                    id_topik: parseInt(id_topik), // ✅ SIMPAN TOPIK
                    tanggal: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error("ERROR INSERT:", error);
            alert("Gagal simpan skor: " + error.message);
        } else {
            console.log("BERHASIL SIMPAN:", data);
            localStorage.setItem("sudah_simpan", "true");
        }
    }

    // 🔙 tombol menu
    const btnMenu = document.getElementById("btnMenu");

    if (btnMenu) {
        btnMenu.addEventListener("click", () => {

            localStorage.removeItem("indexSoal");
            localStorage.removeItem("skor");
            localStorage.removeItem("soalList");
            localStorage.removeItem("sudah_simpan");
            localStorage.removeItem("mulaiBaru");

            window.location.href = "MainMenu.html";
        });
    }
});