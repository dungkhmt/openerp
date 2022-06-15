export const SOCKET_IO_EVENTS = {
  DRAW_LINE_END: 'drawEnd',
  DRAW_RECT_END: 'drawRectEnd',
  DRAW_CIRCLE_END: 'drawCircleEnd',
  ADD_TEXT: 'addText',
  ON_DRAW_LINE_END: 'onDrawEnd',
  ON_DRAW_RECT_END: 'onDrawRectEnd',
  ON_DRAW_CIRCLE_END: 'onDrawCircleEnd',
  ON_ADD_TEXT_END: 'onAddText',
  ADD_NEW_PAGE: 'addNewPage',
  ON_ADD_NEW_PAGE: 'onAddNewPage',
  TEST: 'test',
  ON_TEST: 'onTest',
  DELETE_PAGE: 'deletePage',
  ON_DELETE_PAGE: 'onDeletePage',

  CHECK_LOCAL_STORAGE: 'checkLocalStorage',
  ON_CHECK_LOCAL_STORAGE: 'onCheckLocalStorage',
}

export const KEYS = {
  DRAW_DATA_LOCAL_STORAGE: '@draw_data_local_storage',
  CURRENT_PAGE: '@current_page',
  TOTAL_PAGE: '@total_page',
}

export const POLLING_INTERVAL = 500

export const TOOL = {
  PEN: 'PEN',
  ERASER: 'ERASER',
  RECTANGLE: 'RECTANGLE',
  CIRCLE: 'CIRCLE',
  TEXT: 'TEXT',
  POINTER: 'POINTER',
}
export const EVENT_TYPE = {
  MOUSE_UP: 'MOUSE_UP',
  MOUSE_DOWN: 'MOUSE_DOWN',
  MOUSE_MOVE: 'MOUSE_MOVE',
}

export const ROLE_STATUS = {
  WRITE: 'write',
  READ: 'read',

  IDLE: 'idle',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
}
