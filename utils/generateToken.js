const jwt = require('jsonwebtoken');

const token = (user)=>{
    return jwt.sign(
        {user : user.username},
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

module.exports = token;