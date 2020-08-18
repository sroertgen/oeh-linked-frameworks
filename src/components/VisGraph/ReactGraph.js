import React from 'react';
import Graph from 'react-graph-vis';
import { useSelector } from 'react-redux';
// import './styles.css';
// need to import the vis network css in order to show tooltip
// import './network.css';

function ReactGraph() {
  const nodesAndEdges = useSelector((state) => state.requestNodesAndEdges.nodesAndEdges);

  const graph = {
    nodes: nodesAndEdges.nodes,
    edges: nodesAndEdges.edges,
  };

  const options = {
    autoResize: true,
    layout: {
      hierarchical: false,
    },
    nodes: {
      shape: 'dot',
    },
    edges: {
      color: '#000000',
    },
    height: '600px',
    physics: {
      stabilization: false,
      barnesHut: {
        gravitationalConstant: -2000,
        springConstant: 0.01,
        springLength: 59,
      },
    },
  };

  const events = {
    select(event) {
      const { nodes, edges } = event;
    },
  };
  return (
    <Graph
      graph={graph}
      options={options}
      events={events}
      getNetwork={(network) => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
      }}
    />
  );
}

export default ReactGraph;
