import React, { useContext, useEffect, useState, useRef } from 'react'
import { Layer, Rect } from 'react-konva'
import { EVENT_TYPE, TOOL, SOCKET_IO_EVENTS, KEYS, POLLING_INTERVAL } from '../../../../utils/whiteboard/constants'
import { SocketContext } from '../../../../utils/whiteboard/context/SocketContext'

export const DrawRectangle = React.memo(({ eventPointer, scale, tool }) => {
  const { socket } = useContext(SocketContext)
  const [annotations, setAnnotations] = useState([])
  const [newAnnotation, setNewAnnotation] = useState([])
  const annotationsRef = useRef([])

  useEffect(() => {
    socket.on(SOCKET_IO_EVENTS.ON_DRAW_RECT_END, (annotationToAdd) => {
      setAnnotations(annotationToAdd)
      annotationsRef.current = annotationToAdd
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
      drawData.rectangle = annotationToAdd
      localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
    })

    const id = setInterval(() => {
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
      if (typeof drawData.rectangle !== 'undefined') {
        setAnnotations(drawData.rectangle)
        annotationsRef.current = drawData.rectangle
      }
    }, POLLING_INTERVAL)

    return () => {
      socket.off(SOCKET_IO_EVENTS.ON_DRAW_RECT_END)
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    if (eventPointer.eventType === null || tool !== TOOL.RECTANGLE) {
      return
    }
    if (eventPointer.eventType === EVENT_TYPE.MOUSE_DOWN) {
      if (newAnnotation.length === 0) {
        const { x, y } = eventPointer.pointerPosition
        setNewAnnotation([{ x, y, width: 0, height: 0, key: '0', tool }])
      }
    } else if (eventPointer.eventType === EVENT_TYPE.MOUSE_MOVE) {
      if (newAnnotation.length === 1) {
        const { x, y } = eventPointer.pointerPosition
        setNewAnnotation([
          {
            x: newAnnotation[0].x,
            y: newAnnotation[0].y,
            width: x - newAnnotation[0].x,
            height: y - newAnnotation[0].y,
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
          width: x - newAnnotation[0].x,
          height: y - newAnnotation[0].y,
          key: `${annotations.length + 1}`,
          tool,
        }
        setNewAnnotation([])
        setAnnotations((prev) => [...prev, annotationToAdd])
        annotationsRef.current = [...annotationsRef.current, annotationToAdd]
        const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
        drawData.rectangle = annotationsRef.current
        localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
        socket.emit(SOCKET_IO_EVENTS.DRAW_RECT_END, annotationsRef.current)
      }
    }
  }, [eventPointer])

  const annotationsToDraw = [...annotations, ...newAnnotation]

  return (
    <Layer>
      {annotationsToDraw.map((value) => (
        <Rect
          key={value.key}
          x={value.x}
          y={value.y}
          width={value.width}
          height={value.height}
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
