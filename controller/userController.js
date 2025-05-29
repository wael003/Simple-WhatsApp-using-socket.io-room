const User = require('../models/User');
const generator = require('../utils/generateToken');

exports.signUp = (req, res) => {
    const { username, email, password } = req.body;
    User.findOne({email})
        .then(data => {
            if (data) res.status(400).json({ message: 'User already existe' });
            
                new User({ username, email, password }).save()
                    .then(() => {
                        res.json({ message: 'user signed up', details: { uesr: username, email: email } });
                    })
                    .catch(err => {
                        res.status(401).json({ message: 'the password does not match!' });
                    })
            
        })
        .catch(err => {
            res.status(500).json({ message: 'something went wrong!' });
        })
}

exports.logIn = async (req ,res)=>{
   const { email, password } = req.body;

  // Search by either email or username
  User.findOne({email})
    .then(user => {
      if (!user) {
        return res.status(402).json({
          message: "User not found! If you don't have an account, please sign up."
        });
      }

      return user.comparePassword(password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(401).json({ message: 'Wrong password!' });
          }
          const token = generator(user);
          
          res
          .header('Authorization', `Bearer ${token}`)
          .json({
            message: 'Logged in successfully',
            details: {
              username: user.username,
              email: user.email,
              userId: user._id
            }
            ,token: token
          });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
};


exports.getUsers = (req , res)=>{
  User.find()
  .then(data=>{
    res.json({data: data});
  })
  .catch(err =>{
    res.status(500).json({err:err});
  })
}