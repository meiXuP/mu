const ngrok = 'https://9696eb1c37bc.ngrok-free.app';

const email = localStorage.getItem("email");
const username = localStorage.getItem("username");
const profilePic = localStorage.getItem("profilePic");

const socket = io(ngrok, {
    query: { email: email }
});

const chatMessages = document.getElementById("chat-messages");
// const msgInput = document.getElementById("msg-input");
const sendBtn = document.getElementById("send-btn");
const onlineUsersDiv = document.getElementById("online-users");
const contextMenu = document.getElementById("context-menu");
let messageOffset = 0;

// Load latest 50 messages
function loadMessages() {
    fetch(`${ngrok}/api/global_messages?offset=${messageOffset}`)
        .then(res => res.json())
        .then(messages => {
            if (messages.length === 0) return;
            messages.forEach(msg => appendMessage(msg, false));
            messageOffset += messages.length;
        });
}

function appendMessage(data, scroll = true) {
    const msgDiv = document.createElement("div");
    msgDiv.className = 'msg';
    msgDiv.innerHTML = `<b>${data.sender}</b>: ${data.message}`;
    chatMessages.appendChild(msgDiv);
    if (scroll) chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Infinite scroll for loading older messages
chatMessages.addEventListener('scroll', () => {
    if (chatMessages.scrollTop === 0) loadMessages();
});

sendBtn.onclick = () => {
    const msg = msgInput.value.trim();
    if (!msg) return;
    socket.emit("global_message", { sender: username, message: msg });
    msgInput.value = '';
};

socket.on("new_message", (data) => appendMessage(data));







// Load online users
function loadOnlineUsers() {
    fetch("${ngrok}/api/users/online", {
        method: "GET",
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        console.log("✅ API Response:", data);
        const userList = document.getElementById("user-list");
        userList.innerHTML = ""; // Clear existing users

        if (data.success && data.user.length > 0) {
            data.user.forEach((user, index) => {
                const [username, profilePic] = user;

                const userDiv = document.createElement("div");
                userDiv.className = "user-info";
                userDiv.innerHTML = `
                    <img src=`${ngrok}/static/uploads/${profilePic}` alt="Profile Picture" />
                    <h3>${username}</h3>
                    <div class="context-menu">
                        <button onclick="viewUser('${username}')">View</button>
                        <button onclick="chatUser('${username}')">Chat</button>
                    </div>
                `;

                userDiv.addEventListener("click", function (e) {
                    e.stopPropagation();
                    document.querySelectorAll(".context-menu").forEach(menu => menu.style.display = "none");
                    const menu = this.querySelector(".context-menu");
                    if (menu) menu.style.display = "block";
                });

                userList.appendChild(userDiv);
            });
        } else {
            userList.innerHTML = "<p>No online users.</p>";
        }
    })
    .catch(err => {
        console.error("❌ Error loading users:", err);
        alert("Failed to load online users.");
    });
}

// Optional actions
function viewUser(username) {
    alert("Viewing user: " + username);
}

function chatUser(username) {
    alert("Starting chat with: " + username);
}

// Hide context menu on outside click
document.addEventListener("click", () => {
    document.querySelectorAll(".context-menu").forEach(menu => menu.style.display = "none");
});

// Auto-load users
document.addEventListener("DOMContentLoaded", loadOnlineUsers);








// Voice to Text using Web Speech API
const micBtn = document.getElementById('mic-btn');
const msgInput = document.getElementById('msg-input');
let recognition;

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    msgInput.value += transcript;
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event);
  };
} else {
  micBtn.disabled = true;
  micBtn.innerText = "🎤 (N/A)";
}

micBtn.addEventListener('click', () => {
  if (recognition) {
    recognition.start();
  }
});








// function showContextMenu(x, y) {
//     contextMenu.style.top = y + "px";
//     contextMenu.style.left = x + "px";
//     contextMenu.style.display = "block";
// }

// document.addEventListener("click", () => {
//     contextMenu.style.display = "none";
// });

// document.getElementById("view-btn").onclick = () => {
//     if (selectedUser) window.location.href = `/frontend/profile/view_profile.html?username=${selectedUser}`;
// };

// document.getElementById("chat-btn").onclick = () => {
//     if (selectedUser) window.location.href = `/frontend/chat/personal_chat.html?username=${selectedUser}`;
// };

socket.on("user_online", loadOnlineUsers);
socket.on("user_offline", loadOnlineUsers);

loadMessages();
loadOnlineUsers();

