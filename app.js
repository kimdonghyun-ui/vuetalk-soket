const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "https://dong-chatbox-client2.herokuapp.com",
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});




io.on('connection', (socket)=> {
    console.log("SOCKETIO connection EVENT: ", socket.id, " client connected");



    socket.on('all_users', (msg) => {
      console.log('all_users');
      io.emit('all_user_update', msg);
    });
  
    socket.on('all_rooms', (msg) => {
      console.log('all_rooms')
      io.emit('all_room_update', msg);
    });
    
    // socket.on('all_msgs', (msg) => {
    //   console.log(msg)
    //   io.emit('all_msgs_update', msg);
    // });



    socket.on('joinRoom', function(msg) {     // joinRoom을 클라이언트가 emit 했을 시
        let roomName = msg;
        console.log('joinRoom',roomName)
        socket.join(roomName);    // 클라이언트를 msg에 적힌 room으로 참여 시킴
    });

    socket.on('leaveRoom', function(msg) {     // joinRoom을 클라이언트가 emit 했을 시
      let roomName = msg;
      console.log('leaveRoom',roomName)
      socket.leave(roomName);    // 클라이언트를 msg에 적힌 room으로 참여 시킴
  });





    socket.on('chatting', function(focusroom,new_msgs) {       // 클라이언트가 채팅 내용을 보냈을 시
      console.log(focusroom)
        
      // 전달한 roomName에 존재하는 소켓 전부에게 broadcast라는 이벤트 emit
        io.to(focusroom).emit('broadcast', new_msgs); 
    })
})








server.listen(port, () => console.log(`Listening on port ${port}`));