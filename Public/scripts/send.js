// Send messages 
// const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Submit chat message
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const content = input.value.trim();
  if (content) {
    try {
      const sender = sessionStorage.getItem('userId'); // You could dynamically load this from token or profile
      const token = sessionStorage.getItem('token');
      const receiver = sessionStorage.getItem('receiver');

      const room = [sender, receiver].sort().join("-");


      socket.emit("send_message", {
        room: room,
        content: content,
        sender: sender,
        receiver: receiver,
      });

      const res = await fetch('http://localhost:3000/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ room, sender, receiver, content })
      });



      const data = await res.json();
      console.log(data.message);
      if (data.message === 'Invalid or expired token') {
        window.location.href = "./SignIn.html";
      }
      input.value = '';
    } catch (err) {
      console.error('Failed to send message', err);
    }
  }
});

// Incoming message from socket
socket.on("receive_message", function (msg) {
  const date = new Date(msg.sentAt);

  const hours = date.getUTCHours(); // Use getHours() for local time
  const minutes = date.getUTCMinutes();


  const item = document.createElement('li');
  item.innerHTML = `<strong>Me :</strong> ${msg.content}
  <div class="message-time">${hours}:${minutes}</div>
  `;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});
socket.onAny((event, ...args) => {
  console.log(`📲 Received: ${event}`, args);
});