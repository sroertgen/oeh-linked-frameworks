import React from 'react';
import Header from '../components/Header/Header';

import {Grid} from '@material-ui/core';
import MyTabPanel from "./TabPanel"



const App = () => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Header />
      </Grid>
      <Grid item container spacing={3}>
        <Grid item xs></Grid>
        <Grid item xs={10}>
          <MyTabPanel />
        </Grid>
        <Grid item xs></Grid>
      </Grid>
    </Grid>
  );
}

export default App;
