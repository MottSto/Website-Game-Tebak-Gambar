const client = window.supabase.createClient(
  "https://lffordkymqvaoatbhjuf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZm9yZGt5bXF2YW9hdGJoanVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDYwNDgsImV4cCI6MjA5MTk4MjA0OH0.GuhTqrLsxHZn2xmvSav-kKI0tQ9w60yjIpjbGVjtbmU"
);

document.getElementById("uploadSoal").addEventListener("click", uploadSoal);
document.getElementById("resetForm").addEventListener("click", resetForm);

async function uploadSoal() {
  const soal = document.getElementById("Soal").value;
  const jawabanBenar = document.getElementById("jawabanBenar").value;
  const jawabanSalah1 = document.getElementById("jawabanSalah1").value;
  const jawabanSalah2 = document.getElementById("jawabanSalah2").value;
  const penjelasan = document.getElementById("penjelasan").value;
  const topik = document.getElementById("topik").value;
  const file = document.getElementById("Gambar").files[0];

  console.log("Topik dipilih:", topik);

  if (!topik) {
    alert("Pilih topik terlebih dahulu!");
    return;
  }

  if (!soal || !jawabanBenar || !jawabanSalah1 || !jawabanSalah2) {
    alert("Isi semua field!");
    return;
  }

  const { data, error: userError } = await client.auth.getUser();

  if (userError || !data.user) {
    alert("User belum login!");
    window.location.href = "login.html";
    return;
  }

  const id_Guru = data.user.id;

  let fileName = null;

  if (file) {
    fileName = Date.now() + "_" + file.name.replace(/\s+/g, "_");

    const { error } = await client.storage
      .from("Soal-image")
      .upload(fileName, file);

    if (error) {
      alert("Upload gambar gagal!");
      console.log(error);
      return;
    }
  }

  const now = new Date();

  const { error } = await client
    .from("Soal")
    .insert([
      {
        Soal: soal,
        jawaban_benar: jawabanBenar,
        jawaban_salah_1: jawabanSalah1,
        jawaban_salah_2: jawabanSalah2,
        penjelasan_jawaban: penjelasan,
        Gambar: fileName,
        id_topik: Number(topik),
        id_Guru: id_Guru,
        tanggal: now.toISOString().split("T")[0],
        jam: now.toLocaleTimeString()
      }
    ]);

  if (error) {
    console.log(error);
    alert(error.message);
  } else {
    alert("Berhasil upload soal!");
    location.reload();
  }
}

function resetForm() {
  document.getElementById("Soal").value = "";
  document.getElementById("jawabanBenar").value = "";
  document.getElementById("jawabanSalah1").value = "";
  document.getElementById("jawabanSalah2").value = "";
  document.getElementById("penjelasan").value = "";
  document.getElementById("Gambar").value = "";
  document.getElementById("topik").value = "";
}

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