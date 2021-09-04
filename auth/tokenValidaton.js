const jwt = require('jsonwebtoken')

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization")
        if (token) {
            token = token.slice(7)
            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).send({
                        success: 0,
                        message: err.message
                    })
                } else {
                    next()
                }
            })
        } else {
            return res.status(401).send({
                success: 0,
                message: 'Unauthorized user!'
            })
        }
    } 
}