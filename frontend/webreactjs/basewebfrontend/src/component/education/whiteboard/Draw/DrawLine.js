import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Group, Layer, Line, Text } from 'react-konva'
import { updateLocalStorageData } from '../../../../utils/whiteboard/localStorage'
import { SOCKET_IO_EVENTS, EVENT_TYPE, TOOL, KEYS } from '../../../../utils/whiteboard/constants'
import { SocketContext } from '../../../../utils/whiteboard/context/SocketContext'
import Konva from 'konva'
import { nanoid } from 'nanoid'

export const DrawLine = React.memo(
  React.forwardRef(
    ({ eventPointer, scale, tool, currentPage, whiteboardId, onDrawDone, totalPage, strokeDraw }, ref) => {
      const { socket } = useContext(SocketContext)
      const [lines, setLines] = useState([])

      useEffect(() => {
        socket.on(SOCKET_IO_EVENTS.ON_DRAW_LINE_END, ({ data, currentDrawPage, currentWhiteboardId }) => {
          if (whiteboardId !== currentWhiteboardId) {
            return
          }
          if (currentDrawPage === Number(currentPage)) {
            setLines(data)
            // layerRef.current?.batchDraw()
            if (ref?.getLayers().length > 0 && ref?.getLayers()[1]?.getChildren().length !== data.length) {
              ref?.getLayers()[1]?.clear()
              ref?.getLayers()[1]?.destroyChildren()
              for (let i = 0; i < data.length; ++i) {
                ref?.getLayers()[1]?.add(
                  new Konva.Line({
                    points: data[i].points,
                    stroke: data[i].strokeDraw.color,
                    strokeWidth: data[i].strokeDraw.strokeWidth * scale,
                    tension: 0.5,
                    lineCap: 'round',
                    lineJoin: 'round',
                    globalCompositeOperation: data[i].tool === TOOL.ERASER ? 'destination-out' : 'source-over',
                  }),
                )
              }
              ref?.getLayers()[1]?.batchDraw()
              // ref?.getLayers()[1]?.draw()
              // ref?.getLayer()?.batchDraw()
            }
            // linesRef.current = data
          }
          const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
          if (typeof drawData.lines !== 'undefined') {
            drawData.lines = updateLocalStorageData(drawData.lines, data, currentPage)
          } else {
            drawData.lines = [{ data, currentPage }]
          }
          localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
        })

        const onCheckLS = (currentWhiteboardId) => {
          console.log('onCheckLS', currentWhiteboardId)
          if (whiteboardId !== currentWhiteboardId) {
            return
          }
          const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
          console.log('drawData-socket', drawData)
          if (typeof drawData.lines !== 'undefined') {
            const foundDrawData = drawData.lines.find((item) => Number(item.currentPage) === Number(currentPage))
            if (typeof foundDrawData !== 'undefined') {
              setLines(foundDrawData.data)
              // linesRef.current = foundDrawData.data
            } else {
              setLines([])
              // linesRef.current = []
            }
          }
        }

        // onCheckLS()

        socket.on(SOCKET_IO_EVENTS.ON_CHECK_LOCAL_STORAGE, ({ currentWhiteboardId }) => onCheckLS(currentWhiteboardId))

        return () => {
          socket.off(SOCKET_IO_EVENTS.ON_DRAW_LINE_END)
          // socket.off(SOCKET_IO_EVENTS.ON_CHECK_LOCAL_STORAGE)
        }
      }, [currentPage, totalPage])

      useEffect(() => {
        const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
        console.log('drawData', drawData)
        if (typeof drawData.lines !== 'undefined') {
          const foundDrawData = drawData.lines.find((item) => Number(item.currentPage) === Number(currentPage))
          if (typeof foundDrawData !== 'undefined') {
            setLines(foundDrawData.data)
            // linesRef.current = foundDrawData.data
          } else {
            setLines([])
            // linesRef.current = []
          }
        }
      }, [currentPage])

      // useEffect(() => {
      //   if (ref) {
      //     if (ref?.getLayers().length > 0) {
      //       ref?.getLayers()[1]?.clear()
      //       ref?.getLayers()[1]?.destroyChildren()
      //       for (let i = 0; i < lines.length; ++i) {
      //         ref?.getLayers()[1]?.add(
      //           new Konva.Line({
      //             points: lines.points,
      //             stroke: "#df4b26",
      //             strokeWidth: 5 * scale,
      //             tension: 0.5,
      //             lineCap: "round",
      //             lineJoin: "round",
      //             globalCompositeOperation: lines[i].tool === TOOL.ERASER ? 'destination-out' : 'source-over',
      //           })
      //           )
      //       }
      //       ref?.getLayers()[1]?.batchDraw()
      //       ref?.getLayers()[1]?.draw()
      //       ref?.getLayer()?.batchDraw()
      //     }
      //   }
      // }, [lines, ref])

      useEffect(() => {
        if (eventPointer.eventType === null || (tool !== TOOL.PEN && tool !== TOOL.ERASER)) {
          return
        }

        if (eventPointer.eventType === EVENT_TYPE.MOUSE_DOWN) {
          const { x, y } = eventPointer.pointerPosition
          // linesRef.current = [...linesRef.current, { tool, points: [x, y] }]
          setLines([...lines, { tool, points: [x, y], strokeDraw, key: nanoid() }])
        } else if (eventPointer.eventType === EVENT_TYPE.MOUSE_MOVE) {
          const { x, y } = eventPointer.pointerPosition
          const lastLine = lines[lines.length - 1]
          // add point
          lastLine.points = [...lastLine.points, x, y]
          // socket.emit('draw', { x: point?.x, y: point?.y })

          // replace last
          const newLines = JSON.parse(JSON.stringify(lines))
          newLines.splice(lines.length - 1, 1, lastLine)
          // linesRef.current = [...linesRef.current.slice(0, linesRef.current.length - 1), lastLine]
          setLines(newLines)
        } else if (eventPointer.eventType === EVENT_TYPE.MOUSE_UP) {
          const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
          if (typeof drawData.lines !== 'undefined') {
            drawData.lines = updateLocalStorageData(drawData.lines, lines, currentPage)
          } else {
            drawData.lines = [{ data: lines, currentPage }]
          }
          localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
          socket.emit(SOCKET_IO_EVENTS.DRAW_LINE_END, {
            data: lines,
            currentDrawPage: Number(currentPage),
            currentWhiteboardId: whiteboardId,
          })
          onDrawDone(TOOL.PEN)
        }
      }, [eventPointer, currentPage, strokeDraw])

      // console.log(ref)

      return (
        <Layer>
          <Group>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.strokeDraw.color}
                strokeWidth={line.strokeDraw.strokeWidth * scale}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={line.tool === TOOL.ERASER ? 'destination-out' : 'source-over'}
              />
            ))}
          </Group>
        </Layer>
      )
    },
  ),
)
