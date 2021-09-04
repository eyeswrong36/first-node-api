const express = require('express')
const bodyParser = require('body-parser')
const connection = require('../connection/database')
const validateToken = require('../auth/tokenValidaton')
const router = express.Router()

const jwt = require('jsonwebtoken')
const { checkToken } = require('../auth/tokenValidaton')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

connection.connect((err) => {
    if (err) {
        console.error(`error connecting: ${err.stack}`)
        return
    }
    console.log(`connected as id ${connection.threadId}`);
})

router.post('/users/login', (req, res) => {
    let data = req.body
    connection.query('SELECT * FROM users WHERE username = ? and password = ?',
    [data.username, data.password], (error, results, fields) => {
        if (error) {
            throw error
        }
        if (results.length == 0) {
            return res.status(400).json({
                success: 0,
                data: 'Invalid Username or Password!'
            })
        }
        // console.log(results[0].password);
        results[0].password = undefined
        jsontoken = jwt.sign({ result: results[0] }, process.env.SECRET, {
            expiresIn: '1m'
        }) 
        res.send({
            success: 1,
            message: 'Login Successfully',
            token: jsontoken
        })
    })
})

router.get('/student', checkToken, (req, res) => {
    connection.query('SELECT * FROM student',
    [], (error, results, fields) => {
        if (error) {
            throw error
        }
        if (results.length == 0) {
            return res.status(400).json({
                success: 0,
                data: 'No Data Found'
            })
        }
        res.send({
            success: 1,
            data: results
        })
    })
})

module.exports = router