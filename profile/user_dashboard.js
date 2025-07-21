document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem("email");
    console.log("📦 Email from storage:", email);

    if (!email) {
        alert("Not logged in");
        window.location.href = "https://meixup.github.io/mu/login/login.html";
        return;
    }

    fetch(`https://6a99726a09b8.ngrok-free.app/api/user/by-email?email=${encodeURIComponent(email)}`, {
        method: "GET",
        credentials: "include", // important for session-based login
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("✅ API Response:", data);
        window.userData = data;
        if (data.success) {
            const user = data.user;

            // Update DOM
            document.getElementById("user-name").textContent = user[0];
            document.getElementById("user-email").textContent = user[1];
            document.getElementById("username").textContent = user[2];
            document.getElementById("user-gender").textContent = user[3];
            document.getElementById("user-age").textContent = user.[4];
            document.getElementById("user-created").textContent = new Date(user[6]).toDateString();
            document.getElementById("profile-pic").src = `https://6a99726a09b8.ngrok-free.app/static/uploads/${user[5]}`;
        } else {
            alert("User not found.");
            localStorage.clear();
            window.location.href = "https://meixup.github.io/mu/login/login.html";
        }
    })
    .catch(err => {
        console.error("❌ Fetch error:", err);
        alert("Something went wrong. Please try again.");
    });
});

// 🌓 Theme toggle
const toggle = document.getElementById('modeToggle');
toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// 💡 Load theme preference
window.onload = () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
};

// 🚪 Logout
document.getElementById('logout').addEventListener('click', function () {
    alert('You will be logged out.');

    fetch('https://6a99726a09b8.ngrok-free.app/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            localStorage.clear();
            window.location.href = 'https://meixup.github.io/mu/login/login.html'; // 🔄 Correct redirection
        } else {
            alert('Logout failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during logout.');
    });
});
