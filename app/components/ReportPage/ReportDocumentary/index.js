/**
 *
 * StockManager
 *
 */

import React, { useState } from 'react';
import { Tab, Tabs, withStyles } from '@material-ui/core';
import AddDocumentary from 'containers/AddDocumentary';
import { SwipeableDrawer } from '../../LifetekUi';
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
function ReportDocumenttary(props) {
  const { dataRole = [] } = props;
  const [tab, setTab] = useState();
  const [open, setOpen] = useState(false);

  const handleOpen = value => {
    setTab(value);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeTab = value => {
    setTab(value);
  };

  return (
    <div>
      <VerticalTabs value={tab} wrapped={true}>
        <VerticalTab
          style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
          label="Báo cáo công văn đi"
          onClick={() => handleOpen(0)}
        />
        <VerticalTab
          style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
          label="Báo cáo công văn đến"
          onClick={() => handleOpen(1)}
        />
      </VerticalTabs>
      <SwipeableDrawer
        anchor="right"
        onClose={handleClose}
        open={open}
        width={window.innerWidth - 260}
      >
        <AddDocumentary tab={tab} onClose={handleClose} />
      </SwipeableDrawer>
    </div>
  );
}

export default ReportDocumenttary;
