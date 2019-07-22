const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    email : { type : String, required : true},
    password : { type : String, required : true},
    userImage : { type : String, required : true}
})

let User = mongoose.model("user_details",UserSchema);

module.exports = User;