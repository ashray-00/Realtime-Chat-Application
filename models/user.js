const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const userSchema = new Schema(
    {
        unique_id: Number,
        email: String,
        username: String,
        password: String,
    }
)

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

var User = mongoose.model('user', userSchema)
module.exports = User