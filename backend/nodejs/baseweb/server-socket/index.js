import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { SOCKET_IO_EVENTS } from './src/utils/constants.js' 

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

app.use(cors())

io.on("connection", async (socket) => {
  console.log(`${socket.id} has connected`)

  socket.on(SOCKET_IO_EVENTS.CONNECT_TO_WHITEBOARD, async ({ currentWhiteboardId }) => {
    await socket.join(currentWhiteboardId)
  })

  socket.on(SOCKET_IO_EVENTS.CONNECT_TO_WHITEBOARD_PAGE, async ({ whiteboardPageId }) => {
    await socket.join(whiteboardPageId)
  })

  socket.on(SOCKET_IO_EVENTS.DRAW_LINE_END, (data) => {
    socket.in(data.whiteboardPageId).emit(SOCKET_IO_EVENTS.ON_DRAW_LINE_END, data)
  })

  socket.on(SOCKET_IO_EVENTS.DRAW_RECT_END, (data) => {
    socket.in(data.whiteboardPageId).emit(SOCKET_IO_EVENTS.ON_DRAW_RECT_END, data)
  })

  socket.on(SOCKET_IO_EVENTS.DRAW_CIRCLE_END, (data) => {
    socket.in(data.whiteboardPageId).emit(SOCKET_IO_EVENTS.ON_DRAW_CIRCLE_END, data)
  })

  socket.on(SOCKET_IO_EVENTS.ADD_TEXT, (data) => {
    socket.in(data.whiteboardPageId).emit(SOCKET_IO_EVENTS.ON_ADD_TEXT_END, data)
  })

  socket.on(SOCKET_IO_EVENTS.ADD_NEW_PAGE, (data) => {
    socket.in(data.currentWhiteboardId).emit(SOCKET_IO_EVENTS.ON_ADD_NEW_PAGE, data)
  })

  socket.on(SOCKET_IO_EVENTS.DELETE_PAGE, (data) => {
    socket.in(data.currentWhiteboardId).emit(SOCKET_IO_EVENTS.ON_DELETE_PAGE, data)
  })

  socket.on(SOCKET_IO_EVENTS.CHECK_LOCAL_STORAGE, (data) => {
    io.in(data.currentWhiteboardId).emit(SOCKET_IO_EVENTS.ON_CHECK_LOCAL_STORAGE, data)
  })

  socket.on(SOCKET_IO_EVENTS.REQUEST_DRAW, (data) => {
    socket.in(data.currentWhiteboardId).emit(SOCKET_IO_EVENTS.ON_REQUEST_DRAW, data)
  })

  socket.on(SOCKET_IO_EVENTS.CHANGE_STROKE_DRAW, (data) => {
    socket.in(data.currentWhiteboardId).emit(SOCKET_IO_EVENTS.ON_CHANGE_STROKE_DRAW, data)
  })

  socket.on('disconnect', () => {
    console.log(`${socket.id} is disconnected`)
  })
})

app.get('/', (_, res) => res.send('Hello bro'))

const PORT = process.env.PORT || 8080
httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`))
