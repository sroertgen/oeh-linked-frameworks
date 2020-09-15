import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

const EndpointBox = ({ heading, defaultValue, endpointChange }) => {
  const onEndpointChange = (event) => {
    endpointChange(event);
  };
  return (
    <Fragment>
      <label htmlFor={heading} >{heading}: </label>
      <input
        type="search"
        id={heading}
        placeholder={defaultValue}
        defaultValue={defaultValue}
        onChange={onEndpointChange}
        />
    </Fragment>
  );
};

export default EndpointBox;
