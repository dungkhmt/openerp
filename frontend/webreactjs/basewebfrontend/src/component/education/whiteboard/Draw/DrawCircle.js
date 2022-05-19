import React, { useContext, useEffect, useState, useRef } from 'react'
import { Circle, Layer } from 'react-konva'
import { SOCKET_IO_EVENTS, EVENT_TYPE, TOOL, KEYS, POLLING_INTERVAL } from '../../../../utils/whiteboard/constants'
import { SocketContext } from '../../../../utils/whiteboard/context/SocketContext'

export const DrawCircle = React.memo(({ eventPointer, scale, tool }) => {
  const { socket } = useContext(SocketContext)
  const [annotations, setAnnotations] = useState([])
  const [newAnnotation, setNewAnnotation] = useState([])
  const annotationsRef = useRef([])

  useEffect(() => {
    socket.on(SOCKET_IO_EVENTS.ON_DRAW_CIRCLE_END, (annotationToAdd) => {
      setAnnotations(annotationToAdd)
      annotationsRef.current = annotationToAdd
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
      drawData.circle = annotationToAdd
      localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
    })

    const id = setInterval(() => {
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
      if (typeof drawData.circle !== 'undefined') {
        setAnnotations(drawData.circle)
        annotationsRef.current = drawData.circle
      }
    }, POLLING_INTERVAL)

    return () => {
      socket.off(SOCKET_IO_EVENTS.ON_DRAW_CIRCLE_END)
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    if (eventPointer.eventType === null || tool !== TOOL.CIRCLE) {
      return
    }
    if (eventPointer.eventType === EVENT_TYPE.MOUSE_DOWN) {
      if (newAnnotation.length === 0) {
        const { x, y } = eventPointer.pointerPosition
        setNewAnnotation([{ x, y, radius: 0, key: '0', tool }])
      }
    } else if (eventPointer.eventType === EVENT_TYPE.MOUSE_MOVE) {
      if (newAnnotation.length === 1) {
        const { x, y } = eventPointer.pointerPosition
        setNewAnnotation([
          {
            x: newAnnotation[0].x,
            y: newAnnotation[0].y,
            radius: Math.sqrt(Math.pow(x - newAnnotation[0].x, 2) + Math.pow(y - newAnnotation[0].y, 2)),
            key: '0',
            tool,
          },
        ])
      }
    } else {
      if (newAnnotation.length === 1) {
        const { x, y } = eventPointer.pointerPosition
        const annotationToAdd = {
          x: newAnnotation[0].x,
          y: newAnnotation[0].y,
          radius: Math.sqrt(Math.pow(x - newAnnotation[0].x, 2) + Math.pow(y - newAnnotation[0].y, 2)),
          key: `${annotations.length + 1}`,
          tool,
        }
        setNewAnnotation([])
        setAnnotations((prev) => [...prev, annotationToAdd])
        annotationsRef.current = [...annotationsRef.current, annotationToAdd]
        const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
        drawData.circle = annotationsRef.current
        localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
        socket.emit(SOCKET_IO_EVENTS.DRAW_CIRCLE_END, annotationsRef.current)
      }
    }
  }, [eventPointer])

  const annotationsToDraw = [...annotations, ...newAnnotation]

  return (
    <Layer>
      {annotationsToDraw.map((value) => (
        <Circle
          key={value.key}
          x={value.x}
          y={value.y}
          radius={value.radius}
          stroke="#df4b26"
          strokeWidth={5 * scale}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation={value.tool === TOOL.ERASER ? 'destination-out' : 'source-over'}
        />
      ))}
    </Layer>
  )
})
