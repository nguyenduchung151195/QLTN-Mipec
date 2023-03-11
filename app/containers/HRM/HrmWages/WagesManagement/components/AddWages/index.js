/**
 *
 * AddWages
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import { AsyncAutocomplete } from 'components/LifetekUi';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Tooltip, Typography } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import Department from 'components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm, viewConfigHandleOnChange } from 'utils/common';
import { API_USERS } from '../../../../../../config/urlConfig';
import { compose } from 'redux';
/* eslint-disable react/prefer-stateless-function */
function AddWages(props) {
  const { wages, onSave, onClose, code, open, onChangeSnackbar, profile } = props;
  const [localState, setLocalState] = useState({
    month: '',
    year: '',
    file: {},
    others: {},
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
      if (wages && wages.originItem) {
        setLocalState({ ...wages.originItem });
      } else {
        setLocalState({});
      }
    },
    [wages],
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
    if (localState.month && localState.year && localState.organizationUnitId && localState.inChargedEmployeeId !== null) {
      onSave(localState);
      setLocalState({});
    } else {
      if (!localState.month) {
        setLocalMessages({...localMessages, month: 'Không được để trống tháng'})
      } else {
        delete localMessages.month
      }
      if (!localState.year) {
        setLocalMessages({...localMessages, year: 'Không được để trống năm'})
      } else {
        delete localMessages.year
      }
      if (!localState.organizationUnitId) {onChangeSnackbar({ status: true, message: 'Không được để trống phòng ban', variant: 'error' })}
      if (localState.inChargedEmployeeId === null) {onChangeSnackbar({ status: true, message: 'Không được để trống người phụ trách', variant: 'error' })}
    }
  }

  const handleClose = () => {
    onClose();
    setLocalState({});
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">Thêm bảng công</DialogTitle>
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
                    if (Object.keys(localMessages).length === 0) {
                      handleSave()
                    } else {
                      onChangeSnackbar({ status: true, message: 'Thêm mới thất bại!', variant: 'error' })
                    }
                  }}
                >
                  Lưu
                </CustomButton>
              </Grid>
              <Grid item>
                <CustomButton color="secondary"  onClick={e => handleClose()}>
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


AddWages.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default compose(memo)(AddWages);
