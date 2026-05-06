document.addEventListener("DOMContentLoaded", () => {

const client = window.supabase.createClient(
  "https://lffordkymqvaoatbhjuf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZm9yZGt5bXF2YW9hdGJoanVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDYwNDgsImV4cCI6MjA5MTk4MjA0OH0.GuhTqrLsxHZn2xmvSav-kKI0tQ9w60yjIpjbGVjtbmU"
);

    const btnKirim = document.querySelector(".btn-kirim");
    const emailInput = document.getElementById("Email");
    const notifBox = document.querySelector(".rectangle");

    btnKirim.addEventListener("click", async () => {
        const email = emailInput.value.trim();

        if (!email) {
            alert("Email harus diisi!");
            return;
        }

        try {
            const { error } = await client.auth.resetPasswordForEmail(email, {
                redirectTo: "http://127.0.0.1:5500/UbahPassword.html"
            });

            if (error) throw error;

            notifBox.style.display = "flex";
            notifBox.innerText = "Link reset password sudah dikirim!";

        } catch (err) {
            notifBox.style.display = "flex";
            notifBox.innerText = "Gagal: " + err.message;
        }
    });
});