import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Stage } from 'react-konva'
import { useWindowSize } from '../../../../utils/whiteboard/hooks/useWindowSize'
import { EVENT_TYPE, KEYS, SOCKET_IO_EVENTS, TOOL } from '../../../../utils/whiteboard/constants'
import { drawLines } from '../../../../utils/whiteboard/drawGrid'
import { DrawLine } from '../Draw/DrawLine'
import { DrawRectangle } from '../Draw/DrawRectangle'
import { DrawCircle } from '../Draw/DrawCircle'
import { DrawText } from '../Draw/DrawText'
import { request } from '../../../../api'
import { useHistory, useParams } from 'react-router'
import { toast } from 'react-toastify'
import Slider from "react-slick";
import { useQueryString } from 'utils/whiteboard/hooks/useQueryString'
import { SocketContext } from '../../../../utils/whiteboard/context/SocketContext'
import { mergeDrawData } from '../../../../utils/whiteboard/localStorage'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const scaleBy = 1.05
const MAX_SCALE = 3.125
const MIN_SCALE = 0.25

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    />
  );
}

export const MainBoard = React.memo(() => {
  const { socket } = useContext(SocketContext)
  const { whiteboardId } = useParams()
  const history = useHistory()
  const queryString = useQueryString()
  const { width, height } = useWindowSize()

  const [pages, setPages] = useState([{ id: 1 }])
  const [stageConfig, setStageConfig] = useState({
    width,
    height,
  })
  const [tool, setTool] = useState(TOOL.RECTANGLE)
  const [scale, setScale] = useState(1)
  const [eventPointer, setEventPointer] = useState({
    [TOOL.PEN]: { eventType: null, pointerPosition: { x: 0, y: 0 } },
    [TOOL.RECTANGLE]: { eventType: null, pointerPosition: { x: 0, y: 0 } },
    [TOOL.CIRCLE]: { eventType: null, pointerPosition: { x: 0, y: 0 } },
    [TOOL.TEXT]: { eventType: null, pointerPosition: { x: 0, y: 0 } },
  })
  const [offset, setOffset] = useState()
  const isDrawing = useRef(false)
  const gridLayerRef = useRef(null)
  const stageRef = useRef(null)
  const parentRef = useRef(null)
  const slideRef = useRef(null)

  useEffect(() => {
    socket.on(SOCKET_IO_EVENTS.ON_ADD_NEW_PAGE, ({ newPage }) => {
      setPages((prev) => [...prev, newPage])
      history.push(`?page=${newPage.id}`)
      if (slideRef.current) {
        slideRef.current.slickGoTo(newPage.id)
      }
    })
    // add user to whiteboard here
    void (async () => {
      await request("put", `/whiteboards/add-user/${whiteboardId}`, () => {}, {}, {});
      await request("get", `/whiteboards/detail/${whiteboardId}`, (res) => {
        const currentPage = res?.data?.totalPage || 1
        const newPages = []
        for (let i = 1; i <= currentPage; ++i) {
          newPages.push({ id: i })
        }
        setPages(newPages)
        if (slideRef.current) {
          slideRef.current.slickGoTo(currentPage)
        }

        const drawingData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE))
        if (!drawingData || (typeof drawingData.whiteboardId !== "undefined" && drawingData.whiteboardId !== whiteboardId)) {
          localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify({ whiteboardId, ...JSON.parse(res?.data?.data || '{}') }))
          socket.emit(SOCKET_IO_EVENTS.CHECK_LOCAL_STORAGE)
          return
        }
        const totalData = JSON.parse(res?.data?.data) || { lines: [], rectangle: [], circle: [], text: [] }
        totalData.whiteboardId = whiteboardId
        totalData.lines = mergeDrawData(drawingData.lines || [], totalData.lines || [])
        totalData.rectangle = mergeDrawData(drawingData.rectangle || [], totalData.rectangle || [])
        totalData.circle = mergeDrawData(drawingData.circle || [], totalData.circle || [])
        totalData.text = mergeDrawData(drawingData.text || [], totalData.text || [])

        localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(totalData))
        socket.emit(SOCKET_IO_EVENTS.CHECK_LOCAL_STORAGE)
        /* format: {
         lines: [{ currentPage: 1, data: [{ x: 0, y: 0 }, { x: 0, y: 0 }] }],
         rectangles: [{ currentPage: 1, data: [{ x: 0, y: 0 }, { x: 0, y: 0 }] }],
         circles: [{ currentPage: 1, data: [{ x: 0, y: 0 }, { x: 0, y: 0 }] }],
         texts: [{ currentPage: 1, ] }],
        } */
        // setPages(res?.data?.data?.pages || [])
      }, {}, {});
    })()
  }, []) 

  useEffect(() => {
    const onWindowResize = () => {
      if (parentRef.current) {
        const stageWidth = parentRef.current.offsetWidth;
        const stageHeight = parentRef.current.offsetHeight;
        setStageConfig((prev) => ({ ...prev, width: stageWidth, height: stageHeight }))
      }
    }
    onWindowResize()
    window.addEventListener('resize', onWindowResize)

    return () => {
      window.removeEventListener('resize', onWindowResize)
    }
  }, [width, height])

  useEffect(() => {
    setEventPointer({
      [TOOL.PEN]: { eventType: null, pointerPosition: { x: 0, y: 0 } },
      [TOOL.RECTANGLE]: { eventType: null, pointerPosition: { x: 0, y: 0 } },
      [TOOL.CIRCLE]: { eventType: null, pointerPosition: { x: 0, y: 0 } },
      [TOOL.TEXT]: { eventType: null, pointerPosition: { x: 0, y: 0 } },
    })
  }, [tool])

  useEffect(() => {
    if (gridLayerRef && gridLayerRef.current && stageRef.current) {
      drawLines(gridLayerRef, stageRef.current, width, height)
    }
  }, [pages.length, width, height, scale])

  const handleMouseDown = (e) => {
    isDrawing.current = true
    let pos = e.target.getStage()?.getPointerPosition()
    if (scale !== 1) {
      pos = e.currentTarget.getRelativePointerPosition()
    }
    setEventPointer(prev => ({ ...prev, [tool]: { eventType: EVENT_TYPE.MOUSE_DOWN, pointerPosition: { x: pos?.x, y: pos?.y } }}))
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
    setEventPointer(prev => ({ ...prev, [tool]: { eventType: EVENT_TYPE.MOUSE_MOVE, pointerPosition: { x: point?.x, y: point?.y } }}))
  }

  const handleMouseUp = (e) => {
    isDrawing.current = false
    let point = e.target.getStage()?.getPointerPosition()
    if (scale !== 1) {
      point = e.currentTarget.getRelativePointerPosition()
    }
    setEventPointer(prev => ({ ...prev, [tool]: { eventType: EVENT_TYPE.MOUSE_MOUSE_UPMOVE, pointerPosition: { x: point?.x, y: point?.y } }}))
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
    const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
    const requestBody = {
      whiteboardId,
      data: JSON.stringify(drawData),
      totalPage: queryString.get("page"),
    }
    await request("post", "/whiteboards/save", () => {
      toast.success('Save whiteboard content successfully.', {
        position: 'bottom-right',
      })
    }, (error) => console.error(error), requestBody);
  }

  const onAddNewPage = () => {
    if (tool !== TOOL.POINTER) {
      toast.info('You need to change tool to pointer')
      return
    }
    const currentPagesLength = pages.length
    slideRef.current.slickGoTo(currentPagesLength + 1)
    // slideRef.current.
    socket.emit(SOCKET_IO_EVENTS.ADD_NEW_PAGE, { newPage: { id: currentPagesLength + 1 } })
    setPages(prev => [...prev, { id: currentPagesLength + 1 }])
    history.push(`?page=${currentPagesLength + 1}`)
  }

  const onBeforeChange = useCallback((current, next) => {
    history.push(`?page=${next + 1}`)
  }, [])

  // const onAfterChange = () => {
  //   const currentPage = queryString.get('page')
  //   console.log('currentPage', currentPage);
  //   if (Number(currentPage) !== pages.length) {
  //     history.push(`?page=${Number(currentPage) + 1}`)
  //   }
  // }

  const settings = useMemo(() => ({
    className: "slider-parent",
    dots: false,
    slidesToScroll: 1,
    infinite: false,
    vertical: true,
    verticalSwiping: true,
    draggable: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: onBeforeChange,
    // afterChange: onAfterChange,
  }), [])

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
      <button type="button" onClick={onSaveWhiteboardData}>Save</button>
      <button type="button" onClick={onAddNewPage}>Add new page</button>
      <div id='slider-grand' style={{ width: "calc(100% - 5px)", height: "calc(100vh - 155px)", position: 'relative' }} ref={parentRef}>
        <Slider ref={slideRef} {...settings}>
          {pages.map((page) => (
            <div key={page} style={{ width: "calc(100% - 5px)", height: "calc(100vh - 155px)", position: 'relative' }}>
              <Stage
                ref={stageRef}
                width={stageConfig.width === 0 ? width - 300 : stageConfig.width}
                height={stageConfig.height === 0 ? height - 120 : stageConfig.height}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                onWheel={handleWheel}
              >
                <Layer ref={gridLayerRef} draggable={false} x={0} y={0} />
                <DrawLine eventPointer={eventPointer[TOOL.PEN]} scale={scale} tool={tool} currentPage={queryString.get('page')} />
                <DrawRectangle eventPointer={eventPointer[TOOL.RECTANGLE]} scale={scale} tool={tool} currentPage={queryString.get('page')} />
                <DrawCircle eventPointer={eventPointer[TOOL.CIRCLE]} scale={scale} tool={tool} currentPage={queryString.get('page')} />
                <DrawText eventPointer={eventPointer[TOOL.TEXT]} offset={offset} tool={tool} currentPage={queryString.get('page')} onUpdateTool={onSetDefaultTool} />
              </Stage>
            </div>
          ))}
        </Slider>
      </div>
    </>
  )
})
