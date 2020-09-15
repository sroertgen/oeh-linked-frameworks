import buildSubGraph from './buildSubGraph';

import { getNodesAndEdges, getPrimaryNodes, placeOnCircle } from './utils';

import {
  queryNodeName,
  queryItemNodeName,
  queryHasPart,
  queryIsPartOf,
  queryBuildSubGraph,
  queryBuildItemGraph,
} from "./queries";

const buildNodesAndEdges = async (buildData) => {
  const nodesAll = [];
  const edgesAll = [];
  let messagesAll = [];

  const {
    endpoint, itemGraph, data, showItems,
  } = buildData;

  const lengthOfQueryData = Object.keys(data).length;
  const keys = Object.keys(data);

  try {
    for (let i = 0; i < lengthOfQueryData; i++) {
      const { discipline } = data[keys[i]];
      const { level } = data[keys[i]];
      const { context } = data[keys[i]];
      const { graph } = data[keys[i]];

      // build query for returning a subgraph
      const { query, sources } = queryBuildSubGraph(discipline, level, context, graph, endpoint);
      // returns an array of quads
      const subGraphFramework = await buildSubGraph(query, sources);
      if (subGraphFramework.length === 0) {
        const message = {
          discipline,
          level,
          context,
        };
        messagesAll = [...messagesAll, message];
        continue;
      }
      // add courseCode to use for group
      const courseCode = `${discipline} ${level}`;

      // build nodes and edges
      let { nodes, edges } = await getNodesAndEdges(subGraphFramework, courseCode, queryNodeName, queryHasPart);
      // get primary nodes, i.e. the ones that have no "isPartOf"
      const primaryNodes = getPrimaryNodes(nodes, edges);

      // add core Node to nodes
      nodes.push({
        id: courseCode,
        label: courseCode,
        group: 'coreNode',
      });

      // draw relation from core node to primary nodes
      primaryNodes.map((e) => {
        edges.push({
          from: courseCode,
          to: e,
        });
      });

      // place nodes randomly on a circle
      const { nodes: nodesXY } = placeOnCircle(nodes);

      nodesAll.push(...nodesXY);
      edgesAll.push(...edges);

      // check if items are also requested
      if (showItems) {
        const curriculumNodes = [];
        nodesXY.map((e) => {
          curriculumNodes.push(`"${e.id}"`);
        });
        const { query: itemQuery, sources: itemSources } = queryBuildItemGraph(curriculumNodes, itemGraph, endpoint);
        // returns an array of quads
        const subGraphItemGraph = await buildSubGraph(itemQuery, itemSources);
        const courseCodeItem = 'CreativeWork';
        // concat framework and item subgraph
        const combinedSubGraphs = [...subGraphFramework, ...subGraphItemGraph];
        const { nodes: itemNodes, edges: itemEdges } = await getNodesAndEdges(combinedSubGraphs, courseCodeItem, queryItemNodeName, queryIsPartOf);

        nodesAll.push(...itemNodes);
        edgesAll.push(...itemEdges);
      }
    }

    const response = {
      nodes: nodesAll,
      edges: edgesAll,
      message: messagesAll,
    };
    return response;
  } catch (error) {
  }
  // make a query for every item in query data
};

export default buildNodesAndEdges;
