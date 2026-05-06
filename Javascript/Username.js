const client = window.supabase.createClient(
  "https://lffordkymqvaoatbhjuf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZm9yZGt5bXF2YW9hdGJoanVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDYwNDgsImV4cCI6MjA5MTk4MjA0OH0.GuhTqrLsxHZn2xmvSav-kKI0tQ9w60yjIpjbGVjtbmU"
);

async function mulai() {
    const input = document.getElementById("username");
    const username = input.value.trim();

    if (username === "") {
        alert("Username tidak boleh kosong!");
        input.focus();
        return;
    }

    try {

        // ✅ CEK apakah username sudah ada
        const { data: existingUser, error: errorCheck } = await client
            .from("siswa")
            .select("*")
            .eq("nama_siswa", username)
            .maybeSingle();

        if (errorCheck) {
            console.error("Error cek user:", errorCheck.message);
            alert("Terjadi error saat cek user!");
            return;
        }

        let idSiswa;

        if (existingUser) {
            // ✅ jika sudah ada, pakai ID lama
            idSiswa = existingUser.id;
        } else {
            // ✅ jika belum ada, insert baru + ambil ID
            const { data, error } = await client
                .from("siswa")
                .insert([
                    { nama_siswa: username }
                ])
                .select(); // WAJIB agar dapat ID

            if (error) {
                console.error("Error:", error.message);
                alert("Gagal simpan ke database!");
                return;
            }

            idSiswa = data[0].id;
        }

        // ✅ SIMPAN ID SISWA
        localStorage.setItem("id_siswa", idSiswa);

        console.log("ID SISWA:", idSiswa);

        // pindah ke halaman kategori
        window.location.href = "Arahan.html";

    } catch (err) {
        console.error("Catch error:", err);
        alert("Terjadi error!");
    }
}