import React, { useCallback, useEffect, useState } from 'react';
import { Grid } from 'components/LifetekUi';
import { Typography, AppBar, Toolbar, IconButton, Button } from '@material-ui/core';
import { Edit, GpsFixed, Person, ExpandMore, Close } from '@material-ui/icons';

import { API_TIMEKEEPING_ADDEQUIPMENT } from 'config/urlConfig';
import ListPage from 'components/List';
import Department from 'components/Filter/DepartmentAndEmployee';
import { SwipeableDrawer } from 'components/LifetekUi';
import EditEmployees from '../EditEmployees/Loadable';
import { configAddTimeKeeping } from 'variable';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import './index.css'
function AddTimekeeping(props) {
  const { update, timekeeping, onUpdate, onClose, onChangeSnackbar,profile } = props;
  const [configState, setConfigState] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [configMessages, setConfigMessages] = useState({});
  const [selectEditEmployees, setSelectEditEmployees] = useState(false);

  useEffect(
    () => {
      if (timekeeping) {
        setConfigState({ ...timekeeping });
      } else {
        setConfigState({});
      }
    },
    [timekeeping],
  );

  // useEffect(
  //   () => {
  //     const messages = viewConfigCheckForm(code, configState);
  //     setConfigMessages(messages);
  //     return () => {
  //       messages;
  //     };
  //   },
  //   [configState],
  // );

  const handleOpenEditConfigDialog = row => {
    setSelectEditEmployees(row);
    setOpenDialog(true);
  };

  const handleCloseEditConfigDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleInputChange = e => {
    setConfigState({
      ...configState,
      [e.target.name]: e.target.value,
    });
  };

  const handeChangeDepartment = useCallback(
    result => {
      const { department } = result;
      setConfigState({ ...configState, organizationUnit: department });
    },
    [configState],
  );

  const handleTimekeepingUpdate = e => {
    if (Object.keys(configMessages).length === 0) {
      // console.log('check>>>>', configState)
      onUpdate(configState);
    } else {
      onChangeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' });
    }
  };
 console.log("bbbb", props)
  return (
    <React.Fragment>
      <Grid container spacing={24} style={{marginTop: 70}}> 
      <AppBar className={props.timekeeping === null ? "HearderappBarTimeKeeptingADD" : "HearderappBarTimeKeeptingCN"}>
              <Toolbar>
                <IconButton
                  // className={id !== 'add' ? '' : ''}
                  className={props.timekeeping ===  null  ? "BTNTimeKeeptingADD" : "BTNTimeKeeptingCN"}
                  color="inherit"
                  variant="contained"
                  onClick={() => props.onClose()}
                  aria-label="Close"
                >
                  <Close />
                </IconButton>
                <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                  {/* {props.timekeeping === null ? `Thêm mới` : `cập nhật`} */}
                  CẤU HÌNHhihichafo anh
                </Typography>
                {/* {showButtonEx()} */}

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleTimekeepingUpdate}
                >
                  LƯU
                </Button>
              </Toolbar>
            </AppBar>
        <Grid item xl={12} xs={12}>
          <Typography variant="h4" color="primary">
            CẤU HÌNH
          </Typography>
        </Grid>
        <Grid item xl={6} xs={6}>
          <CustomInputBase name="code" label="Mã máy chấm công" onChange={handleInputChange} value={configState.code} />
        </Grid>

        <Grid item xl={6} xs={6}>
          <CustomInputBase name="name" label="Tên máy chấm công" onChange={handleInputChange} value={configState.name} />
        </Grid>

        <Grid item xl={3} xs={3}>
          <Department onChange={handeChangeDepartment} department={configState.organizationUnit} disableEmployee moduleCode="hrm" profile={profile} />
        </Grid>

        {update && (
          <Grid item xl={12} xs={12}>
            <Typography variant="h6">DANH SÁCH NHÂN VIÊN PHÒNG/BAN:</Typography>
            <ListPage
              apiUrl={API_TIMEKEEPING_ADDEQUIPMENT}
              columns={configAddTimeKeeping}
              disableSearch
              disableAdd
              disableConfig
              onEdit={handleOpenEditConfigDialog}
            />
          </Grid>
        )}

        <SwipeableDrawer anchor="right" onClose={handleCloseEditConfigDialog} open={openDialog}  width={window.innerWidth - 260}>
          <Grid 
            // style={{ width: window.innerWidth - 260 }}
            >
            <EditEmployees employees={selectEditEmployees} onClose={handleCloseEditConfigDialog} propsAll={props} />
          </Grid>
        </SwipeableDrawer>

        <Grid item xl={12} xs={12}>
          <Grid container spacing={8} justify="flex-end">
            {/* <Grid item>
              <CustomButton variant="outlined" color="primary" onClick={handleTimekeepingUpdate}>
                {update ? 'LƯU' : 'LƯU'}
              </CustomButton>
            </Grid> */}
            {/* <Grid item>
              <CustomButton variant="outlined" color="secondary" onClick={e => onClose()}>
                Hủy
              </CustomButton>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default AddTimekeeping;
