const express = require('express');
const http = require('http');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Server } = require('socket.io');
require ('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('socket connected:', socket.id);

  socket.on('join_poll', ({ pollId }) => {
    if (!pollId) return;
    const room = `poll:${pollId}`;
    socket.join(room);
    console.log(`socket ${socket.id} joined ${room}`);
  });

  socket.on('leave_poll', ({ pollId }) => {
    if (!pollId) return;
    const room = `poll:${pollId}`;
    socket.leave(room);
    console.log(`socket ${socket.id} left ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected:', socket.id);
  });
});

const usersRouter = require('./routes/users')(prisma);
const pollsRouter = require('./routes/polls')(prisma, io);
const votesRouter = require('./routes/votes')(prisma, io);

app.use('/api/users', usersRouter);
app.use('/api/polls', pollsRouter);
app.use('/api/votes', votesRouter);

app.get('/', (req, res) => res.send('Move37 Polling Backend is running'));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
