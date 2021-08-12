const express = require("express");
const socket = require("socket.io");

const app = express();

const server = app.listen(3000);

app.use(express.static('public'));

const io = socket(server) // izliyeceği serveri veriyoruz

io.on("connection",(socket) => { 

    socket.on('chat', data => {
        
        io.sockets.emit('chat',data) // veriyi bütün clientlere dağıtıyor
    })
})
