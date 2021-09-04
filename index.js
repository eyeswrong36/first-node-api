require('dotenv').config()
const express = require('express')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000000
    }
})

const app = express()

const port = process.env.PORT
const userRoutes = require('./users/controller')  

app.use('/test', express.static('uploads/images'))
app.post('/upload', upload.single('profile'), (req, res) => {
    console.log(req.file);
    res.send({
        success: 1,
        profile_url: `http://localhost:9000/test/${req.file.filename}`
    })
})
function errHandler (err, req, res, next) {
    if (err instanceof multer.MulterError) {
        console.log(err);
        res.send({
            success: 0,
            message: err.message
        })
    }
}
app.use(errHandler)

app.use('/api', userRoutes)

app.listen(port, () => {
    console.log(`listening to http://localhost:${port}`)
})