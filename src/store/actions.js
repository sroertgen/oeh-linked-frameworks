import shortid from 'shortid';
import {
  REQUEST_PENDING,
  REQUEST_DISCIPLINE,
  REQUEST_LEVEL,
  REQUEST_CONTEXT,
  REQUEST_FAILED,
  CHANGE_ENDPOINTURL,
  REQUEST_GRAPHS,
  CHANGE_ITEM_GRAPH,
  BUILD_SUB_GRAPH_PENDING,
  BUILD_SUB_GRAPH_SUCCESS,
  BUILD_SUB_GRAPH_FAILED,
  CHANGE_COMPONENT_DATA,
  ADD_DATA_COMPONENTS,
  REMOVE_DATA_COMPONENT,
  REMOVE_COMPONENT_DATA,
  CHANGE_GRAPH
} from "./constants";

import {querySparql} from '../api/sparql/querySparql';
import buildNodesAndEdges from '../api/sparql/buildNodesAndEdges';
import { getComponentData } from '../api/sparql/utils';

import {
  queryData,
  queryCurriculaGraphs,
} from '../api/sparql/queries';

export const requestGraphsFromSparql = (endpoint) => (dispatch) => {
  dispatch({ type: REQUEST_PENDING });
  const { query, target, sources } = queryCurriculaGraphs(endpoint);
  querySparql(query, target, sources).then((res) => {
    dispatch({ type: REQUEST_GRAPHS, payload: res });
  }).catch((error) => dispatch({ type: REQUEST_FAILED, payload: error }));
};

export const requestSparql = (endpoint, graph, select, property) => (dispatch) => {
  dispatch({ type: REQUEST_PENDING });
  const { query, target, sources } = queryData(endpoint, graph, select, property);

  switch (select) {
    case '?discipline':
      querySparql(query, target, sources).then((res) => {
        dispatch({ type: REQUEST_DISCIPLINE, payload: res });
      }).catch((error) => dispatch({ type: REQUEST_FAILED, payload: error }));
      break;
    case '?level':
      querySparql(query, target, sources).then((res) => {
        dispatch({ type: REQUEST_LEVEL, payload: res });
      }).catch((error) => dispatch({ type: REQUEST_FAILED, payload: error }));
      break;
    case '?context':
      querySparql(query, target, sources).then((res) => {
        dispatch({ type: REQUEST_CONTEXT, payload: res });
      }).catch((error) => dispatch({ type: REQUEST_FAILED, payload: error }));
      break;
    default:
  }
};

export const requestNodesAndEdges = (data, showItems) => (dispatch, getState) => {
  // get states and pack it into an object
  const state = getState();
  const buildData = {
    endpoint: state.endpoint.endpointURL,
    itemGraph: state.itemGraph.graph,
    data,
    showItems,
  };
  dispatch({ type: BUILD_SUB_GRAPH_PENDING });
  buildNodesAndEdges(buildData).then((res) => {
    dispatch({ type: BUILD_SUB_GRAPH_SUCCESS, payload: res });
  }).catch((error) => dispatch({ type: BUILD_SUB_GRAPH_FAILED, payload: error }));
};

export const setEndpoint = (endpointURL) => ({ type: CHANGE_ENDPOINTURL, payload: endpointURL });

export const setGraph = (graph) => ({ type: CHANGE_GRAPH, payload: graph });

export const setItemGraph = (graph) => ({ type: CHANGE_ITEM_GRAPH, payload: graph });

export const getDataFromComponent = (componentId, selectId, value) => (dispatch, getState) => {
  const state = getState();
  const dataFromComponents = state.componentData.data;
  const data = getComponentData(componentId, selectId, value, dataFromComponents);
  dispatch({ type: CHANGE_COMPONENT_DATA, payload: data });
};

export const addDataComponent = () => (dispatch, getState) => {
  const state = getState();
  const { dataComponents } = state.dataComponents;
  const key = shortid.generate();
  const dataArray = [...dataComponents, key];
  dispatch({ type: ADD_DATA_COMPONENTS, payload: dataArray });
};

export const removeChild = (event, id) => (dispatch, useState) => {
  const state = useState();
  const { dataComponents } = state.dataComponents;
  const componentData = state.componentData.data;
  const newDataArray = dataComponents.filter(
    (e) => e !== id,
  );
  dispatch({ type: REMOVE_DATA_COMPONENT, payload: newDataArray });

  // delete corresponding componentData
  const { [id]: removed, ...rest } = componentData;
  dispatch({ type: REMOVE_COMPONENT_DATA, payload: rest });
};
