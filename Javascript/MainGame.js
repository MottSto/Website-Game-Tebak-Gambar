document.addEventListener("DOMContentLoaded", () => {

    const supabase = window.supabase.createClient(
        "https://lffordkymqvaoatbhjuf.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZm9yZGt5bXF2YW9hdGJoanVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDYwNDgsImV4cCI6MjA5MTk4MjA0OH0.GuhTqrLsxHZn2xmvSav-kKI0tQ9w60yjIpjbGVzWUtjbmU",
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        }
    );

    const POIN_BENAR = 10;

    const kategori = localStorage.getItem("kategori");

    if (!kategori) {
        alert("Silakan pilih kategori terlebih dahulu!");
        window.location.href = "kategori.html";
        return;
    }

    const gambarContainer = document.querySelector(".Gambar-container");
    const tombolJawaban = document.querySelectorAll("[data-jawaban]");
    const soalText = document.getElementById("soalText");
    const feedbackBox = document.getElementById("feedbackBox");

    // =========================
    // 🎵 AUDIO FIX TOTAL (AUTO PLAY)
    // =========================
    const bgMusic = document.getElementById("bgMusic");
    const soundBenar = document.getElementById("soundBenar");
    const soundSalah = document.getElementById("soundSalah");

    if (bgMusic) {
        bgMusic.volume = 0.3;
        bgMusic.muted = true;
        bgMusic.load();

        // coba autoplay langsung
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                console.log("Autoplay diblokir, menunggu interaksi user");
            });
        }
    }

    if (soundBenar) soundBenar.volume = 0.8;
    if (soundSalah) soundSalah.volume = 0.8;

    // =========================
    // 🔥 fallback kalau autoplay diblokir
    // =========================
    function unlockAudio() {
        if (!bgMusic) return;

        bgMusic.muted = false;
        bgMusic.play().catch(() => {});
    }

    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("touchstart", unlockAudio, { once: true });

    let sudahJawab = false;
    let soalList = [];
    let indexSoal = 0;
    let skor = parseInt(localStorage.getItem("skor")) || 0;

    // =========================
    // AMBIL SOAL
    // =========================
    async function ambilSoal() {

        const saved = localStorage.getItem("soalList");

        if (saved) {
            soalList = JSON.parse(saved);
        } else {

            const { data, error } = await supabase
                .from("Soal")
                .select("*")
                .eq("id_topik", parseInt(kategori));

            if (error) {
                alert("Gagal mengambil soal!");
                return;
            }

            if (!data || data.length === 0) {
                alert("Soal kosong!");
                window.location.href = "kategori.html";
                return;
            }

            soalList = data.sort(() => Math.random() - 0.5);
            localStorage.setItem("soalList", JSON.stringify(soalList));
        }

        indexSoal = parseInt(localStorage.getItem("indexSoal")) || 0;

        tampilkanSoal();
    }

    // =========================
    // TAMPILKAN SOAL
    // =========================
    function tampilkanSoal() {

        if (indexSoal >= soalList.length) {
            window.location.href = "Selesai.html";
            return;
        }

        sudahJawab = false;

        const data = soalList[indexSoal];

        let imgSrc = "";

        if (data.Gambar && data.Gambar.startsWith("http")) {
            imgSrc = data.Gambar;
        } else if (data.Gambar) {
            const { data: publicUrl } = supabase
                .storage
                .from("Soal-image")
                .getPublicUrl(data.Gambar);

            imgSrc = publicUrl.publicUrl;
        }

        gambarContainer.innerHTML = `
            <img src="${imgSrc}" style="width:100%; height:100%; object-fit:cover; border-radius:10px;" />
        `;

        soalText.innerText = data.Soal;

        let jawaban = [
            data.jawaban_benar,
            data.jawaban_salah_1,
            data.jawaban_salah_2
        ];

        jawaban.sort(() => Math.random() - 0.5);

        tombolJawaban.forEach((btn, i) => {
            btn.innerText = jawaban[i];
            btn.disabled = false;
            btn.style.background = "";
        });
    }

    // =========================
    // FEEDBACK
    // =========================
    function showFeedback(isBenar) {

        feedbackBox.classList.remove("hidden");
        feedbackBox.className = isBenar ? "feedback benar-box" : "feedback salah-box";
        feedbackBox.innerText = isBenar ? "Benar" : "Salah";

        setTimeout(() => {
            feedbackBox.classList.add("hidden");
        }, 1000);
    }

    // =========================
    // JAWABAN
    // =========================
    function handleJawaban(btn) {

        if (sudahJawab) return;
        sudahJawab = true;

        const data = soalList[indexSoal];
        const benar = btn.innerText === data.jawaban_benar;

        tombolJawaban.forEach(b => b.disabled = true);

        const nextIndex = indexSoal + 1;
        localStorage.setItem("indexSoal", nextIndex);

        if (benar) {

            if (soundBenar) {
                soundBenar.currentTime = 0;
                soundBenar.play();
            }

            skor += POIN_BENAR;
            localStorage.setItem("skor", skor);
            localStorage.setItem("penjelasan", data.penjelasan_jawaban);

            btn.style.background = "#28a745";

            showFeedback(true);

            setTimeout(() => {
                window.location.href = "Penjelasan.html";
            }, 1200);

        } else {

            if (soundSalah) {
                soundSalah.currentTime = 0;
                soundSalah.play();
            }

            btn.style.background = "#dc3545";

            showFeedback(false);

            setTimeout(() => {
                if (nextIndex < soalList.length) {
                    window.location.href = "MainGame.html";
                } else {
                    window.location.href = "Selesai.html";
                }
            }, 1200);
        }
    }

    tombolJawaban.forEach(btn => {
        btn.addEventListener("click", () => handleJawaban(btn));
    });

    ambilSoal();
});