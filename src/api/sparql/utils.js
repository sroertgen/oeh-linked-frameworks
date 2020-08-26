import { queryForNodes, queryForEdges } from './queryForNodesAndEdges';

export const getNodesAndEdges = async (subGraph, courseCode, nodesQuery, edgesQuery) => {
  const N3 = require('n3');
  // create N3 store to query
  const store = new N3.Store();

  let edges = [];

  store.addQuads([...subGraph]);
  // get nodes and node names from subgraph
  const nodesAndNames = await queryForNodes(nodesQuery, store);

  const nodes = nodesAndNames.map(e => 
    ({...e, group: courseCode})
  );

  // check if only prim nodes are there
  // check also for isPartOf otherwise the function will fail
  // if it runs to check the associated items
  if (
    !store
      .getPredicates()
      .some((node) => node.id === 'http://schema.org/hasPart')
      && !store
        .getPredicates()
        .some((node) => node.id === 'http://schema.org/isPartOf')
  ) {
    // only prim nodes, return here otherwise search for edges will fail
    edges = [];
    return { nodes, edges };
  }
  edges = await queryForEdges(edgesQuery, store);
  return { nodes, edges };
};

export const getPrimaryNodes = (nodes, edges) => {
  const allNodes = [];
  nodes.map((e) => allNodes.push(e.id));
  const allTos = [];
  edges.map((e) => allTos.push(e.to));
  const primaryNodes = allNodes.filter((e) => !allTos.includes(e));
  return primaryNodes;
};

export const placeOnCircle = (nodes) => {
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * 400;
  const y = Math.sin(angle) * 400;
  nodes.forEach((element) => {
    element.x = x;
    element.y = y;
  });

  return { nodes };
};

export const getComponentData = (componentId, selectId, value, dataFromComponents) => {
  const deepmerge = require('deepmerge');
  const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;
  const compData = {};
  compData[componentId] = { [selectId]: value };
  const merged = deepmerge(
    dataFromComponents,
    compData,
    { arrayMerge: overwriteMerge },
  );
  return merged;
};

export const queryForLevels = async (
  query,
  sources,
  targetLevel
) => {
  const { newEngine } = require('@comunica/actor-init-sparql');
  const myEngine = newEngine();

  try {
    const result = await myEngine.query(query, {
      sources,
    });
    const results = [];
    result.bindingsStream.on('data', (data) => {
      results.push(
        data.get(targetLevel).value
      );
    });
    return new Promise((resolve) => {
      result.bindingsStream.on('end', () => {
        resolve(results);
      });
    });
  } catch (err) {
    console.error(err);
  }
};

export const getNodeProperties = (node) => {
  
}

export const cleanURL = (url) => {
  return url.trim().replace(/(\r\n|\n|\r)/gm, "");
};