import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import dotenv from 'dotenv'
import cors from 'cors'
import { SOCKET_IO_EVENTS } from '@utils/constants'

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

let connections = []

io.on('connect', (socket) => {
  connections.push(socket)
  console.log(`${socket.id} has connected`)

  socket.on(SOCKET_IO_EVENTS.DRAW_LINE_END, (data) => {
    connections.forEach((connection) => {
      if (connection.id !== socket.id) {
        connection.emit(SOCKET_IO_EVENTS.ON_DRAW_LINE_END, data)
      }
    })
  })

  socket.on(SOCKET_IO_EVENTS.DRAW_RECT_END, (data) => {
    connections.forEach((connection) => {
      if (connection.id !== socket.id) {
        connection.emit(SOCKET_IO_EVENTS.ON_DRAW_RECT_END, data)
      }
    })
  })

  socket.on(SOCKET_IO_EVENTS.DRAW_CIRCLE_END, (data) => {
    connections.forEach((connection) => {
      if (connection.id !== socket.id) {
        connection.emit(SOCKET_IO_EVENTS.ON_DRAW_CIRCLE_END, data)
      }
    })
  })

  socket.on(SOCKET_IO_EVENTS.ADD_TEXT, (data) => {
    connections.forEach((connection) => {
      if (connection.id !== socket.id) {
        connection.emit(SOCKET_IO_EVENTS.ON_ADD_TEXT_END, data)
      }
    })
  })

  socket.on('disconnect', () => {
    console.log(`${socket.id} is disconnected`)
    connections = connections.filter((connection) => connection.id !== socket.id)
  })
})

app.get('/', (_, res) => res.send('Hello bro'))

const PORT = process.env.PORT ?? 8080
httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`))
