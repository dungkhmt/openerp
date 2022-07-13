import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Stage } from 'react-konva'
import { useWindowSize } from '../../../../utils/whiteboard/hooks/useWindowSize'
import { EVENT_TYPE, KEYS, ROLE_STATUS, SOCKET_IO_EVENTS, TOOL } from '../../../../utils/whiteboard/constants'
import { drawLines } from '../../../../utils/whiteboard/drawGrid'
import { DrawLine } from '../Draw/DrawLine'
import { DrawRectangle } from '../Draw/DrawRectangle'
import { DrawCircle } from '../Draw/DrawCircle'
import { DrawText } from '../Draw/DrawText'
import { request } from '../../../../api'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import Slider from 'react-slick'
import { SocketContext } from '../../../../utils/whiteboard/context/SocketContext'
import { removeData } from '../../../../utils/whiteboard/localStorage'
import { Dropdown } from '../Dropdown'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ListParticipantDropdown } from '../ListParticipantDropdown'
import { Button, FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core'

const scaleBy = 1.05
const MAX_SCALE = 3.125
const MIN_SCALE = 0.25

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  optionWrapper: {
    display: 'flex',
    alignItems: 'center',
    columnGap: 12,
    fontSize: 12,
  },
}))

const generatePages = (totalPage) => {
  const pages = []
  for (let i = 0; i < totalPage; ++i) {
    pages.push({ id: i })
  }
  return pages
}

export const MainBoard = React.memo(() => {
  const { socket } = useContext(SocketContext)
  const { whiteboardId } = useParams()
  const classes = useStyles()
  const { width, height } = useWindowSize()

  const [pageNow, setPageNow] = useState(Number(localStorage.getItem(KEYS.CURRENT_PAGE) ?? 1))
  const [pages, setPages] = useState(generatePages(Number(localStorage.getItem(KEYS.TOTAL_PAGE) ?? 1)))
  const [stageConfig, setStageConfig] = useState({
    width,
    height,
  })
  const [tool, setTool] = useState(TOOL.POINTER)
  const [scale, setScale] = useState(1)
  const [strokeDraw, setStrokeDraw] = useState({
    strokeWidth: 5,
    color: '#df4b26',
  })
  const [eventPointer, setEventPointer] = useState({
    [TOOL.PEN]: { eventType: null, pointerPosition: { x: 0, y: 0 } },
    [TOOL.RECTANGLE]: { eventType: null, pointerPosition: { x: 0, y: 0 } },
    [TOOL.CIRCLE]: { eventType: null, pointerPosition: { x: 0, y: 0 } },
    [TOOL.TEXT]: { eventType: null, pointerPosition: { x: 0, y: 0 } },
  })
  const [stageContainer, setStageContainer] = useState(null)
  const [offset, setOffset] = useState()

  const [roleStatus, setRoleStatus] = useState({
    roleId: ROLE_STATUS.READ,
    statusId: ROLE_STATUS.IDLE,
    isCreatedUser: false,
  })
  const [pendingDrawRequestList, setPendingDrawRequestList] = useState([])
  const [listParticipant, setListParticipant] = useState([])

  const isDrawing = useRef(false)
  const gridLayerRef = useRef(null)
  const stageRef = useRef([])
  const parentRef = useRef(null)
  const slideRef = useRef(null)

  const isAbleToDraw = roleStatus.roleId === ROLE_STATUS.WRITE && roleStatus.statusId === ROLE_STATUS.ACCEPTED

  useEffect(() => {
    socket.on(SOCKET_IO_EVENTS.ON_ADD_NEW_PAGE, ({ newPage, currentWhiteboardId, changePage, totalPage }) => {
      if (whiteboardId !== currentWhiteboardId) {
        return
      }
      if (!changePage) {
        setPages((prev) => [...prev, newPage])
      }
      localStorage.setItem(KEYS.CURRENT_PAGE, newPage.id)
      localStorage.setItem(KEYS.TOTAL_PAGE, totalPage)
      setPageNow(newPage.id)
      if (slideRef.current) {
        slideRef.current.slickGoTo(newPage.id - 1)
      }
    })

    socket.on(SOCKET_IO_EVENTS.ON_DELETE_PAGE, ({ pageId, currentWhiteboardId, newDrawData, totalPage }) => {
      if (whiteboardId !== currentWhiteboardId) {
        return
      }
      setPages((prev) =>
        prev.reduce((acc, item) => {
          if (item.id < Number(pageId)) {
            acc.push(item)
          } else {
            if (item.id === Number(pageId)) {
              return acc
            }
            acc.push({ id: item.id - 1 })
          }
          return acc
        }, []),
      )

      socket.on(SOCKET_IO_EVENTS.ON_CHANGE_STROKE_DRAW, ({ data, currentWhiteboardId }) => {
        if (whiteboardId !== currentWhiteboardId) {
          return
        }
        setStrokeDraw(data.strokeDraw)
      })

      localStorage.setItem(KEYS.CURRENT_PAGE, pageId === 1 ? 1 : pageId - 1)
      localStorage.setItem(KEYS.TOTAL_PAGE, totalPage)
      setPageNow(pageId === 1 ? 1 : pageId - 1)
      if (slideRef.current) {
        slideRef.current.slickGoTo(pageId === 1 ? 0 : pageId - 2)
      }
      stageRef.current.splice(Number(pageId) - 1, 1)

      localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(newDrawData))
      socket.emit(SOCKET_IO_EVENTS.CHECK_LOCAL_STORAGE, { currentWhiteboardId: whiteboardId })
    })

    if (stageRef && stageRef.current.length > 0) {
      setStageContainer(stageRef.current[Number(pageNow) - 1]?.container())
    }
    // add user to whiteboard here
    void (async () => {
      await request(
        'put',
        `/whiteboards/user/${whiteboardId}`,
        (res) => {
          if (res.status === 200) {
            setRoleStatus({
              roleId: res?.data?.roleId,
              statusId: res?.data?.statusId,
              isCreatedUser: res?.data?.isCreatedUser ?? false,
            })
            localStorage.setItem(KEYS.USER_ID, res?.data?.userId)
            socket.emit(SOCKET_IO_EVENTS.CONNECT_TO_WHITEBOARD, { whiteboardId })
          }
        },
        {},
        { roleId: ROLE_STATUS.READ, statusId: ROLE_STATUS.IDLE },
      )

      await request(
        'get',
        `/whiteboards/detail/${whiteboardId}`,
        (res) => {
          const currentPage = res?.data?.totalPage || 1
          localStorage.setItem(KEYS.TOTAL_PAGE, currentPage)
          localStorage.setItem(KEYS.CURRENT_PAGE, currentPage)
          setPageNow(currentPage)
          const newPages = []
          for (let i = 1; i <= currentPage; ++i) {
            newPages.push({ id: i })
          }
          setPages(newPages)
          if (slideRef.current) {
            slideRef.current.slickGoTo(currentPage - 1)
          }

          // const drawingData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE))
          // if (
          //   !drawingData ||
          //   (typeof drawingData.whiteboardId !== 'undefined' && drawingData.whiteboardId !== whiteboardId)
          // ) {
          //   localStorage.setItem(
          //     KEYS.DRAW_DATA_LOCAL_STORAGE,
          //     JSON.stringify({ whiteboardId, ...JSON.parse(res?.data?.data || '{}') }),
          //     )
          //     socket.emit(SOCKET_IO_EVENTS.CHECK_LOCAL_STORAGE, { currentWhiteboardId: whiteboardId })
          //     return
          //   }
          localStorage.removeItem(KEYS.DRAW_DATA_LOCAL_STORAGE)
          const totalData = JSON.parse(res?.data?.data) || { lines: [], rectangle: [], circle: [], text: [] }
          totalData.whiteboardId = whiteboardId
          totalData.lines = totalData.lines || []
          totalData.rectangle = totalData.rectangle || []
          totalData.circle = totalData.circle || []
          totalData.text = totalData.text || []

          localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(totalData))
          socket.emit(SOCKET_IO_EVENTS.CHECK_LOCAL_STORAGE, { currentWhiteboardId: whiteboardId })
        },
        {},
        {},
      )
    })()

    return () => {
      socket.off(SOCKET_IO_EVENTS.ON_ADD_NEW_PAGE)
      socket.off(SOCKET_IO_EVENTS.ON_DELETE_PAGE)
    }
  }, [whiteboardId, socket])

  useEffect(() => {
    socket.on(SOCKET_IO_EVENTS.ON_REQUEST_DRAW, async (data) => {
      if (roleStatus.isCreatedUser) {
        await request(
          'get',
          `/whiteboards/user/${data.currentWhiteboardId}/list-pending`,
          (res) => {
            if (res?.data?.addUserToWhiteboardResultModelList?.length > 0) {
              setPendingDrawRequestList(res.data.addUserToWhiteboardResultModelList)
            }
            toast.info(`${data.userId ?? 'User'} đang yêu cầu quyền vẽ.`, {
              position: toast.POSITION.BOTTOM_RIGHT,
            })
          },
          {},
          {},
        )
      } else {
        if (data?.isSuccess) {
          toast.success(`${data.userId ?? 'User'} đã được chấp thuận quyền vẽ.`, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        } else {
          toast.error(`${data.userId ?? 'User'} đã bị từ chối quyền vẽ.`, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        }
        await request(
          'put',
          `/whiteboards/user/${whiteboardId}`,
          (res) => {
            if (res.status === 200) {
              setRoleStatus({
                roleId: res?.data?.roleId,
                statusId: res?.data?.statusId,
                isCreatedUser: res?.data?.isCreatedUser ?? false,
              })
            }
          },
          {},
          { roleId: ROLE_STATUS.READ, statusId: ROLE_STATUS.IDLE },
        )
      }
    })

    void (async () => {
      if (roleStatus.isCreatedUser) {
        await request(
          'get',
          `/whiteboards/user/${whiteboardId}/list-pending`,
          (res) => {
            if (res?.addUserToWhiteboardResultModelList?.length > 0) {
              setPendingDrawRequestList(res.addUserToWhiteboardResultModelList)
            }
          },
          {},
          {},
        )
      }
    })()

    void (async () => {
      if (roleStatus.isCreatedUser) {
        await request(
          'get',
          `/whiteboards/user/${whiteboardId}/list-users`,
          (res) => {
            if (res?.data?.length > 0) {
              setListParticipant(res.data)
            }
          },
          {},
          {},
        )
      }
    })()

    return () => {
      socket.off(SOCKET_IO_EVENTS.ON_REQUEST_DRAW)
    }
  }, [roleStatus.isCreatedUser, socket, whiteboardId])

  useEffect(() => {
    const onWindowResize = () => {
      if (parentRef.current) {
        const stageWidth = parentRef.current.offsetWidth
        const stageHeight = parentRef.current.offsetHeight
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
  }, [tool, pageNow])

  useEffect(() => {
    if (gridLayerRef && gridLayerRef.current && stageRef.current.length > 0) {
      // drawLines(gridLayerRef, stageRef.current[Number(queryString.get('page')) - 1], width, height)
      drawLines(gridLayerRef, stageRef.current[pageNow - 1], width, height)
    }
  }, [pages.length, width, height, scale, pageNow])

  const handleMouseDown = (e) => {
    isDrawing.current = true
    let pos = e.target.getStage()?.getPointerPosition()
    if (scale !== 1) {
      pos = e.currentTarget.getRelativePointerPosition()
    }
    if (tool === TOOL.ERASER) {
      setEventPointer((prev) => ({
        ...prev,
        [TOOL.PEN]: { eventType: EVENT_TYPE.MOUSE_DOWN, pointerPosition: { x: pos?.x, y: pos?.y } },
      }))
    } else {
      setEventPointer((prev) => ({
        ...prev,
        [tool]: { eventType: EVENT_TYPE.MOUSE_DOWN, pointerPosition: { x: pos?.x, y: pos?.y } },
      }))
    }
    setOffset({
      // top: stageRef.current[Number(queryString.get('page')) - 1]?.container().offsetTop,
      // left: stageRef.current[Number(queryString.get('page')) - 1]?.container().offsetLeft,
      top: stageRef.current[pageNow - 1]?.container().offsetTop,
      left: stageRef.current[pageNow - 1]?.container().offsetLeft,
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
    if (tool === TOOL.ERASER) {
      setEventPointer((prev) => ({
        ...prev,
        [TOOL.PEN]: { eventType: EVENT_TYPE.MOUSE_MOVE, pointerPosition: { x: point?.x, y: point?.y } },
      }))
    } else {
      setEventPointer((prev) => ({
        ...prev,
        [tool]: { eventType: EVENT_TYPE.MOUSE_MOVE, pointerPosition: { x: point?.x, y: point?.y } },
      }))
    }
  }

  const handleMouseUp = (e) => {
    isDrawing.current = false
    let point = e.target.getStage()?.getPointerPosition()
    if (scale !== 1) {
      point = e.currentTarget.getRelativePointerPosition()
    }
    if (tool === TOOL.ERASER) {
      setEventPointer((prev) => ({
        ...prev,
        [TOOL.PEN]: { eventType: EVENT_TYPE.MOUSE_UP, pointerPosition: { x: point?.x, y: point?.y } },
      }))
    } else {
      setEventPointer((prev) => ({
        ...prev,
        [tool]: { eventType: EVENT_TYPE.MOUSE_UP, pointerPosition: { x: point?.x, y: point?.y } },
      }))
    }
  }

  const handleWheel = (e) => {
    e.evt.preventDefault()
    const stage = e.target.getStage()
    // const layer = e.target.g()

    const oldScale = stage?.scaleX()
    const pointer = stage?.getPointerPosition()
    const mousePointTo = {
      x: (pointer?.x - Number(stage?.x())) / Number(oldScale),
      y: (pointer?.y - Number(stage?.y())) / Number(oldScale),
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
      x: pointer?.x - mousePointTo.x * newScale,
      y: pointer?.y - mousePointTo.y * newScale,
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
      totalPage: pages.length,
    }
    await request(
      'post',
      '/whiteboards/save',
      () => {
        toast.success('Lưu dữ liệu bảng viết thành công.', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      },
      (error) => console.error(error),
      requestBody,
    )
  }

  const onAddNewPage = () => {
    if (tool !== TOOL.POINTER) {
      toast.info('Bạn cần đổi sang công cụ chuột.')
      return
    }
    const currentPagesLength = pages.length
    setPages((prev) => [...prev, { id: currentPagesLength + 1 }])
    setPageNow(currentPagesLength + 1)
    slideRef.current.slickGoTo(currentPagesLength)
    localStorage.setItem(KEYS.CURRENT_PAGE, currentPagesLength + 1)
    localStorage.setItem(KEYS.TOTAL_PAGE, currentPagesLength + 1)
    // window.history.pushState(null, '', `?page=${currentPagesLength + 1}`)
    socket.emit(SOCKET_IO_EVENTS.ADD_NEW_PAGE, {
      newPage: { id: currentPagesLength + 1 },
      currentWhiteboardId: whiteboardId,
      changePage: false,
      totalPage: currentPagesLength + 1,
    })
  }

  const onDeletePage = () => {
    const drawData = JSON.parse(localStorage.getItem(KEYS.DRAW_DATA_LOCAL_STORAGE) || '{}')
    const currentPage = localStorage.getItem(KEYS.CURRENT_PAGE)

    const newDrawData = { lines: [], rectangle: [], circle: [], text: [] }
    newDrawData.lines = removeData(drawData.lines || [], currentPage)
    newDrawData.rectangle = removeData(drawData.rectangle || [], currentPage)
    newDrawData.circle = removeData(drawData.circle || [], currentPage)
    newDrawData.text = removeData(drawData.text || [], currentPage)

    if (Number(currentPage) === 1) {
      localStorage.setItem(KEYS.CURRENT_PAGE, 1)
      setPageNow(1)
    } else {
      localStorage.setItem(KEYS.CURRENT_PAGE, Number(currentPage) - 1)
      setPageNow((prev) => prev - 1)
    }
    localStorage.setItem(KEYS.TOTAL_PAGE, pages.length - 1)
    localStorage.setItem(KEYS.DRAW_DATA_LOCAL_STORAGE, JSON.stringify(newDrawData))

    const newPages = pages.reduce((acc, item) => {
      if (item.id < Number(currentPage)) {
        acc.push(item)
      } else {
        if (item.id === Number(currentPage)) {
          return acc
        }
        acc.push({ id: item.id - 1 })
      }
      return acc
    }, [])
    setPages(newPages)
    if (slideRef.current) {
      slideRef.current.slickGoTo(Number(currentPage) === 1 ? 1 : Number(currentPage) - 2)
    }

    stageRef.current.splice(Number(currentPage) - 1, 1)
    socket.emit(SOCKET_IO_EVENTS.DELETE_PAGE, {
      pageId: Number(currentPage),
      currentWhiteboardId: whiteboardId,
      newDrawData,
      totalPage: pages.length - 1,
    })
    socket.emit(SOCKET_IO_EVENTS.CHECK_LOCAL_STORAGE, { currentWhiteboardId: whiteboardId })
    toast.success('Xóa trang vẽ thành công.', {
      position: toast.POSITION.BOTTOM_RIGHT,
    })
  }

  const onPrevPage = () => {
    if (Number(pageNow) === 1) {
      return
    }
    localStorage.setItem(KEYS.CURRENT_PAGE, Number(pageNow) - 1)
    setPageNow((prev) => prev - 1)
    socket.emit(SOCKET_IO_EVENTS.ADD_NEW_PAGE, {
      currentWhiteboardId: whiteboardId,
      newPage: { id: Number(pageNow) - 1 },
      changePage: true,
    })
    if (slideRef.current) {
      slideRef.current.slickGoTo(Number(pageNow) - 2)
    }
    // socket.emit(SOCKET_IO_EVENTS.CHECK_LOCAL_STORAGE, { currentWhiteboardId: whiteboardId })
  }

  const onNextPage = () => {
    if (Number(pageNow) >= pages.length) {
      return
    }
    setPageNow((prev) => prev + 1)
    socket.emit(SOCKET_IO_EVENTS.ADD_NEW_PAGE, {
      currentWhiteboardId: whiteboardId,
      newPage: { id: Number(pageNow) + 1 },
      changePage: true,
    })
    localStorage.setItem(KEYS.CURRENT_PAGE, Number(pageNow) + 1)
    if (slideRef.current) {
      slideRef.current.slickGoTo(Number(pageNow))
    }
  }

  const onDrawDone = (tool) =>
    setEventPointer((prev) => ({ ...prev, [tool]: { eventType: null, pointerPosition: { x: 0, y: 0 } } })) - 1

  const onRequestDraw = async () => {
    // call API with write-pending
    const userId = localStorage.getItem(KEYS.USER_ID)
    if (!userId) {
      toast.error('Thiếu userId.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      return
    }

    await request(
      'post',
      `/whiteboards/user/${whiteboardId}`,
      (res) => {
        if (res.status === 200) {
          setRoleStatus({
            roleId: res?.data?.roleId,
            statusId: res?.data?.statusId,
          })
          toast.success('Gửi yêu cầu thành công.', {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          // TODO: Notify to admin
          socket.emit(SOCKET_IO_EVENTS.REQUEST_DRAW, { userId, currentWhiteboardId: whiteboardId })
        }
      },
      {},
      { userId, roleId: ROLE_STATUS.WRITE, statusId: ROLE_STATUS.PENDING },
    )
  }

  const approveRequest = async (item) => {
    // call API with write-accepted
    await request(
      'post',
      `/whiteboards/user/${whiteboardId}`,
      async (res) => {
        if (res.status === 200) {
          toast.info('Yêu cầu vẽ đã được chấp thuận.', {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          // TODO: Notify to this user
          socket.emit(SOCKET_IO_EVENTS.REQUEST_DRAW, {
            userId: item.userId,
            isSuccess: true,
            currentWhiteboardId: whiteboardId,
          })
          await request(
            'get',
            `/whiteboards/user/${whiteboardId}/list-pending`,
            (res) => {
              if (res?.data?.addUserToWhiteboardResultModelList) {
                setPendingDrawRequestList(res.data.addUserToWhiteboardResultModelList)
              }
            },
            {},
            {},
          )
        }
      },
      {},
      { userId: item.userId, roleId: ROLE_STATUS.WRITE, statusId: ROLE_STATUS.ACCEPTED },
    )
  }

  const rejectRequest = async (item) => {
    // call API with write-accepted
    await request(
      'post',
      `/whiteboards/user/${whiteboardId}`,
      async (res) => {
        if (res.status === 200) {
          toast.info('Yêu cầu vẽ đã bị từ chối.', {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          // TODO: Notify to this user
          socket.emit(SOCKET_IO_EVENTS.REQUEST_DRAW, {
            userId: item.userId,
            isSuccess: false,
            currentWhiteboardId: whiteboardId,
          })
          await request(
            'get',
            `/whiteboards/user/${whiteboardId}/list-pending`,
            (res) => {
              if (res?.data?.addUserToWhiteboardResultModelList) {
                setPendingDrawRequestList(res.data.addUserToWhiteboardResultModelList)
              }
            },
            {},
            {},
          )
        }
      },
      {},
      { userId: item.userId, roleId: ROLE_STATUS.WRITE, statusId: ROLE_STATUS.REJECTED },
    )
  }

  const onChangeStrokeDraw = (e) => {
    setStrokeDraw((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.includes('#') ? e.target.value : Number(e.target.value),
    }))
    socket.emit(SOCKET_IO_EVENTS.CHANGE_STROKE_DRAW, {
      data: { ...strokeDraw, [e.target.name]: e.target.value },
      currentWhiteboardId: whiteboardId,
    })
  }

  const settings = useMemo(
    () => ({
      arrows: false,
      className: 'slider-parent',
      dots: false,
      slidesToScroll: 1,
      infinite: false,
      vertical: true,
      verticalSwiping: true,
      draggable: false,
      // beforeChange: onBeforeChange,
      // afterChange: onAfterChange,
    }),
    [],
  )

  return (
    <div className={classes.container}>
      {isAbleToDraw ? (
        <div className={classes.optionWrapper}>
          <Button variant="outlined" color="secondary" onClick={onPrevPage} disabled={pageNow === 1}>
            Trang trước
          </Button>
          <Button variant="outlined" color="primary" onClick={onNextPage} disabled={pageNow >= pages.length}>
            Trang sau
          </Button>
          <label htmlFor="color">Màu nét vẽ</label>
          <input id="color" name="color" type="color" value={strokeDraw.color} onChange={onChangeStrokeDraw} />
          <label htmlFor="strokeWidth">Độ dày nét vẽ</label>
          <input
            type="range"
            max={15}
            min={0}
            step={0.5}
            name="strokeWidth"
            value={strokeDraw.strokeWidth}
            onChange={onChangeStrokeDraw}
            aria-labelledby="strokeWidth"
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="tool">Công cụ</InputLabel>
            <Select labelId="tool" value={tool} onChange={(e) => setTool(e.target.value)}>
              <MenuItem value={TOOL.POINTER}>Chuột</MenuItem>
              <MenuItem value={TOOL.PEN}>Bút</MenuItem>
              <MenuItem value={TOOL.RECTANGLE}>Hình chữ nhật</MenuItem>
              <MenuItem value={TOOL.CIRCLE}>Hình tròn</MenuItem>
              <MenuItem value={TOOL.ERASER}>Tẩy</MenuItem>
              <MenuItem value={TOOL.TEXT}>Chữ</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={onSaveWhiteboardData}>
            Lưu
          </Button>
          <Button variant="contained" color="primary" onClick={onAddNewPage}>
            Thêm trang mới
          </Button>
          {pages.length >= 2 && (
            <Button variant="contained" color="secondary" onClick={onDeletePage}>
              Xóa trang {pageNow}
            </Button>
          )}
          {pendingDrawRequestList.length > 0 && (
            <Dropdown
              pendingList={pendingDrawRequestList}
              onApproveRequest={approveRequest}
              onRejectRequest={rejectRequest}
            />
          )}
          {listParticipant.length > 0 && (
            <ListParticipantDropdown list={listParticipant} onRejectRequest={rejectRequest} />
          )}
        </div>
      ) : roleStatus.statusId === ROLE_STATUS.PENDING ? (
        <Button variant="contained" disabled>
          Đã gửi yêu cầu. Vui lòng đợi.
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={onRequestDraw}>
          Yêu cầu quyền vẽ
        </Button>
      )}

      <div
        id="slider-grand"
        style={{ width: 'calc(100% - 5px)', height: 'calc(100vh - 155px)', position: 'relative' }}
        ref={parentRef}
      >
        <Slider ref={slideRef} {...settings}>
          {pages.map((page) => (
            <div id={`konva-${page.id - 1}`} key={page}>
              <Stage
                ref={(el) => (stageRef.current[page.id] = el)}
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
                <DrawLine
                  eventPointer={eventPointer[TOOL.PEN]}
                  scale={scale}
                  tool={tool}
                  currentPage={pageNow}
                  whiteboardId={whiteboardId}
                  totalPage={pages.length}
                  strokeDraw={strokeDraw}
                  onDrawDone={onDrawDone}
                  ref={stageRef.current[Number(pageNow)]}
                />
                <DrawRectangle
                  eventPointer={eventPointer[TOOL.RECTANGLE]}
                  scale={scale}
                  tool={tool}
                  currentPage={pageNow}
                  stageContainer={stageContainer}
                  whiteboardId={whiteboardId}
                  totalPage={pages.length}
                  strokeDraw={strokeDraw}
                  onDrawDone={onDrawDone}
                  ref={stageRef.current[Number(pageNow)]}
                />
                <DrawCircle
                  eventPointer={eventPointer[TOOL.CIRCLE]}
                  scale={scale}
                  tool={tool}
                  currentPage={pageNow}
                  stageContainer={stageContainer}
                  whiteboardId={whiteboardId}
                  onDrawDone={onDrawDone}
                  strokeDraw={strokeDraw}
                  totalPage={pages.length}
                  ref={stageRef.current[Number(pageNow)]}
                />
                <DrawText
                  eventPointer={eventPointer[TOOL.TEXT]}
                  offset={offset}
                  tool={tool}
                  currentPage={pageNow}
                  onUpdateTool={onSetDefaultTool}
                  whiteboardId={whiteboardId}
                  onDrawDone={onDrawDone}
                  totalPage={pages.length}
                  ref={stageRef.current[Number(pageNow)]}
                />
              </Stage>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
})
