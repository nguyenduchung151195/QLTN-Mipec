import React from 'react';
import { Paper as PaperUi, withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
});

function Paper({ classes, ...rest }) {
  return <PaperUi classes={classes} {...rest} />;
}

export default withStyles(styles)(Paper);
