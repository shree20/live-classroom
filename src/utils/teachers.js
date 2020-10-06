const teachers = []

//addteacher, removeteacher, getteacher, getteachersInRoom

const addteacher = ({ id, username, room }) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Check for existing User
    const existingUser = teachers.find((teacher) => {
        return teacher.username === username && teacher.room === room
    })

    //validate username
    if (existingUser) {
        return {
            error: 'User has already joined the class!'
        }
    }

    const user = { id, username, room }
    teachers.push(user)
    return { user }

}

const removeteacher = (room, username) => {
    const index = teachers.findIndex((teacher) => {
        return teacher.room === room.trim().toLowerCase() && teacher.username === username.trim().toLowerCase()
    })

    if (index !== -1) {
        return teachers.splice(index, 1)[0]
    }

}

const getteacher = (id) => {
    return teachers.find((teacher) => {
        return teacher.id === id
    })

}

const getteachersInRoom = (room) => {
    room = room.trim().toLowerCase()

    let teachersInRoom = []
    teachersInRoom = teachers.filter((teacher) => {
        return teacher.room === room
    })

    return teachersInRoom
}

module.exports = {
    addteacher,
    removeteacher,
    getteacher,
    getteachersInRoom
}