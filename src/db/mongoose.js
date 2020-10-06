const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

// mongoose.connect("mongodb://127.0.0.1:27017/live-classroom", {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// })




