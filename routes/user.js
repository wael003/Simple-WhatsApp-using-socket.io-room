const express = require('express');
const Route = express.Router();
const userController = require('../controller/userController');
const authMiddleware = require('../middleware/auth');

Route.get('/profile',authMiddleware , (req , res)=>{res.json({ user: req.user})});
Route.get('/', userController.getUsers )
Route.post('/signUp',userController.signUp);
Route.post('/logIn',userController.logIn);

module.exports = Route;

