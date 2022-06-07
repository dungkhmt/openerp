import React, { useContext, useEffect, useRef, useState } from 'react'
import { Group, Layer, Line, Text } from 'react-konva'
import { updateLocalStorageData } from '../../../../utils/whiteboard/localStorage'
import { SOCKET_IO_EVENTS, EVENT_TYPE, TOOL, KEYS } from '../../../../utils/whiteboard/constants'
import { SocketContext } from '../../../../utils/whiteboard/context/SocketContext'

export const DrawLine = React.memo(({ eventPointer, scale, tool, currentPage }) => {
  const { socket } = useContext(SocketContext)
  const [lines, setLines] = useState([])
  const linesRef = useRef([])

  useEffect(() => {
    socket.on(SOCKET_IO_EVENTS.ON_DRAW_LINE_END, ({ data, currentDrawPage }) => {
      if (currentDrawPage === Number(currentPage)) {
        setLines(data)
        linesRef.current = data
      }
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
      if (typeof drawData.lines !== 'undefined') {
        drawData.lines = updateLocalStorageData(drawData.lines, data, currentPage)
      } else {
        drawData.lines = [{ data, currentPage }]
      }
      localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
    })

    const onChangePage = () => {
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
      if (typeof drawData.lines !== 'undefined') {
        const foundDrawData = drawData.lines.find((item) => Number(item.currentPage) === Number(currentPage))
        if (typeof foundDrawData !== 'undefined') {
          setLines(foundDrawData.data)
          linesRef.current = foundDrawData.data
        } else {
          setLines([])
          linesRef.current = []
        }
      }
    }

    setTimeout(() => onChangePage(), 150)

    socket.on(SOCKET_IO_EVENTS.ON_CHECK_LOCAL_STORAGE, onChangePage)

    return () => {
      socket.off(SOCKET_IO_EVENTS.ON_DRAW_LINE_END)
      socket.off(SOCKET_IO_EVENTS.ON_CHECK_LOCAL_STORAGE)
    }
  }, [currentPage])

  useEffect(() => {
    if (eventPointer.eventType === null || (tool !== TOOL.PEN && tool !== TOOL.ERASER)) {
      return
    }

    if (eventPointer.eventType === EVENT_TYPE.MOUSE_DOWN) {
      const { x, y } = eventPointer.pointerPosition
      linesRef.current = [...linesRef.current, { tool, points: [x, y] }]
      setLines([...lines, { tool, points: [x, y] }])
    } else if (eventPointer.eventType === EVENT_TYPE.MOUSE_MOVE) {
      const { x, y } = eventPointer.pointerPosition
      const lastLine = lines[lines.length - 1]
      // add point
      lastLine.points = lastLine.points.concat([x, y])
      // socket.emit('draw', { x: point?.x, y: point?.y })

      // replace last
      lines.splice(lines.length - 1, 1, lastLine)
      linesRef.current = [...linesRef.current.slice(0, linesRef.current.length - 1), lastLine]
      setLines(lines.concat())
    } else {
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
      if (typeof drawData.lines !== 'undefined') {
        drawData.lines = updateLocalStorageData(drawData.lines, linesRef.current, currentPage)
      } else {
        drawData.lines = [{ data: linesRef.current, currentPage }]
      }
      localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
      socket.emit(SOCKET_IO_EVENTS.DRAW_LINE_END, { data: linesRef.current, currentDrawPage: Number(currentPage) })
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
