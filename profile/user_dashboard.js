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
        credentials: "include"
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
            document.getElementById("profile-pic").src = `https://6a99726a09b8.ngrok-free.app/static/uploads/${user[5]}`;

        } else {
            alert("User not found.");
        }
    })
    .catch(err => {
        console.error("❌ Fetch error:", err);
        alert("Something went wrong. Please try again.");
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
    fetch('https://6a99726a09b8.ngrok-free.app/logout', {
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
