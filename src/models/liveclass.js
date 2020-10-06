const mongoose = require('mongoose')


const liveclassSchema = new mongoose.Schema({
    classname: {
        type: String,
        required: true,
        trim: true
    },
    classStartTime: {
        type: String
    },
    classEndTime: {
        type: String,
        default: null
    },
    roomId: {
        type: String,
    }
})

liveclassSchema.statics.addClass = async (classname, classStartTime, roomId) => {

    await Liveclass.insertMany({
        classname,
        classStartTime,
        roomId
    })

    return true;

}

liveclassSchema.statics.endClass = async (classname, classEndTime, roomId) => {

    await Liveclass.findOneAndUpdate({
        classname,
        roomId,
        classEndTime: null
    }, {
        classEndTime
    })


    return true;

}


const Liveclass = mongoose.model('Liveclass', liveclassSchema)

module.exports = Liveclass