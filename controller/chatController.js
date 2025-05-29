const Message = require('../models/Chat');
const socket = require('../config/socket');

exports.getChats = (req, res)=>{
    Message.find()
    .populate('sender', 'username')
    .then(data=>{
        res.json({messages : data})
    }).catch(err =>{
        res.status(500).json({err:  err});
    })
}

exports.send = async (req, res) => {
  try {
    // Save the message with sender (assumed to be ObjectId of user)
    const {room,sender , receiver , content} = req.body;
    const message = await new Message({sender , receiver , content}).save();

    // Re-fetch the message and populate the sender's name
    const populatedMessage = await Message.findById(message._id).populate('sender', 'username'); // or 'name' depending on your model

    const io = socket.getIO();
    io.to(room).emit("receive_message", populatedMessage);

    res.json({ message: "The message was sent successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
};
exports.getConversation = async (req, res) => {
  try {
    const { user1, user2 } = req.query; // You can also get these from req.body or req.params

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 })
    .populate('receiver' , 'username') 
    .populate('sender', 'username');

    res.json(messages);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve messages." });
  }
};
