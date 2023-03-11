// import React from 'react';
import { Grid, withStyles } from '@material-ui/core';

const styles = theme => ({
  container: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
});
export default withStyles(styles)(Grid);
