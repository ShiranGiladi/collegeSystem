const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})  

// static login mathod
userSchema.statics.login = async function (username, password) {
    if (!username || !password) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({username})
    
    if(!user) {
        throw Error('Incorrect username or password')
    }

    if(password != user.password) {
        throw Error('Incorrect username or password')
    }

    return user
}

module.exports = mongoose.model('Admin', userSchema)