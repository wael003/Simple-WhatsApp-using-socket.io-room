const socket = io("http://localhost:3000");




fetch("http://localhost:3000/user/", {
  method: "GET",
})
  .then(res => res.json())
  .then(data => {
    console.log("User info:", data);
    const menu = document.getElementById('user-list');

    if (data.data && Array.isArray(data.data)) {
      for (let i = 0; i < data.data.length; i++) {

        const user = data.data[i];
        const item = document.createElement('li');
        if (sessionStorage.getItem('userId') == user._id) {
          continue;
        }
        item.className = 'user-item'; // Add class
        item.setAttribute('data-user-id', user._id); // Add data-user-id
        item.textContent = user.username; // Set username as text
        menu.appendChild(item);
        menu.scrollTop = menu.scrollHeight;
      }
      const userItems = document.querySelectorAll('.user-item');
      const chatHeader = document.querySelector('#chat-container h2');

      userItems.forEach(item => {
        item.addEventListener('click', () => {
          const receiver = item.getAttribute('data-user-id');
          sessionStorage.setItem('receiver', receiver);
          const sender = sessionStorage.getItem('userId');


          // make room between sender and receiver
          const roomName = [sender, receiver].sort().join("-");
          socket.emit("join_room", roomName);

          userItems.forEach(u => u.classList.remove('active'));
          item.classList.add('active');

          chatHeader.textContent = `${item.textContent}`;

          fetch(`http://localhost:3000/chat/get?user1=${sender}&user2=${receiver}`, {
            method: "GET",
          })
            .then(res => res.json())
            .then(data => {
              console.log("chat info:", data);

              const messages = document.getElementById('messages');
              messages.innerHTML = "";

              data.forEach((msg) => {
                const date = new Date(msg.sentAt);

                const hours = date.getUTCHours(); // Use getHours() for local time
                const minutes = date.getUTCMinutes();

                const item = document.createElement('li');
                if(msg.sender._id == sessionStorage.getItem('userId')){
                  item.innerHTML = `<strong>Me:</strong> ${msg.content}
                <div class="message-time">${hours}:${minutes}</div>
                `;
                }else{
                  item.innerHTML = `<strong>${msg.sender.username}:</strong> ${msg.content}
                <div class="message-time">${hours}:${minutes}</div>
                `;
                }
                messages.appendChild(item);
                messages.scrollTop = messages.scrollHeight;
              });
            })
            .catch(err => {
              console.error("Failed to get user info", err);
            });
        });
      });


    } else {
      console.error("Unexpected data format:", data);
    }
  })
  .catch(err => {
    console.error("Failed to get user info", err);
  });




