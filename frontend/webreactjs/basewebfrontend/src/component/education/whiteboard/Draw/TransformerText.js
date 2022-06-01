import React, { useEffect, useRef } from 'react'
import { Text, Transformer } from 'react-konva'
import { TOOL } from '../../../../utils/whiteboard/constants'

export const TransformerText = React.memo(({ value, offset, tool, onUpdateText }) => {
  const textRef = useRef(null)
  const transformRef = useRef(null)

  useEffect(() => {
    if (tool === TOOL.POINTER) {
      transformRef.current?.nodes([textRef.current])
      transformRef.current?.hide()
      transformRef.current?.getLayer()?.batchDraw()
    }
  }, [tool])

  const onDragTextEnd = () => {
    const node = textRef.current
    onUpdateText({
      ...value,
      x: node?.x(),
      y: node?.y(),
    })

    // e.target.setAttrs({
    //   width: e.target.width() * e.target.scaleX(),
    //   scaleX: 1,
    // })
    // const newAnnotation: AddTextInterface = {
    //   ...value,
    //   width: e.target.width() * e.target.scaleX(),
    // }
    // onUpdateText(newAnnotation)
  }

  const onTextTransformEnd = () => {
    if (tool !== TOOL.POINTER) {
      return
    }
    const node = textRef.current
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
      width: Math.max(5, (node?.width()) * scaleX),
      height: Math.max((node?.height()) * scaleY),
    })
  }

  const onDblClickTextRect = (e) => {
    if (tool !== TOOL.POINTER) {
      return
    }

    e.target.hide()
    transformRef.current?.hide()
    // Create text area
    const textPosition = e.target.absolutePosition()
    const areaPosition = {
      x: (offset?.left) + textPosition.x,
      y: (offset?.top) + textPosition.y,
    }
    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
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
    const rotation = e.target.rotation()
    let transform = ''
    if (rotation) {
      transform = `rotateZ(${rotation}deg)`
    }

    let px = 0
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    if (isFirefox) {
      px += 2 + Math.round((e.target).fontSize() / 20)
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
        text: (event).target.value,
      }
      onUpdateText(newAnnotation)
    }

    function removeTextarea() {
      textarea.parentNode?.removeChild(textarea)
      window.removeEventListener('click', handleOutsideClick)
      e.target.show()
      transformRef.current?.show()
      transformRef.current?.forceUpdate()
    }

    function setTextareaWidth(newWidth) {
      if (!newWidth) {
        // set width for placeholder
        newWidth = (e.target).placeholder.length * (e.target).fontSize()
      }
      // some extra fixes on different browsers
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth)
      }

      const isEdge = (document).documentMode || /Edge/.test(navigator.userAgent)
      if (isEdge) {
        newWidth += 1
      }
      textarea.style.width = `${newWidth}px`
    }

    textarea.addEventListener('keydown', function (event) {
      // hide on enter
      // but don't hide on shift + enter
      if (event.key === 'Enter' && !event.shiftKey) {
        void (e.target).text(textarea.value)
        removeTextarea()
      }
      // on esc do not set value back to node
      if (event.key === 'Esc') {
        removeTextarea()
      }
    })

    textarea.addEventListener('keydown', function () {
      const scale = e.target.getAbsoluteScale().x
      setTextareaWidth(e.target.width() * scale)
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight + (e.target).fontSize()}px`
    })

    function handleOutsideClick(event) {
      if (event.target !== textarea) {
        void (e.target).text(textarea.value)
        removeTextarea()
      }
      onClickText()
    }
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick)
    })
  }

  const onClickText = () =>
    transformRef.current?.isVisible() ? transformRef.current.hide() : transformRef.current?.show()

  return (
    <>
      <Text
        ref={textRef}
        x={value.x}
        y={value.y}
        width={value.width}
        draggable={tool !== TOOL.POINTER ? false : true}
        rotation={value.rotation}
        text={value.text}
        verticalAlign="bottom"
        fontSize={value.fontSize}
        fontFamily={value.fontFamily}
        fill={value.fill}
        padding={value.padding}
        align={value.align}
        onClick={onClickText}
        onDblClick={onDblClickTextRect}
        onDblTap={onDblClickTextRect}
        onDragEnd={onDragTextEnd}
        onTransformEnd={onTextTransformEnd}
      />
      <Transformer
        ref={transformRef}
        enabledAnchors={[
          'middle-left',
          'middle-right',
          'top-left',
          'top-right',
          'top-center',
          'bottom-left',
          'bottom-right',
          'bottom-center',
        ]}
        boundBoxFunc={function (_, newBox) {
          newBox.width = Math.max(30, newBox.width)
          return newBox
        }}
      />
    </>
  )
})
