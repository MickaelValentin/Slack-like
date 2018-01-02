var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');


//Channel model
var ChannelSchema = new Schema({
    name: String,
    permalink : String,
    date: Date,
    user : { type : mongoose.Schema.Types.ObjectId, ref : "User"}
});

var Channel = mongoose.model('Channel', ChannelSchema);

module.exports = Channel;