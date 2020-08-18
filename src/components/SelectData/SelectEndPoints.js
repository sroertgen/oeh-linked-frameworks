import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EndpointBox from './EndpointBox';
import {
  setEndpoint,
  setGraph,
} from '../../store/actions';

const SelectEndpoint = () => {
  const dispatch = useDispatch();

  const endpointfield = useSelector((state) => state.endpoint.endpointURL);
  const graphfield = useSelector((state) => state.graphs.graph);

  const onEndpointChange = (event) => dispatch(setEndpoint(event.target.value));
  const onGraphChange = (event) => dispatch(setGraph(event.target.value));

  return (
    <Fragment>
      <EndpointBox heading={'Sparql-Endpoint'} defaultValue={endpointfield} endpointChange={onEndpointChange}/>
      {/* <EndpointBox heading={'Graph-Name'} defaultValue={graphfield} endpointChange={onGraphChange}/> */}
    </Fragment>
  );
};
export default SelectEndpoint;
