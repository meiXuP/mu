document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem("email");
    console.log("📦 Email from storage:", email);

    if (!email) {
        alert("Not logged in");
        window.location.href = "https://meixup.github.io/mu/login/login.html";
        return;
    }

    fetch("https://0aceed31c6b7.ngrok-free.app/api/user/by-email?email=${encodeURIComponent(email)}", {
        method: "GET",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("✅ API Response:", data);
        if (data.success) {
            const user = data.user;

            document.getElementById("user-name").textContent = user[0] || 'N/A';
            document.getElementById("user-email").textContent = user[1] || 'N/A';
            document.getElementById("username").textContent = user[2] || 'N/A';
            document.getElementById("user-gender").textContent = user[3] || 'N/A';
            document.getElementById("user-age").textContent = user[4] || 'N/A';
            document.getElementById("user-created").textContent = new Date(user[6]).toDateString() || 'N/A';
            document.getElementById("profile-pic").src = `https://0aceed31c6b7.ngrok-free.app/static/uploads/${user[5]}`;
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
toggle?.addEventListener('click', () => {
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
document.getElementById('logout')?.addEventListener('click', () => {
    alert('You will be logged out.');
    fetch('https://d7b19d3ad71f.ngrok-free.app/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            localStorage.clear();
            window.location.href = 'https://meixup.github.io/mu/index.html';
        } else {
            alert('Logout failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('❌ Logout error:', error);
        alert('An error occurred during logout.');
    });
});
