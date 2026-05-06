document.addEventListener("DOMContentLoaded", () => {

    const supabaseUrl = "https://lffordkymqvaoatbhjuf.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZm9yZGt5bXF2YW9hdGJoanVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDYwNDgsImV4cCI6MjA5MTk4MjA0OH0.GuhTqrLsxHZn2xmvSav-kKI0tQ9w60yjIpjbGVjtbmU";

    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById("username");
            const passwordInput = document.getElementById("password");

            if (!emailInput || !passwordInput) {
                alert("Input tidak ditemukan!");
                return;
            }

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                alert("Email dan password wajib diisi!");
                return;
            }

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {

                    console.error("LOGIN ERROR:", error.message);

                    if (error.message.includes("Email not confirmed")) {

                        const resend = confirm("Email belum diverifikasi.\n\nKlik OK untuk kirim ulang email verifikasi.");

                        if (resend) {
                            const { error: resendError } = await supabase.auth.resend({
                                type: 'signup',
                                email: email
                            });

                            if (resendError) {
                                alert("Gagal kirim ulang email: " + resendError.message);
                            } else {
                                alert("Email verifikasi berhasil dikirim ulang. Cek inbox/spam!");
                            }
                        }

                    } else {
                        alert("Login gagal: " + error.message);
                    }

                    return;
                }

                toastr.options = {
                    "closeButton": true,
                    "progressBar": true,
                    "positionClass": "toast-top-right",
                    "timeOut": "5000",        // ⬅️ 5 detik (atur sesuai mau kamu)
                    "extendedTimeOut": "2000",
                    "showDuration": "300",
                    "hideDuration": "300",
                    "preventDuplicates": true
                };

                toastr.success("Login Berhasil!");
                setTimeout(() => {
                    window.location.href = "Dashboard.html";
                }, 1500);

            } catch (err) {
                console.error("ERROR:", err);
                alert("Terjadi kesalahan!");
            }
        });
    }

});