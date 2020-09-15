import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from "@material-ui/core/Container";
import TextField from '@material-ui/core/TextField';

import { setItemGraph } from "../../store/actions"

const ItemBox = () => {
  const dispatch = useDispatch()
  const itemGraph = useSelector((state) => state.itemGraph.graph);
  
  const itemGraphChange = (event) => { 
    dispatch(setItemGraph({value: event.target.value}))
    }

  return (
    <Container>
      <TextField
        id="standard-full-width"
        label="Item-Graph-Url:"
        style={{ margin: 8 }}
        placeholder={itemGraph}
        defaultValue={itemGraph}
        helperText="URL zu Graphen der Items"
        fullWidth
        margin="normal"
        onChange={itemGraphChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Container>
  );
};

export default ItemBox;
