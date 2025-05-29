const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socket = require('./config/socket');
require('./config/DB');
require('dotenv').config();
const user = require('./routes/user');
const chat = require('./routes/chat');


const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const server = http.createServer(app);


app.use('/user', user);
app.use('/chat', chat);

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/Public/SignIn.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Public/index.html');
});


const io = socket.init(server);
io.on('connection', (socket) => {
  console.log('User Connected');

  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.onAny((event, ...args) => {
    console.log(`📡 Event: ${event}`, args);
  });

  socket.on('disconnect', () => {
    console.log('User has Leave the chat');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));



