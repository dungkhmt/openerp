import React, { useContext, useEffect, useRef, useState } from 'react'
import { Layer } from 'react-konva'
import { TransformerText } from './TransformerText'
import { KEYS, EVENT_TYPE, TOOL, SOCKET_IO_EVENTS, POLLING_INTERVAL } from '../../../../utils/whiteboard/constants'
import { SocketContext } from '../../../../utils/whiteboard/context/SocketContext'

export const DrawText = React.memo(({ eventPointer, offset, tool, onUpdateTool }) => {
  const { socket } = useContext(SocketContext)
  const [annotations, setAnnotations] = useState([])
  const annotationsRef = useRef([])

  useEffect(() => {
    socket.on(SOCKET_IO_EVENTS.ON_ADD_TEXT_END, (annotationToAdd) => {
      setAnnotations(annotationToAdd)
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
      drawData.text = annotationToAdd
      localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
    })

    const id = setInterval(() => {
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
      if (typeof drawData.text !== 'undefined') {
        setAnnotations(drawData.text)
        annotationsRef.current = drawData.text
      }
    }, POLLING_INTERVAL)

    return () => {
      socket.off(SOCKET_IO_EVENTS.ON_ADD_TEXT_END)
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    if (eventPointer.eventType === null || eventPointer.eventType !== EVENT_TYPE.MOUSE_DOWN || tool !== TOOL.TEXT) {
      return
    }

    const { x, y } = eventPointer.pointerPosition
    const annotationToAdd = {
      x,
      y,
      text: 'Enter some text...',
      padding: 5,
      fontSize: 16,
      fontFamily: 'Calibri',
      align: 'center',
      fill: '#000',
      width: 200,
      height: 100,
      rotation: 0,
      id: `${annotations.length + 1}`,
      tool,
    }
    setAnnotations((prev) => [...prev, annotationToAdd])
    annotationsRef.current = [...annotationsRef.current, annotationToAdd]
    const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
    drawData.text = annotationsRef.current 
    localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
    socket.emit(SOCKET_IO_EVENTS.ADD_TEXT, [...annotations, annotationToAdd])

    onUpdateTool()
  }, [eventPointer])

  const onUpdateText = (updatedAnnotation) => {
    const index = annotations.findIndex((ele) => ele.id === updatedAnnotation.id)
    const newAnnotationArray = [...annotations.slice(0, index), updatedAnnotation, ...annotations.slice(index + 1)]
    setAnnotations(newAnnotationArray)
    const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
    drawData.text = newAnnotationArray
    localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
    socket.emit(SOCKET_IO_EVENTS.ADD_TEXT, newAnnotationArray)
  }

  return (
    <Layer>
      {annotations.map((value) => (
        <TransformerText key={value.id} value={value} offset={offset} tool={tool} onUpdateText={onUpdateText} />
      ))}
    </Layer>
  )
})
