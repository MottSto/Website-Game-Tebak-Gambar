import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://lffordkymqvaoatbhjuf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZm9yZGt5bXF2YW9hdGJoanVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDYwNDgsImV4cCI6MjA5MTk4MjA0OH0.GuhTqrLsxHZn2xmvSav-kKI0tQ9w60yjIpjbGVjtbmU"
);

// ================= USER =================
async function loadUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    window.location.href = "login.html";
    return;
  }

  const user = data.user;

  const { data: guru } = await supabase
    .from("Guru")
    .select("nama_guru")
    .eq("id", user.id)
    .single();

  document.getElementById("namaGuru").innerText =
    "Selamat Datang, " + (guru?.nama_guru || "-");

  loadSoal(user.id);
}

// ================= FORMAT JAM =================
function formatJam(jam) {
  if (!jam) return "-";
  return jam.substring(0, 5).replace(":", ".");
}

// ================= LOAD SOAL =================
async function loadSoal(idGuru) {
  const { data, error } = await supabase
    .from("Soal")
    .select("id, tanggal, jam, id_topik")
    .eq("id_Guru", idGuru)
    .order("tanggal", { ascending: false });

  if (error) {
    console.error("Error Soal:", error.message);
    alert("Gagal ambil data soal!");
    return;
  }

  const tabel = document.getElementById("tabelSoal");
  tabel.innerHTML = "";

  if (!data || data.length === 0) {
    tabel.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">Belum ada soal</td>
      </tr>
    `;
    return;
  }

  data.forEach((item, index) => {

    let topik = "Tidak diketahui";
    if (item.id_topik == 1) topik = "Alat Musik";
    if (item.id_topik == 2) topik = "Rumah Adat";

    tabel.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${topik}</td>
        <td>${item.tanggal || "-"}</td>
        <td>${formatJam(item.jam)}</td> 
        <td class="aksi">
          <button class="btnHapus" data-id="${item.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });

  // 🔥 FIX: event listener setelah render
  document.querySelectorAll(".btnHapus").forEach(btn => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      hapusSoal(id);
    });
  });
}

// ================= HAPUS SOAL =================
async function hapusSoal(id) {
  const konfirmasi = confirm("Yakin mau hapus?");
  if (!konfirmasi) return;

  // ambil gambar
  const { data: soal, error: errGet } = await supabase
    .from("Soal")
    .select('"Gambar"')
    .eq("id", id)
    .single();

  if (errGet) {
    console.error(errGet);
    alert("Gagal ambil data!");
    return;
  }

  const namaFile = soal?.Gambar;

  // hapus storage
  if (namaFile) {
    let cleanPath = namaFile.split("/").pop().trim();

    const { error: errStorage } = await supabase
      .storage
      .from("Soal-image")
      .remove([cleanPath]);

    if (errStorage) {
      console.error(errStorage);
      alert("Gagal hapus gambar!");
      return;
    }
  }

  // hapus database
  const { error: errDelete } = await supabase
    .from("Soal")
    .delete()
    .eq("id", id);

  if (errDelete) {
    console.error(errDelete);
    alert("Gagal hapus data!");
  } else {
    alert("Berhasil dihapus!");
    loadUser(); // reload data
  }
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", loadUser);

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