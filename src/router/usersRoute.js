var express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')

router.post("/", async (req, res) => {
    let user = new User(req.body)
    try {
        user = await user.save()
        const token = await user.getAuthToken()
        res.send({ user, token })
    } catch (er) {
        res.send(er).status(400)
    }

})

router.post("/login", async (req, res) => {

    try {
        let user = await User.getUserByCredential(req.body.email, req.body.password)
        const token = await user.getAuthToken();
        res.send({ user, token })
    } catch (e) {
        res.status(400).send("Invalid Username/Password")
    }

})

router.get("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send({ message: "Logged out!!" })

    } catch (error) {
        res.status(500).send({ error })
    }
})

router.get("/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send({ message: "Cleared all sessions!!" })

    } catch (error) {
        res.status(500).send({ error })
    }
})
router.get("/myProfile", auth, async (req, res) => {
    res.send(req.user)
})

router.patch("/me", auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        let user = req.user

        updates.forEach((update) => user[update] = req.body[update])
        user = await user.save()

        if (!user) {
            return res.status(400).send({ message: "User not found" })
        }
        return res.send({ message: user })
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: error })
    }
})

router.delete("/me", auth, async (req, res) => {
    const user = req.user
    await user.remove()
    res.send(req.user)
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|pdf)$/)) {
            return cb(new Error("File Type not supported"))
        }
        cb(undefined, true)
    }
})

router.post("/avatar", auth, upload.single('upload'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.send({ error: error.message }).status(400)
})

router.delete("/avatar", auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.send({ error: error.message }).status(400)
})


module.exports = router