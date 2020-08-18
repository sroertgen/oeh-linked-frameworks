import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDataFromComponent, removeChild } from '../../store/actions';
import querySparql from '../../api/sparql/querySparql';
import { queryForLevels } from "../../api/sparql/utils";

import {
  makeStyles, 
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  IconButton,
  Grid
  } from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete"

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(2),
  }
}));

const Data = ({ id }) => {
  const {
    queryData,
    queryForLevelOptions,
    queryForContextOptions
  } = require('../../api/sparql/queries');

  const dispatch = useDispatch();

  const data = useSelector((state) => state.componentData.data);
  const endpoint = useSelector((state) => state.endpoint.endpointURL);
  const graphs = useSelector((state) => state.graphs.graph);

  let [graph, setGraph] = useState("");
  let [discipline, setDiscipline] = useState("");
  let [disciplines, setDisciplines] = useState([]);
  let [level, setLevel] = useState("");
  let [levels, setLevels] = useState([]);
  let [context, setContext] = useState("");
  let [contexts, setContexts] = useState([]);

  const removeComponent = (event) => {
    dispatch(removeChild(event, id));
  };

  const getData = (componentId, event) => {
    dispatch(getDataFromComponent(id, componentId, event.target.value));
  };

  const onChangeGraph = (event) => {
    const { query, target, sources } = queryData(
      endpoint,
      event.target.value,
      '?discipline',
      'sdo:about'
    );
    querySparql(query, target, sources).then((res) => {
      setDisciplines(res);
      setGraph(event.target.value);
      setDiscipline("")
    })
  }

  const onChangeDiscipline = (event) => {
    const {
      query,
      sources,
      targetLevel,
    } = queryForLevelOptions(graph, endpoint, event.target.value);
    queryForLevels(query, sources, targetLevel).then(res => {
      setLevels(res)
      setDiscipline(event.target.value)
      setLevel("")
      setContext("")
    });
  }

  const onChangeLevel = (event) => {
    const {
      query,
      sources,
      targetLevel,
    } = queryForContextOptions(graph, endpoint, event.target.value, data[id].discipline);
    queryForLevels(query, sources, targetLevel).then((res) => {
      setContexts(res);
      setLevel(event.target.value)
      setContext("")
    });
  }

  const onChangeContext = (event) => {
    setContext(event.target.value);
  }

  const classes = useStyles();

  return (
    // graph corresponds to curriculums graph, i.e. the state
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      spacing={2}
    >
      <FormControl className={classes.formControl}>
        <InputLabel id="state-label">Bundesland</InputLabel>
        <Select
          labelId="state-label"
          id="graph"
          value={graph}
          displayEmpty
          onChange={(event) => {
            event.persist();
            onChangeGraph(event);
            getData('graph', event);
          }}
        >
          <MenuItem value="" disabled>
            Bundesland
          </MenuItem>
          {graphs
            .sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }))
            .map((e, i) => {
              const id = graphs[i];
              return (
                <MenuItem key={id} value={id}>
                  {id.split('/')[id.split('/').length - 2]}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel id="discipline-label">Schulfach</InputLabel>
        <Select
          labelId="discipline-label"
          id="discipline"
          value={discipline}
          displayEmpty
          defaultValue=""
          onChange={(event) => {
            event.persist();
            onChangeDiscipline(event);
            getData('discipline', event);
          }}
        >
          <MenuItem value="" disabled>
            Schulfach
          </MenuItem>
          {disciplines
            .sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }))
            .map((e, i) => {
              const id = disciplines[i];
              return (
                <MenuItem key={id} value={id}>
                  {id}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel id="levels-label">Stufe</InputLabel>
        <Select
          labelId="level-label"
          id="level"
          value={level}
          displayEmpty
          defaultValue=""
          onChange={(event) => {
            event.persist();
            onChangeLevel(event);
            getData('level', event);
          }}
        >
          <MenuItem value="" disabled>
            Stufe
          </MenuItem>
          {levels
            .sort((a, b) => a - b)
            .map((e, i) => {
              const id = levels[i];
              return (
                <MenuItem key={id} value={id}>
                  {id}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel id="contexts-label">Schulart</InputLabel>
        <Select
          labelId="context-label"
          id="context"
          value={context}
          displayEmpty
          defaultValue=""
          onChange={(event) => {
            event.persist();
            onChangeContext(event);
            getData('context', event);
          }}
        >
          <MenuItem value="" disabled>
            Schulart
          </MenuItem>
          {contexts
            .sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }))
            .map((e, i) => {
              const id = contexts[i];
              return (
                <MenuItem key={id} value={id}>
                  {id.toLowerCase()}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>

      <IconButton aria-label="delete" onClick={removeComponent}>
        <DeleteIcon />
      </IconButton>
    </Grid>
  );
};

export default Data;
