import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, AppBar, Toolbar, IconButton, Button } from '@material-ui/core';
import React, { memo, useState, useCallback, useEffect } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import { AsyncAutocomplete } from 'components/LifetekUi';
import { API_TASK_PROJECT, API_HRM_EMPLOYEE } from 'config/urlConfig';
import CustomButton from 'components/Button/CustomButton';
import { SwipeableDrawer } from '../../../../../../components/LifetekUi';
import { Info, Close } from '@material-ui/icons';
import moment from 'moment';
import CustomAppBar from 'components/CustomAppBar';

import CustomDatePicker from '../../../../../../components/CustomDatePicker';
import './style.css'
import CustomGroupInputField from '../../../../../../components/Input/CustomGroupInputField';
function AddPlanOverTime(props) {
  const { onSave, reload, onClose, code, open, planOT } = props;
  const [localState, setLocalState] = useState({
    taskId: {},
    join: [],
    startDate: new Date(),
    endDate: new Date(),
  });
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');

  useEffect(
    () => {
      if (planOT && planOT.originItem) {
        setLocalState({ ...planOT.originItem });
      }
    },
    [planOT],
  );

  const handleChange = e => {
    const {
      target: { value, name },
    } = e;
    setLocalState({
      ...localState,
      [name]: value,
    });
  };

  const handleInputChange = (e, isStartDate) => {
    //setLocalState({ ...localState, [e.target.name]: e.target.value });
    const name = isStartDate ? 'startDate' : 'endDate';
    const value = isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    // setTime({ ...time, [name]: value });
    const newFilter = { ...localState, [name]: value };

    // TT
    if (!newFilter.startDate && newFilter.endDate) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('nhập thiếu: "Từ ngày"');
      setErrorTextEndDate('');
    } else if (newFilter.startDate && !newFilter.endDate) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('');
      setErrorTextEndDate('nhập thiếu: "Đến ngày"');
    } else if (newFilter.startDate && newFilter.endDate && new Date(newFilter.endDate) < new Date(newFilter.startDate)) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('"Từ ngày" phải nhỏ hơn "Đến ngày"');
      setErrorTextEndDate('"Đến ngày" phải lớn hơn "Từ ngày"');
    } else {
      setErrorStartDateEndDate(false);
      setErrorTextStartDate('');
      setErrorTextEndDate('');
    }
    setLocalState(newFilter);
    // setFilter({ ...filter, [name]: value })
  };

  const handleChangeTask = value => {
    const { join } = value;

    if (localState.join) {
      console.log(1, localState.join);
    }

    setLocalState({
      ...localState,
      taskId: value && value._id,
      join: join || [],
    });
  };

  const handleChangeJoin = value => {
    setLocalState({
      ...localState,
      join: value,
    });
  };
  
  const handleOtherDataChange = useCallback(newOther => {
    setLocalState(state => ({ ...state, others: newOther }));
  }, [localState]);

  const handleSave = () => {
    if (onSave) {
      onSave(localState);
    }
  };
  return (
    <React.Fragment>
      <SwipeableDrawer anchor="right" onClose={onClose} open={open} width= {window.innerWidth - 260}>
        <div style={{ padding: '15px', marginTop: '70px' }}>
          <Grid container spacing={16}>
          {/* <AppBar className={props.planOT === null ? "HearderappBarPlanOverTime" : "HearderappBarPlanOverTimeID"}>
                <Toolbar>
                    <IconButton
                      className={props.planOT === null ? "BTNPlanOverTime" : "BTNPlanOverTimeID"}
                      color="inherit"
                      variant="contained"
                      onClick={onClose}
                      aria-label="Close"
                    >
                      <Close />
                    </IconButton>
                  <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
                  {props.planOT === null ? 'THÊM MỚI Kế hoạch OT' : 'CẬP NHẬT'}
                  </Typography>
                  <Button variant="outlined" color="inherit" onClick={handleSave}>
                    LƯU
                  </Button>
                </Toolbar>
              </AppBar> */}
              <CustomAppBar
          title={props.planOT === null ? 'THÊM MỚI Kế hoạch OT' : 'CẬP NHẬT'}

          onGoBack={onClose}
          onSubmit={handleSave}
        />
            <Grid item xs={6}>
              <CustomDatePicker name="startDate" label="Từ ngày" value={localState.startDate} onChange={e => handleInputChange(e, true)} />
              {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextStartDate}</Typography> : null}
            </Grid>
            <Grid item xs={6}>
              <CustomDatePicker name="endDate" label="Đến ngày" value={localState.endDate} onChange={e => handleInputChange(e, false)} />
              {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextEndDate}</Typography> : null}
            </Grid>
            <Grid item xs={12}>
              <AsyncAutocomplete
                label="Dự án"
                onChange={value => handleChangeTask(value)}
                value={localState.taskId}
                url={API_TASK_PROJECT}
                optionValue="_id"
                optionlabel="name"
              />
            </Grid>
            <Grid item xs={12}>
              <AsyncAutocomplete
                isMulti
                label="Nhân sự"
                value={localState.join}
                onChange={value => handleChangeJoin(value)}
                url={API_HRM_EMPLOYEE}
                optionValue="_id"
                optionlabel="name"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomGroupInputField
              code="HrmOverTime"
              columnPerRow={2}
              value={localState.others}
              onChange={handleOtherDataChange}
              />
            </Grid>
          </Grid>
          {/* <Grid container spacing={16} justify="flex-end">
            <Grid item>
              <CustomButton color="primary" onClick={handleSave}>
                Lưu
              </CustomButton>
            </Grid>
            <Grid item>
              <CustomButton color="secondary" onClick={onClose}>
                Đóng
              </CustomButton>
            </Grid>
          </Grid> */}
        </div>
      </SwipeableDrawer>
    </React.Fragment>
  );
}

export default memo(AddPlanOverTime);
