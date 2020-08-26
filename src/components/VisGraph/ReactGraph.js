import React, { useState } from 'react';
import Graph from 'react-graph-vis';
import { useSelector } from 'react-redux';
import { querySparqlForProperties } from '../../api/sparql/querySparql';

// import './styles.css';
// need to import the vis network css in order to show tooltip
// import './network.css';

import { 
  queryForCourseProperties,
  queryForItemProps,
  queryForType
} from '../../api/sparql/queries';

function ReactGraph({setNode}) {
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
      // check if item or course node is selected, then get respective content
      queryForType(nodes)
        .then(data => {
          const type = data[0].type;
          if (type === "http://schema.org/Course") {
            queryForCourseProperties(nodes).then((data) => {
              setNode(data.results.bindings)
            });
          } else if (type === "http://schema.org/CreativeWork") {
            queryForItemProps(nodes).then(data => {
              setNode(data.results.bindings)
            });
          } else { setNode([
            {"error": 
              {"value": "No data found, might be a root node?"}}])}
        });
    }
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
