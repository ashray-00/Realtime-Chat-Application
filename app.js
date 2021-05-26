const express = require('express')
const socketio = require('socket.io')
const Chat = require("./models/ChatSchema")
const connect = require("./dbconnect")
const chatRouter = require("./route/chat")
const bodyParser = require("body-parser")
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use("/chats", chatRouter)

app.get('/', (req,res) => {
    res.render('index')
})

const server = app.listen(process.env.PORT || 3000, () => {
    console.log("server is running")
})

// initializing socket for the server
const io = socketio(server, {'transports': ['websocket', 'polling'], allowEIO3: true})

io.on('connection', socket => {
    console.log("User connected")

    socket.username = "Anonymous"

    socket.on('change_username', data => {
        socket.username = data.username
    })

    //New messages
    socket.on('new_message', data => {
        console.log("new meaage")
        io.sockets.emit('receive_message', {message: data.message, username: socket.username})

        connect.then(db => {
            console.log("Connected to the server")

            let chatMessage = new Chat({message:data.message, sender: socket.username})
            chatMessage.save()
        })
    })

    socket.on('typing', data => {
        socket.broadcast.emit('typing', {username: socket.username})
    })

    socket.on("disconnect", ()=>{
        console.log("User Disconnected")
    })
})