const createError = require('http-errors')
const express = require('express')
const path = require('path')
const http = require('http');
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const authRouter = require('./routes/auth')
const authController = require('./controllers/auth')

const app = express()
app.server = http.createServer(app)
const io = require('socket.io')(app.server);


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

io.use(authController.verifyToken)
app.use('/', authRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})


app.use((err, req, res, next) => {
    const error = {
        status: err.status || 500,
        message: err.message || 'Server Error',
    };
    res.status(err.status).json(error);
});

io.on('connection', (socket) => {
    setInterval(() => {
        socket.emit('time', {
            time: Date()
        });
    }, 5000)
});

const listener = app.server.listen(process.env.PORT || 3000, '127.0.0.1', () => {
    console.log(`Server started on  http://${listener.address().address + ':' + listener.address().port}`);
});

