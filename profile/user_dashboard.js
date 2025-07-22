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
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })  // send login credentials
})
.then(res => res.json())
.then(data => {
    if (data.success) {
        const user = data.user;

        // Display user data in HTML
        document.getElementById("nickname").textContent = user.nickname;
        document.getElementById("email").textContent = user.email;
        document.getElementById("username").textContent = user.username;
        document.getElementById("gender").textContent = user.gender;
        document.getElementById("age").textContent = user.age;
        document.getElementById("created_at").textContent = user.created_at;

        // Profile picture display
        document.getElementById("profile-pic").src = `https://0aceed31c6b7.ngrok-free.app/static/uploads/${user.profile_pic}`;
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

