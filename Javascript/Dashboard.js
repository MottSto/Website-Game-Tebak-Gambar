import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://lffordkymqvaoatbhjuf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZm9yZGt5bXF2YW9hdGJoanVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDYwNDgsImV4cCI6MjA5MTk4MjA0OH0.GuhTqrLsxHZn2xmvSav-kKI0tQ9w60yjIpjbGVjtbmU"
);

// ================= GLOBAL USER =================
let currentUserId = null;

// ================= USER =================
async function loadUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    window.location.href = "login.html";
    return;
  }

  const user = data.user;
  currentUserId = user.id;

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
        <td colspan="6" style="text-align:center;">Belum ada soal</td>
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
        <td>
          <input type="checkbox" class="pilihSoal" data-id="${item.id}">
        </td>

        <td>${index + 1}</td>
        <td>${topik}</td>
        <td>${item.tanggal || "-"}</td>
        <td>${formatJam(item.jam)}</td>

        <td>
          <button class="btnHapus" data-id="${item.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });

  // ================= SINGLE DELETE =================
  document.querySelectorAll(".btnHapus").forEach(btn => {
    btn.addEventListener("click", function () {
      hapusSingleSoal(this.dataset.id);
    });
  });
}

// ================= HAPUS 1 DATA =================
async function hapusSingleSoal(id) {

  const konfirmasi = confirm("Yakin hapus soal ini?");
  if (!konfirmasi) return;

  const { data: soal } = await supabase
    .from("Soal")
    .select("Gambar")
    .eq("id", id)
    .single();

  if (soal?.Gambar) {
    const cleanPath = soal.Gambar.split("/").pop().trim();

    await supabase
      .storage
      .from("Soal-image")
      .remove([cleanPath]);
  }

  await supabase
    .from("Soal")
    .delete()
    .eq("id", id);

  alert("Soal berhasil dihapus");

  loadSoal(currentUserId);
}

// ================= HAPUS BANYAK =================
async function hapusBanyakSoal() {

  const dipilih = document.querySelectorAll(".pilihSoal:checked");

  if (dipilih.length === 0) {
    alert("Pilih data dulu");
    return;
  }

  const konfirmasi = confirm("Yakin hapus soal terpilih?");
  if (!konfirmasi) return;

  for (const item of dipilih) {

    let id = item.dataset.id;

    const { data: soal } = await supabase
      .from("Soal")
      .select("Gambar")
      .eq("id", id)
      .single();

    if (soal?.Gambar) {
      const cleanPath = soal.Gambar.split("/").pop().trim();

      await supabase
        .storage
        .from("Soal-image")
        .remove([cleanPath]);
    }

    await supabase
      .from("Soal")
      .delete()
      .eq("id", id);
  }

  alert("Soal berhasil dihapus");

  loadSoal(currentUserId);
}

// ================= CHECKBOX SELECT ALL =================
document.addEventListener("change", function (e) {
  if (e.target && e.target.id === "cekSemua") {
    document.querySelectorAll(".pilihSoal").forEach(item => {
      item.checked = e.target.checked;
    });
  }
});

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

  loadUser();

  const btnHapusMassal = document.getElementById("hapusDipilih");

  if (btnHapusMassal) {
    btnHapusMassal.addEventListener("click", hapusBanyakSoal);
  }

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