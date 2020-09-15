import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

const ErrorBox = () => {
  const errorMessage = useSelector((state) => state.requestNodesAndEdges.nodesAndEdges.message);
  return (
    <Fragment>
    {
      errorMessage.map((e, i) => (
          <p key={i}>No data found for: {e.discipline}, {e.context}, {e.level}</p>
      ))
    }
    </Fragment>
  );
};
export default ErrorBox;
