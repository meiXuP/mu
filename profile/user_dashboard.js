document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem("email");
    console.log("📦 Email from storage:", email);

    if (!email) {
        alert("Not logged in");
        window.location.href = "https://meixup.github.io/mu/login/login.html";
        return;
    }

    // const baseURL = "https://0aceed31c6b7.ngrok-free.app";
    // const endpoint = "/api/user/by-email";
    // const emailParam = `?email=${encodeURIComponent(email)}`;

fetch("https://0aceed31c6b7.ngrok-free.app/api/user/by-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    // method: "GET"
    // credentials: "include"  // ✅ Allow session cookie
})
.then(res => res.json())
.then(data => {
    if (data.success) {
        const user = data.user;

        document.getElementById("nickname").textContent = user[0];
        document.getElementById("email").textContent = user[1];
        document.getElementById("username").textContent = user[2];
        document.getElementById("gender").textContent = user[3];
        document.getElementById("age").textContent = user[4];
        document.getElementById("created_at").textContent = user[6];

        document.getElementById("profile-pic").src = `https://your-ngrok-url/static/uploads/${user[5]}`;
    } else {
        alert("User not logged in.");
        window.location.href = "https://meixup.github.io/mu/login/login.html";  // redirect if not logged in
    }
})
.catch(err => {
    console.error("Fetch error:", err);
});
});




const toggle = document.getElementById('modeToggle');

toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Save preference
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved preference on start
window.onload = () => {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  }
};




document.getElementById('logout').addEventListener('click', function() {
    alert('You will be logged out.');
    fetch("https://0aceed31c6b7.ngrok-free.app", {
        method: 'POST',
        credentials: 'include', // important if using cookies/sessions
        headers: {
            'Content-Type': 'application/json'
        }
        
    })
    
    .then(response => {
        if (response.ok) {
            // alert('You have logged out.');
            localStorage.clear(); // optional: clear saved data
            window.location.href = 'https://meixup.github.io/mu/index.html'; // redirect to login
        } else {
            alert('Logout failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during logout.');
    });
});

