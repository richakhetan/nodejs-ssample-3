const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findOne({ _id: tokenData._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token

        next()
    } catch (error) {
        res.send("Please authenticate").status(401)
    }

}

module.exports = auth