var express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()
const User = require('../models/user')

router.post("/", auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save();
        res.send(task)
    } catch (error) {
        res.send(error).status(400)
    }

})

router.get("/", auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        const user = req.user
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(user.tasks)
    } catch (error) {
        res.send(error).status(500)
    }

})

router.get("/:description", auth, async (req, res) => {
    try {
        const task = await Task.findOne({ description: req.params.description, owner: req.user._id })
        if (!task) {
            res.send({ message: "No such task for user" }).status(500)
        }
        res.send(task)
    } catch (error) {
        res.send(error).status(500)
    }
})

router.patch("/:description", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate({ description: req.params.description, owner: req.user._id },
            req.body, { new: true, runValidators: true })
        if (!task) {
            res.status(400).send({ message: "Task not found" })
        }
        return res.send({ message: task })
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: error })
    }
})

router.delete("/:description", auth, async (req, res) => {
    try {
        const user = await Task.findOneAndDelete({ description: req.params.description, owner: req.user._id })
        if (!user) {
            return res.status(400).send({ message: "Task not found" })
        }
        return res.send({ message: "Task deleted" })
    } catch (error) {
        res.status(400).send({ message: error })
    }
})


module.exports = router