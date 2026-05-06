document.addEventListener("DOMContentLoaded", async () => {

    const supabase = window.supabase.createClient(
        "https://lffordkymqvaoatbhjuf.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZm9yZGt5bXF2YW9hdGJoanVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDYwNDgsImV4cCI6MjA5MTk4MjA0OH0.GuhTqrLsxHZn2xmvSav-kKI0tQ9w60yjIpjbGVjtbmU"
    );

    const tableBody = document.getElementById("dataSkor");

    // 🔥 LOAD DATA
    async function loadData() {

        const { data, error } = await supabase
            .from("permainan")
            .select(`
                id,
                total_skor,
                id_siswa,
                id_topik,
                siswa (nama_siswa)
            `)
            .order("id", { ascending: false });

        if (error) {
            console.error("ERROR:", error);
            alert("Gagal ambil data skor!");
            return;
        }

        // kosongkan tabel
        tableBody.innerHTML = "";

        if (!data || data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">
                        Belum ada data skor
                    </td>
                </tr>
            `;
            return;
        }

        data.forEach((item, index) => {

            const nama = item.siswa?.nama_siswa || "-";
            const skor = item.total_skor || 0;

            // 🎯 mapping topik
            let topik = "Tidak diketahui";
            if (item.id_topik == 1) topik = "Alat Musik";
            if (item.id_topik == 2) topik = "Rumah Adat";

            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${nama}</td>
                    <td>${topik}</td>
                    <td>${skor}</td>
                    <td class="aksi">
                        <button onclick="hapusData(${item.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;

            tableBody.innerHTML += row;
        });
    }

    // 🔥 HAPUS DATA
    window.hapusData = async (id) => {

        const konfirmasi = confirm("Yakin ingin menghapus data ini?");
        if (!konfirmasi) return;

        const { error } = await supabase
            .from("permainan")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("ERROR DELETE:", error);
            alert("Gagal hapus data!");
        } else {
            alert("Data berhasil dihapus");
            loadData(); // reload tabel
        }
    };

    loadData();
});

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const sidebar = document.getElementById("sidebarMobile");
    const overlay = document.getElementById("overlay");

    // buka sidebar
    hamburger.addEventListener("click", () => {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    });

    // klik luar (overlay) = tutup
    overlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });
});