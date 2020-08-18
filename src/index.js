import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import './index.css';
import App from './containers/App';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "./theme";
import {
  requestSparql,
  endpoint,
  graphs,
  itemGraph,
  requestNodesAndEdges,
  componentData,
  dataComponents,
} from './store/reducers';

const logger = createLogger();
const rootReducer = combineReducers({
  requestSparql,
  endpoint,
  graphs,
  itemGraph,
  requestNodesAndEdges,
  componentData,
  dataComponents,
});
const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunkMiddleware, logger),
  ),
);

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);
