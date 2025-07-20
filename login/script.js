// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = loginForm.querySelector("#email").value;
        const password = loginForm.querySelector("#password").value;

        const response = await fetch("https://6a99726a09b8.ngrok-free.app/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        alert(result.message);
        if (result.status === "success") {
            if (result.user.role === "1") {
                window.location.href = "admin.html";
            } else {
                const user = result.user;
                // Save email and username in localStorage (or sessionStorage)
                localStorage.setItem("email", user.email);
                localStorage.setItem("username", user.username); // Optional
                window.location.href = "profile/home.html";
            }
        }
    });
}

// VERIFY OTP
const otpForm = document.getElementById("otpForm");
if (otpForm) {
    otpForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = localStorage.getItem("verify_email");
        const otp = otpForm.querySelector("#otp").value;

        const response = await fetch("https://6a99726a09b8.ngrok-free.app/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp })
        });

        const result = await response.json();
        alert(result.message);

        if (result.status === "success") {
            localStorage.removeItem("verify_email");
            window.location.href = "profile/home.html";
        }
    });


// resend otp
    const resendBtn = document.getElementById("resendBtn");
    if (resendBtn) {
        resendBtn.addEventListener("click", async () => {
            const email = localStorage.getItem("verify_email");
            const response = await fetch("https://6a99726a09b8.ngrok-free.app/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const result = await response.json();
            alert(result.message);
        });
    }
}

// forget password
const forgotForm = document.getElementById("forgotForm");
if (forgotForm) {
    forgotForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = forgotForm.querySelector("#email").value;
        const response = await fetch("https://6a99726a09b8.ngrok-free.app/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        const result = await response.json();
        alert(result.message);
        if (result.status === "success") {
            // Store email in localStorage for OTP verification use
            localStorage.setItem("verify_email", email);
            // Redirect to OTP verification page
            window.location.href = "reset_password.html";
        }
    });
}

// reset_password
const resetForm = document.getElementById("resetForm");
if (resetForm) {
    resetForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = localStorage.getItem("verify_email");
        const otp = resetForm.querySelector("#otp").value;
        const new_password = resetForm.querySelector("#new_password").value;

        const response = await fetch("https://6a99726a09b8.ngrok-free.app/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp, new_password })
        });

        const result = await response.json();
        alert(result.message);

        if (result.status === "success") {
            localStorage.removeItem("verify_email");
            window.location.href = "login/login.html";
        }
    });
}
