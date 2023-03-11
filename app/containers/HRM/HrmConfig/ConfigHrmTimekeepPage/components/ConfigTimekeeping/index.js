import React, { useCallback, useState } from 'react';
import AddTimekeeping from './components/addTimekeeping/Loadable';

import { API_TIMEKEEPING_EQUIPMENT } from 'config/urlConfig';
import ListPage from 'components/List';
import { Grid } from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import { SwipeableDrawer } from 'components/LifetekUi';
import { configTimeKeeping } from 'variable';

function ConfigHrmTimekeep(props) {
  const { onSave, onDelete, data, reload } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [update, setUpdate] = useState(false);
  const [selectConfigTimekeeping, setSelectConfigTimekeeping] = useState(null);

  const handleOpenAddConfigDialog = () => {
    setSelectConfigTimekeeping(null);
    setOpenDialog(true);
    setUpdate(false);
  };

  const handleOpenEditConfigDialog = row => {
    setSelectConfigTimekeeping(row);
    setOpenDialog(true);
    setUpdate(true);
  };

  const handleCloseAddConfigDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenAddConfigDialog}>
      Open Menu
    </Add>
  );

  const handleTimekeepingDelete = data => {
    onDelete(data);
  };

  const handleUpdate = data => {
    setOpenDialog(false);
    onSave(data);
  };

  return (
    <React.Fragment>
      <ListPage
        disableAdd
        columns={configTimeKeeping}
        onEdit={handleOpenEditConfigDialog}
        apiUrl={API_TIMEKEEPING_EQUIPMENT}
        // filter={filter}
        reload={reload}
        settingBar={[addItem()]}
        onDelete={handleTimekeepingDelete}
      />

      <SwipeableDrawer anchor="right" onClose={handleCloseAddConfigDialog} open={openDialog}  width={window.innerWidth - 260}>
        <Grid >
          <AddTimekeeping update={update} timekeeping={selectConfigTimekeeping} onClose={handleCloseAddConfigDialog} onUpdate={handleUpdate}  propsAll={props} />
        </Grid>
      </SwipeableDrawer>
    </React.Fragment>
  );
}

export default ConfigHrmTimekeep;
