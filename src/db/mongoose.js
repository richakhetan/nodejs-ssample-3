const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_CONNECT, {
    useNewUrlParser: true,
    useCreateIndex: true
})

