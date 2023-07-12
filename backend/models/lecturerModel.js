const mongoose = require('mongoose')

const Schema = mongoose.Schema

const taskSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    percentage: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    id: {
        type: String
    },
    courses: [
        {
          name: {
            type: String,
            required: true,
          },
          code: {
            type: String,
            required: true,
          },
          tasks: [taskSchema], // Define the sub-document schema for tasks
          year: {
            type: Number,
          },
          semester: {
            type: String,
          },
        },
      ],
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
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

module.exports = mongoose.model('Lecturer', userSchema)