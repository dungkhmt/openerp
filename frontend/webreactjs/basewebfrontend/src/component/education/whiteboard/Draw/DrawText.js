import React, { useContext, useEffect, useRef, useState } from 'react'
import { Group, Layer, Text, Transformer } from 'react-konva'
import { TransformerText } from './TransformerText'
import { updateLocalStorageData } from '../../../../utils/whiteboard/localStorage'
import { KEYS, EVENT_TYPE, TOOL, SOCKET_IO_EVENTS } from '../../../../utils/whiteboard/constants'
import { SocketContext } from '../../../../utils/whiteboard/context/SocketContext'
import { nanoid } from 'nanoid'
import Konva from 'konva'

export const DrawText = React.memo(
  React.forwardRef(
    ({ eventPointer, offset, tool, currentPage, onUpdateTool, whiteboardId, onDrawDone, totalPage }, ref) => {
      const { socket } = useContext(SocketContext)
      const [annotations, setAnnotations] = useState([])
      const textRef = useRef({})
      const transformRef = useRef({})

      useEffect(() => {
        socket.on(SOCKET_IO_EVENTS.ON_ADD_TEXT_END, ({ data, currentDrawPage, currentWhiteboardId }) => {
          if (whiteboardId !== currentWhiteboardId) {
            return
          }
          if (Number(currentDrawPage) === Number(currentPage)) {
            if (
              ref?.getLayers().length > 0 &&
              ref?.getLayers()[4]?.getChildren().length / 2 !== data.length
              // annotations.length === data.length
            ) {
              ref?.getLayers()[4]?.clear()
              ref?.getLayers()[4]?.destroyChildren()
              for (let i = 0; i < data.length; ++i) {
                const newText = new Konva.Text({
                  x: data[i].x,
                  y: data[i].y,
                  width: data[i].width,
                  draggable: tool !== TOOL.POINTER ? false : true,
                  rotation: data[i].rotation,
                  text: data[i].text,
                  verticalAlign: 'bottom',
                  fontSize: data[i].fontSize,
                  fontFamily: data[i].fontFamily,
                  fill: data[i].fill,
                  padding: data[i].padding,
                  align: data[i].align,
                })
                textRef.current[data[i].id] = newText
                // textRef.current[data[i].id].onClick = onClickText
                ref?.getLayers()[4]?.add(newText)

                const newTransform = new Konva.Transformer({
                  boundBoxFunc: function (_, newBox) {
                    newBox.width = Math.max(30, newBox.width)
                    return newBox
                  },
                  rotation: 0,
                  visible: false,
                })
                transformRef.current[data[i].id] = newTransform
                ref?.getLayers()[4]?.add(newTransform)
                newTransform.nodes([newText])

                newText.on('dblclick dbltap', () => onDblClickTextRect(newText, data[i]))
                newText.on('click', () => onClickText(newText, data[i]))
                newText.on('dragend', () => onDragTextEnd(newText, data[i]))
                newText.on('transformend', () => onTextTransformEnd(newText, data[i]))
              }
              ref?.getLayers()[4]?.batchDraw()
            }

            const newTransformRef = {}
            for (const key of Object.keys(transformRef.current)) {
              if (transformRef.current.hasOwnProperty(key)) {
                if (textRef.current[key] !== null) {
                  newTransformRef[key] = transformRef.current[key]
                }
              }
            }
            transformRef.current = newTransformRef
            const newTextRef = {}
            for (const key of Object.keys(textRef.current)) {
              if (textRef.current.hasOwnProperty(key)) {
                if (textRef.current[key] !== null) {
                  newTextRef[key] = textRef.current[key]
                }
              }
            }
            // textRef.current = newTextRef
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

        const onCheckLS = (currentWhiteboardId) => {
          if (whiteboardId !== currentWhiteboardId) {
            return
          }
          const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
          if (typeof drawData.text !== 'undefined') {
            const foundDrawData = drawData.text.find((item) => Number(item.currentPage) === Number(currentPage))
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
        //   console.log('changePage', newPage, changePage)
        //   const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
        //   if (typeof drawData.text !== 'undefined') {
        //     const foundDrawData = drawData.text.find((item) => Number(item.currentPage) === Number(newPage))
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
          socket.off(SOCKET_IO_EVENTS.ON_ADD_TEXT_END)
          socket.off(SOCKET_IO_EVENTS.ON_CHECK_LOCAL_STORAGE)
        }
      }, [currentPage, annotations, totalPage])

      useEffect(() => {
        const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
        if (typeof drawData.text !== 'undefined') {
          const foundDrawData = drawData.text.find((item) => Number(item.currentPage) === Number(currentPage))
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
          id: nanoid(),
          tool,
        }
        const newAnno = [...annotations, annotationToAdd]
        setAnnotations((prev) => [...prev, annotationToAdd])
        // annotationsRef.current = [...annotationsRef.current, annotationToAdd]
        const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
        if (typeof drawData.text !== 'undefined') {
          drawData.text = updateLocalStorageData(drawData.text, newAnno, currentPage)
        } else {
          drawData.text = [{ data: newAnno, currentPage }]
        }
        localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(drawData))
        socket.emit(SOCKET_IO_EVENTS.ADD_TEXT, {
          data: newAnno,
          currentDrawPage: currentPage,
          currentWhiteboardId: whiteboardId,
        })
        onDrawDone(TOOL.TEXT)
        onUpdateTool()
      }, [eventPointer, currentPage])

      const onUpdateText = async (updatedAnnotation) => {
        const index = annotations.findIndex((ele) => ele.id === updatedAnnotation.id)
        const newAnnotationArray = [...annotations.slice(0, index), updatedAnnotation, ...annotations.slice(index + 1)]
        console.log('updateText', index, newAnnotationArray)
        setAnnotations(newAnnotationArray)
        textRef.current[updatedAnnotation.id]?.text(updatedAnnotation.text)
        // annotationsRef.current = newAnnotationArray

        socket.emit(SOCKET_IO_EVENTS.ADD_TEXT, {
          data: newAnnotationArray,
          currentDrawPage: currentPage,
          currentWhiteboardId: whiteboardId,
        })
      }

      // useEffect(() => {
      //   if (tool === TOOL.POINTER) {
      //     for (let i = 0; i < annotations.length; ++i) {
      //       transformRef.current[annotations[i].id]?.nodes([textRef.current[annotations[i].id]])
      //       transformRef.current[annotations[i].id]?.hide()
      //       transformRef.current[annotations[i].id]?.getLayer()?.batchDraw()
      //     }
      //   }
      // }, [tool, annotations])

      const onDragTextEnd = (e, value) => {
        const node = textRef.current[value.id]
        onUpdateText({
          ...value,
          x: node?.x(),
          y: node?.y(),
        })

        // e.setAttrs({
        //   width: e.width() * e.scaleX(),
        //   scaleX: 1,
        // })
        // const newAnnotation: AddTextInterface = {
        //   ...value,
        //   width: e.width() * e.scaleX(),
        // }
        // onUpdateText(newAnnotation)
      }

      const onTextTransformEnd = (e, value) => {
        if (tool !== TOOL.POINTER) {
          return
        }
        const node = textRef.current[value.id]
        const scaleX = node?.scaleX()
        const scaleY = node?.scaleY()

        // we will reset it back
        node?.scaleX(1)
        node?.scaleY(1)
        onUpdateText({
          ...value,
          x: node?.x(),
          y: node?.y(),
          rotation: node?.rotation(),
          // set minimal value
          width: Math.max(5, node?.width() * scaleX),
          height: Math.max(node?.height() * scaleY),
        })
      }

      const onDblClickTextRect = (e, value) => {
        if (tool !== TOOL.POINTER) {
          return
        }

        e.hide()
        transformRef.current[value.id]?.hide()
        // Create text area
        const textPosition = e.absolutePosition()
        const areaPosition = {
          x: textPosition.x,
          y: textPosition.y,
        }
        const textarea = document.createElement('textarea')
        document.body.querySelector('#slider-grand').appendChild(textarea)
        textarea.value = value.text
        textarea.style.position = 'absolute'
        textarea.style.top = `${areaPosition.y}px`
        textarea.style.left = `${areaPosition.x}px`
        textarea.style.width = `${value.width - value.padding * 2}px`
        textarea.style.height = `${value.height - value.padding * 2 + 5}px`
        textarea.style.fontSize = `${value.fontSize}px`
        textarea.style.border = 'none'
        textarea.style.padding = '0px'
        textarea.style.margin = '0px'
        textarea.style.overflow = 'hidden'
        textarea.style.background = 'none'
        textarea.style.outline = 'none'
        textarea.style.resize = 'none'
        textarea.style.fontFamily = value.fontFamily
        textarea.style.transformOrigin = 'left top'
        textarea.style.textAlign = value.align
        textarea.style.color = value.fill
        const rotation = e.rotation()
        let transform = ''
        if (rotation) {
          transform = `rotateZ(${rotation}deg)`
        }

        let px = 0
        // also we need to slightly move textarea on firefox
        // because it jumps a bit
        const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
        if (isFirefox) {
          px += 2 + Math.round(e.fontSize() / 20)
        }
        transform = `translateY(-${px}px)`

        textarea.style.transform = transform

        // reset height
        textarea.style.height = 'auto'
        // after browsers resized it we can set actual value
        textarea.style.height = `${textarea.scrollHeight + 3}px`

        textarea.focus()

        textarea.onchange = (event) => {
          const newAnnotation = {
            ...value,
            x: textPosition.x,
            y: textPosition.y,
            text: event.target.value,
          }
          onUpdateText(newAnnotation)
        }

        function removeTextarea() {
          textarea.parentNode?.removeChild(textarea)
          window.removeEventListener('click', handleOutsideClick)
          e.show()
          console.log('sdebuig', value.id, transformRef.current, transformRef.current[value.id])
          transformRef.current[value.id]?.show()
          // transformRef.current[value.id]?.forceUpdate()
        }

        function setTextareaWidth(newWidth) {
          if (!newWidth) {
            // set width for placeholder
            newWidth = e.placeholder.length * e.fontSize()
          }
          // some extra fixes on different browsers
          const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
          const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
          if (isSafari || isFirefox) {
            newWidth = Math.ceil(newWidth)
          }

          const isEdge = document.documentMode || /Edge/.test(navigator.userAgent)
          if (isEdge) {
            newWidth += 1
          }
          textarea.style.width = `${newWidth}px`
        }

        textarea.addEventListener('keydown', function (event) {
          // hide on enter
          // but don't hide on shift + enter
          if (event.key === 'Enter' && !event.shiftKey) {
            void e.text(textarea.value)
            removeTextarea()
          }
          // on esc do not set value back to node
          if (event.key === 'Esc') {
            removeTextarea()
          }
        })

        textarea.addEventListener('keydown', function () {
          const scale = e.getAbsoluteScale().x
          setTextareaWidth(e.width() * scale)
          textarea.style.height = 'auto'
          textarea.style.height = `${textarea.scrollHeight + e.fontSize()}px`
        })

        function handleOutsideClick(event) {
          if (event.target !== textarea) {
            void e.text(textarea.value)
            removeTextarea()
          }
          onClickText(e, value)
        }
        setTimeout(() => {
          window.addEventListener('click', handleOutsideClick)
        })
      }

      const onClickText = (e, value) => {
        transformRef.current[value.id]?.isVisible()
          ? transformRef.current[value.id]?.hide()
          : transformRef.current[value.id]?.show()
      }
      return (
        <Layer>
          {annotations.map((value) => (
            <TransformerText key={value.id} value={value} offset={offset} tool={tool} onUpdateText={onUpdateText} />
          ))}
        </Layer>
      )
    },
  ),
)
