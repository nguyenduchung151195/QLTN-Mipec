/**
 *
 * AddProcess
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import { Grid, Typography } from '../../../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import CustomInputField from '../../../../../../../../components/Input/CustomInputField';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import moment from 'moment';
/* eslint-disable react/prefer-stateless-function */
function AddProcess(props) {
  const { process, onSave, onClose, code, hrmEmployeeId } = props;
  const [localState, setLocalState] = useState({
    others: {},
  });
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [name2Title, setName2Title] = useState({});

  useEffect(() => {
    const newName2Title = viewConfigName2Title(code);
    setName2Title(newName2Title);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    setLocalCheckRequired(checkRequired);
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    setLocalCheckShowForm(checkShowForm);
    return () => {
      newName2Title;
      checkRequired;
      checkShowForm;
    }
  }, []);

  useEffect(
    () => {
      if (process && process.originItem) {
        setLocalState({ ...process.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [process],
  );

  useEffect(() => {
    const messages = viewConfigCheckForm(code, localState);
    setLocalMessages(messages);
    return () => {
      messages;
    }
  }, [localState])

  const handleInput = (e, isDate) => {
    const name = isDate ?  'decisionDate' : 'efficiencyDate';
    const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD') ;
    setLocalState({ ...localState, [name]: value });
  };

  const handleInputDuration = (e) => {
    const name = 'duration';
    const value = moment(e).format('YYYY-MM-DD') ;
    setLocalState({ ...localState, [name]: value });
  };

  const handleInputChange = (e) => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const handleOtherDataChange = useCallback(newOther => {
    setLocalState(state => ({ ...state, others: newOther }));
  }, [localState]);
  return (
    <>
      <Grid container>
        <Typography variant="h5" color="primary">
          <Info />
          Thông tin quá trình điều chuyển/bổ nhiệm
        </Typography>
      </Grid>

      <Grid container spacing={8}>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.decisionNumber} value={localState.decisionNumber} name="decisionNumber" onChange={handleInputChange}
             checkedShowForm={localCheckShowForm && localCheckShowForm.decisionNumber}
            required={localCheckRequired && localCheckRequired.decisionNumber}
            error={localMessages && localMessages.decisionNumber}
            helperText={localMessages && localMessages.decisionNumber} />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.decisionDate || "Chọn ngày"}
            value={localState.decisionDate}
            name="decisionDate"
            onChange={e => handleInput(e, true )} checkedShowForm={localCheckShowForm && localCheckShowForm.decisionDate}
            required={localCheckRequired && localCheckRequired.decisionDate}
            error={localMessages && localMessages.decisionDate}
            helperText={localMessages && localMessages.decisionDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.efficiencyDate || "Chọn ngày"}
            value={localState.efficiencyDate}
            name="efficiencyDate"
            onChange={e => handleInput(e,  false )} checkedShowForm={localCheckShowForm && localCheckShowForm.efficiencyDate}
            required={localCheckRequired && localCheckRequired.efficiencyDate}
            error={localMessages && localMessages.efficiencyDate}
            helperText={localMessages && localMessages.efficiencyDate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker label={name2Title.duration || "Chọn ngày"} value={localState.duration} name="duration" onChange={e => handleInputDuration(e,  true )}
            checkedShowForm={localCheckShowForm && localCheckShowForm.duration}
            required={localCheckRequired && localCheckRequired.duration}
            error={localMessages && localMessages.duration}
            helperText={localMessages && localMessages.duration} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Thông tin phòng ban/chức vụ hiện tại
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            select
            label={name2Title.oldOrganizationUnit}
            value={localState.oldOrganizationUnit}
            name="oldOrganizationUnit"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={4}>
          {/* <CustomInputBase label={name2Title.oldPosition} value={localState.oldPosition} name="oldPosition" onChange={handleInputChange} /> */}
          <CustomInputField
            value={localState.oldPosition}
            onChange={handleInputChange}
            name="oldPosition"
            label={name2Title["oldPosition.title"]}
            type="1"
            configType="hrmSource"
            configCode="S16"
            checkedShowForm={localCheckShowForm && localCheckShowForm["oldPosition.title"]}
            required={localCheckRequired && localCheckRequired["oldPosition.title"]}
            error={localMessages && localMessages["oldPosition.title"]}
            helperText={localMessages && localMessages["oldPosition.title"]}
          />
        </Grid>
        <Grid item xs={4}>
          {/* <CustomInputBase select label={name2Title.oldTitle} value={localState.oldTitle} name="oldTitle" onChange={handleInputChange} /> */}
          <CustomInputField
            value={localState.oldTitle}
            onChange={handleInputChange}
            name="oldTitle"
            label={name2Title["oldTitle.title"]}
            type="1"
            configType="hrmSource"
            configCode="S04"
            checkedShowForm={localCheckShowForm && localCheckShowForm["oldTitle.title"]}
            required={localCheckRequired && localCheckRequired["oldTitle.title"]}
            error={localMessages && localMessages["oldTitle.title"]}
            helperText={localMessages && localMessages["oldTitle.title"]}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Điều chuyển tới
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            select
            label={name2Title.newOrganizationUnit}
            value={localState.newOrganizationUnit}
            name="newOrganizationUnit"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={4}>
          {/* <CustomInputBase label={name2Title.newPosition} value={localState.newPosition} name="newPosition" onChange={handleInputChange} /> */}
          <CustomInputField
            value={localState.newPosition}
            onChange={handleInputChange}
            name="newPosition"
            label={name2Title["newPosition.title"]}
            type="1"
            configType="hrmSource"
            configCode="S16" checkedShowForm={localCheckShowForm && localCheckShowForm["newPosition.title"]}
            required={localCheckRequired && localCheckRequired["newPosition.title"]}
            error={localMessages && localMessages["newPosition.title"]}
            helperText={localMessages && localMessages["newPosition.title"]}
          />
        </Grid>
        <Grid item xs={4}>

          {/* <CustomInputBase select label={name2Title.newTitle} value={localState.newTitle} name="newTitle" onChange={handleInputChange} /> */}
          <CustomInputField
            value={localState.newTitle}
            onChange={handleInputChange}
            name="newTitle"
            label={name2Title["newTitle.title"]}
            type="1"
            configType="hrmSource"
            configCode="S04"
            checkedShowForm={localCheckShowForm && localCheckShowForm["newTitle.title"]}
            required={localCheckRequired && localCheckRequired["newTitle.title"]}
            error={localMessages && localMessages["newTitle.title"]}
            helperText={localMessages && localMessages["newTitle.title"]}
          />
        </Grid>
        {/* <Grid item xs={4}>
          <CustomInputBase select label={name2Title.newTitle} value={localState.newTitle} name="newTitle" onChange={handleInputChange} />
        </Grid> */}
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Lý do/ghi chú
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.reason} value={localState.reason} name="reason" onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.reason}
            required={localCheckRequired && localCheckRequired.reason}
            error={localMessages && localMessages.reason}
            helperText={localMessages && localMessages.reason} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.node} value={localState.node} name="node" onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.node}
            required={localCheckRequired && localCheckRequired.node}
            error={localMessages && localMessages.node}
            helperText={localMessages && localMessages.node} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label="File Upload"
            name="url"
            type="file"

          />
        </Grid>
      </Grid>
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
      <Grid container spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton
            color="primary"
            onClick={e => {
              onSave(localState);
            }}
          >
            Lưu
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={e => onClose()}>
            hủy
          </CustomButton>
        </Grid>
      </Grid>
    </>
  );
}

AddProcess.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddProcess);
