/**
 *
 * AddRecruitmentManagement
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Info, Close } from '@material-ui/icons';
import { AsyncAutocomplete, Grid, Typography } from '../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../components/Input/CustomGroupInputField';
import { viewConfigName2Title } from 'utils/common';
import KanbanStepper from '../../../../../../components/KanbanStepper';
import Department from '../../../../../../components/Filter/DepartmentAndEmployee';
import { MenuItem, AppBar, Toolbar, IconButton, Button } from '@material-ui/core';
import CustomInputField from '../../../../../../components/Input/CustomInputField';
import { API_USERS, API_VANCANCIES } from 'config/urlConfig';
import moment from 'moment';
import CustomDatePicker from '../../../../../../components/CustomDatePicker';
import CustomAppBar from 'components/CustomAppBar';
import axios from 'axios'
import { serialize } from 'helper';

import './style.css';
/* eslint-disable react/prefer-stateless-function */
function AddRecruitmentManagement(props) {
  const { recruitmentManagement, onSave, onClose, code, humanResource, fieldRole, countEmployee, positionVacation, getCountHrmByRole, getPositionVacation, profile } = props;
  const [listKanbanStatus, setListKanbanStatus] = useState([]);
  const [localState, setLocalState] = useState({
    others: {},
  });
  const [name2Title, setName2Title] = useState({});

  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);
  }, []);

  useEffect(
    () => {
      const { unitId, vacancy } = localState;
      if (unitId && vacancy && vacancy.roleCode) {
        getCountHrmByRole(vacancy.roleCode, unitId);
      }
    },
    [localState.unitId, localState.vacancy],
  );
  useEffect(
    () => {
      const { vacancy } = localState;
      if (vacancy && vacancy.roleCode) {
        getPositionVacation(vacancy.roleCode);
      }
    },
    [localState.vacancy],
  );

  useEffect(
    () => {
      const { unitId, vacancy } = localState;
      if (unitId && vacancy && vacancy.roleCode) {
        calAmountHumanResource(unitId, vacancy);
      }
    },
    [localState.unitId, localState.vacancy, countEmployee],
  );

  useEffect(
    () => {
      let kanbanStatus;
      const listKanBan = JSON.parse(localStorage.getItem('hrmStatus'));
      if (listKanBan) {
        let hrmKanbanStatuses = listKanBan.find(p => p.code === 'ST06');
        if (hrmKanbanStatuses && hrmKanbanStatuses.data) {
          const { _id } = hrmKanbanStatuses.data[0];
          kanbanStatus = _id;
          setListKanbanStatus(hrmKanbanStatuses.data);
        }
      }
      if (recruitmentManagement && recruitmentManagement.originItem) {
        const { dateFounded, dateNeed, unitId } = recruitmentManagement.originItem;
        setLocalState({
          ...recruitmentManagement.originItem,
          unitId: unitId && unitId._id,
          dateFounded: formatDate(dateFounded),
          dateNeed: formatDate(dateNeed),
        });
      } else {
        setLocalState({ ...localState, proponent: profile, kanbanStatus, gender: 0 });
      }
    },
    [recruitmentManagement],
  );

  const formatDate = date => {
    if (date) {
      return moment(date).format('YYYY-MM-DD');
    }
    return date;
  };

  const handleInputChange = useCallback(
    (e, isDate, date) => {
      const name = isDate ? 'dateFounded' : 'dateNeed';
      const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
      if (date) {
        setLocalState({ ...localState, [name]: value });
      } else {
        setLocalState({ ...localState, [e.target.name]: e.target.value });
      }
    },
    [localState],
  );

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  const handeChangeDepartment = useCallback(
    result => {
      const { department } = result;
      setLocalState({ ...localState, unitId: department });
    },
    [localState],
  );

  const handleChangeProponent = useCallback(
    value => {
      setLocalState({ ...localState, proponent: value });
    },
    [localState],
  );

  const handleChangeVacancy = useCallback(
    e => {
      const {
        target: { name, value },
      } = e;
      const vacancy = { roleName: value.name, roleCode: value.code };
      setLocalState({ ...localState, [name]: vacancy });
    },
    [localState],
  );
  const handleChangePosition = useCallback(
    e => {
      const {
        target: { name, value },
      } = e;
      const position = { ...value, name: value.name, code: value.code };
      setLocalState({ ...localState, [name]: position });
    },
    [localState],
  );

  const handleInputField = useCallback(
    e => {
      const {
        target: { name, value: obj },
      } = e;
      const newObj = { title: obj.title || '', value: obj.value || '' };
      setLocalState({ ...localState, [name]: newObj });
    },
    [localState],
  );

  const getValueFieldRole = value => {
    if (!value) return null;
    return fieldRole.find(it => it.code === value.roleCode);
  };
  const getValuePosition = value => {
    if (!value) return null;
    return positionVacation.find(it => it.name === value.name);
  };

  function calAmountHumanResource(unitId, vacancy) {
    const foundHumanResource = Array.isArray(humanResource) && humanResource.length > 0 ? humanResource.find(it => it.unitId === unitId) : null;
    const foundValueByRoleCode = foundHumanResource
      ? Array.isArray(foundHumanResource.roles) && foundHumanResource.roles.length > 0
        ? foundHumanResource.roles.find(it => it.code === vacancy.code)
        : null
      : null;
    const amountHumanResource = foundValueByRoleCode ? foundValueByRoleCode.value : 0;
    const amountVacancy = amountHumanResource - countEmployee;
    setLocalState({ ...localState, amount: amountVacancy >= 0 ? amountVacancy : 0 });
  }
  return (
    <>
      <CustomAppBar
        title={props.recruitmentManagement === null
          ? 'THÊM MỚI NHU CẦU TUYỂN DỤNG'
          : 'CẬP NHẬT NHU CẦU TUYỂN DỤNG'}
        onGoBack={onClose}
        onSubmit={e => {
          onSave(localState);
        }}
      />
      <Grid>
        <KanbanStepper
          listStatus={listKanbanStatus}
          onKabanClick={value => {
            setLocalState({ ...localState, kanbanStatus: value });
          }}
          activeStep={localState.kanbanStatus}
        />
      </Grid>
      <Grid container>
        <Typography variant="h5" color="primary">
          <Info />
          Quản lý nhu cầu tuyển dụng
        </Typography>
      </Grid>

      <Grid container spacing={8}>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.name} value={localState.name} name="name" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <Department onChange={handeChangeDepartment} department={localState.unitId} disableEmployee profile={profile} moduleCode="HrmRecruitment" />
        </Grid>
        <Grid item xs={4}>
          <AsyncAutocomplete
            url={API_USERS}
            onChange={value => handleChangeProponent(value)}
            value={localState.proponent}
            label={name2Title.proponent}
            optionLabel="name"
            optionValue="_id"
          />
          {/* <CustomInputBase label={name2Title.proponent} value={localState.proponent ? localState.proponent.name : ''} name="proponent" onChange={handleInputChange} disabled /> */}
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.dateFounded || 'Chọn ngày'}
            value={localState.dateFounded}
            name="dateFounded"
            onChange={e => handleInputChange(e, true, true)}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title.dateNeed || 'Chọn ngày'}
            value={localState.dateNeed}
            name="dateNeed"
            onChange={e => handleInputChange(e, false, true)}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.reason} value={localState.reason} name="reason" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            Chi tiết nhu cầu tuyển dụng
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            select
            label={name2Title['vacancy.roleName']}
            value={getValueFieldRole(localState.vacancy)}
            name="vacancy"
            onChange={handleChangeVacancy}
          >
            {Array.isArray(fieldRole) && fieldRole.length > 0 ? fieldRole.map(field => <MenuItem value={field}>{field.name}</MenuItem>) : null}
          </CustomInputBase>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            select
            label={"Vị trí tuyển dụng"}
            value={getValuePosition(localState.vacanciesId)}
            name="vacanciesId"
            onChange={handleChangePosition}
          >
            {Array.isArray(positionVacation) && positionVacation.length > 0 ? positionVacation.map(field => <MenuItem value={field}>{field.name}</MenuItem>) : null}
          </CustomInputBase>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.amount} value={localState.amount} name="amount" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="number"
            label={name2Title.amountApprove}
            value={localState.amountApprove}
            name="amountApprove"
            onChange={handleInputChange}
            disabled
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputField
            select
            value={localState.certificate}
            onChange={handleInputField}
            name="certificate"
            label={name2Title['certificate']}
            type="1"
            configType="hrmSource"
            configCode="S07"
          // checkedShowForm={localCheckShowForm && localCheckShowForm["certificate.title"]}
          // required={localCheckRequired && localCheckRequired["certificate.title"]}
          // error={localMessages && localMessages["certificate.title"]}
          // helperText={localMessages && localMessages["certificate.title"]}
          />
          {/* <CustomInputBase label={name2Title['certificate']} value={localState.certificate} name="certificate" onChange={handleInputChange} /> */}
        </Grid>
        <Grid item xs={4}>
          <CustomInputField
            select
            value={localState.specialized}
            onChange={handleInputField}
            name="specialized"
            label={name2Title['specialized']}
            type="1"
            configType="hrmSource"
            configCode="S06"
          // checkedShowForm={localCheckShowForm && localCheckShowForm["specialized.title"]}
          // required={localCheckRequired && localCheckRequired["specialized.title"]}
          // error={localMessages && localMessages["specialized.title"]}
          // helperText={localMessages && localMessages["specialized.title"]}
          />
          {/* <CustomInputBase label={name2Title['specialized']} value={localState.specialized} name="specialized" onChange={handleInputChange} /> */}
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.experienceYear} value={localState.experienceYear} name="experienceYear" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputField
            select
            value={localState.age}
            onChange={handleInputField}
            name="age"
            label={name2Title['age']}
            type="1"
            configType="hrmSource"
            configCode="S21"
          // checkedShowForm={localCheckShowForm && localCheckShowForm["specialized.title"]}
          // required={localCheckRequired && localCheckRequired["specialized.title"]}
          // error={localMessages && localMessages["specialized.title"]}
          // helperText={localMessages && localMessages["specialized.title"]}
          />
          {/* <CustomInputBase label={name2Title.age} value={localState.age} name="age" onChange={handleInputChange} /> */}
        </Grid>
        <Grid item xs={4}>
          <CustomInputField
            select
            value={localState.levelLanguage}
            onChange={handleInputField}
            name="levelLanguage"
            label={name2Title['levelLanguage']}
            type="1"
            configType="hrmSource"
            configCode="S09"
          // checkedShowForm={localCheckShowForm && localCheckShowForm["levelLanguage.title"]}
          // required={localCheckRequired && localCheckRequired["levelLanguage.title"]}
          // error={localMessages && localMessages["levelLanguage.title"]}
          // helperText={localMessages && localMessages["levelLanguage.title"]}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase select label={name2Title.gender} value={localState.gender} name="gender" onChange={handleInputChange} select>
            <MenuItem value={0}>Nam</MenuItem>
            <MenuItem value={1}>Nữ</MenuItem>
          </CustomInputBase>
        </Grid>
        <Grid item xs={4}>
          <CustomInputField
            select
            value={localState.marriage}
            onChange={handleInputField}
            name="marriage"
            label={name2Title['marriage']}
            type="1"
            configType="hrmSource"
            configCode="S02"
          // checkedShowForm={localCheckShowForm && localCheckShowForm["levelLanguage.title"]}
          // required={localCheckRequired && localCheckRequired["levelLanguage.title"]}
          // error={localMessages && localMessages["levelLanguage.title"]}
          // helperText={localMessages && localMessages["levelLanguage.title"]}
          />
          {/* <CustomInputBase select label={name2Title.marriage} value={localState.marriage} name="marriage" onChange={handleInputChange} /> */}
        </Grid>
        <Grid item xs={12}>
          <CustomInputBase rows={5} multiline label={name2Title.skill} value={localState.skill} name="skill" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={12}>
          <CustomInputBase
            rows={5}
            multiline
            label={name2Title.experience}
            value={localState.experience}
            name="experience"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomInputBase
            rows={5}
            multiline
            label={name2Title.requirementsOther}
            value={localState.requirementsOther}
            name="requirementsOther"
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
      <Grid container spacing={8} direction="row" justify="flex-end" alignItems="flex-end">
        {/* <Grid item xs={4}>
          <CustomInputBase select label="Chọn mẫu báo cáo" value={localState.reportForm} name="reportForm" onChange={handleInputChange} />
        </Grid> */}
        {/* <Grid item>
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
          <CustomButton color="secondary" onClick={onClose}>
            Đóng
          </CustomButton>
        </Grid> */}
      </Grid>
    </>
  );
}

AddRecruitmentManagement.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddRecruitmentManagement);
