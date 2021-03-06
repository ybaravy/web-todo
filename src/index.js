import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import './styles/index.css';
import throttle from 'lodash/throttle';
import App from './components/App/index';
import globalReducer from './store/reducers/index';
import { loadState, saveState } from './helpers';
import registerServiceWorker from './registerServiceWorker';
import { AppContainer } from 'react-hot-loader';

const persistedState = loadState();

/* eslint-disable no-underscore-dangle */
const store = createStore(
  globalReducer,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable no-underscore-dangle */

store.subscribe(throttle(() => {
  saveState(store.getState());
}, 1000));

localStorage.clear();

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <App />
      </AppContainer>
    </Provider>,
    document.getElementById('root'),
  );
};

registerServiceWorker();

render();

if (module.hot) {
  module.hot.accept('./components/App/index', () => {
    render();
  });
}