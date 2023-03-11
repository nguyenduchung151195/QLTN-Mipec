/**
 *
 * PraisePage
 *
 */

import React, { useState, useCallback, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Edit, Person } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Grid, Paper, withStyles } from '@material-ui/core';
import { TextField, Typography, SwipeableDrawer, Autocomplete, FileUpload } from 'components/LifetekUi';
import reducer from './reducer';
import saga from './saga';
import CustomInputBase from '../../../../../components/Input/CustomInputBase';
import { MenuItem, Button, Checkbox, Avatar } from '@material-ui/core';
import avatarA from '../../../../../images/default-avatar.png';
import Department from '../../../../../components/Filter/DepartmentAndEmployee';
import styles from './styles';
import CustomInputField from '../../../../../components/Input/CustomInputField';
import KanbanStepper from '../../../../../components/KanbanStepper';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import { makeSelectRoles } from './selectors';
import { getRoleGroup } from './actions';
import { makeSelectProfile } from '../../../../Dashboard/selectors';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import CustomGroupInputField from '../../../../../components/Input/CustomGroupInputField';
/* eslint-disable react/prefer-stateless-function */
function MainInfor(props) {
  const [addPersonnelState, setPersonnelState] = useState({});
  const [name2Title, setName2Title] = useState({});
  const [listKanbanStatus, setListKanbanStatus] = useState([]);
  const [localCheckRequired, setLocalCheckRequired] = useState({});
  const [localCheckShowForm, setLocalCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const { handleChangeInput, addPersonnel, handleChangeInputFile, handleDiscount, id, code, handleChangeImage, profile } = props;
  const { classes, roles, getRoleGroup } = props;
  const [uploadImageError, setUploadImageError] = useState('');

  useEffect(
    () => {
      setPersonnelState(addPersonnel);
      const listKanBan = JSON.parse(localStorage.getItem('hrmStatus'));
      if (listKanBan) {
        let hrmKanbanStatuses = listKanBan.find(p => p.code === 'ST01');
        if (hrmKanbanStatuses && hrmKanbanStatuses.data) {
          setListKanbanStatus(hrmKanbanStatuses.data);
          if (id === 'add') {
            const { _id } = hrmKanbanStatuses.data;
            // props.mergeData({ kanbanStatus: _id });
          }
        }
      }
    },
    [addPersonnel],
  );

  useEffect(() => {
    getRoleGroup();
    const newName2Title = viewConfigName2Title(code);
    setName2Title(newName2Title);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    setLocalCheckRequired(checkRequired);
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    setLocalCheckShowForm(checkShowForm);

    // return () => {
    //   newName2Title;
    //   checkRequired;
    //   checkShowForm;
    // }

  }, []);

  useEffect(() => {
    const messages = viewConfigCheckForm(code, addPersonnelState);
    setLocalMessages(messages);
    props.messages(messages);
    return () => {
      messages;
    }
  }, [addPersonnelState]);

  const handleChangeTextField = useCallback(
    e => {
      const {
        target: { name, value },
      } = e;
      //setPersonnelState({ ...addPersonnelState, [name]: value });
      handleChangeInput(name, value);
    },
    [addPersonnel],
  );

  const handeChangeDepartment = useCallback(
    result => {
      const { department } = result;
      props.mergeData({ organizationUnit: department, errorOrganizationUnit: !Boolean(department) });
    },
    [addPersonnel],
  );

  const handleChangeRole = useCallback((e) => {
    const { target: { value, name } } = e;
    const role = {
      roleName: value.name,
      roleCode: value.code,
    }
    props.mergeData({ role })
  }, [addPersonnel])

  const getValueRole = (value) => {
    if (!value) return null;
    return roles.find(it => it.code === value.roleCode)
  }

  const onSelectImg = e => {
    const types = ['image/png', 'image/jpeg', 'image/gif'];
    const file = e.target.files[0];
    // k có file
    if (!file) return false;

    let checkFile = true;
    let txt = '';
    // check image type
    if (types.every(type => file.type !== type)) {
      checkFile = false;
      txt = 'File bạn vừa chọn không đúng định dạng';
      // check image size > 10mb
    } else if (file.size / 1024 / 1024 > 10) {
      checkFile = false;
      txt = 'Dung lượng file tối đa là 10MB';
    }
    setUploadImageError(txt)

    // confirm logo
    if (!checkFile) {
      props.enqueueSnackbar(txt, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        autoHideDuration: 3000,
      });
    } else {
      // const urlAvt = URL.createObjectURL(e.target.files[0]);
      // // eslint-disable-next-line react/no-unused-state
      // this.setState({ avatarURL: urlAvt, avatar: e.target.files[0] }); // ,
      const avtURL = URL.createObjectURL(e.target.files[0]);
      props.handleChangeImage({ avatarURL: avtURL, avatar: e.target.files[0] })
    }
  };
  return (
    <Paper className={classes.paper}>
      <KanbanStepper
        listStatus={listKanbanStatus}
        onKabanClick={value => {
          // addPersonnelState.kanbanStatus = value;
          props.mergeData({ kanbanStatus: value });
        }}
        activeStep={addPersonnelState.kanbanStatus}
      />
      <Grid container spacing={16}>
        <Grid item md={6}>
          <Grid container spacing={16}>
            <Grid item md={12}>
              <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
                <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Thông tin cá nhân
                <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
              </Typography>
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                label={name2Title.name}
                onChange={e =>
                  props.mergeData({
                    name: e.target.value,
                    errorName: !Boolean(e.target.value),
                  })
                }
                value={addPersonnelState.name}
                name="name"
                checkedShowForm={localCheckShowForm && localCheckShowForm.name}
                required={localCheckRequired && localCheckRequired.name}
                error={localMessages && localMessages.name}
                helperText={localMessages && localMessages.name}
              />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                label={name2Title.code}
                onChange={e =>
                  props.mergeData({
                    code: e.target.value,
                  })
                }
                value={addPersonnelState.code}
                name="code"
                checkedShowForm={localCheckShowForm && localCheckShowForm.code}
                required={localCheckRequired && localCheckRequired.code}
                error={localMessages && localMessages.code}
                helperText={localMessages && localMessages.code}
              />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                value={addPersonnelState.gender}
                onChange={e =>
                  props.mergeData({
                    gender: e.target.value,
                  })
                }
                select
                label={name2Title.gender}
                name="gender"
                checkedShowForm={localCheckShowForm && localCheckShowForm.gender}
                required={localCheckRequired && localCheckRequired.gender}
                error={localMessages && localMessages.gender}
                helperText={localMessages && localMessages.gender}
              >
                <MenuItem key="0" value={0}>
                  Nam
                </MenuItem>
                <MenuItem key="1" value={1}>
                  Nữ
                </MenuItem>
              </CustomInputBase>
            </Grid>
            <Grid item md={6}>
              {/* <CustomInputBase
                label={name2Title.birthday}
                name="birthday"
                onChange={e =>
                  props.mergeData({
                    birthday: e.target.value,
                  })
                }
                value={addPersonnelState.birthday}
                type="date"
                checkedShowForm={localCheckShowForm && localCheckShowForm.birthday}
                required={localCheckRequired && localCheckRequired.birthday}
                error={localMessages && localMessages.birthday}
                helperText={localMessages && localMessages.birthday}
              /> */}
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  invalidLabel="DD/MM/YYYY"
                  format="DD/MM/YYYY"
                  value={addPersonnelState.birthday}
                  variant="outlined"
                  label={name2Title.birthday || 'Chọn ngày'}
                  margin="dense"
                  name="birthday"
                  checkedShowForm={localCheckShowForm && localCheckShowForm.birthday}
                  required={localCheckRequired && localCheckRequired.birthday}
                  error={localMessages && localMessages.birthday}
                  helperText={localMessages && localMessages.birthday}
                  onChange={value => props.mergeData({ birthday: value })}
                  fullWidth
                  disableFuture
                // onChange={e => this.handleChangeCustomer(e, 'birthDay', true, true)}
                // onChange={e =>
                //   props.mergeData({
                //     birthday: e.target.value,
                //   })
                // }

                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                label={name2Title.email}
                name="email"
                onChange={e =>
                  props.mergeData({
                    email: e.target.value,
                  })
                }
                value={addPersonnelState.email}
                checkedShowForm={localCheckShowForm && localCheckShowForm.email}
                required={localCheckRequired && localCheckRequired.email}
                error={localMessages && localMessages.email}
                helperText={localMessages && localMessages.email}
              />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                label={name2Title.phoneNumber}
                value={addPersonnelState.phoneNumber}
                name="phoneNumber"
                onChange={e =>
                  props.mergeData({
                    phoneNumber: e.target.value,
                  })
                }
                // type="number"
                checkedShowForm={localCheckShowForm && localCheckShowForm.phoneNumber}
                required={localCheckRequired && localCheckRequired.phoneNumber}
                error={localMessages && localMessages.phoneNumber}
                helperText={localMessages && localMessages.phoneNumber}
              />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                label={name2Title.address}
                value={addPersonnelState.address}
                name="address"
                onChange={e =>
                  props.mergeData({
                    address: e.target.value,
                  })
                }
                type="text"
                checkedShowForm={localCheckShowForm && localCheckShowForm.address}
                required={localCheckRequired && localCheckRequired.address}
                error={localMessages && localMessages.address}
                helperText={localMessages && localMessages.address}
              />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                label={name2Title.note}
                value={addPersonnelState.note}
                onChange={e =>
                  props.mergeData({
                    note: e.target.value,
                  })
                }
                name="note"
                type="text"
                checkedShowForm={localCheckShowForm && localCheckShowForm.note}
                required={localCheckRequired && localCheckRequired.note}
                error={localMessages && localMessages.note}
                helperText={localMessages && localMessages.note}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} container justify="center" style={{ marginTop: 40 }}>
          <div style={{ display: 'grid', justifyContent: 'center' }}>
            <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
              <Person style={{ fontSize: '20px', marginBottom: '5px' }} /> Chọn ảnh đại diện
            </Typography>
            <Avatar
              alt="Ảnh đại diện"
              src={addPersonnelState.avatarURL || addPersonnelState.avatar || avatarA}
              style={{ marginTop: 20, width: 200, height: 200 }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="contained-button-file"
              onChange={onSelectImg}
              // onChange={(e) => {
              //   const avtURL = URL.createObjectURL(e.target.files[0]);
              //   props.handleChangeImage({ avatarURL: avtURL, avatar: e.target.files[0] })
              // }}
              type="file"
            />
            <p style={{ color: '#f44336' }}>{uploadImageError}</p>
            <label htmlFor="contained-button-file">
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
      </Grid>

      <Grid container spacing={16}>
        <Grid item xs={3}>
          <CustomInputBase
            value={addPersonnelState.identityCardNumber}
            onChange={e =>
              props.mergeData({
                identityCardNumber: e.target.value,
                errorIdentityCardNumber: !Boolean(e.target.value),
              })
            }
            label={name2Title.identityCardNumber}
            name="identityCardNumber"
            // type="number"
            checkedShowForm={localCheckShowForm && localCheckShowForm.identityCardNumber}
            required={localCheckRequired && localCheckRequired.identityCardNumber}
            error={localMessages && localMessages.identityCardNumber}
            helperText={localMessages && localMessages.identityCardNumber}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputBase
            value={addPersonnelState.locationProvide}
            onChange={e =>
              props.mergeData({
                locationProvide: e.target.value,
              })
            }
            label={name2Title.locationProvide}
            name="locationProvide"
            checkedShowForm={localCheckShowForm && localCheckShowForm.locationProvide}
            required={localCheckRequired && localCheckRequired.locationProvide}
            error={localMessages && localMessages.locationProvide}
            helperText={localMessages && localMessages.locationProvide}
          />
        </Grid>
        <Grid item xs={3}>
          {/* <CustomInputBase
            value={addPersonnelState.dateProvide}
            onChange={e =>
              props.mergeData({
                dateProvide: e.target.value,
              })
            }
            label={name2Title.dateProvide}
            name="dateProvide"
            type="date"
            checkedShowForm={localCheckShowForm && localCheckShowForm.dateProvide}
            required={localCheckRequired && localCheckRequired.dateProvide}
            error={localMessages && localMessages.dateProvide}
            helperText={localMessages && localMessages.dateProvide}
          /> */}
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              invalidLabel="DD/MM/YYYY"
              inputVariant="outlined"
              format="DD/MM/YYYY"
              value={addPersonnelState.dateProvide}
              variant="outlined"
              label={name2Title.dateProvide || 'Chọn ngày'}
              margin="dense"
              name="dateProvide"
              checkedShowForm={localCheckShowForm && localCheckShowForm.dateProvide}
              required={localCheckRequired && localCheckRequired.dateProvide}
              error={localMessages && localMessages.dateProvide}
              helperText={localMessages && localMessages.dateProvide}
              onChange={value => props.mergeData({ dateProvide: value })}
              fullWidth
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={3}>
          <CustomInputField
            value={addPersonnelState.marriage}
            onChange={handleChangeTextField}
            name="marriage"
            label={name2Title["marriage"]}
            type="1"
            configType="hrmSource"
            configCode="S02"
            checkedShowForm={localCheckShowForm && localCheckShowForm["marriage"]}
            required={localCheckRequired && localCheckRequired["marriage"]}
            error={localMessages && localMessages["marriage"]}
            helperText={localMessages && localMessages["marriage"]}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography>
            <Checkbox color="primary" checked={addPersonnelState.portal} onChange={e => console.log('e', e) || props.mergeData({ portal: e.target.checked })} />
            Tự động tạo tài khoản HR-Portal
          </Typography>
        </Grid>
        <Grid item xs={3}>
          {/* <CustomInputBase
            value={addPersonnelState.startDate}
            onChange={e => props.mergeData({ startDate: e.target.value })}
            name="startDate"
            label={name2Title.beginWork}
            type="date"
            checkedShowForm={localCheckShowForm && localCheckShowForm.beginWork}
            required={localCheckRequired && localCheckRequired.beginWork}
            error={localMessages && localMessages.beginWork}
            helperText={localMessages && localMessages.beginWork}
          /> */}
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              invalidLabel="DD/MM/YYYY"
              inputVariant="outlined"
              format="DD/MM/YYYY"
              value={addPersonnelState.startDate}
              variant="outlined"
              label={name2Title.beginWork || 'Chọn ngày'}
              margin="dense"
              name="startDate"
              checkedShowForm={localCheckShowForm && localCheckShowForm.beginWork}
              required={localCheckRequired && localCheckRequired.beginWork}
              error={localMessages && localMessages.beginWork}
              helperText={localMessages && localMessages.beginWork}
              onChange={value => props.mergeData({ dateProvide: value })}
              fullWidth
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={3}>
          {/* <CustomInputBase
            value={addPersonnelState.dateOfficial}
            onChange={e =>
              props.mergeData({
                dateOfficial: e.target.value,
              })
            }
            name="dateOfficial "
            label={name2Title.dateOfficial}
            type="date"
            checkedShowForm={localCheckShowForm && localCheckShowForm.dateOfficial}
            required={localCheckRequired && localCheckRequired.dateOfficial}
            error={localMessages && localMessages.dateOfficial}
            helperText={localMessages && localMessages.dateOfficial}
          /> */}
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              invalidLabel="DD/MM/YYYY"
              inputVariant="outlined"
              format="DD/MM/YYYY"
              value={addPersonnelState.dateOfficial}
              variant="outlined"
              label={name2Title.dateOfficial || 'Chọn ngày'}
              margin="dense"
              name="dateOfficial"
              checkedShowForm={localCheckShowForm && localCheckShowForm.dateOfficial}
              required={localCheckRequired && localCheckRequired.dateOfficial}
              error={localMessages && localMessages.dateOfficial}
              helperText={localMessages && localMessages.dateOfficial}
              onChange={value => props.mergeData({ dateOfficial: value })}
              fullWidth
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={3}>
          <CustomInputField
            value={addPersonnelState.laborStatus}
            onChange={handleChangeTextField}
            name="laborStatus"
            label={name2Title["laborStatus"]}
            type="1"
            configType="hrmSource"
            configCode="S01"
            checkedShowForm={localCheckShowForm && localCheckShowForm["laborStatus"]}
            required={localCheckRequired && localCheckRequired["laborStatus"]}
            error={localMessages && localMessages["laborStatus"]}
            helperText={localMessages && localMessages["laborStatus"]}
          />
        </Grid>
      </Grid>

      <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Thông tin tiếp nhận nhân sự
        <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
      </Typography>
      <Grid container md={6} spacing={16}>
        <Grid item xs={6}>
          <CustomInputBase
            value={addPersonnelState.decisionNumber}
            onChange={e =>
              props.mergeData({
                decisionNumber: e.target.value,
              })
            }
            name="decisionNumber"
            label={name2Title.decisionNumber}
            checkedShowForm={localCheckShowForm && localCheckShowForm.decisionNumber}
            required={localCheckRequired && localCheckRequired.decisionNumber}
            error={localMessages && localMessages.decisionNumber}
            helperText={localMessages && localMessages.decisionNumber}
          />
        </Grid>
        <Grid item xs={6}>
          {/* <CustomInputBase
            
            onChange={e =>
              props.mergeData({
                decisionDay: e.target.value,
              })
            }
            
            label={name2Title.decisionDay}
            type="date"
            checkedShowForm={localCheckShowForm && localCheckShowForm.decisionDay}
            required={localCheckRequired && localCheckRequired.decisionDay}
            error={localMessages && localMessages.decisionDay}
            helperText={localMessages && localMessages.decisionDay}
          /> */}
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              invalidLabel="DD/MM/YYYY"
              inputVariant="outlined"
              format="DD/MM/YYYY"
              value={addPersonnelState.decisionDay}
              variant="outlined"
              label={name2Title.decisionDay || 'Chọn ngày'}
              margin="dense"
              name="decisionDay"
              checkedShowForm={localCheckShowForm && localCheckShowForm.decisionDay}
              required={localCheckRequired && localCheckRequired.decisionDay}
              error={localMessages && localMessages.decisionDay}
              helperText={localMessages && localMessages.decisionDay}
              onChange={value => props.mergeData({ decisionDay: value })}
              fullWidth
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12}>
          <Department labelDepartment={name2Title["organizationUnit"]} onChange={handeChangeDepartment} profile={props.profile} department={addPersonnelState.organizationUnit && addPersonnelState.organizationUnit._id ? addPersonnelState.organizationUnit._id : addPersonnelState.organizationUnit} moduleCode="hrm" disableEmployee />
        </Grid>
        <Grid item xs={12}>
          <CustomInputField
            value={addPersonnelState.position}
            onChange={handleChangeTextField}
            name="position"
            label={name2Title["position"]}
            type="1"
            configType="hrmSource"
            configCode="S16"
            checkedShowForm={localCheckShowForm && localCheckShowForm["position"]}
            required={localCheckRequired && localCheckRequired["position"]}
            error={localMessages && localMessages["position"]}
            helperText={localMessages && localMessages["position"]}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomInputField
            value={addPersonnelState.title}
            onChange={handleChangeTextField}
            name="title"
            label={name2Title["title"]}
            type="1"
            configType="hrmSource"
            configCode="S04"
            checkedShowForm={localCheckShowForm && localCheckShowForm["title"]}
            required={localCheckRequired && localCheckRequired["title"]}
            error={localMessages && localMessages["title"]}
            helperText={localMessages && localMessages["title"]}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomInputBase label={name2Title["role"]} name="role" value={getValueRole(addPersonnelState.role)} onChange={handleChangeRole} select>
            {Array.isArray(roles) && roles.length > 0
              ?
              roles.map(role => (
                <MenuItem value={role}>{role.name}</MenuItem>
              ))
              : null
            }
          </CustomInputBase>
        </Grid>
      </Grid>
      <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Thông tin hợp đồng
        <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
      </Typography>
      <Grid container md={6} spacing={16}>
        <Grid item xs={6}>
          <CustomInputBase
            value={addPersonnelState.contractNumber}
            onChange={e =>
              props.mergeData({
                contractNumber: e.target.value,
              })
            }
            name="contractNumber"
            label={name2Title.contractNumber}
            checkedShowForm={localCheckShowForm && localCheckShowForm.contractNumber}
            required={localCheckRequired && localCheckRequired.contractNumber}
            error={localMessages && localMessages.contractNumber}
            helperText={localMessages && localMessages.contractNumber}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputField
            value={addPersonnelState.contractType}
            onChange={handleChangeTextField}
            name="contractType"
            label={name2Title["contractType"]}
            type="1"
            configType="hrmSource"
            configCode="S03"
            checkedShowForm={localCheckShowForm && localCheckShowForm["contractType"]}
            required={localCheckRequired && localCheckRequired["contractType"]}
            error={localMessages && localMessages["contractType"]}
            helperText={localMessages && localMessages["contractType"]}
          />
        </Grid>
        <Grid item xs={6}>
          {/* <CustomInputBase
            value={addPersonnelState.contractStartDate}
            onChange={e =>
              props.mergeData({
                contractStartDate: e.target.value,
              })
            }
            label={name2Title.contractStartDate}
            name="contractStartDate"
            type="date"
            checkedShowForm={localCheckShowForm && localCheckShowForm.contractStartDate}
            required={localCheckRequired && localCheckRequired.contractStartDate}
            error={localMessages && localMessages.contractStartDate}
            helperText={localMessages && localMessages.contractStartDate}
          /> */}
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              invalidLabel="DD/MM/YYYY"
              format="DD/MM/YYYY"
              value={addPersonnelState.contractStartDate}
              variant="outlined"
              label={name2Title.contractStartDate || 'Chọn ngày'}
              margin="dense"
              name="contractStartDate"
              checkedShowForm={localCheckShowForm && localCheckShowForm.contractStartDate}
              required={localCheckRequired && localCheckRequired.contractStartDate}
              error={localMessages && localMessages.contractStartDate}
              helperText={localMessages && localMessages.contractStartDate}
              onChange={value => props.mergeData({ contractStartDate: value })}
              fullWidth
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={6}>
          {/* <CustomInputBase
            value={addPersonnelState.contractEndDate}
            onChange={e =>
              props.mergeData({
                contractEndDate: e.target.value,
              })
            }
            name="contractEndDate"
            label={name2Title.contractEndDate}
            type="date"
            checkedShowForm={localCheckShowForm && localCheckShowForm.contractEndDate}
            required={localCheckRequired && localCheckRequired.contractEndDate}
            error={localMessages && localMessages.contractEndDate}
            helperText={localMessages && localMessages.contractEndDate}
            
          />*/}
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              invalidLabel="DD/MM/YYYY"
              format="DD/MM/YYYY"
              value={addPersonnelState.contractEndDate}
              variant="outlined"
              label={name2Title.contractEndDate || 'Chọn ngày'}
              margin="dense"
              name="contractEndDate"
              checkedShowForm={localCheckShowForm && localCheckShowForm.contractEndDate}
              required={localCheckRequired && localCheckRequired.contractEndDate}
              error={localMessages && localMessages.contractEndDate}
              helperText={localMessages && localMessages.contractEndDate}
              onChange={value => props.mergeData({ contractEndDate: value })}
              fullWidth
            />
          </MuiPickersUtilsProvider>
        </Grid>

      </Grid>
      <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Tài khoản - Trình độ - Các thông tin khác
        <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
      </Typography>
      <Grid container md={12} spacing={16}>
        <Grid item xs={3}>
          <CustomInputBase
            value={addPersonnelState.bankAccount}
            onChange={e =>
              props.mergeData({
                bankAccount: e.target.value,
              })
            }
            name="bankAccount"
            label={name2Title.bankAccount}
            checkedShowForm={localCheckShowForm && localCheckShowForm.bankAccount}
            required={localCheckRequired && localCheckRequired.bankAccount}
            error={localMessages && localMessages.bankAccount}
            helperText={localMessages && localMessages.bankAccount}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputBase value={addPersonnelState.bank} onChange={e => props.mergeData({ bank: e.target.value })} name="bank" label={name2Title.bank} />
        </Grid>
        <Grid item xs={3}>
          <CustomInputBase
            value={addPersonnelState.taxCode}
            onChange={e =>
              props.mergeData({
                taxCode: e.target.value,
              })
            }
            name="taxCode"
            label={name2Title.taxCode}
            checkedShowForm={localCheckShowForm && localCheckShowForm.taxCode}
            required={localCheckRequired && localCheckRequired.taxCode}
            error={localMessages && localMessages.taxCode}
            helperText={localMessages && localMessages.taxCode}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputField
            value={addPersonnelState.educateSystem}
            onChange={handleChangeTextField}
            name="educateSystem"
            label={name2Title["educateSystem"]}
            type="1"
            configType="hrmSource"
            configCode="S05"
            checkedShowForm={localCheckShowForm && localCheckShowForm["educateSystem"]}
            required={localCheckRequired && localCheckRequired["educateSystem"]}
            error={localMessages && localMessages["educateSystem"]}
            helperText={localMessages && localMessages["educateSystem"]}

          />
        </Grid>
        {/* {console.log(addPersonnelState.specialize,name2Title,'name2Titlename2Title')} */}
        <Grid item xs={3}>
          <CustomInputField
            value={addPersonnelState.specialize}
            onChange={handleChangeTextField}
            name="specialize"
            label={name2Title["specialize"]}
            type="1"
            configType="hrmSource"
            configCode="S06"
            checkedShowForm={localCheckShowForm && localCheckShowForm["specialize"]}
            required={localCheckRequired && localCheckRequired["specialize"]}
            error={localMessages && localMessages["specialize"]}
            helperText={localMessages && localMessages["specialize"]}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputField
            value={addPersonnelState.degree}
            onChange={handleChangeTextField}
            name="degree"
            label={name2Title["degree"] || "Trình độ"}
            type="1"
            configType="hrmSource"
            configCode="S07"
            checkedShowForm={localCheckShowForm && localCheckShowForm["degree"]}
            required={localCheckRequired && localCheckRequired["degree"]}
            error={localMessages && localMessages["degree"]}
            helperText={localMessages && localMessages["degree"]}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputField
            value={addPersonnelState.informatics}
            onChange={handleChangeTextField}
            name="informatics"
            label={name2Title["informatics"]}
            type="1"
            configType="hrmSource"
            configCode="S08"
            checkedShowForm={localCheckShowForm && localCheckShowForm["informatics"]}
            required={localCheckRequired && localCheckRequired["informatics"]}
            error={localMessages && localMessages["informatics"]}
            helperText={localMessages && localMessages["informatics"]}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputField
            value={addPersonnelState.language1}
            onChange={handleChangeTextField}
            name="language1"
            label={name2Title["language1"]}
            type="1"
            configType="hrmSource"
            configCode="S09"
            checkedShowForm={localCheckShowForm && localCheckShowForm["language1"]}
            required={localCheckRequired && localCheckRequired["language1"]}
            error={localMessages && localMessages["language1"]}
            helperText={localMessages && localMessages["language1"]}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputField
            value={addPersonnelState.language2}
            onChange={handleChangeTextField}
            name="language2"
            label={name2Title["language2"]}
            type="1"
            configType="hrmSource"
            configCode="S10"
            checkedShowForm={localCheckShowForm && localCheckShowForm["language2"]}
            required={localCheckRequired && localCheckRequired["language2"]}
            error={localMessages && localMessages["language2"]}
            helperText={localMessages && localMessages["language2"]}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputField
            value={addPersonnelState.nation}
            onChange={handleChangeTextField}
            name="nation"
            label={name2Title["nation"]}
            type="1"
            configType="hrmSource"
            configCode="S11"
            checkedShowForm={localCheckShowForm && localCheckShowForm["nation"]}
            required={localCheckRequired && localCheckRequired["nation"]}
            error={localMessages && localMessages["nation"]}
            helperText={localMessages && localMessages["nation"]}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomInputField
            value={addPersonnelState.religion}
            onChange={handleChangeTextField}
            name="religion"
            label={name2Title["religion"]}
            type="1"
            configType="hrmSource"
            configCode="S12"
            checkedShowForm={localCheckShowForm && localCheckShowForm["religion"]}
            required={localCheckRequired && localCheckRequired["religion"]}
            error={localMessages && localMessages["religion"]}
            helperText={localMessages && localMessages["religion"]}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomGroupInputField
            code="hrm"
            columnPerRow={4}
            value={addPersonnelState.others}
            onChange={value => props.mergeData({ others: value })}
          />
        </Grid>
        {/* <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
          <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Tải file đính kèm - Quản lý file scan
          <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
        </Typography>
        <Grid item xs={12}>
          <CustomInputBase label="File Upload" name="url" type="file" onChange={handleChangeInputFile} />
        </Grid> */}
      </Grid>

      {id !== 'add' && <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Tải file đính kèm - Quản lý file scan
        <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
      </Typography>}

      <Grid item md={12}>

        <FileUpload name={`${addPersonnelState.name}_${addPersonnelState.code}`} id={id} code="hrm" employee={addPersonnelState} />
      </Grid>
    </Paper>
  );
}

MainInfor.propTypes = {
  classes: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roles: makeSelectRoles(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    getRoleGroup: () => dispatch(getRoleGroup())
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'mainInfor', reducer });
const withSaga = injectSaga({ key: 'mainInfor', saga });


export default compose(
  memo,
  withStyles(styles),
  withReducer,
  withSaga,
  withConnect,
)(MainInfor);
