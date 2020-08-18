import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import {
  Grid, 
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  } from "@material-ui/core";

import Data from '../components/SelectData/Data';
import ItemBox from '../components/SelectData/ItemBox';
import ErrorBox from '../components/SelectData/ErrorBox';
import {
  requestNodesAndEdges,
  addDataComponent,
  requestGraphsFromSparql,
} from '../store/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const SelectData = () => {
  const dispatch = useDispatch();

  const endpoint = useSelector((state) => state.endpoint.endpointURL);
  const graphs = useSelector((state) => state.graphs.graph);
  const dataComponents = useSelector(
    (state) => state.dataComponents.dataComponents
  );
  const dataFromComponents = useSelector((state) => state.componentData.data);

  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    dispatch(requestGraphsFromSparql(endpoint));
  }, [dispatch, endpoint]);

  const onAddDataComponent = () => {
    dispatch(addDataComponent());
  };

  const onRequestNodesAndEdges = () => {
    dispatch(requestNodesAndEdges(dataFromComponents, showItems));
  };

  const toggleShowItems = event => {
    setShowItems(showItems => !showItems);
  }

  const classes = useStyles();

  return graphs.length === 0 ? (
    <Fragment>
      <Typography variant="h4" align="center">
        Loading...
      </Typography>
    </Fragment>
  ) : (
    <Grid container>
      <Grid container item className={classes.root}>
        {showItems && <ItemBox />}
        {dataComponents.map((e) => (
          <Data key={e} id={e} />
        ))}
      </Grid>
      <Grid container item className={classes.root}>
        <Button onClick={onAddDataComponent}>Add</Button>
        <Button onClick={onRequestNodesAndEdges}>Build Graph!</Button>

        <FormGroup>
          <FormControlLabel
            value="true"
            control={<Checkbox color="primary" />}
            label="show associated items?"
            labelPlacement="start"
            onChange={toggleShowItems}
          />
        </FormGroup>
        <ErrorBox />
      </Grid>
    </Grid>
  );
};

export default SelectData;
