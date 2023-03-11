import React, { useState } from 'react';
import { Tab, Tabs, withStyles } from '@material-ui/core';
import { SwipeableDrawer } from '../../components/LifetekUi';
import AddTaskReport from '../AddTaskReport';
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

function TaskManager(props) {
  const [tab, setTab] = useState();
  const [open, setOpen] = useState(false);

  const handleOpen = index => {
    setOpen(true);
    setTab(index);
  };
  const handleChangeTab = tab => {
    setTab(tab);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { dataRole = [] } = props;
  return (
    <>
      <VerticalTabs value={tab} wrapped={true} variant="fullWidth">
        {dataRole &&
          dataRole.map((i, index) => (
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label={i.titleFunction}
              onClick={() => handleOpen(index)}
            />
          ))}
      </VerticalTabs>

      <SwipeableDrawer anchor="right" onClose={() => handleClose()} open={open} width={window.innerWidth - 260}>
        <AddTaskReport tab={tab} />
      </SwipeableDrawer>
    </>
  );
}

export default TaskManager;
