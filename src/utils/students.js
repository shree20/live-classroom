const students = []

//addStudent, removeStudent, getStudent, getStudentsInRoom

const addStudent = ({ id, username, room }) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Check for existing User
    const existingUser = students.find((student) => {
        return student.username === username && student.room === room
    })

    //validate username
    if (existingUser) {
        return {
            error: 'User has already joined the class!'
        }
    }

    const user = { id, username, room }
    students.push(user)
    return { user }

}

const removeStudent = (room, username) => {
    const index = students.findIndex((student) => {
        return student.room === room.trim().toLowerCase() && student.username === username.trim().toLowerCase()
    })

    if (index !== -1) {
        return students.splice(index, 1)[0]
    }

}

const getStudent = (id) => {
    return students.find((student) => {
        return student.id === id
    })

}

const getStudentsInRoom = (room) => {
    room = room.trim().toLowerCase()

    let StudentsInRoom = []
    StudentsInRoom = students.filter((student) => {
        return student.room === room
    })

    return StudentsInRoom
}

module.exports = {
    addStudent,
    removeStudent,
    getStudent,
    getStudentsInRoom
}