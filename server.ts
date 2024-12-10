import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId, userId, username }) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        participants: new Map(),
        votes: new Map(),
        revealed: false
      });
    }
    
    const room = rooms.get(roomId);
    room.participants.set(userId, { username, socketId: socket.id });
    
    socket.to(roomId).emit('userJoined', { userId, username });
    
    // Send current room state to the new participant
    socket.emit('sessionState', {
      participants: Array.from(room.participants.entries()),
      votes: Array.from(room.votes.entries()),
      revealed: room.revealed
    });
  });

  socket.on('leaveRoom', ({ roomId, userId }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.participants.delete(userId);
      room.votes.delete(userId);
      socket.to(roomId).emit('userLeft', userId);
      
      if (room.participants.size === 0) {
        rooms.delete(roomId);
      }
    }
    socket.leave(roomId);
  });

  socket.on('vote', ({ roomId, userId, username, value }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.votes.set(userId, { username, value });
      io.to(roomId).emit('vote', { userId, username, value });
    }
  });

  socket.on('revealVotes', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.revealed = true;
      io.to(roomId).emit('revealVotes');
    }
  });

  socket.on('resetVotes', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.votes.clear();
      room.revealed = false;
      io.to(roomId).emit('resetVotes');
    }
  });

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) {
        const room = rooms.get(roomId);
        if (room) {
          const userId = Array.from(room.participants.entries())
            .find(([, data]) => data.socketId === socket.id)?.[0];
            
          if (userId) {
            room.participants.delete(userId);
            room.votes.delete(userId);
            socket.to(roomId).emit('userLeft', userId);
            
            if (room.participants.size === 0) {
              rooms.delete(roomId);
            }
          }
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});