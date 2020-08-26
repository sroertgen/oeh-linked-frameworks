import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';


const PropertyTable = ({nodeProperties}) => {

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Property</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nodeProperties.map(e => {
            return (
              Object.entries(e).map(([key, value], i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {key}
                  </TableCell>
                  <TableCell>{value.value}</TableCell>
                </TableRow>
              ))
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PropertyTable