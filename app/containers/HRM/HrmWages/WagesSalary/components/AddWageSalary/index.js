/**
 *
 * AddWageSalary
 *
 */

import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField, Tooltip, Typography } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CustomButton from 'components/Button/CustomButton';
import Department from 'components/Filter/DepartmentAndEmployee';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import CustomInputBase from 'components/Input/CustomInputBase';
import PropTypes from 'prop-types';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { compose } from 'redux';
import { viewConfigCheckForm, viewConfigCheckRequired, viewConfigHandleOnChange, viewConfigName2Title } from 'utils/common';
/* eslint-disable react/prefer-stateless-function */
function AddWageSalary(props) {
  const { wageSalary, onSave, onClose, code, open, onChangeSnackbar, salaryFormula, profile } = props;
  const [localState, setLocalState] = useState({
    month: '',
    year: '',
    file: {},
    others: {},
    formula: '',
  });
  const [name2Title, setName2Title] = useState({});
  const [checkRequired, setCheckRequired] = useState({});
  const [checkShowForm, setCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});

  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    const messages = viewConfigCheckForm(code, localState);
    setLocalMessages(messages);
    setCheckRequired(checkRequired);
    setCheckShowForm(checkShowForm);
    return () => {
      newNam2Title;
      checkRequired;
      checkShowForm;
      messages;
    }
  }, []);

  useEffect(
    () => {
      if (wageSalary && wageSalary.originItem) {
        setLocalState({ ...wageSalary.originItem });
      } else {
        setLocalState({});
      }
    },
    [wageSalary],
  );

  const handleInputChange = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
    const messages = viewConfigHandleOnChange(code, localMessages, e.target.name, e.target.value);
    setLocalMessages(messages);
  };

  const handleOtherDataChange = useCallback(newOther => {
    setLocalState(state => ({ ...state, others: newOther }));
  }, [localState]);

  const handeChangeDepartment = useCallback(result => {
    const { department, employee } = result;
    setLocalState({ ...localState, organizationUnitId: department, inChargedEmployeeId: employee && employee._id, employee });
  }, [localState]);

  const handleSave = () => {
    if (localState.month && localState.year && localState.organizationUnitId && localState.formula && localState.inChargedEmployeeId !== null) {
      onSave(localState);
      setLocalState({});
      onClose();
    } 
    if (!localState.month) {
      setLocalMessages({ ...localMessages, month: 'Không được để trống tháng' })
    } else {
      delete localMessages.month
    }
    if (!localState.year) {
      setLocalMessages({ ...localMessages, year: 'Không được để trống năm' })
    } else {
      delete localMessages.year
    }
    if (!localState.formula) {onChangeSnackbar({ status: true, message: 'Không được để trống công thức lương', variant: 'error' })} 
    if (!localState.organizationUnitId) { onChangeSnackbar({ status: true, message: 'Không được để trống phòng ban', variant: 'error' }) }
    if (localState.inChargedEmployeeId === null) { onChangeSnackbar({ status: true, message: 'Không được để trống người phụ trách', variant: 'error' }) }
  }
  const handleClose = () => {
    setLocalState({});
    onClose();
  }


  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">Thêm bảng lương</DialogTitle>
        <DialogContent style={{ width: 600 }}>
          <Grid container direction="row" justify="center" alignItems="flex-start" spacing={8}>

            <Grid item xs={6}>
              <CustomInputBase type="number" label={name2Title.month} value={localState.month} name="month" onChange={handleInputChange}
                required={checkRequired && checkRequired.month}
                checkedShowForm={checkShowForm && checkShowForm.month}
                error={localMessages && localMessages.month}
                helperText={localMessages && localMessages.month}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomInputBase type="number" label={name2Title.year} value={localState.year} name="year" onChange={handleInputChange}
                required={checkRequired && checkRequired.year}
                checkedShowForm={checkShowForm && checkShowForm.year}
                error={localMessages && localMessages.year}
                helperText={localMessages && localMessages.year}
              />
            </Grid>

            <Grid item xs={12}>
              <Department onChange={handeChangeDepartment} department={localState.organizationUnitId} employee={localState.employee} labelEmployee="Người phụ trách" profile={profile} moduleCode="HrmTimekeepingTable" />
            </Grid>
            <Grid item xs={12}>
              <CustomInputBase
                value={localState.formula}
                onChange={handleInputChange}
                name="formula"
                select
                label={'Công thức lương'}
                required={checkRequired && checkRequired.formula}
                checkedShowForm={checkShowForm && checkShowForm.formula}
                error={localMessages && localMessages.formula}
                helperText={localMessages && localMessages.formula}
              >
                {Array.isArray(salaryFormula) && salaryFormula.map((item, index) => {
                  return (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  )
                })}
              </CustomInputBase>

            </Grid>
            <Grid item xs={12}>
              <TextField
                type="file"
                name="file"
                onChange={(e) => setLocalState(prevState => ({ ...prevState, file: e.target.files[0] }))}
                id="HIDDEN"
                style={{ display: 'none' }}
              />
              <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                <Typography variant="body1">{localState.file && localState.file.name}</Typography>
                <label htmlFor="HIDDEN">
                  <Tooltip title="Import">
                    <CloudDownloadIcon color="primary"
                      style={{ cursor: "pointer", marginLeft: '5px' }}
                    />
                  </Tooltip>
                </label>
                <Typography>{localState.file && localState.file.name ? "Import bảng chấm công" : ''}</Typography>
              </Grid>
            </Grid>

            <CustomGroupInputField code={code} columnPerRow={1} value={localState.others} onChange={handleOtherDataChange} />
          </Grid>

        </DialogContent>
        <DialogActions>
          <Grid item xs={12}>
            <Grid container spacing={8} justify="flex-end">
              <Grid item>
                <CustomButton
                  color="primary"
                  onClick={e => {
                    // if (Object.keys(localMessages).length === 0) {
                      handleSave()
                    // } else {
                    //   onChangeSnackbar({ status: true, message: 'Thêm mới thất bại!', variant: 'error' })
                    // }
                  }}
                >
                  Lưu
                </CustomButton>
              </Grid>
              <Grid item>
                <CustomButton color="secondary" onClick={e => handleClose()}>
                  HỦY
                  </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
}


AddWageSalary.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default compose(
  memo
)(AddWageSalary);
