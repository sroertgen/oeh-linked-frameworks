import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import SelectData from './SelectData';
import VisCanvas from '../components/VisGraph/VisCanvas';
import YasguiEditor from "./YasguiEditor.js";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    background: 'transparent',
    boxShadow: 'none',
    color: 'black',
    textColorSecondary: "black"
  }
}));

export default function MyTabPanel() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.root} position="static">
        <Tabs
          className={classes.root}
          value={value}
          onChange={handleChange}
          aria-label="simple tabs"
        >
          <Tab label="Curricula Browser" {...a11yProps(0)} />
          <Tab label="SPARQL GUI" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <SelectData />
        <VisCanvas />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <YasguiEditor />
      </TabPanel>
    </div>
  );
}
