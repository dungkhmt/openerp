import * as types from '../actions/ActionTypes';

const initialState = {
  menuItemList: [
    /*
    [
      '',
    ]
    */
  ],
  isFetching: false,
};

const getMenuReducer = (state = initialState, action) => {
  console.log('getMenuReducer: enter, action = ' + JSON.stringify(action));
  switch (action.type) {
    case types.GET_MENU:
      return {
        ...state,
        isFetching: true,
      };
    case types.GET_MENU_SUCCESS:
      return {
        ...state,
        menuItemList: action.menuItemList,
        isFetching: false,
      };
    case types.GET_MENU_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default getMenuReducer;
