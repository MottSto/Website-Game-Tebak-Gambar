const client = window.supabase.createClient(
  "https://lffordkymqvaoatbhjuf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZm9yZGt5bXF2YW9hdGJoanVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDYwNDgsImV4cCI6MjA5MTk4MjA0OH0.GuhTqrLsxHZn2xmvSav-kKI0tQ9w60yjIpjbGVjtbmU"
);

const form = document.getElementById("ubahPasswordForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const passwordBaru = document.getElementById("passwordBaru").value;
    const konfirmasiPassword = document.getElementById("konfirmasiPassword").value;

    if (passwordBaru !== konfirmasiPassword) {
        alert("Password tidak cocok!");
        return;
    }

    try {
        const { data, error } = await client.auth.updateUser({
            password: passwordBaru
        });

        if (error) throw error;

        alert("Password berhasil diubah!");
        window.location.href = "Login.html";

    } catch (err) {
        console.error(err);
        alert("Gagal ubah password: " + err.message);
    }
});