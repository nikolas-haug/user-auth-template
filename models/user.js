const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

// Basic user profile with: email, password, and profile-image

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true},
    image: {
        secure_url: { type: String, default: '/images/default-profile.png'},
        public_id: String
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);