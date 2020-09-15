import React, { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import ReactGraph from './ReactGraph';
import {Box} from "@material-ui/core"
import PropertyTable from './PropertyTable'

const VisCanvas = () => {
  const graphBuildPending = useSelector((state) => state.requestNodesAndEdges.isPending);
  const [selectedNode, setSelectedNode] = useState([]);

  return (
    <Box border={1}>
      {graphBuildPending ? (
        <Fragment>
          Loading...
        </Fragment>
      ):(
        <div>
          <ReactGraph 
            setNode={node => setSelectedNode(node)}
            />
          {selectedNode.length > 0 &&
            <PropertyTable nodeProperties={selectedNode}/>
          }
        </div>
      )}
    </Box>
  )};

export default VisCanvas;
