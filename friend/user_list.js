

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

  // Fallback: ensure current user is stored in localStorage
  // if (!localStorage.getItem("username")) {
  //   localStorage.setItem("username", allUsers); // Replace this with dynamic value after login
  // }

// store current user
  fetch('https://0aceed31c6b7.ngrok-free.app/api/recent-user')
  .then(res => res.json())
  .then(data => {
    localStorage.setItem("username", data.username);
  });


  // Fetch all users from backend
  fetch('https://0aceed31c6b7.ngrok-free.app/api/users')
    .then(res => res.json())
    .then(users => {
      allUsers = users;
      displayUsers(users);

      // Search Logic
      search.addEventListener("input", () => {
        const query = search.value.toLowerCase();
        const filtered = users.filter(user =>
          user.username.toLowerCase().includes(query)
        );
        showSuggestions(filtered.slice(0, 5));
      });

      // Click on search suggestion
      suggestions.addEventListener("click", e => {
        if (e.target.tagName === "LI") {
          const username = e.target.textContent;
          window.location.href = `https://meixup.github.io/mu/friend/user_profile.html?username=${username}`;
        }
      });
    });

  // Display all users on screen
  function displayUsers(users) {
    users.forEach(user => {
      const card = document.createElement("div");
      card.className = "user-card";
      card.innerHTML = `
        <img class="profile-pic" src="https://0aceed31c6b7.ngrok-free.app/static/uploads/${user.profile_pic}" />
        <span>${user.username}</span>
      `;
      card.addEventListener("click", (e) => {
        selectedUsername = user.username;
        selectedUserPic = user.profile_pic;

        // Show context menu at cursor
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.display = 'block';
      });
      container.appendChild(card);
    });
  }

  // Show matching usernames
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




  
  // View profile button click
  viewBtn.addEventListener("click", () => {
    if (selectedUsername) {
      window.location.href = `https://meixup.github.io/mu/friend/user_profile.html?username=${selectedUsername}`;
    }
  });

  // Chat button click
  chatBtn.addEventListener("click", () => {
    if (selectedUsername && selectedUserPic) {
      localStorage.setItem("chatWithUser", selectedUsername);
      localStorage.setItem("chatWithUserPic", selectedUserPic);
      window.location.href = `https://meixup.github.io/mu/chat/personal_chat.html?with=${selectedUsername}`;
    }
  });

  // Hide context menu if clicked outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".user-card") && !e.target.closest("#context-menu")) {
      contextMenu.style.display = "none";
    }
  });

  // Hamburger menu animation
  menu.addEventListener("click", () => {
    menu.classList.toggle("open");
    nav.classList.toggle("active");
  });
});
