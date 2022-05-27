import React, { useEffect, useRef, useState } from 'react'
import { Layer, Stage } from 'react-konva'
import { useWindowSize } from '../../../../utils/whiteboard/hooks/useWindowSize'
import { EVENT_TYPE, KEYS, TOOL } from '../../../../utils/whiteboard/constants'
import { drawLines } from '../../../../utils/whiteboard/drawGrid'
import { DrawLine } from '../Draw/DrawLine'
import { DrawRectangle } from '../Draw/DrawRectangle'
import { DrawCircle } from '../Draw/DrawCircle'
import { DrawText } from '../Draw/DrawText'
import { request } from '../../../../api'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

const scaleBy = 1.05
const MAX_SCALE = 3.125
const MIN_SCALE = 0.25

export const MainBoard = React.memo(() => {
  const { whiteboardId } = useParams()
  const { width, height } = useWindowSize()
  const [stageConfig, setStageConfig] = useState({
    width,
    height,
  })
  const [tool, setTool] = useState(TOOL.RECTANGLE)
  const [scale, setScale] = useState(1)
  const [eventPointer, setEventPointer] = useState({ eventType: null, pointerPosition: { x: 0, y: 0 } })
  const [offset, setOffset] = useState()
  const isDrawing = useRef(false)
  const gridLayerRef = useRef(null)
  const stageRef = useRef(null)
  const parentRef = useRef(null)

  useEffect(() => {
    // add user to whiteboard here
    void (async () => {
      await request("put", `/whiteboards/add-user/${whiteboardId}`, () => {}, {}, {});
      await request("get", `/whiteboards/detail/${whiteboardId}`, (res) => {
        localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, res?.data?.data ?? JSON.stringify({}))
      }, {}, {});
    })()
  }, [])

  useEffect(() => {
    if (gridLayerRef && gridLayerRef.current && stageRef.current) {
      drawLines(gridLayerRef, stageRef.current, width, height)
    }
    const onWindowResize = () => {
      if (parentRef.current) {
        const stageWidth = parentRef.current.offsetWidth;
        const stageHeight = parentRef.current.offsetHeight
        console.log(stageWidth, stageHeight);
        setStageConfig((prev) => ({ ...prev, width: stageWidth, height: stageHeight }))
      }
    }
    onWindowResize()
    window.addEventListener('resize', onWindowResize)

    return () => {
      window.removeEventListener('resize', onWindowResize)
    }
  }, [width])

  useEffect(() => {
    setEventPointer({ eventType: null, pointerPosition: { x: 0, y: 0 } })
  }, [tool])

  const handleMouseDown = (e) => {
    isDrawing.current = true
    let pos = e.target.getStage()?.getPointerPosition()
    if (scale !== 1) {
      pos = e.currentTarget.getRelativePointerPosition()
    }
    setEventPointer({ eventType: EVENT_TYPE.MOUSE_DOWN, pointerPosition: { x: pos?.x, y: pos?.y } })
    setOffset({
      top: stageRef.current?.container().offsetTop,
      left: stageRef.current?.container().offsetLeft,
    })
  }

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return
    }
    const stage = e.target.getStage()
    let point = stage?.getPointerPosition()
    if (scale !== 1) {
      point = e.currentTarget.getRelativePointerPosition()
    }
    setEventPointer({ eventType: EVENT_TYPE.MOUSE_MOVE, pointerPosition: { x: point?.x, y: point?.y } })
  }

  const handleMouseUp = (e) => {
    isDrawing.current = false
    let point = e.target.getStage()?.getPointerPosition()
    if (scale !== 1) {
      point = e.currentTarget.getRelativePointerPosition()
    }
    setEventPointer({ eventType: EVENT_TYPE.MOUSE_UP, pointerPosition: { x: point?.x, y: point?.y } })
  }

  const handleWheel = (e) => {
    e.evt.preventDefault()
    const stage = e.target.getStage()
    // const layer = e.target.g()

    const oldScale = stage?.scaleX()
    const pointer = stage?.getPointerPosition()
    const mousePointTo = {
      x: ((pointer?.x) - Number(stage?.x())) / Number(oldScale),
      y: ((pointer?.y) - Number(stage?.y())) / Number(oldScale),
    }
    // check is zoom in or zoom out
    let direction = e.evt.deltaY > 0 ? 1 : -1
    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction
    }

    const newScale = direction > 0 ? Number(oldScale) * scaleBy : Number(oldScale) / scaleBy
    if (newScale < MIN_SCALE || newScale > MAX_SCALE) {
      return
    }
    stage?.scale({ x: newScale, y: newScale })
    setScale(newScale)
    const newPos = {
      x: (pointer?.x) - mousePointTo.x * newScale,
      y: (pointer?.y) - mousePointTo.y * newScale,
    }
    stage?.position(newPos)

    drawLines(gridLayerRef, stage, width, height)
  }

  const onSetDefaultTool = () => setTool(TOOL.POINTER)

  const onSaveWhiteboardData = async () => {
    // TODO: modify backend API
    const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) ?? '{}')
    const requestBody = {
      whiteboardId,
      data: JSON.stringify(drawData),
    }
    await request("post", "/whiteboards/save", () => {
      toast.success('Save whiteboard content successfully.', {
        position: 'bottom-right',
      })
    }, (error) => console.error(error), requestBody);
  }

  return (
    <>
      <select value={tool} onChange={(e) => setTool(e.target.value)}>
        <option value={TOOL.POINTER}>Pointer</option>
        <option value={TOOL.PEN}>Pen</option>
        <option value={TOOL.RECTANGLE}>Rectangle</option>
        <option value={TOOL.CIRCLE}>Circle</option>
        <option value={TOOL.ERASER}>Eraser</option>
        <option value={TOOL.TEXT}>Text</option>
      </select>
      <button onClick={onSaveWhiteboardData}>Save</button>
      <div style={{ height: "calc(100vh - 64px)" }} ref={parentRef}>
        <Stage
          ref={stageRef}
          width={stageConfig.width}
          height={stageConfig.height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          onWheel={handleWheel}
        >
          <Layer ref={gridLayerRef} draggable={false} x={0} y={0} />
          <DrawLine eventPointer={eventPointer} scale={scale} tool={tool} />
          <DrawRectangle eventPointer={eventPointer} scale={scale} tool={tool} />
          <DrawCircle eventPointer={eventPointer} scale={scale} tool={tool} />
          <DrawText eventPointer={eventPointer} offset={offset} tool={tool} onUpdateTool={onSetDefaultTool} />
        </Stage>
      </div>
    </>
  )
})
