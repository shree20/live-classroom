const mongoose = require('mongoose')
const liveclass = require('./liveclass.js')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    }
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password

    return userObject

}

userSchema.statics.findByCredentials = async (username, password, roomID) => {
    const user = await User.findOne({ username })

    if (!user) {
        throw new Error('Access Denied!')
    }

    //  const isMatch = await bcrypt.compare(password, user.password)
    const isMatch = await password === user.password

    if (!isMatch) {
        throw new Error('Access Denied!')
    }

    if (user.role.toLowerCase() === "student") {
        const roomActive = await isRoomActive(roomID)

        if (!roomActive) {
            throw new Error('Access Denied!')
        }
    }

    return user

}

const isRoomActive = async (roomId) => {
    const classroom = await liveclass.findOne({
        roomId,
        classEndTime: null
    })

    if (classroom) {
        return true
    }

    return false;

}


const User = mongoose.model('User', userSchema)

module.exports = User