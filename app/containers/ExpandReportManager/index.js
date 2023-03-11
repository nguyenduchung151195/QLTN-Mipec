/**
 *
 * ExpandReportManager
 *
 */

import React, { useState } from 'react';

import { Tab, Tabs, withStyles } from '@material-ui/core';

import AddExpandReportManager from 'containers/AddExpandReportManager/Loadable';
import { SwipeableDrawer } from '../../components/LifetekUi';
const VerticalTabs = withStyles(() => ({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

const VerticalTab = withStyles(() => ({
  selected: {
    color: 'white',
    backgroundColor: `#2196F3`,
    borderRadius: '5px',
    boxShadow: '3px 5.5px 7px rgba(0, 0, 0, 0.15)',
  },
  root: {},
}))(Tab);
/* eslint-disable react/prefer-stateless-function */
function ExpandReportManager(props) {
  const { dataRole = [] } = props;
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState();

  const handleClose = index => {
    setTab(index);
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <VerticalTabs>
        {dataRole &&
          dataRole.map((i, index) => (
            <VerticalTab style={{ textAlign: 'left', textTransform: 'none', width: 400 }} label={i.titleFunction} onClick={() => handleOpen(index)} />
          ))}
      </VerticalTabs>
      <SwipeableDrawer anchor="right" onClose={handleClose} open={open} width={window.innerWidth - 260}>
        <AddExpandReportManager tab={tab} />
      </SwipeableDrawer>
    </div>
  );
}

export default ExpandReportManager;
