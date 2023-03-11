/**
 *
 * AddApplicantRecruitment
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import Department from 'components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm } from 'utils/common';
import moment from 'moment';
import ListPage from 'components/List';
import { Paper, Typography, Swipe, Grid, FileUpload } from 'components/LifetekUi';
import KanbanStepper from 'components/KanbanStepper';
import { Edit, Person, Info } from '@material-ui/icons';
import { MenuItem, Button, Checkbox, Avatar } from '@material-ui/core';
import CustomInputField from 'components/Input/CustomInputField';
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */
function AddApplicantRecruitment(props) {
  const [localState, setLocalState] = useState({});

  const [listKanbanStatus, setListKanbanStatus] = useState(['']);
  const [name2Title, setName2Title] = useState({});
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});

  const { code, onCreateApplicantRecruitment, onUpdateApplicantRecruitment, onClose, onSave } = props;
  useEffect(() => {
    setName2Title(viewConfigName2Title(code));
    setLocalCheckRequired(viewConfigCheckRequired(code, 'required'));
    setLocalCheckShowForm(viewConfigCheckRequired(code, 'showForm'));
    setLocalMessages(viewConfigCheckForm(code, localState));

    const listCrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    const crmStatus = listCrmStatus.find(element => String(element.code) === 'ST09');
    if (crmStatus) {
      setListKanbanStatus(crmStatus.data);
    }
  }, []);

  useEffect(
    () => {
      setLocalMessages(viewConfigCheckForm(code, localState));
    },
    [localState],
  );

  const handleInputChange = useCallback(
    e => {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    },
    [localState],
  );

  const handleAvatarChange = useCallback(
    e => {
      const avtURL = URL.createObjectURL(e.target.files[0]);
      setLocalState({ ...localState, avatar: e.target.files[0], avatarURL: avtURL });
    },
    [localState],
  );

  return (
    <>
       <CustomAppBar
        title= {props.isOpenApplicantRecruitmentWave === true
          ? 'THÊM MỚI ỨNG VIÊN'
          : 'CẬP NHẬT ỨNG VIÊN'}
        onGoBack={onClose}
        onSubmit={e => {
          onSave(localState);
        }}
      />
      {/* <KanbanStepper
        listStatus={listKanbanStatus}
        onKabanClick={value => {
          // addPersonnelState.kanbanStatus = value;
          props.mergeData({ kanbanStatus: value });
        }}
        activeStep={addPersonnelState.kanbanStatus}
      /> */}
      <Grid container>
        <Grid item md={6}>
          <Grid container spacing={16}>
            {/* <Grid item md={6}>
              <CustomInputBase label="ĐỢT TUYỂN DỤNG" name="" value={localState.n} />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="VỊ TRÍ" name="" value={localState.N} />
            </Grid> */}

            <Grid item md={12}>
              <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
                <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Thông tin ứng viên
                <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
              </Typography>
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="HỌ TÊN" name="name" value={localState.name} onChange={handleInputChange} />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="GIỚI TÍNH" name="gender" select value={localState.gender} onChange={handleInputChange}>
                <MenuItem key="0" value={0}>
                  Nam
                </MenuItem>
                <MenuItem key="1" value={1}>
                  Nữ
                </MenuItem>
              </CustomInputBase>
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="NGÀY SINH" name="birthday" type="date" value={localState.birthday} onChange={handleInputChange} />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="SỐ CMND" name="identityCardNumber" value={localState.identityCardNumber} onChange={handleInputChange} />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="SỐ ĐIỆN THOẠI" name="phoneNumber" value={localState.phoneNumber} onChange={handleInputChange} />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="EMAIL" name="email" value={localState.email} onChange={handleInputChange} />
            </Grid>
            <Grid item md={12}>
              <CustomInputBase label="ĐỊA CHỈ" name="location" value={localState.location} onChange={handleInputChange} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={6} container justify="center" style={{ marginTop: 40 }}>
          <div style={{ display: 'grid', justifyContent: 'center' }}>
            <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
              <Person style={{ fontSize: '20px', marginBottom: '5px' }} /> Chọn ảnh đại diện
            </Typography>
            <Avatar alt="Ảnh đại diện" src={localState.avatarURL} style={{ marginTop: 20, width: 200, height: 200 }} />
            <input accept="image/*" style={{ display: 'none' }} id="avatarRecruitment" onChange={handleAvatarChange} type="file" />
            <label htmlFor="avatarRecruitment">
              <Button
                variant="outlined"
                color="primary"
                component="span"
                style={
                  { marginLeft: 16, marginTop: 10 } // textAlign: 'center',
                }
              >
                Thêm ảnh đại diện
              </Button>
            </label>
          </div>
        </Grid>

        <Grid container spacing={16}>
          <Grid item md={3}>
            <CustomInputField
              label="VĂN BẰNG"
              name="certificate"
              value={localState.certificate}
              select
              type="1"
              configType="hrmSource"
              configCode="S14"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item md={3}>
            <CustomInputField
              label="NGÀNH HỌC"
              name="specialized"
              value={localState.specialized}
              select
              type="1"
              configType="hrmSource"
              configCode="S07"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item md={3}>
            <CustomInputField
              label="NGOẠI NGỮ"
              name="levelLanguage"
              value={localState.levelLanguage}
              select
              type="1"
              configType="hrmSource"
              configCode="S09"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item md={3}>
            <CustomInputField
              label="TIN HỌC"
              name="informatics"
              value={localState.informatics}
              select
              type="1"
              configType="hrmSource"
              configCode="S08"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item md={12}>
            <CustomInputBase
              label="KINH NGHIỆM"
              name="experienceYear"
              value={localState.experienceYear}
              multiline
              rows={5}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item md={12}>
            <CustomInputBase
              label="THÔNG TIN THÊM"
              name="description"
              value={localState.description}
              multiline
              rows={5}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </Grid>

      <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Tải file đính kèm - Quản lý file scan
        <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
      </Typography>

      <Grid item md={12}>
        {/* <FileUpload name={'`${addPersonnelState.name}_${addPersonnelState.code}`'} id="" code="hrm" /> */}
      </Grid>

      {/* <Grid container spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton
            color="primary"
            onClick={e => {
              if (!localState._id) onCreateApplicantRecruitment(localState);
              else onUpdateApplicantRecruitment(localState);
            }}
          >
            Lưu
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={e => onClose()}>
            HỦY
          </CustomButton>
        </Grid>
      </Grid> */}
    </>
  );
}

AddApplicantRecruitment.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default memo(AddApplicantRecruitment);
