const socketio = require('socket.io');

let io;

const setupWebsocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: "http://localhost:8000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

const getIo = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { setupWebsocket, getIo };