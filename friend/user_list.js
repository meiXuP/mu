document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById("user-container");
  const search = document.getElementById("search");
  const suggestions = document.getElementById("suggestions");
  const contextMenu = document.getElementById("context-menu");
  const viewBtn = document.getElementById("view-btn");
  const chatBtn = document.getElementById("chat-btn");
  const menu = document.getElementById("menu-icon");
  const nav = document.getElementById("nav-menu");

  let selectedUsername = "";
  let selectedUserPic = "";
  let allUsers = [];

  // Store current user
  fetch('https://backend-q9fm.onrender.com/api/recent-user')
    .then(res => res.json())
    .then(data => {
      if (data.username) {
        localStorage.setItem("username", data.username);
      }
    })
    .catch(err => {
      console.error("Error fetching current user:", err);
    });

  // Fetch all users
  fetch('https://backend-q9fm.onrender.com/api/users')
    .then(res => res.json())
    .then(users => {
      allUsers = users;
      displayUsers(users);

      // Search functionality
      if (search && suggestions) {
        search.addEventListener("input", () => {
          const query = search.value.toLowerCase();
          const filtered = users.filter(user =>
            user.username.toLowerCase().includes(query)
          );
          showSuggestions(filtered.slice(0, 5));
        });

        suggestions.addEventListener("click", e => {
          if (e.target.tagName === "LI") {
            const username = e.target.textContent;
            window.location.href = `https://meixup.github.io/mu/friend/user_profile.html?username=${username}`;
          }
        });
      }
    })
    .catch(err => {
      console.error("Error fetching users:", err);
    });

  // Display user cards
  function displayUsers(users) {
    container.innerHTML = ""; // Clear previous if any
    users.forEach(user => {
      const card = document.createElement("div");
      card.className = "user-card";
      card.innerHTML = `
        <img class="profile-pic" src="https://backend-q9fm.onrender.com/static/uploads/${user.profile_pic}" alt="${user.username}'s profile picture" />
        <span>${user.username}</span>
      `;
      card.addEventListener("click", (e) => {
        selectedUsername = user.username;
        selectedUserPic = user.profile_pic;

        // Position and show context menu
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.display = 'block';
      });
      container.appendChild(card);
    });
  }

  // Show search suggestions
  function showSuggestions(users) {
    suggestions.innerHTML = "";
    if (users.length === 0 || search.value.trim() === "") {
      suggestions.style.display = "none";
      return;
    }
    users.forEach(user => {
      const li = document.createElement("li");
      li.textContent = user.username;
      suggestions.appendChild(li);
    });
    suggestions.style.display = "block";
  }

  // View profile
  viewBtn?.addEventListener("click", () => {
    if (selectedUsername) {
      window.location.href = `https://meixup.github.io/mu/friend/user_profile.html?username=${selectedUsername}`;
    }
  });

  // Start chat
  chatBtn?.addEventListener("click", () => {
    if (selectedUsername && selectedUserPic) {
      localStorage.setItem("chatWithUser", selectedUsername);
      localStorage.setItem("chatWithUserPic", selectedUserPic);
      window.location.href = `https://meixup.github.io/mu/chat/personal_chat.html?with=${selectedUsername}`;
    }
  });

  // Hide context menu on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".user-card") && !e.target.closest("#context-menu")) {
      contextMenu.style.display = "none";
    }
  });

  // Hamburger menu toggle
  menu?.addEventListener("click", () => {
    menu.classList.toggle("open");
    nav?.classList.toggle("active");
  });
});
