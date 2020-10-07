const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

// mongoose.connect("mongodb+srv://taskapp:Password123@cluster0.vx4iu.mongodb.net/live-classroom?retryWrites=true", {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// })




