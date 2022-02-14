import createSagaMiddleware from 'redux-saga';
import {createStore, applyMiddleware} from 'redux';

import rootSaga from '../sagas';
import rootReducer from '../reducers';

const sagaMiddleware = createSagaMiddleware();

export default function store() {
  const configuredStore = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware),
  );
  sagaMiddleware.run(rootSaga);
  return configuredStore;
}
