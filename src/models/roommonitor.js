const mongoose = require('mongoose')


const roommonitorSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        trim: true
    },
    roomEntryTime: {
        type: String
    },
    roomExitTime: {
        type: String,
        default: null
    },
    username: {
        type: String
    },
    role: {
        type: String
    }
})

roommonitorSchema.statics.addEntryTime = async (username, role, roomEntryTime, roomId) => {

    await RoomMonitor.insertMany({
        roomId,
        roomEntryTime,
        username,
        role
    })

    return true;

}


roommonitorSchema.statics.addExitTime = async (username, role, roomExitTime, roomId) => {

    await RoomMonitor.findOneAndUpdate({
        roomId,
        username,
        role,
        roomExitTime: null
    }, {
        roomExitTime
    })

    return true;

}


const RoomMonitor = mongoose.model('RoomMonitor', roommonitorSchema)

module.exports = RoomMonitor