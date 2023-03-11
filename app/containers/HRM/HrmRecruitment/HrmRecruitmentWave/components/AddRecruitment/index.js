/**
 *
 * AddRecruitment
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Info, Close } from '@material-ui/icons';
import { Grid, Typography, AsyncAutocomplete } from 'components/LifetekUi';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import Department from 'components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm } from 'utils/common';
import moment from 'moment';
import Buttons from 'components/CustomButtons/Button';
import { Helmet } from 'react-helmet';
import { API_USERS, API_HRM_RECRUITMEN, API_RECRUITMENT, API_HUMAN_RESOURCE } from 'config/urlConfig';
import { MenuItem, Button, Checkbox, Avatar, FormControlLabel,AppBar, Toolbar, IconButton } from '@material-ui/core';
import CustomInputField from 'components/Input/CustomInputField';
import KanbanStepper from 'components/KanbanStepper';
import { ValidatorForm } from 'react-material-ui-form-validator';
import CustomDatePicker from '../../../../../../components/CustomDatePicker';
import './style.css'
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */
  
function AddRecruitment(props) {
  const [localState, setLocalState] = useState({});

  const [kanbanStatuses, setKanbanStatuses] = useState(['']);
  const [name2Title, setName2Title] = useState({});
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});

  const { recruitmentWavePage, recruitmentWave, onSave, onClose, code, onGetRoleGroup } = props;
  console.log(recruitmentWave,recruitmentWavePage,'recruitmentWave')
  const { roleGroups } = recruitmentWavePage;
  
  useEffect(() => {
    onGetRoleGroup();

    setName2Title(viewConfigName2Title(code));
    setLocalCheckRequired(viewConfigCheckRequired(code, 'required'));
    setLocalCheckShowForm(viewConfigCheckRequired(code, 'showForm'));
    setLocalMessages(viewConfigCheckForm(code, localState));

    const listCrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    const crmStatus = listCrmStatus.find(element => String(element.code) === 'ST09');
    if (crmStatus) {
      setKanbanStatuses(crmStatus.data);
    }
  }, []);

  useEffect(
    () => {
      setLocalMessages(viewConfigCheckForm(code, localState));
    },
    [localState],
  );

  useEffect(
    () => {
      setLocalState(localState => ({ kanbanStatus: kanbanStatuses[0] && kanbanStatuses[0]._id, ...localState }));
    },
    [kanbanStatuses],
  );

  useEffect(
    () => {
      if (recruitmentWave && recruitmentWave.originItem) {
        setLocalState({ ...recruitmentWave.originItem, gender: getGender(recruitmentWave.originItem.gender) });
      } else {
        setLocalState({});
      }
    },
    [recruitmentWave],
  );

  const handleInputChange = useCallback((e,isDate) => {
    const name = isDate ? 'dateNeed' : 'dateFounded';
    const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    setLocalState({ ...localState, [name]: value });
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  }, [localState]);
  useEffect(()=>{
    if(localState && localState.vacanciesId){
      props.getId(localState.vacanciesId)
    }
  },[])

  const handleHrmRecruitmentChange = useCallback(
    e => {
      console.log(e,roleGroups,'kkkk')
      const vacancy = e.vacancy;
      const vacanciesId = e.vacanciesId._id;

      const role = roleGroups.find(role => role.code === vacancy.roleCode);
      const description = role && role.description;
      setLocalState({
        hrmRecruitmentId: e,
        dateFounded: formatDate(moment()),
        dateNeed: formatDate(moment()),
        name: e.name + ' - ' + vacancy.roleName,
        // hrmRecruitmentId: e.hrmRecruitment && e.hrmRecruitment._id,
        vacancy: vacancy,
        vacanciesId: vacanciesId,
        certificate: e.certificate,
        specialized: e.specialized,
        age: e.age,
        levelLanguage: e.levelLanguage,
        marriage: e.marriage,
        proponent: e.proponent,
        reason: e.reason,
        amount: e.amount,
        experienceYear: e.experienceYear ? e.experienceYear : null,
        gender: e.gender ? getGender(e.gender) : null,
        skill: e.skill ? e.skill : null,
        experience: e.experience ? e.experience : null,
        requirementsOther: e.requirementsOther ?  e.requirementsOther  : null,
        code:e.code ?  e.code : null,
        decisionNo: e.decisionNo ? e.decisionNo : null,
        startingSalary: e.startingSalary ? e.startingSalary : null,
        cvDescription: description,
        contact: e.contact ? e.contact : null,
        informatics: e.informatics ? e.informatics : null,
        kanbanStatus: localState.kanbanStatus,
      });
      console.log(localState,'ee')
    },
    [localState],
  );

  const formatDate = date => {
    if (date) {
      return moment(date).format('YYYY-MM-DD');
    }
    return date;
  };

  const getGender = gender => {
   if(recruitmentWave){ props.getId(recruitmentWave.vacanciesId)
    props.getRecruitmentWaveId(recruitmentWave._id)
    props.getRecruitmentWaveCode(recruitmentWave.code)
   }
    console.log(recruitmentWave,'sss')
    if ( recruitmentWave && recruitmentWave.gender && recruitmentWave.gender.toLowerCase() === 'nam') gender = '0';
    if (recruitmentWave && recruitmentWave.gender && recruitmentWave.gender.toLowerCase() === 'nữ') gender = '1';
    return gender;
  };
  return (
    <>
    {/* <AppBar className='HearderappBarRecuitement'>
        <Toolbar>
          <IconButton
            // className={id !== 'add' ? '' : ''}
            className='BTNRecuitement'
            color="inherit"
            variant="contained"
            onClick={e => onClose()}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            {props.recruitmentWave === null
              ? 'THÊM MỚI  đợt tuyển dụng'
              : 'CẬP NHẬT  đợt tuyển dụng'}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={e => onSave(localState)}
          >
            LƯU
          </Button>
        </Toolbar>
      </AppBar> */}
      <CustomAppBar
          title=  {props.recruitmentWave === null
            ? 'THÊM MỚI  đợt tuyển dụng'
            : 'CẬP NHẬT  đợt tuyển dụng'}
          onGoBack={e => onClose()}
          onSubmit={() => {
            onSave(localState)
          }}
        />
      <KanbanStepper
        listStatus={kanbanStatuses}
        onKabanClick={values => setLocalState({ ...localState, kanbanStatus: values })}
        activeStep={localState.kanbanStatus}
      />

      <Grid container>
        <Typography variant="h5" color="primary">
          <Info />
          Đợt tuyển dụng
        </Typography>
      </Grid>

      <Grid container spacing={16}>
        {!localState._id && (
          <React.Fragment>
            <Grid item xs={8}>
              <AsyncAutocomplete
                value={localState.hrmRecruitmentId}
                label={name2Title.hrmRecruitmentId}
                error={localMessages && localMessages['hrmRecruitmentId']}
                helperText={localMessages && localMessages['hrmRecruitmentId']}
                checkedShowForm={localCheckShowForm && localCheckShowForm['']}
                required={localCheckRequired && localCheckRequired['hrmRecruitmentId']}
                onChange={handleHrmRecruitmentChange}
                url={API_RECRUITMENT}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" color="primary">
                <Info />
                THÔNG TIN CHI TIẾT
              </Typography>
            </Grid>
          </React.Fragment>
        )}

        <Grid item xs={4}>
          <CustomInputBase
            select
            label={name2Title['vacancy.roleName']}
            value={localState.vacancy}
            name="vacancy"
            error={localMessages && localMessages['vacancy.roleName']}
            helperText={localMessages && localMessages['vacancy.roleName']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['vacancy.roleName']}
            required={localCheckRequired && localCheckRequired['vacancy']}
          >
            {localState && localState.vacancy && <MenuItem value={localState.vacancy}>{localState.vacancy.roleName}</MenuItem>}
          </CustomInputBase>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            select
            label={'Vị trí tuyển dụng'}
            value={localState.vacanciesId}
            name="vacanciesId"
            error={localMessages && localMessages['vacancy.roleName']}
            helperText={localMessages && localMessages['vacancy.roleName']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['vacancy.roleName']}
            required={localCheckRequired && localCheckRequired['vacancy']}
          >
            {localState && localState.vacanciesId && <MenuItem value={localState.vacanciesId}>{localState.vacanciesId.name}</MenuItem>}
          </CustomInputBase>
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title['code']}
            onChange={handleInputChange}
            name="code"
            value={localState.code}
            error={localMessages && localMessages['code']}
            helperText={localMessages && localMessages['code']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['code']}
            required={localCheckRequired && localCheckRequired['code']}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title['decisionNo']}
            onChange={handleInputChange}
            name="decisionNo"
            value={localState.decisionNo}
            error={localMessages && localMessages['decisionNo']}
            helperText={localMessages && localMessages['decisionNo']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['decisionNo']}
            required={localCheckRequired && localCheckRequired['decisionNo']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title['amount']}
            type="number"
            onChange={handleInputChange}
            name="amount"
            value={localState.amount}
            error={localMessages && localMessages['amount']}
            helperText={localMessages && localMessages['amount']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['amount']}
            required={localCheckRequired && localCheckRequired['amount']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title['dateNeed'] || ['Chọn ngày']}
            onChange={e => handleInputChange(e,  true )} 
            name="dateNeed"
            value={localState.dateNeed}
            error={localMessages && localMessages['dateNeed']}
            helperText={localMessages && localMessages['dateNeed']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['dateNeed']}
            required={localCheckRequired && localCheckRequired['dateNeed']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomDatePicker
            label={name2Title['dateFounded'] || ['Chọn ngày']}
            onChange={e => handleInputChange(e,  false )} 
            name="dateFounded"
            value={localState.dateFounded}
            error={localMessages && localMessages['dateFounded']}
            helperText={localMessages && localMessages['dateFounded']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['dateFounded']}
            required={localCheckRequired && localCheckRequired['dateFounded']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title.name}
            onChange={handleInputChange}
            name="name"
            value={localState.name}
            error={localMessages && localMessages['name']}
            helperText={localMessages && localMessages['name']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['name']}
            required={localCheckRequired && localCheckRequired['name']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title['startingSalary']}
            onChange={handleInputChange}
            name="startingSalary"
            value={localState.startingSalary}
            type="number"
            error={localMessages && localMessages['startingSalary']}
            helperText={localMessages && localMessages['startingSalary']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['startingSalary']}
            required={localCheckRequired && localCheckRequired['startingSalary']}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomInputBase
            rows={5}
            label={name2Title['cvDescription']}
            onChange={handleInputChange}
            name="cvDescription"
            value={localState.cvDescription}
            multiline
            error={localMessages && localMessages['cvDescription']}
            helperText={localMessages && localMessages['cvDescription']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['cvDescription']}
            required={localCheckRequired && localCheckRequired['cvDescription']}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            YÊU CẦU CHI TIẾT
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <CustomInputField
            select
            type="1"
            configType="hrmSource"
            configCode="S14"
            label={name2Title['certificate']}
            name="certificate"
            value={localState.certificate}
            onChange={handleInputChange}
            error={localMessages && localMessages['certificate']}
            helperText={localMessages && localMessages['certificate']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['certificate']}
            required={localCheckRequired && localCheckRequired['certificate']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputField
            select
            value={localState.specialized}
            onChange={handleInputChange}
            name="specialized"
            label={name2Title['specialized']}
            type="1"
            configType="hrmSource"
            configCode="S07"
            error={localMessages && localMessages['specialized']}
            helperText={localMessages && localMessages['specialized']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['specialized']}
            required={localCheckRequired && localCheckRequired['specialized']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputField
            select
            value={localState.levelLanguage}
            onChange={handleInputChange}
            name="levelLanguage"
            label={name2Title['levelLanguage']}
            type="1"
            configType="hrmSource"
            configCode="S09"
            error={localMessages && localMessages['levelLanguage']}
            helperText={localMessages && localMessages['']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['levelLanguage']}
            required={localCheckRequired && localCheckRequired['levelLanguage']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputField
            label={name2Title['informatics']}
            onChange={handleInputChange}
            name="informatics"
            value={localState.informatics}
            type="1"
            configType="hrmSource"
            configCode="S08"
            error={localMessages && localMessages['informatics']}
            helperText={localMessages && localMessages['informatics']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['informatics']}
            required={localCheckRequired && localCheckRequired['informatics']}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title['gender']}
            select
            onClick={handleInputChange}
            name="gender"
            value={localState.gender}
            error={localMessages && localMessages['gender']}
            helperText={localMessages && localMessages['gender']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['gender']}
            required={localCheckRequired && localCheckRequired['gender']}
          >
            <MenuItem key="0" value="0">
              Nam
            </MenuItem>
            <MenuItem key="1" value="1">
              Nữ
            </MenuItem>
          </CustomInputBase>
        </Grid>
        <Grid item xs={4}>
          <CustomInputField
            select
            value={localState.age}
            onChange={handleInputChange}
            name="age"
            label={name2Title['age']}
            type="1"
            configType="hrmSource"
            configCode="S21"
            error={localMessages && localMessages['age']}
            helperText={localMessages && localMessages['age']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['age']}
            required={localCheckRequired && localCheckRequired['age']}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            label={name2Title['experienceYear']}
            type="number"
            onChange={handleInputChange}
            name="experienceYear"
            value={localState.experienceYear}
            error={localMessages && localMessages['experienceYear']}
            helperText={localMessages && localMessages['experienceYear']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['experienceYear']}
            required={localCheckRequired && localCheckRequired['experienceYear']}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomInputBase
            rows={5}
            multiline
            label={name2Title.skill}
            value={localState.skill}
            name="skill"
            onChange={handleInputChange}
            error={localMessages && localMessages['skill']}
            helperText={localMessages && localMessages['skill']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['skill']}
            required={localCheckRequired && localCheckRequired['skill']}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomInputBase
            rows={5}
            multiline
            label={name2Title['experience']}
            value={localState.experience}
            name="experience"
            onChange={handleInputChange}
            error={localMessages && localMessages['experience']}
            helperText={localMessages && localMessages['experience']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['experience']}
            required={localCheckRequired && localCheckRequired['experience']}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" color="primary">
            <Info />
            THÔNG TIN THÊM
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <CustomInputBase
            label={name2Title['requirementsOther']}
            rows={5}
            onChange={handleInputChange}
            name="requirementsOther"
            value={localState.requirementsOther}
            multiline
            error={localMessages && localMessages['requirementsOther']}
            helperText={localMessages && localMessages['requirementsOther']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['requirementsOther']}
            required={localCheckRequired && localCheckRequired['requirementsOther']}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomInputBase
            label={name2Title['contact']}
            rows={5}
            onChange={handleInputChange}
            name="contact"
            value={localState.contact}
            multiline
            error={localMessages && localMessages['contact']}
            helperText={localMessages && localMessages['contact']}
            checkedShowForm={localCheckShowForm && localCheckShowForm['contact']}
            required={localCheckRequired && localCheckRequired['contact']}
          />
        </Grid>
      </Grid>

      {/* <Grid container spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton color="primary" onClick={e => onSave(localState)}>
            Lưu thông tin
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={e => onClose()}>
            Đóng
          </CustomButton>
        </Grid>
      </Grid> */}
    </>
  );
}

AddRecruitment.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddRecruitment);
