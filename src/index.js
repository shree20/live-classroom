const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
var bodyParser = require('body-parser')
const User = require('./models/user.js')
const Classroom = require('./models/classroom.js')
const liveclass = require('./models/liveclass.js')
const RoomMonitor = require('./models/roommonitor.js')
const { addStudent, removeStudent, getStudent, getStudentsInRoom } = require('./utils/students.js')
const { addteacher, removeteacher, getteacher, getteachersInRoom } = require('./utils/teachers.js')


require('./db/mongoose.js')
const app = express()
//const router = express.Router()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')


// Setup static directory to serve
app.use(express.static(publicDirectoryPath))


// parse application/json
app.use(bodyParser.json())

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('classconnect', (roomID) => {

        socket.join(roomID)
        io.to(roomID).emit('roomData', {
            roomID,
            students: getStudentsInRoom(roomID),
            teachers: getteachersInRoom(roomID)
        })
    })

    socket.on('join', ({ username, room, role, entryTime }, callback) => {
        let user = {}
        if (role.toLowerCase() === 'teacher') {
            user = addteacher({ id: socket.id, username, room })
        }
        else {
            user = addStudent({ id: socket.id, username, room })

        }

        if (user.error) {
            return callback(user.error)
        }

        RoomMonitor.addEntryTime(username, role, entryTime, room)
        callback()

    })

})

app.post('/login', async (req, res) => {
    try {
        const loggedInUser = await User.findByCredentials(req.body.username, req.body.password, req.body.roomID)

        if (loggedInUser.role.toLowerCase() === "teacher") {
            await Classroom.roomCheck(req.body.roomID)
        }

        res.send({
            "roomID": req.body.roomID,
            "role": loggedInUser.role
        })
    } catch (e) {
        res.status(401).send(e.toString())
    }

})

app.post('/addClass', async (req, res) => {
    try {
        await liveclass.addClass(req.body.classname, req.body.startTime, req.body.roomID)
        res.send({})

    } catch (error) {
        res.status(400).send(error.toString())
    }

})

app.post('/endClass', async (req, res) => {
    try {
        await liveclass.endClass(req.body.classname, req.body.endTime, req.body.roomID)
        res.send({})

    } catch (error) {
        res.status(400).send(error.toString())
    }

})

app.post('/removeUser', async (req, res) => {
    try {
        if (req.body.role.toLowerCase() === "student") {
            removeStudent(req.body.roomID, req.body.username)
        }
        else {
            await liveclass.endClass(req.body.classname, req.body.endTime, req.body.roomID)
            await Classroom.releaseRoom(req.body.roomID)
            removeteacher(req.body.roomID, req.body.username)

        }

        await RoomMonitor.addExitTime(req.body.username, req.body.role, req.body.endTime, req.body.roomID)

        io.to(req.body.roomID).emit('roomData', {
            roomID: req.body.roomID,
            students: getStudentsInRoom(req.body.roomID),
            teachers: getteachersInRoom(req.body.roomID)
        })

        res.send({})

    } catch (error) {
        res.status(400).send(error.toString())
    }

})




server.listen(port, () => {
    console.log(`Server is up and running on ${port}`)
})