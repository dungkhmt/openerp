import React, { useContext, useEffect, useState, useRef } from 'react'
import { Circle, Layer } from 'react-konva'
import { updateLocalStorageData } from '../../../../utils/whiteboard/localStorage'
import { SOCKET_IO_EVENTS, EVENT_TYPE, TOOL, KEYS } from '../../../../utils/whiteboard/constants'
import { SocketContext } from '../../../../utils/whiteboard/context/SocketContext'
import Konva from 'konva'
import { nanoid } from 'nanoid'

export const DrawCircle = React.memo(
  React.forwardRef(
    ({ eventPointer, scale, tool, currentPage, stageContainer, whiteboardId, onDrawDone, totalPage }, ref) => {
      const { socket } = useContext(SocketContext)
      const [annotations, setAnnotations] = useState([])
      const [newAnnotation, setNewAnnotation] = useState([])
      const [currentAnnotation, setCurrentAnnotation] = useState(null)

      useEffect(() => {
        socket.on(SOCKET_IO_EVENTS.ON_DRAW_CIRCLE_END, ({ data, currentDrawPage, currentWhiteboardId }) => {
          if (whiteboardId !== currentWhiteboardId) {
            return
          }
          if (Number(currentPage) === Number(currentDrawPage)) {
            setAnnotations(data)
            if (ref?.getLayers().length > 0 && ref?.getLayers()[3]?.getChildren().length !== data.length) {
              ref?.getLayers()[3]?.clear()
              ref?.getLayers()[3]?.destroyChildren()
              for (let i = 0; i < data.length; ++i) {
                ref?.getLayers()[3]?.add(
                  new Konva.Circle({
                    x: data[i].x,
                    y: data[i].y,
                    radius: data[i].radius,
                    stroke: currentAnnotation !== null && currentAnnotation.key === data[i].key ? 'red' : '#df4b26',
                    strokeWidth: 5 * scale,
                    tension: 0.5,
                    lineCap: 'round',
                    lineJoin: 'round',
                    globalCompositeOperation: 'source-over',
                    onClick: () => onClickCircle(data[i].key),
                  }),
                )
              }
              ref?.getLayers()[3]?.batchDraw()
            }
            // annotationsRef.current = data
          }
          const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
          if (typeof drawData.circle !== 'undefined') {
            drawData.circle = updateLocalStorageData(drawData.circle, data, currentPage)
          } else {
            drawData.circle = [{ data, currentPage }]
          }
          localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
        })

        const onCheckLS = (currentWhiteboardId) => {
          if (whiteboardId !== currentWhiteboardId) {
            return
          }
          const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
          if (typeof drawData.circle !== 'undefined') {
            const foundDrawData = drawData.circle.find((item) => Number(item.currentPage) === Number(currentPage))
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

        // socket.on(SOCKET_IO_EVENTS.ON_ADD_NEW_PAGE, ({ currentWhiteboardId, newPage, changePage }) => {
        //   if (whiteboardId !== currentWhiteboardId || !changePage) {
        //     return
        //   }
        //   const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
        //   if (typeof drawData.circle !== 'undefined') {
        //     const foundDrawData = drawData.circle.find((item) => Number(item.currentPage) === Number(newPage))
        //     if (typeof foundDrawData !== 'undefined') {
        //       setAnnotations(foundDrawData.data)
        //       // annotationsRef.current = foundDrawData.data
        //     } else {
        //       setAnnotations([])
        //       // annotationsRef.current = []
        //     }
        //   }
        // })

        return () => {
          socket.off(SOCKET_IO_EVENTS.ON_DRAW_CIRCLE_END)
          socket.off(SOCKET_IO_EVENTS.ON_CHECK_LOCAL_STORAGE)
          socket.off(SOCKET_IO_EVENTS.ON_CHANGE_PAGE)
        }
      }, [currentPage, totalPage])

      useEffect(() => {
        const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
        if (typeof drawData.circle !== 'undefined') {
          const foundDrawData = drawData.circle.find((item) => Number(item.currentPage) === Number(currentPage))
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
        if (eventPointer.eventType === null || tool !== TOOL.CIRCLE) {
          return
        }
        if (eventPointer.eventType === EVENT_TYPE.MOUSE_DOWN) {
          if (newAnnotation.length === 0) {
            const { x, y } = eventPointer.pointerPosition
            setNewAnnotation([{ x, y, radius: 0, key: nanoid(), tool }])
          }
        } else if (eventPointer.eventType === EVENT_TYPE.MOUSE_MOVE) {
          if (newAnnotation.length === 1) {
            const { x, y } = eventPointer.pointerPosition
            setNewAnnotation([
              {
                x: newAnnotation[0].x,
                y: newAnnotation[0].y,
                radius: Math.sqrt(Math.pow(x - newAnnotation[0].x, 2) + Math.pow(y - newAnnotation[0].y, 2)),
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
              radius: Math.sqrt(Math.pow(x - newAnnotation[0].x, 2) + Math.pow(y - newAnnotation[0].y, 2)),
              key: nanoid(),
              tool,
            }
            setNewAnnotation([])
            const newAnno = [...annotations, annotationToAdd]
            setAnnotations((prev) => [...prev, annotationToAdd])
            // annotationsRef.current = [...annotationsRef.current, annotationToAdd]
            const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
            if (typeof drawData.circle !== 'undefined') {
              drawData.circle = updateLocalStorageData(drawData.circle, newAnno, currentPage)
            } else {
              drawData.circle = [{ data: newAnno, currentPage }]
            }
            localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
            socket.emit(SOCKET_IO_EVENTS.DRAW_CIRCLE_END, {
              data: newAnno,
              currentDrawPage: currentPage,
              currentWhiteboardId: whiteboardId,
            })
            onDrawDone(TOOL.CIRCLE)
          }
        }
      }, [eventPointer, annotations, currentPage])

      useEffect(() => {
        if (!stageContainer) {
          return
        }
        stageContainer.tabIndex = 1
        stageContainer.focus()

        const listener = (e) => {
          if (e.key === 'Delete' && currentAnnotation !== null) {
            const newAnnotations = annotations.filter((annotation) => annotation.key !== currentAnnotation.key)
            setAnnotations(newAnnotations)
            // annotationsRef.current = newAnnotations

            socket.emit(SOCKET_IO_EVENTS.DRAW_CIRCLE_END, {
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
      }, [stageContainer, currentAnnotation, annotations])

      const onClickCircle = (key) => {
        setCurrentAnnotation(annotations.find((item) => item.key === key))
      }

      const annotationsToDraw = [...annotations, ...newAnnotation]

      return (
        <Layer>
          {annotationsToDraw.map((value) => (
            <Circle
              key={value.key}
              x={value.x}
              y={value.y}
              radius={value.radius}
              stroke={currentAnnotation !== null && currentAnnotation.key === value.key ? 'red' : '#df4b26'}
              strokeWidth={5 * scale}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              onClick={() => onClickCircle(value.key)}
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      )
    },
  ),
)
