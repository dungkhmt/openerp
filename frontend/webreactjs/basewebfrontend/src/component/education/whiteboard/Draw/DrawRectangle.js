import React, { useContext, useEffect, useState, useRef } from 'react'
import { Layer, Rect } from 'react-konva'
import { updateLocalStorageData } from '../../../../utils/whiteboard/localStorage'
import { EVENT_TYPE, TOOL, SOCKET_IO_EVENTS, KEYS } from '../../../../utils/whiteboard/constants'
import { SocketContext } from '../../../../utils/whiteboard/context/SocketContext'

export const DrawRectangle = React.memo(({ eventPointer, scale, tool, currentPage, stageContainer }) => {
  const { socket } = useContext(SocketContext)
  const [annotations, setAnnotations] = useState([])
  const [newAnnotation, setNewAnnotation] = useState([])
  const [currentAnnotation, setCurrentAnnotation] = useState(null)
  const annotationsRef = useRef([])

  useEffect(() => {
    socket.on(SOCKET_IO_EVENTS.ON_DRAW_RECT_END, ({ data, currentDrawPage }) => {
      if (currentDrawPage === Number(currentPage)) {
        setAnnotations(data)
        annotationsRef.current = data
      }
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
      if (typeof drawData.rectangle !== 'undefined') {
        drawData.rectangle = updateLocalStorageData(drawData.rectangle, data, currentPage)
      } else {
        drawData.rectangle = [{ data, currentPage }]
      }
      localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
    })

    const onChangePage = () => {
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
      if (typeof drawData.rectangle !== 'undefined') {
        const foundDrawData = drawData.rectangle.find((item) => Number(item.currentPage) === Number(currentPage))
        if (typeof foundDrawData !== 'undefined') {
          setAnnotations(foundDrawData.data)
          annotationsRef.current = foundDrawData.data
        } else {
          setAnnotations([])
          annotationsRef.current = []
        }
      }
    }

    setTimeout(() => onChangePage(), 150)

    socket.on(SOCKET_IO_EVENTS.ON_CHECK_LOCAL_STORAGE, onChangePage)

    return () => {
      socket.off(SOCKET_IO_EVENTS.ON_DRAW_RECT_END)
      socket.off(SOCKET_IO_EVENTS.ON_CHECK_LOCAL_STORAGE)
    }
  }, [currentPage])

  useEffect(() => {
    if (eventPointer.eventType === null || (tool !== TOOL.RECTANGLE && tool !== TOOL.ERASER)) {
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
        const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
        if (typeof drawData.rectangle !== 'undefined') {
          drawData.rectangle = updateLocalStorageData(drawData.rectangle, annotationsRef.current, currentPage)
        } else {
          drawData.rectangle = [{ data: annotationsRef.current, currentPage }]
        }
        localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
        socket.emit(SOCKET_IO_EVENTS.DRAW_RECT_END, { data: annotationsRef.current, currentDrawPage: Number(currentPage)})
      }
    }
  }, [eventPointer])

  useEffect(() => {
    if (stageContainer === null) {
      return
    }
    stageContainer.tabIndex = 1
    stageContainer.focus()

    const listener = (e) => {
      if (e.key === 'Delete' && currentAnnotation !== null) {
        const newAnnotations = annotations.filter((annotation) => annotation.key !== currentAnnotation.key)
        setAnnotations(newAnnotations)
        annotationsRef.current = newAnnotations
        const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
        if (typeof drawData.rectangle !== 'undefined') {
          drawData.rectangle = updateLocalStorageData(drawData.rectangle, annotationsRef.current, currentPage)
        } else {
          drawData.rectangle = [{ data: annotationsRef.current, currentPage }]
        }
        localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
        socket.emit(SOCKET_IO_EVENTS.DRAW_RECT_END, { data: annotationsRef.current, currentDrawPage: Number(currentPage)})
      }
    }

    stageContainer.addEventListener('keydown', listener)

    return () => {
      stageContainer.removeEventListener('keydown', listener)
    }
  }, [stageContainer, currentAnnotation, annotations])

  const onClickRect = (key) => {
    setCurrentAnnotation(annotations.find((item) => item.key === key))
  }

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
          stroke={currentAnnotation !== null && currentAnnotation.key === value.key ? 'red' : '#df4b26'}
          strokeWidth={5 * scale}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation="source-over"
          onClick={() => onClickRect(value.key)}
        />
      ))}
    </Layer>
  )
})
