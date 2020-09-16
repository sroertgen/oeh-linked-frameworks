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
} from './constants';

const initialStateOptions = {
  isPending: false,
  discipline: [],
  level: [],
  context: [],
  error: '',
};

const initialStateEndpointURL = {
  endpointURL: '/store/ds/sparql',
};

const initialStateCurriculumsGraph = {
  graph: [],
};

const initialStateItemGraph = {
  graph: 'http://example.org/dummy_items',
};

const initialStateSubGraph = {
  isPending: false,
  nodesAndEdges: {
    nodes: [],
    edges: [],
    message: [],
  },
  error: '',
};

const initialStateComponentData = {
  data: [],
};

const inititalStateDataComponents = {
  dataComponents: [],
};

export const requestSparql = (state = initialStateOptions, action = {}) => {
  switch (action.type) {
    case REQUEST_PENDING:
      return { ...state, isPending: true };
    case REQUEST_DISCIPLINE:
      return { ...state, discipline: action.payload, isPending: false };
    case REQUEST_LEVEL:
      return { ...state, level: action.payload, isPending: false };
    case REQUEST_CONTEXT:
      return { ...state, context: action.payload, isPending: false };
    case REQUEST_FAILED:
      return { ...state, error: action.payload, isPending: false };
    default:
      return state;
  }
};

export const endpoint = (state = initialStateEndpointURL, action = {}) => {
  switch (action.type) {
    case CHANGE_ENDPOINTURL:
      return { ...state, endpointURL: action.payload };
    default:
      return state;
  }
};

// TODO Change
export const graphs = (state = initialStateCurriculumsGraph, action = {}) => {
  switch (action.type) {
    case REQUEST_GRAPHS:
      return { ...state, graph: action.payload };
    default:
      return state;
  }
};

export const itemGraph = (state = initialStateItemGraph, action = {}) => {
  switch (action.type) {
    case CHANGE_ITEM_GRAPH:
      return { ...state, graph: action.payload };
    default:
      return state;
  }
};

export const requestNodesAndEdges = (state = initialStateSubGraph, action = {}) => {
  switch (action.type) {
    case BUILD_SUB_GRAPH_PENDING:
      return { ...state, isPending: true };
    case BUILD_SUB_GRAPH_SUCCESS:
      return { ...state, nodesAndEdges: action.payload, isPending: false };
    case BUILD_SUB_GRAPH_FAILED:
      return { ...state, nodesAndEdges: action.payload, isPending: false };
    default:
      return state;
  }
};

export const componentData = (state = initialStateComponentData, action = {}) => {
  switch (action.type) {
    case CHANGE_COMPONENT_DATA:
      return { ...state, data: action.payload };
    case REMOVE_COMPONENT_DATA:
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export const dataComponents = (state = inititalStateDataComponents, action = {}) => {
  switch (action.type) {
    case ADD_DATA_COMPONENTS:
      return { ...state, dataComponents: action.payload };
    case REMOVE_DATA_COMPONENT:
      return { ...state, dataComponents: action.payload };
    default:
      return state;
  }
};
