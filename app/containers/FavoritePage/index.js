/**
 *
 * FavoritePage
 *
 */

import React, {useState} from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Tab, Tabs } from '@material-ui/core';

import AddFavoritePage from '../AddFavoritePage/Loadable';
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
function FavoritePage(props) {
  const { dataRole } = props;
  const [menu, setMenu] = useState();
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(false);
  }
  function handleChangeTab(menu) {
    setMenu(menu);
  }


  function handleOpen(index) {
    setMenu(index);
    setOpen(true);
  }

  return (
    <div style={{ width: '360px' }}>
      <VerticalTabs value={menu} wrapped={true}>
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
        <AddFavoritePage menu={menu} onChangeTab={handleChangeTab} />
      </SwipeableDrawer>
    </div>
  );
}

export default FavoritePage;
