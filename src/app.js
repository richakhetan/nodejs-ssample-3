const express = require('express')
const userRoute = require('./router/usersRoute')
const taskRoute = require('./router/tasksRoute')
const app = express();
require('./db/mongoose')

app.use(express.json())
app.use("/users", userRoute)
app.use("/tasks", taskRoute)

app.listen(3000)