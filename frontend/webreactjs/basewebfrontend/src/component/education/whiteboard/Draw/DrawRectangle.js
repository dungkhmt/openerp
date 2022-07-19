import React, { useContext, useEffect, useState, useRef } from 'react'
import { Layer, Rect } from 'react-konva'
import { updateLocalStorageData } from '../../../../utils/whiteboard/localStorage'
import { EVENT_TYPE, TOOL, SOCKET_IO_EVENTS, KEYS } from '../../../../utils/whiteboard/constants'
import { SocketContext } from '../../../../utils/whiteboard/context/SocketContext'
import Konva from 'konva'
import { nanoid } from 'nanoid'

export const DrawRectangle = React.memo(
  React.forwardRef(
    (
      { eventPointer, scale, tool, currentPage, stageContainer, whiteboardId, onDrawDone, totalPage, strokeDraw },
      ref,
    ) => {
      const { socket } = useContext(SocketContext)
      const [annotations, setAnnotations] = useState([])
      const [newAnnotation, setNewAnnotation] = useState([])
      const [currentAnnotation, setCurrentAnnotation] = useState(null)

      useEffect(() => {
        socket.on(SOCKET_IO_EVENTS.ON_DRAW_RECT_END, ({ data, currentDrawPage, currentWhiteboardId }) => {
          if (whiteboardId !== currentWhiteboardId) {
            return
          }
          if (currentDrawPage === Number(currentPage)) {
            setAnnotations(data)
            if (ref?.getLayers().length > 0 && ref?.getLayers()[2]?.getChildren().length !== data.length) {
              ref?.getLayers()[2]?.clear()
              ref?.getLayers()[2]?.destroyChildren()
              for (let i = 0; i < data.length; ++i) {
                ref?.getLayers()[2]?.add(
                  new Konva.Rect({
                    x: data[i].x,
                    y: data[i].y,
                    width: data[i].width,
                    height: data[i].height,
                    stroke: currentAnnotation !== null && currentAnnotation.key === data[i].key ? 'red' : data[i].color,
                    strokeWidth: data[i].strokeWidth * scale,
                    tension: 0.5,
                    lineCap: 'round',
                    lineJoin: 'round',
                    globalCompositeOperation: 'source-over',
                    onClick: () => onClickRect(data[i].key),
                  }),
                )
              }
              ref?.getLayers()[2]?.batchDraw()
            }
            // annotationsRef.current = data
          }
          const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
          if (typeof drawData.rectangle !== 'undefined') {
            drawData.rectangle = updateLocalStorageData(drawData.rectangle, data, currentPage)
          } else {
            drawData.rectangle = [{ data, currentPage }]
          }
          localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
        })

        const onCheckLS = (currentWhiteboardId) => {
          if (whiteboardId !== currentWhiteboardId) {
            return
          }
          const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
          if (typeof drawData.rectangle !== 'undefined') {
            const foundDrawData = drawData.rectangle.find((item) => Number(item.currentPage) === Number(currentPage))
            if (typeof foundDrawData !== 'undefined') {
              setAnnotations(foundDrawData.data)
              // annotationsRef.current = foundDrawData.data
            } else {
              setAnnotations([])
              // annotationsRef.current = []
            }
          }
        }

        setTimeout(() => onCheckLS(), 150)

        socket.on(SOCKET_IO_EVENTS.ON_CHECK_LOCAL_STORAGE, ({ currentWhiteboardId }) => onCheckLS(currentWhiteboardId))

        return () => {
          socket.off(SOCKET_IO_EVENTS.ON_DRAW_RECT_END)
          // socket.off(SOCKET_IO_EVENTS.ON_CHECK_LOCAL_STORAGE)
          // socket.off(SOCKET_IO_EVENTS.ON_ADD_NEW_PAGE)
        }
      }, [currentPage, whiteboardId, annotations, socket, totalPage])

      useEffect(() => {
        const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
        if (typeof drawData.rectangle !== 'undefined') {
          const foundDrawData = drawData.rectangle.find((item) => Number(item.currentPage) === Number(currentPage))
          if (typeof foundDrawData !== 'undefined') {
            setAnnotations(foundDrawData.data)
            // annotationsRef.current = foundDrawData.data
          } else {
            setAnnotations([])
            // annotationsRef.current = []
          }
        }
      }, [currentPage])

      useEffect(() => {
        if (eventPointer.eventType === null || (tool !== TOOL.RECTANGLE && tool !== TOOL.ERASER)) {
          return
        }
        if (eventPointer.eventType === EVENT_TYPE.MOUSE_DOWN) {
          if (newAnnotation.length === 0) {
            const { x, y } = eventPointer.pointerPosition
            setNewAnnotation([
              {
                x,
                y,
                width: 0,
                height: 0,
                key: nanoid(),
                tool,
                page: currentPage,
                color: strokeDraw.color,
                strokeWidth: strokeDraw.strokeWidth,
              },
            ])
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
                color: strokeDraw.color,
                strokeWidth: strokeDraw.strokeWidth,
                key: nanoid(),
                tool,
              },
            ])
          }
        } else if (eventPointer.eventType === EVENT_TYPE.MOUSE_UP) {
          if (newAnnotation.length === 1) {
            const { x, y } = eventPointer.pointerPosition
            const annotationToAdd = {
              x: newAnnotation[0].x,
              y: newAnnotation[0].y,
              width: x - newAnnotation[0].x,
              height: y - newAnnotation[0].y,
              color: strokeDraw.color,
              strokeWidth: strokeDraw.strokeWidth,
              key: nanoid(),
              tool,
            }
            setNewAnnotation([])
            const newAnno = [...annotations, annotationToAdd]
            setAnnotations((prev) => [...prev, annotationToAdd])
            // annotationsRef.current = [...annotationsRef.current, annotationToAdd]
            const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
            if (typeof drawData.rectangle !== 'undefined') {
              drawData.rectangle = updateLocalStorageData(drawData.rectangle, newAnno, currentPage)
            } else {
              drawData.rectangle = [{ data: newAnno, currentPage }]
            }
            localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
            socket.emit(SOCKET_IO_EVENTS.DRAW_RECT_END, {
              data: newAnno,
              currentDrawPage: Number(currentPage),
              currentWhiteboardId: whiteboardId,
            })
            onDrawDone(TOOL.RECTANGLE)
          }
        }
      }, [eventPointer, annotations, currentPage])

      useEffect(() => {
        if (!stageContainer && tool !== TOOL.ERASER) {
          return
        }
        stageContainer.tabIndex = 1
        stageContainer.focus()

        const listener = (e) => {
          if (e.key === 'Delete' && currentAnnotation !== null) {
            const newAnnotations = annotations.filter((annotation) => annotation.key !== currentAnnotation.key)
            setAnnotations(newAnnotations)
            setCurrentAnnotation(null)
            // annotationsRef.current = newAnnotations

            const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
            if (typeof drawData.rectangle !== 'undefined') {
              drawData.rectangle = updateLocalStorageData(drawData.rectangle, newAnnotations, currentPage)
            } else {
              drawData.rectangle = [{ data: newAnnotations, currentPage }]
            }
            localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))

            socket.emit(SOCKET_IO_EVENTS.DRAW_RECT_END, {
              data: newAnnotations,
              currentDrawPage: Number(currentPage),
              currentWhiteboardId: whiteboardId,
            })
          }
        }

        stageContainer.addEventListener('keydown', listener)

        return () => {
          stageContainer.removeEventListener('keydown', listener)
        }
      }, [stageContainer, currentAnnotation, tool])

      const onClickRect = (key) => {
        setCurrentAnnotation(annotations.find((item) => item.key === key))
      }

      const annotationsToDraw = [...annotations, ...newAnnotation]

      if (annotationsToDraw.length === 0) {
        return null
      }

      return (
        <Layer>
          {annotationsToDraw.map((value) => (
            <Rect
              key={value.key}
              x={value.x}
              y={value.y}
              width={value.width}
              height={value.height}
              stroke={currentAnnotation !== null && currentAnnotation.key === value.key ? 'red' : value.color}
              strokeWidth={value.strokeWidth * scale}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation="source-over"
              onClick={() => onClickRect(value.key)}
            />
          ))}
        </Layer>
      )
    },
  ),
)
