/**
 *
 * AddEducations
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Info, Close } from '@material-ui/icons';
import { MenuItem, Button, Checkbox, Avatar, FormControlLabel, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Grid, Typography } from '../../../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import CustomDatePicker from '../../../../../../../../components/CustomDatePicker';
import CustomAppBar from 'components/CustomAppBar';

import moment from 'moment';
/* eslint-disable react/prefer-stateless-function */
function AddEducations(props) {
  const { education, onSave, onClose, code, hrmEmployeeId, profile } = props;
  const [localState, setLocalState] = useState({
    others: {},
  });
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [name2Title, setName2Title] = useState({});
  const [employee, setEmployee] = useState({});
  const [origin, setOrigin] = useState({});

  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');

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
    };
  }, []);

  useEffect(
    () => {
      if (education && education.originItem) {
        setLocalState({ ...education.originItem });
      } else {
        setLocalState({
          hrmEmployeeId: hrmEmployeeId,
        });
      }
    },
    [education],
  );

  useEffect(
    () => {
      const messages = viewConfigCheckForm(code, localState);
      setLocalMessages(messages);
      return () => {
        messages;
      };
    },
    [localState],
  );

  const handleInputChange = (e, isStartDate) => {
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
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  function handleDepartmentAndEmployeeChange(data) {
    const { department, employee } = data;
    setOrigin(department);
    setEmployee(employee);
  }
  return (
    <>
      {/* <AppBar className='HearderappBarEducation'>
        <Toolbar>
          <IconButton
            // className={id !== 'add' ? '' : ''}
            className='BTNEducation'
            color="inherit"
            variant="contained"
            onClick={e => onClose()}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            {props.educate === null
              ? 'THÊM MỚI'
              : 'CẬP NHẬT'}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={e => onSave(localState)}
          >
            LƯU
          </Button>
        </Toolbar>
      </AppBar> */}
      <CustomAppBar
        title={props.educate === null ? 'THÊM MỚI quản lí đào tạo' : 'CẬP NHẬT quản lí đào tạo'}
        onGoBack={e => onClose()}
        onSubmit={e => onSave(localState)}
      />
      <Grid container>
        <Typography variant="h5" color="primary">
          <Info />
          Thông tin đào tạo
        </Typography>
      </Grid>

      <Grid container spacing={8}>
        <Grid item xs={12}>
          <DepartmentAndEmployee
            onChange={handleDepartmentAndEmployeeChange}
            employee={employee}
            department={origin}
            profile={profile}
            moduleCode="EducateProcess"
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.decisionNumber}
            value={localState.decisionNumber}
            name="decisionNumber"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.decisionNumber}
            required={localCheckRequired && localCheckRequired.decisionNumber}
            error={localMessages && localMessages.decisionNumber}
            helperText={localMessages && localMessages.decisionNumber}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            select
            label={name2Title.educateTime}
            value={localState.educateTime}
            name="educateTime"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.educateTime}
            required={localCheckRequired && localCheckRequired.educateTime}
            error={localMessages && localMessages.educateTime}
            helperText={localMessages && localMessages.educateTime}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.startDate || 'Chọn ngày'}
            value={localState.startDate}
            name="startDate"
            onChange={e => handleInputChange(e, true)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.startDate}
            required={localCheckRequired && localCheckRequired.startDate}
            error={localMessages && localMessages.startDate}
            helperText={localMessages && localMessages.startDate}
          />
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextStartDate}</Typography> : null}
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.endDate || 'Chọn ngày'}
            value={localState.endDate}
            name="endDate"
            onChange={e => handleInputChange(e, false)}
            checkedShowForm={localCheckShowForm && localCheckShowForm.endDate}
            required={localCheckRequired && localCheckRequired.endDate}
            error={localMessages && localMessages.endDate}
            helperText={localMessages && localMessages.endDate}
          />
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextEndDate}</Typography> : null}
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.formsOfTraining}
            value={localState.formsOfTraining}
            name="formsOfTraining"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.formsOfTraining}
            required={localCheckRequired && localCheckRequired.formsOfTraining}
            error={localMessages && localMessages.formsOfTraining}
            helperText={localMessages && localMessages.formsOfTraining}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.categoriesTraining}
            value={localState.categoriesTraining}
            name="categoriesTraining"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.categoriesTraining}
            required={localCheckRequired && localCheckRequired.categoriesTraining}
            error={localMessages && localMessages.categoriesTraining}
            helperText={localMessages && localMessages.categoriesTraining}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Thông tin chi tiết
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.partnerTraining}
            value={localState.partnerTraining}
            name="partnerTraining"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.partnerTraining}
            required={localCheckRequired && localCheckRequired.partnerTraining}
            error={localMessages && localMessages.partnerTraining}
            helperText={localMessages && localMessages.partnerTraining}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.placesTraining}
            value={localState.placesTraining}
            name="placesTraining"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.placesTraining}
            required={localCheckRequired && localCheckRequired.placesTraining}
            error={localMessages && localMessages.placesTraining}
            helperText={localMessages && localMessages.placesTraining}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.countryTraining}
            value={localState.countryTraining}
            name="countryTraining"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.countryTraining}
            required={localCheckRequired && localCheckRequired.countryTraining}
            error={localMessages && localMessages.countryTraining}
            helperText={localMessages && localMessages.countryTraining}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.schoolTraining}
            value={localState.schoolTraining}
            name="schoolTraining"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.schoolTraining}
            required={localCheckRequired && localCheckRequired.schoolTraining}
            error={localMessages && localMessages.schoolTraining}
            helperText={localMessages && localMessages.schoolTraining}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.systemTraining}
            value={localState.systemTraining}
            name="systemTraining"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.systemTraining}
            required={localCheckRequired && localCheckRequired.systemTraining}
            error={localMessages && localMessages.systemTraining}
            helperText={localMessages && localMessages.systemTraining}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.specialized}
            value={localState.specialized}
            name="specialized"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.specialized}
            required={localCheckRequired && localCheckRequired.specialized}
            error={localMessages && localMessages.specialized}
            helperText={localMessages && localMessages.specialized}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.fields}
            value={localState.fields}
            name="fields"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.fields}
            required={localCheckRequired && localCheckRequired.fields}
            error={localMessages && localMessages.fields}
            helperText={localMessages && localMessages.fields}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.resultTraining}
            value={localState.resultTraining}
            name="resultTraining"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.resultTraining}
            required={localCheckRequired && localCheckRequired.resultTraining}
            error={localMessages && localMessages.resultTraining}
            helperText={localMessages && localMessages.resultTraining}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.diploma}
            value={localState.diploma}
            name="diploma"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.diploma}
            required={localCheckRequired && localCheckRequired.diploma}
            error={localMessages && localMessages.diploma}
            helperText={localMessages && localMessages.diploma}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.classTraining}
            value={localState.classTraining}
            name="classTraining"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.classTraining}
            required={localCheckRequired && localCheckRequired.classTraining}
            error={localMessages && localMessages.classTraining}
            helperText={localMessages && localMessages.classTraining}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.certificate}
            value={localState.certificate}
            name="certificate"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.certificate}
            required={localCheckRequired && localCheckRequired.certificate}
            error={localMessages && localMessages.certificate}
            helperText={localMessages && localMessages.certificate}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.scores}
            value={localState.scores}
            name="scores"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.scores}
            required={localCheckRequired && localCheckRequired.scores}
            error={localMessages && localMessages.scores}
            helperText={localMessages && localMessages.scores}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Thông tin chi phí
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.companyExpenses}
            value={localState.companyExpenses}
            name="companyExpenses"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.companyExpenses}
            required={localCheckRequired && localCheckRequired.companyExpenses}
            error={localMessages && localMessages.companyExpenses}
            helperText={localMessages && localMessages.companyExpenses}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.personalCosts}
            value={localState.personalCosts}
            name="personalCosts"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.personalCosts}
            required={localCheckRequired && localCheckRequired.personalCosts}
            error={localMessages && localMessages.personalCosts}
            helperText={localMessages && localMessages.personalCosts}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.otherCosts}
            value={localState.otherCosts}
            name="otherCosts"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.otherCosts}
            required={localCheckRequired && localCheckRequired.otherCosts}
            error={localMessages && localMessages.otherCosts}
            helperText={localMessages && localMessages.otherCosts}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.commitMonth}
            value={localState.commitMonth}
            name="commitMonth"
            onChange={handleInputChange}
            checkedShowForm={localCheckShowForm && localCheckShowForm.commitMonth}
            required={localCheckRequired && localCheckRequired.commitMonth}
            error={localMessages && localMessages.commitMonth}
            helperText={localMessages && localMessages.commitMonth}
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

AddEducations.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddEducations);
