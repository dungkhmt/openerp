import React, { useContext, useEffect, useRef, useState } from 'react'
import { Layer } from 'react-konva'
import { TransformerText } from './TransformerText'
import { updateLocalStorageData } from '../../../../utils/whiteboard/localStorage'
import { KEYS, EVENT_TYPE, TOOL, SOCKET_IO_EVENTS } from '../../../../utils/whiteboard/constants'
import { SocketContext } from '../../../../utils/whiteboard/context/SocketContext'

export const DrawText = React.memo(({ eventPointer, offset, tool, currentPage, onUpdateTool }) => {
  const { socket } = useContext(SocketContext)
  const [annotations, setAnnotations] = useState([])
  const annotationsRef = useRef([])

  useEffect(() => {
    socket.on(SOCKET_IO_EVENTS.ON_ADD_TEXT_END, ({ data, currentDrawPage }) => {
      if(Number(currentDrawPage) === Number(currentPage)) {
        setAnnotations(data)
      }
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
      if (typeof drawData.text !== 'undefined') {
        drawData.text = updateLocalStorageData(drawData.text, data, currentPage)
      } else {
        drawData.text = [{ data, currentPage }]
      }
      localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
    })

    const onChangePage = () => {
      const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
      if (typeof drawData.text !== 'undefined') {
        const foundDrawData = drawData.text.find((item) => Number(item.currentPage) === Number(currentPage))
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
      socket.off(SOCKET_IO_EVENTS.ON_ADD_TEXT_END)
      socket.off(SOCKET_IO_EVENTS.ON_CHECK_LOCAL_STORAGE)
    }
  }, [currentPage])

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
    const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
    if (typeof drawData.text !== 'undefined') {
      drawData.text = updateLocalStorageData(drawData.text, annotationsRef.current, currentPage)
    } else {
      drawData.text = [{ data: annotationsRef.current, currentPage }]
    }
    localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
    socket.emit(SOCKET_IO_EVENTS.ADD_TEXT, { data: annotationsRef.current, currentDrawPage: currentPage })

    onUpdateTool()
  }, [eventPointer])

  const onUpdateText = (updatedAnnotation) => {
    const index = annotations.findIndex((ele) => ele.id === updatedAnnotation.id)
    const newAnnotationArray = [...annotations.slice(0, index), updatedAnnotation, ...annotations.slice(index + 1)]
    setAnnotations(newAnnotationArray)
    annotationsRef.current = newAnnotationArray
    const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
    if (typeof drawData.text !== 'undefined') {
      drawData.text = updateLocalStorageData(drawData.text, newAnnotationArray, currentPage)
    } else {
      drawData.text = [{ data: newAnnotationArray, currentPage }]
    }
    localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
    socket.emit(SOCKET_IO_EVENTS.ADD_TEXT, { data: newAnnotationArray, currentDrawPage: currentPage })
  }

  return (
    <Layer>
      {annotations.map((value) => (
        <TransformerText key={value.id} value={value} offset={offset} tool={tool} onUpdateText={onUpdateText} />
      ))}
    </Layer>
  )
})
