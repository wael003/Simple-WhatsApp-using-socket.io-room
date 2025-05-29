const mongoose = require('mongoose');

class Database{
    constructor(){
        this.URL = 'mongodb://localhost:27017/UserChat';
    }
    connect(){
        mongoose.connect(this.URL)
        .then(()=>{
            console.log('connected to database');
        })
        .catch(err=>{
            console.log(err);
        })

    }
}
const obj = new Database();
obj.connect();

module.exports = obj;