const ngrok = 'https://9696eb1c37bc.ngrok-free.app';
const socket = io(ngrok);

// Get current and selected user info from localStorage
const currentUser = localStorage.getItem("username");
const selectedUser = localStorage.getItem("chatWithUser");
const profilePic = localStorage.getItem("chatWithUserPic");
const isActive = localStorage.getItem("chatWithUserActive"); // optional

// Fallback if data is missing
if (!currentUser || !selectedUser || !profilePic) {
  alert("User info missing. Redirecting to messages page...");
  window.location.href = "https://meixup.github.io/mu/message/chat_list.html";
}

// Set header display
const userImg = document.getElementById("chat-user-pic");
document.getElementById("chat-username").innerText = selectedUser;
userImg.src = `${ngrok}/static/uploads/${profilePic}`;

// Add glow if user is active (optional)
if (isActive === "true") {
  userImg.classList.add("glow");
}

// Create a consistent room ID
const roomId = [currentUser, selectedUser].sort().join('_');
socket.emit('join_room', { room: roomId });

// Load chat history
function loadMessages() {
  fetch(`${ngrok}/api/messages/${selectedUser}?from=${currentUser}`)
    .then(res => res.json())
    .then(messages => {
      const msgContainer = document.getElementById('chat-messages');
      msgContainer.innerHTML = '';
      messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg ' + (msg.sender === currentUser ? 'sender' : 'receiver');
        msgDiv.innerText = msg.message;
        msgContainer.appendChild(msgDiv);
      });
      msgContainer.scrollTop = msgContainer.scrollHeight;
    })
    .catch(err => console.error('Error loading messages:', err));
}

loadMessages();

// Send message
document.getElementById('send-btn').onclick = () => {
  const input = document.getElementById('msg-input');
  const message = input.value.trim();
  if (!message) return;

  socket.emit('send_message', {
    sender: currentUser,
    receiver: selectedUser,
    message: message,
    room: roomId
  });

  input.value = '';
};

// Listen for incoming messages
socket.on('receive_message', data => {
  if (data.sender === selectedUser || data.receiver === selectedUser) {
    const msgContainer = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg ' + (data.sender === currentUser ? 'sender' : 'receiver');
    msgDiv.innerText = data.message;
    msgContainer.appendChild(msgDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }
});

// JS to handle profile image preview (only chat user pic)
userImg.addEventListener('click', () => {
  const modal = document.getElementById('preview-modal');
  const previewImg = document.getElementById('preview-img');
  previewImg.src = userImg.src;
  modal.style.display = 'flex';
});

// Hide preview modal on click
document.getElementById('preview-modal').addEventListener('click', () => {
  document.getElementById('preview-modal').style.display = 'none';
});

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



// online status
function updateUserStatus(isActive) {
  fetch('${ngrok}/api/update-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: localStorage.getItem("username"),
      is_active: isActive
    })
  }).catch(err => console.error('Failed to update user status:', err));
}

// When user opens the chat or returns
window.addEventListener('focus', () => updateUserStatus(true));

// When user switches tab or becomes inactive
window.addEventListener('blur', () => updateUserStatus(false));

// On page load
updateUserStatus(true);

// Optional: On close or refresh
window.addEventListener('beforeunload', () => updateUserStatus(false));
