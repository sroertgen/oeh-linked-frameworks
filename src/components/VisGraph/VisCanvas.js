import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import ReactGraph from './ReactGraph';
import {Box} from "@material-ui/core"

const VisCanvas = () => {
  const graphBuildPending = useSelector((state) => state.requestNodesAndEdges.isPending);
  return (
    <Box border={1}>
      {graphBuildPending ? (
        <Fragment>
          Loading...
        </Fragment>
      ):(
        <div>
          <ReactGraph />
        </div>
      )};
    </Box>
  )};

export default VisCanvas;
