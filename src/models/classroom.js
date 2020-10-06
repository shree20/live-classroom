const mongoose = require('mongoose')


const classroomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        trim: true
    },
    isOccupied: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

classroomSchema.statics.roomCheck = async (roomId) => {

    //Check if room is occupied
    const room = await Classroom.findOne({ roomId })
    if (room) {
        if (room.isOccupied)
            throw new Error('Room is Occupied')
        else
            return true
    }

    await Classroom.insertMany({
        roomId,
        isOccupied: true
    })

    return true;

}

classroomSchema.statics.releaseRoom = async (roomId) => {

    //Check if room is occupied
    const room = await Classroom.findOneAndUpdate({ roomId }, {
        $set: { 'isOccupied': false },

    })


}


const Classroom = mongoose.model('Classroom', classroomSchema)

module.exports = Classroom