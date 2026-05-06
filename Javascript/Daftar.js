const client = window.supabase.createClient(
  "https://lffordkymqvaoatbhjuf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZm9yZGt5bXF2YW9hdGJoanVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDYwNDgsImV4cCI6MjA5MTk4MjA0OH0.GuhTqrLsxHZn2xmvSav-kKI0tQ9w60yjIpjbGVjtbmU"
);

  const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nama = document.getElementById("nama").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (!nama || !email || !password || !confirmPassword) {
                alert("Semua field wajib diisi!");
                return;
            }

            if (password.length < 6) {
                alert("Password minimal 6 karakter!");
                return;
            }

            if (password !== confirmPassword) {
                alert("Password tidak sama!");
                return;
            }

            try {
                const { data, error } = await client.auth.signUp({
                    email: email,
                    password: password
                });

                if (error) {
                    console.error("REGISTER ERROR:", error.message);
                    alert("Register gagal: " + error.message);
                    return;
                }

                const user = data.user;

                if (!user) {
                    alert("User tidak terbentuk!");
                    return;
                }

                const { error: insertError } = await client
                    .from("Guru")
                    .insert([
                        {
                            id: user.id,
                            nama_guru: nama,
                            email: email
                        }
                    ]);

                if (insertError) {
                    console.error("INSERT ERROR:", insertError.message);
                    alert("Gagal simpan ke tabel Guru!");
                    return;
                }

                alert("Registrasi berhasil!");
                window.location.href = "Login.html";

            } catch (err) {
                console.error("ERROR:", err);
                alert("Terjadi kesalahan!");
            }
        });
    }