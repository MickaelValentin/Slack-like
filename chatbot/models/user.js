var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//User model
var UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    role: String,
    facebook : {
        id : String,
        token : String,
    },
    twitter : {
        id : String,
        token : String,
    },
    google : {
        id : String,
        token : String,
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;