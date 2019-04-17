const authController = require('./auth')

module.exports = init = (server) => {
    const io = require('socket.io')(server);
    //handle token verification
    io.use(authController.verifyToken)

    io.on('connection', (socket) => {
        setInterval(() => {
            socket.emit('time', {
                time: Date()
            });
        }, 5000)
    });
}