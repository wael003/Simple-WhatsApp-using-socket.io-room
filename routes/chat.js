const express = require('express');
const Route = express.Router();
const chatController = require('../controller/chatController');
const authMiddleware = require('../middleware/auth');


Route.get('/get' ,chatController.getConversation )
Route.post('/send',authMiddleware ,chatController.send )

module.exports = Route;