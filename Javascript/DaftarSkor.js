document.addEventListener("DOMContentLoaded", async () => {

    const supabase = window.supabase.createClient(
        "https://lffordkymqvaoatbhjuf.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZm9yZGt5bXF2YW9hdGJoanVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDYwNDgsImV4cCI6MjA5MTk4MjA0OH0.GuhTqrLsxHZn2xmvSav-kKI0tQ9w60yjIpjbGVjtbmU"
    );

    const tableBody = document.getElementById("dataSkor");

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

            let topik = "Tidak diketahui";
            if (item.id_topik == 1) topik = "Alat Musik";
            if (item.id_topik == 2) topik = "Rumah Adat";

            const row = `
                <tr>
                    <td>
                        <input type="checkbox" class="pilihSkor" data-id="${item.id}">
                    </td>

                    <td>${index + 1}</td>
                    <td>${nama}</td>
                    <td>${topik}</td>
                    <td>${skor}</td>
                </tr>
            `;

            tableBody.innerHTML += row;
        });
    }

    document.addEventListener("change", function (e) {
        if (e.target && e.target.id === "cekSemua") {
            document.querySelectorAll(".pilihSkor").forEach(item => {
                item.checked = e.target.checked;
            });
        }
    });

    async function hapusBanyakSkor() {

        const dipilih = document.querySelectorAll(".pilihSkor:checked");

        if (dipilih.length === 0) {
            alert("Pilih data dulu!");
            return;
        }

        const konfirmasi = confirm("Yakin ingin menghapus data terpilih?");
        if (!konfirmasi) return;

        for (const item of dipilih) {

            const id = item.dataset.id;

            const { error } = await supabase
                .from("permainan")
                .delete()
                .eq("id", id);

            if (error) {
                console.error(error);
            }
        }

        alert("Data berhasil dihapus");
        loadData();
    }

    const btnHapus = document.getElementById("hapusDipilih");

    if (btnHapus) {
        btnHapus.addEventListener("click", hapusBanyakSkor);
    }

    window.hapusData = async (id) => {

        const konfirmasi = confirm("Yakin ingin menghapus data ini?");
        if (!konfirmasi) return;

        const { error } = await supabase
            .from("permainan")
            .delete()
            .eq("id", id);

        if (error) {
            alert("Gagal hapus data!");
        } else {
            alert("Data berhasil dihapus");
            loadData();
        }
    };

    loadData();
});

document.addEventListener("DOMContentLoaded", () => {

    const hamburger = document.querySelector(".hamburger");
    const sidebar = document.getElementById("sidebarMobile");
    const overlay = document.getElementById("overlay");

    hamburger.addEventListener("click", () => {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    });

    overlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });
});