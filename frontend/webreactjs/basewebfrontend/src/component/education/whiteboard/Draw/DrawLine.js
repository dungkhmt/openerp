import React, { useContext, useEffect, useRef, useState } from 'react'
import { Group, Layer, Line, Text } from 'react-konva'
import { SOCKET_IO_EVENTS, EVENT_TYPE, TOOL, KEYS, POLLING_INTERVAL } from '../../../../utils/whiteboard/constants'
import { SocketContext } from '../../../../utils/whiteboard/context/SocketContext'

export const DrawLine = React.memo(({ eventPointer, scale, tool }) => {
  const { socket } = useContext(SocketContext)
  const [lines, setLines] = useState([])
  const linesRef = useRef([])
  const intervalRef = useRef(null)

  useEffect(() => {
    socket.on(SOCKET_IO_EVENTS.ON_DRAW_LINE_END, (pointsToAdd) => {
      setLines(pointsToAdd)
      linesRef.current = pointsToAdd
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
      drawData.lines = pointsToAdd
      localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
    })

    intervalRef.current = setInterval(() => {
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
      if (typeof drawData.lines !== 'undefined') {
        setLines(drawData.lines)
        linesRef.current = drawData.lines
      }
    }, POLLING_INTERVAL)

    return () => {
      socket.off(SOCKET_IO_EVENTS.ON_DRAW_LINE_END)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (eventPointer.eventType === null || tool !== TOOL.PEN) {
      return
    }

    if (eventPointer.eventType === EVENT_TYPE.MOUSE_DOWN) {
      const { x, y } = eventPointer.pointerPosition
      setLines([...lines, { tool, points: [x, y] }])
    } else if (eventPointer.eventType === EVENT_TYPE.MOUSE_MOVE) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      const { x, y } = eventPointer.pointerPosition
      const lastLine = lines[lines.length - 1]
      // add point
      lastLine.points = lastLine.points.concat([x, y])
      // socket.emit('draw', { x: point?.x, y: point?.y })

      // replace last
      lines.splice(lines.length - 1, 1, lastLine)
      setLines([...lines.slice(0, lines.length - 1), lastLine])
    } else {
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
      linesRef.current = [...linesRef.current, { tool, points: lines[lines.length - 1].points }]
      drawData.lines = linesRef.current
      localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
      socket.emit(SOCKET_IO_EVENTS.DRAW_LINE_END, linesRef.current)
    }

  }, [eventPointer])

  return (
    <Layer>
      <Text text="Just start drawing" x={5} y={30} fontSize={20} />
      <Group>
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="#df4b26"
            strokeWidth={5 * scale}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation={line.tool === TOOL.ERASER ? 'destination-out' : 'source-over'}
          />
        ))}
      </Group>
    </Layer>
  )
})
