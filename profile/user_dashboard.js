document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem("email");
    // const password = localStorage.getItem("password"); // assumed you stored it earlier

    console.log("📦 Email from storage:", email);

    if (!email) {
        alert("Not logged in");
        window.location.href = "https://meixup.github.io/mu/login/login.html";
        return;
    }

    fetch("https://0aceed31c6b7.ngrok-free.app/api/user/by-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(data => {
        console.log("✅ API Response:", data);
        window.userData = data; // Optional: for debugging in console
        if (data.success) {
            const user = data.user;

            // Update DOM with user info
            document.getElementById("user-name").textContent = user[0];
            document.getElementById("user-email").textContent = user[1];
            document.getElementById("username").textContent = user[2];
            document.getElementById("user-gender").textContent = user[3];
            document.getElementById("user-age").textContent = user[4];
            document.getElementById("user-created").textContent = new Date(user[6]).toDateString();

            const propi = user[5];
            localStorage.setItem("ppi", propi);
            
        } else {
            alert("Login failed: " + (data.message || "Unknown error"));
            window.location.href = "https://meixup.github.io/mu/login/login.html";
        }
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("An error occurred. Please try again later.");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const ppi = localStorage.getItem("ppi");
    console.log("📦 Profile pic from storage:", ppi);


            fetch("https://0aceed31c6b7.ngrok-free.app/static/uploads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ppi })
            })
            .then(res => res.json())
            .then(data => {
                console.log("✅ PPI Response:", data);
                window.userData = data; // Optional: for debugging in console
                if (data.success) {
                    const ppiu = data.ppiu;
                    document.getElementById("profile-pic").src = ppiu[0];
                } else {
                    document.getElementById("profile-pic").src = "https://0aceed31c6b7.ngrok-free.app/static/uploads/default.png";
                }
                .catch(err => {
        console.error("Fetch error:", err);
        alert("Profile pic not lode.");
    });
});


// 🌙 Light/Dark Mode Toggle
const toggle = document.getElementById('modeToggle');

toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Save preference
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme preference
window.onload = () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
};

// 🚪 Logout
document.getElementById('logout').addEventListener('click', function() {
    alert('You will be logged out.');

    fetch("https://0aceed31c6b7.ngrok-free.app/logout", {  // change endpoint if needed
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
        // body: JSON.stringify({})  // add if needed
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
        console.error('Error:', error);
        alert('An error occurred during logout.');
    });
});
