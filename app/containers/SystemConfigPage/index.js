/**
 *
 * SystemConfigPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';

import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import messages from './messages';
import './index.css';

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  InputLabel,
  // Input,
  OutlinedInput,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormLabel,
  FormHelperText,
  AppBar,
  Toolbar,
  Collapse,
  ListItem,
  ListItemIcon,
} from '@material-ui/core';
import { Breadcrumbs } from '@material-ui/lab';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { CameraAlt, ExpandLess, ExpandMore, Close } from '@material-ui/icons';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectSystemConfigPage from './selectors';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import avatarA from '../../images/avatarCompany.png';
import { updateSysConfAct, createConfigCodeAct, getSysConfAct, resetNoti, getConfigCodeAct } from './actions';
import CustomAppBar from 'components/CustomAppBar';
import logoDefault from '../../images/logo.jpg';
import { API_UPLOAD_FILE } from '../../config/urlConfig';
import axios from 'axios';
import { Loading } from 'components/LifetekUi';
/* eslint-disable react/prefer-stateless-function */
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
// TT - UPDATE=CREATE CODE - 24
const initialDataConfigCode = [
  {
    value: null, // 1
    name: 'moduleType',
    checked: true,
  },
  {
    value: null,
    checked: false,
    name: 'prefix',
  },
  {
    value: null,
    checked: false,
    name: 'formatDate',
  },
  {
    value: null,
    ckecked: false,
    name: 'numericalOrderFormat',
  },
  {
    value: false,
    checked: false,
    name: 'provincial',
  },
  {
    value: false,
    checked: false,
    name: 'productType',
  },
  {
    value: null,
    checked: false,
    name: 'intermediate',
  },
  {
    value: null,
    checked: false,
    name: 'suffixes',
  },
  {
    value: null,
    checked: false,
    name: 'nickname',
  },
  {
    value: null, // 1/ , 2-
    checked: true,
    name: 'breakCharacter',
  },
];

// TT - UPDATE=CREATE CODE - 23
export class SystemConfigPage extends React.Component {
  state = {
    codeExample: '',
    avatar: null,
    avatarURL: '',
    companyName: '',
    nameDisplay: '',
    website: '',
    email: '',
    holiday: '',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    startDay: 1,
    timeStart: '08:00',
    timeEnd: '17:30',
    daysInWeek: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    language: 'vi',
    mailServer: '',
    passServer: '',
    host: '',
    serviceServer: '',
    smsBrandname: '',
    smsAccount: '',
    smsPass: '',
    errorCompanyName: false,
    errorTitleName: false,
    errorEmail: false,
    open: false,
    openSetupCode: false,
    dataConfigCode: initialDataConfigCode, // TT - UPDATE=CREATE CODE - 23
    facebook: '',
    bankAccount: '',
    openUploadFile: false,
    file: {},
    path: '',
    reason: '',
    note: '',
    load: false,
  };

  handleClick = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  handleClickSetupCodeCollapse = () => {
    this.setState(prevState => ({ openSetupCode: !prevState.openSetupCode }));
  };

  componentWillMount() {
    // console.log('state', this.state);
    this.props.onGetConfigCode({ task: 'Task' });
    this.props.onGetConf();
  }
  handleSubmit = () => {
    const token = localStorage.getItem('token');
    const path = this.state.path;
    const form = new FormData();
    form.append('file', this.state.file, this.state.file.name);
    form.append('note', this.state.note);
    form.append('reason', this.state.reason);
    this.setState({ load: true });
    // console.log(8888, form);
    // const data = {
    //   file: {...this.state.file },
    //   reason: this.state.reason,
    //   note: this.state.note,
    // }
    console.log(11111, this.state.file.type);
    if (this.state.file.type.includes('zip')) {
      axios
        .post(`${API_UPLOAD_FILE}?path=${path}`, form, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          alert('Lưu thành công!');
        })
        .catch(error => {
          alert('Lưu thất bại!');
        });
      this.setState({ openUploadFile: false });
    } else {
      alert('Định dạng file phải là .zip!');
    }
  };
  async componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { systemConfigPage } = props;
      const { configCode } = systemConfigPage;
      const configCodeDefault = {
        moduleType: null,
        prefix: null,
        formatDate: null,
        numericalOrderFormat: null,
        provincial: false,
        productType: false,
        intermediate: null,
        suffixes: null,
        nickname: null,
        breakCharacter: null,
      };
      const configCodeFull = Object.assign(configCodeDefault, configCode);
      if (configCodeFull.moduleType === 4) {
        configCodeFull.nickname = false;
      }
      if (Object.keys(configCodeFull).length) {
        const defaultDataConfigCode = [...initialDataConfigCode];
        const newDataConfigCode = defaultDataConfigCode.map(item => {
          const newVal = configCodeFull[item.name];
          return {
            value: newVal,
            checked: !!newVal,
            name: item.name,
          };
        });
        await this.setState({ dataConfigCode: newDataConfigCode });
        this.handleCodeFollowDataConfigCode();
      }
      if (systemConfigPage.sysConf) {
        const { sysConf } = systemConfigPage;
        const holiday = sysConf.holidays.join(', ');
        const daysInWeek = sysConf.workingDays.map(item => {
          if (parseInt(item, 10) > 1) {
            return `Thứ ${item}`;
          }
          return 'Chủ nhật';
        });
        this.setState({
          avatarURL: sysConf.logo,
          companyName: sysConf.name,
          nameDisplay: sysConf.displayName,
          website: sysConf.website,
          email: sysConf.email,
          holiday,
          dateFormat: sysConf.dateFomat || '',
          timeFormat: sysConf.timeFomat || '',
          startDay: sysConf.firstDayOfTheWeek - 1,
          timeStart: sysConf.workingTime.start,
          timeEnd: sysConf.workingTime.end,
          mailServer: sysConf.mailServer,
          passServer: sysConf.passServer,
          host: sysConf.host,
          serviceServer: sysConf.serviceServer,
          smsBrandname: sysConf.smsBrandname,
          smsAccount: sysConf.smsAccount,
          smsPass: sysConf.smsPass,
          daysInWeek,
          language: sysConf.language,
          facebook: sysConf.facebook,
          bankAccount: sysConf.bankAccount,
        });
      }
    }
  }

  // systemConfigPage :
  componentDidUpdate() {
    const { systemConfigPage } = this.props;
    if (systemConfigPage) {
      if (systemConfigPage.successUpdate === true) {
        this.props.enqueueSnackbar('Thao tác thành công!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        this.props.onReset();
      }
      if (systemConfigPage.successCreateCode === true) {
        this.props.enqueueSnackbar('Thao tác thành công!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        this.props.onReset();
      }
      if (systemConfigPage.error) {
        this.props.enqueueSnackbar('Thao tác thất bại!', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        this.props.onReset();
      }
    }
  }

  // TT - UPDATE=CREATE CODE - 5
  // TT 1.2 - ONCHANGE - INPUT
  handleChangeInputForConfigCode = e => {
    const val = e.target.value;
    const name = e.target.name;
    this.setState(
      prevState => ({
        dataConfigCode: prevState.dataConfigCode.map(item => {
          if (item.name === name) {
            return { ...item, value: val };
          }
          return { ...item };
        }),
      }),
      // TT - UPDATE=CREATE CODE - 6
      () => this.handleCodeFollowDataConfigCode(),
    );
    // TT - UPDATE=CREATE CODE - 7 NẾU CLICK VAO MODULETYPE - thì nó sẽ LOAD lại REQUEST SERVER LOAD = LOGIC GET
    if (e.target.name === 'moduleType') {
      const body = { task: null };
      switch (e.target.value) {
        case 1:
          body.task = 'Task';
          break;
        case 2:
          body.task = 'Contract';
          break;
        case 3:
          body.task = 'Customer';
          break;
        case 4:
          body.task = 'Supplier';
          break;
        case 5:
          body.task = 'SalesQuotation';
          break;
        default:
          break;
      }
      // TT - UPDATE=CREATE CODE - 7 NẾU CLICK VAO MODULETYPE - thì nó sẽ LOAD lại REQUEST SERVER LOAD = LOGIC GET
      if (body) {
        this.props.onGetConfigCode(body);
      }
    }
  };

  // TT - UPDATE=CREATE CODE - 2
  // TT 1.1 - ONCHANGE - CHECK BOX truyen len fieldName : thay đổi checked dataConfigCode - fieldName truyền lên
  handleCheckBoxConfigCode = fieldName => {
    this.setState(
      prevState => ({
        dataConfigCode: prevState.dataConfigCode.map(item => {
          // nếu là dataConfigCode.item - fieldName truyen len :
          // toggle checked cua dataConfigCode.item (default : checked= false,) (THAY DOI - ITEM do)
          if (item.name === fieldName) {
            if (fieldName === 'nickname' || fieldName === 'provincial' || fieldName === 'productType') {
              return { ...item, checked: !item.checked, value: !item.checked }; // vi nickname bi DISABLE - khong bat ONCHANGE
            }
            return { ...item, checked: !item.checked };
          }
          // nếu khong phai là dataConfigCode.item - fieldName truyen len : thi tra ve ITEM cu (KO DOI)
          return { ...item };
        }),
      }),
      // TT - UPDATE=CREATE CODE - 3
      () => this.handleCodeFollowDataConfigCode(), // CB
    );
  };

  // TT - UPDATE=CREATE CODE - 4
  // TT 2 - ONCHANGE : để hiển thị : state codeExample.
  handleCodeFollowDataConfigCode = () => {
    // loc ITEM cua - dataConfigCode : ko phải moduleType,breakCharacter,null,'' (KO NỐI VÀO CHUỖI - codeExample)
    const data = this.state.dataConfigCode.filter(
      item => item.checked === true && item.name !== 'moduleType' && item.name !== 'breakCharacter' && item.value !== null && item.value !== '',
    );
    // NỐI CHUỖI - codeExample : sau do SETSTATE
    this.setState(prevState => ({
      codeExample: data
        .map(item => {
          if (item.name === 'formatDate') {
            if (item.value === 1) {
              return '01122021';
            }
            if (item.value === 2) {
              return '20211201';
            }
            if (item.value === 3) {
              return '12012021';
            }
          }
          if (item.name === 'numericalOrderFormat') {
            if (item.value === 1) {
              return '01';
            }
            if (item.value === 2) {
              return '001';
            }
            if (item.value === 3) {
              return '0001';
            }
          }
          if (item.name === 'nickname') {
            if (item.value === true) {
              return 'BIET DANH';
            }
            return '';
          }
          return item.value;
        })
        .join(
          prevState.dataConfigCode.find(item => item.name === 'breakCharacter').value === 2
            ? '-'
            : prevState.dataConfigCode.find(item => item.name === 'breakCharacter').value === 1
              ? '/'
              : '',
        ),
      // .join(prevState.dataConfigCode.find(item => item.name === 'breakCharacter').value),
    }));
  };

  onGoBack = () => {
    this.props.history.push('/Kpi');
    // window.location.reload();
  };

  handleClickOpen = () => {
    this.setState({ openUploadFile: true });
  };

  handleClose = () => {
    this.setState({ openUploadFile: false });
  };
  render() {
    const { classes, intl } = this.props;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 6, nameAdd.length);
    return (
      <div>
        {this.state.load ? (
          <>
            <Loading />
            <p style={{ textAlign: 'center' }}>Đang Upcode</p>
          </>
        ) : null}
        <CustomAppBar
          scp_close={false}
          title={
            addStock === 'config'
              ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Cấu hình chung' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cấu hình chung' })}`
          }
          onGoBack={this.onGoBack}
          onSubmit={this.onSubmit}
        />
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Tải file
        </Button>
        <Helmet>
          <title>Cấu hình hệ thống</title>
          <meta name="description" content="Cấu hình hệ thống" />
        </Helmet>
        <Paper className={classes.breadcrumbs} style={{ display: 'none' }}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/setting">
              Thiết lập
            </Link>
            <Typography color="textPrimary">Cấu hình chung</Typography>
          </Breadcrumbs>
        </Paper>
        <div>
          <Dialog
            open={this.state.openUploadFile}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">UPLOAD CODE</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Grid container fullWidth>
                  <Grid item md={12}>
                    <label for="upload-code">
                      <CloudUploadIcon style={{ marginLeft: 25, color: '#2196F3', cursor: 'pointer', marginRight: 5 }} />
                      {this.state.file.name}
                    </label>
                    <input
                      id="upload-code"
                      style={{ marginLeft: '1.7rem', display: 'none' }}
                      accept="image/*"
                      // className={classes.inputAvt}
                      type="file"
                      onChange={e => {
                        console.log(8888, e.target.files[0]);
                        this.setState({ file: e.target.files[0] });
                      }}
                      // onMouseEnter={this.onHoverIn}
                      // onMouseLeave={this.onHoverOut}
                      name="file"
                    />
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      select
                      label="PATH"
                      variant="outlined"
                      className={classes.CustomInputBase}
                      value={this.state.path}
                      name="PATH"
                      onChange={e => {
                        this.setState({ path: e.target.value });
                      }}
                      input={<OutlinedInput labelWidth={0} id="select-checkbox" />}
                    >
                      <MenuItem value="APP">APP</MenuItem>
                      <MenuItem value="FE">FE</MenuItem>
                      <MenuItem value="DRIVER">DRIVER</MenuItem>
                      <MenuItem value="DYNAMIC">DYNAMIC</MenuItem>
                      <MenuItem value="APPROVE">APPROVE</MenuItem>
                      <MenuItem value="NOTIFY">NOTIFY</MenuItem>
                      <MenuItem value="AUTH">AUTH</MenuItem>
                      <MenuItem value="ATTRIBUTE">ATTRIBUTE</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      label="LÝ DO"
                      onChange={e => {
                        this.setState({ reason: e.target.value });
                      }}
                      className={classes.textField}
                      value={this.state.reason}
                      name="reason"
                      margin="normal"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      label="NOTE"
                      onChange={e => {
                        this.setState({ note: e.target.value });
                      }}
                      className={classes.textField}
                      value={this.state.note}
                      name="companyName"
                      margin="normal"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleSubmit} color="primary" variant="outlined">
                Lưu
              </Button>
              <Button onClick={this.handleClose} color="secondary" autoFocus variant="outlined">
                Hủy
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <Grid container style={{ marginTop: 50 }}>
          <Grid justify="center" md={6}>
            <Paper container direction="row" justify="center" alignItems="center">
              <FormControl className={classes.textField} error>
                <TextField
                  label="Tên công ty"
                  onChange={this.handleChangeInput}
                  // className={classes.textField}
                  value={this.state.companyName}
                  name="companyName"
                  margin="normal"
                  variant="outlined"
                // InputLabelProps={{
                //   shrink: true,
                // }}
                />
                {this.state.errorCompanyName ? (
                  <FormHelperText id="component-error-text1" style={{ marginTop: -3 }}>
                    Tên công ty không được để trống
                  </FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>
              <FormControl className={classes.textField} error>
                <TextField
                  label="Tên công ty hiển thị trên thanh tiêu đề"
                  onChange={this.handleChangeInput}
                  style={{ marginTop: '10px' }}
                  // className={classes.textField}
                  value={this.state.nameDisplay}
                  name="nameDisplay"
                  variant="outlined"
                  // inputRef={input => (this.code = input)}
                  margin="displayName"
                />
                {this.state.errorTitleName ? (
                  <FormHelperText id="component-error-text1">Tên công ty hiển thị trên thanh tiêu đề không được để trống</FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>
              <TextField
                label="Tên website"
                onChange={this.handleChangeInput}
                className={classes.textField}
                value={this.state.website}
                name="website"
                variant="outlined"
                // inputRef={input => (this.code = input)}
                margin="normal"
              />
              <TextField
                label="Địa chỉ Facebook"
                onChange={this.handleChangeInput}
                className={classes.textField}
                value={this.state.facebook}
                name="facebook"
                variant="outlined"
                // inputRef={input => (this.code = input)}
                margin="normal"
              />
              <TextField
                label="Tài khoản ngân hàng"
                onChange={this.handleChangeInput}
                className={classes.textField}
                value={this.state.bankAccount}
                name="bankAccount"
                variant="outlined"
                // inputRef={input => (this.code = input)}
                margin="normal"
              />
              <FormControl className={classes.textField} error>
                <TextField
                  label="Email người quản lí : "
                  onChange={this.handleChangeInput}
                  // className={classes.textField}
                  value={this.state.email}
                  name="email"
                  variant="outlined"
                  // inputRef={input => (this.code = input)}
                  margin="normal"
                />
                {this.state.errorEmail ? (
                  <FormHelperText id="component-error-text1" style={{ marginTop: -2 }}>
                    Email sai định dạng
                  </FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>
              {/* <InputLabel style={{ fontSize: 12, marginLeft: 25, marginTop: 20 }}>Định dạng ngày tháng</InputLabel> */}
              <TextField
                select
                label="Định dạng ngày tháng"
                variant="outlined"
                className={classes.CustomInputBase}
                value={this.state.dateFormat}
                name="dateFormat"
                onChange={this.handleChangeInput}
                input={<OutlinedInput labelWidth={0} id="select-checkbox" />}
              >
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
              </TextField>

              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend" style={{ fontSize: 12 }}>
                  Định dạng thời gian
                </FormLabel>
                <RadioGroup
                  aria-label="timeFormat"
                  name="timeFormat"
                  className={classes.group}
                  value={this.state.timeFormat}
                  onChange={this.handleChangeInput}
                >
                  <FormControlLabel value="12h" control={<Radio />} label="12 giờ" />
                  <FormControlLabel value="24h" control={<Radio />} label="24 giờ" />
                </RadioGroup>
              </FormControl>
              {/* <InputLabel style={{ fontSize: 12, marginLeft: 25, display: 'block' }}>Ngày đầu tiên trong tuần</InputLabel> */}
              <TextField
                select
                label="Ngày đầu tiên trong tuần"
                variant="outlined"
                className={classes.textField}
                value={this.state.startDay}
                name="startDay"
                onChange={this.handleChangeInput}
                input={<OutlinedInput labelWidth={0} id="select" />}
              >
                <MenuItem value={0}>Chủ nhật</MenuItem>
                <MenuItem value={1}>Thứ 2</MenuItem>
              </TextField>
              <Grid container justify="flex-start" className={classes.textField}>
                <FormLabel component="legend" style={{ fontSize: 12, marginTop: 30, marginRight: 20 }}>
                  Thời gian làm việc:
                </FormLabel>
                <TextField
                  onChange={this.handleChangeInput}
                  variant="outlined"
                  type="time"
                  // className={classes.textField}
                  name="timeStart"
                  value={this.state.timeStart}
                  // inputRef={input => (this.code = input)}
                  margin="normal"
                />
                <span style={{ fontSize: 12, marginTop: 30, marginRight: 20 }}>&nbsp;đến</span>
                <TextField
                  onChange={this.handleChangeInput}
                  type="time"
                  variant="outlined"
                  value={this.state.timeEnd}
                  // className={classes.textField}
                  name="timeEnd"
                  // inputRef={input => (this.code = input)}
                  margin="normal"
                />
              </Grid>
              {/* <InputLabel style={{ fontSize: 12, marginLeft: 25, marginTop: 20, display: 'block' }}>Ngày trong tuần</InputLabel> */}
              {/* <TextField
                select
                label="Ngày trong tuần"
                variant="outlined"
                multiple
                value={this.state.daysInWeek}
                name="daysInWeek"
                className={classes.textField}
                onChange={this.handleChangeInput}
                // input={<Input id="select-multiple-checkbox" />}
                renderValue={selected => selected.join(', ')}
                MenuProps={MenuProps}
                input={<OutlinedInput labelWidth={0} id="select-multiple-checkbox" />}
              >
                <MenuItem value="Thứ 2">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 2') > -1} />
                  <ListItemText primary="Thứ 2" />
                </MenuItem>
                <MenuItem value="Thứ 3">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 3') > -1} />
                  <ListItemText primary="Thứ 3" />
                </MenuItem>
                <MenuItem value="Thứ 4">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 4') > -1} />
                  <ListItemText primary="Thứ 4" />
                </MenuItem>
                <MenuItem value="Thứ 5">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 5') > -1} />
                  <ListItemText primary="Thứ 5" />
                </MenuItem>
                <MenuItem value="Thứ 6">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 6') > -1} />
                  <ListItemText primary="Thứ 6" />
                </MenuItem>
                <MenuItem value="Thứ 7">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 7') > -1} />
                  <ListItemText primary="Thứ 7" />
                </MenuItem>
                <MenuItem value="Chủ nhật">
                  <Checkbox checked={this.state.daysInWeek.indexOf('Chủ nhật') > -1} />
                  <ListItemText primary="Chủ nhật" />
                </MenuItem>
              </TextField>
              <TextField
                label="Ngày nghỉ(định dạng: dd/mm/yyyy, mỗi ngày cách nhau bởi một dấu phẩy): "
                onChange={this.handleChangeInput}
                className={classes.textField}
                name="holiday"
                variant="outlined"
                // inputRef={input => (this.code = input)}
                margin="normal"
                value={this.state.holiday}
                // InputLabelProps={{
                //   shrink: true,
                // }}
              />
              <InputLabel style={{ fontSize: 12, marginLeft: 25, marginTop: 20, display: 'block' }}>Ngôn ngữ</InputLabel>
              <TextField
                select
                labe="Ngôn ngữ"
                variant="outlined"
                className={classes.textField}
                value={this.state.language}
                name="language"
                onChange={this.handleChangeInput}
                input={<OutlinedInput labelWidth={0} id="select-language" />}
              >
                <MenuItem value="vi">Việt Nam</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </TextField> */}
              <TextField disabled />
              {/* <Button variant="contained" color="primary" onClick={this.onSubmit} className={classes.button}>
                Lưu
              </Button>
              <Button variant="contained" className={classes.button}>
                Hủy
              </Button> */}
            </Paper>
          </Grid>
          <Grid style={{ height: '100%' }} md={6} justify="center" container flexWrap="wrap" className="avatar">
            <Avatar style={{ width: 300, height: 300 }} src={logoDefault} className={classes.avatar} srcSet={this.state.avatarURL} />
            <input
              className={classes.textFieldAva}
              onChange={this.onSelectImg}
              accept="image/*"
              name="avatar"
              type="file"
              style={{ cursor: 'pointer', opacity: 0, width: '300px', position: 'absolute', zIndex: '999', margin: '0px' }}
            />
            <span className={classes.spanAva}>
              <CameraAlt className={classes.iconCam} />
            </span>
            <Grid container justify="center">
              <span>Logo công ty </span>
            </Grid>
            <Grid container justify="center">
              <span>(Nhấp vào ảnh để thay đổi logo công ty)</span>
            </Grid>
            <Grid container style={{ padding: 10 }}>
              <ListItem button onClick={() => this.handleClick()}>
                <ListItemIcon>
                  <Typography variant="body1">Sms và Email</Typography>
                </ListItemIcon>
                {this.state.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Paper container direction="row" justify="center" alignItems="center">
                <Collapse style={{ padding: 20 }} in={this.state.open} timeout={0} unmountOnExit>
                  <TextField
                    name="smsBrandname"
                    value={this.state.smsBrandname}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    // defaultValue="Gmail"
                    variant="outlined"
                    fullWidth
                    label="smsBrandname"
                  />
                  <TextField
                    name="smsAccount"
                    value={this.state.smsAccount}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    label="smsAccount"
                  />
                  <TextField
                    name="smsPass"
                    value={this.state.smsPass}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    type="password"
                    variant="outlined"
                    fullWidth
                    label="smsPass"
                  />
                  <TextField
                    name="serviceServer"
                    value={this.state.serviceServer}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    // defaultValue="Gmail"
                    variant="outlined"
                    fullWidth
                    label="Service Server"
                  />
                  <TextField
                    name="mailServer"
                    value={this.state.mailServer}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    label="Mail Server"
                  />
                  <TextField
                    name="passServer"
                    value={this.state.passServer}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    type="password"
                    variant="outlined"
                    fullWidth
                    label="Password Server"
                  />
                  <TextField
                    name="host"
                    value={this.state.host}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    label="Host"
                  />
                </Collapse>
              </Paper>
            </Grid>
            {/* TASK 1 - DIEN GIA TRI CHECKED */}
            <Grid container style={{ padding: 10 }}>
              <ListItem button onClick={() => this.handleClickSetupCodeCollapse()}>
                <ListItemIcon>
                  <Typography variant="body1">Cấu hình tạo mã hệ thống</Typography>
                </ListItemIcon>
                {this.state.openSetupCode ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Paper style={{ width: '100%' }}>
                <Collapse in={this.state.openSetupCode} style={{ width: '100%', padding: 20 }} timeout={0} unmountOnExit>
                  {/* <Button variant="contained" color="primary" style={{ margin: 10, 'margin-left': 0 }}>
                    Thêm mới
                  </Button> */}
                  <InputLabel style={{ fontSize: 12, marginTop: 20, display: 'block' }}>MODULE ÁP DỤNG</InputLabel>
                  <Select
                    className={classes.textField}
                    style={{ 'margin-left': 0, width: '100%' }}
                    // TT - UPDATE=CREATE CODE - 25
                    value={this.state.dataConfigCode.find(item => item.name === 'moduleType').value}
                    name="moduleType"
                    onChange={this.handleChangeInputForConfigCode}
                    input={<OutlinedInput labelWidth={0} id="select-language" />}
                  >
                    <MenuItem value={1}>Dự Án</MenuItem>
                    <MenuItem value={2}>Hợp Đồng</MenuItem>
                    <MenuItem value={3}>Khách Hàng</MenuItem>
                    <MenuItem value={4}>Nhà Cung Cấp</MenuItem>
                    <MenuItem value={5}>Báo Giá</MenuItem>
                  </Select>
                  <div className={classes.checkboxGroup}>
                    <TextField
                      // TT - UPDATE=CREATE CODE - 25
                      value={this.state.dataConfigCode.find(item => item.name === 'prefix').value}
                      // TT - UPDATE=CREATE CODE - 4
                      onChange={this.handleChangeInputForConfigCode}
                      name="prefix"
                      margin="normal"
                      variant={this.state.dataConfigCode.find(item => item.name === 'prefix').checked ? 'outlined' : 'filled'}
                      fullWidth
                      label="TIỀN TỐ"
                      disabled={!this.state.dataConfigCode.find(item => item.name === 'prefix').checked}
                    />
                    <Checkbox
                      checked={this.state.dataConfigCode.find(item => item.name === 'prefix').checked}
                      // TT - UPDATE=CREATE CODE - 1
                      onClick={() => this.handleCheckBoxConfigCode('prefix')}
                      color="primary"
                    />
                  </div>
                  <InputLabel style={{ fontSize: 12, marginTop: 20, display: 'block' }}>ĐỊNH DẠNG NGÀY</InputLabel>
                  <div className={classes.checkboxGroup}>
                    <Select
                      className={
                        this.state.dataConfigCode.find(item => item.name === 'formatDate').checked ? classes.textField : classes.disabledSelect
                      }
                      style={{ 'margin-left': 0, width: '100%' }}
                      // TT - UPDATE=CREATE CODE - 25
                      value={this.state.dataConfigCode.find(item => item.name === 'formatDate').value}
                      name="formatDate"
                      // variant={this.state.dataConfigCode.find(item => item.name === 'formatDate').checked ? 'outlined' : 'filled'}
                      // TT - UPDATE=CREATE CODE - 4
                      onChange={this.handleChangeInputForConfigCode}
                      input={<OutlinedInput labelWidth={0} id="select-language" />}
                      disabled={!this.state.dataConfigCode.find(item => item.name === 'formatDate').checked}
                    >
                      <MenuItem value={1}>DD/MM/YYYY</MenuItem>
                      <MenuItem value={2}>YYYY/MM/DD</MenuItem>
                      <MenuItem value={3}>MM/DD/YYYY</MenuItem>
                    </Select>
                    <Checkbox
                      checked={this.state.dataConfigCode.find(item => item.name === 'formatDate').checked}
                      // TT - UPDATE=CREATE CODE - 1
                      onClick={() => this.handleCheckBoxConfigCode('formatDate')}
                      color="primary"
                    />
                  </div>
                  <InputLabel style={{ fontSize: 12, marginTop: 20, display: 'block' }}>ĐỊNH DẠNG SỐ THỨ TỰ</InputLabel>
                  <div className={classes.checkboxGroup}>
                    <Select
                      style={{ 'margin-left': 0, width: '100%' }}
                      // TT - UPDATE=CREATE CODE - 4
                      value={this.state.dataConfigCode.find(item => item.name === 'numericalOrderFormat').value}
                      // TT - UPDATE=CREATE CODE - 25
                      name="numericalOrderFormat"
                      disabled={!this.state.dataConfigCode.find(item => item.name === 'numericalOrderFormat').checked}
                      onChange={this.handleChangeInputForConfigCode}
                      className={
                        this.state.dataConfigCode.find(item => item.name === 'numericalOrderFormat').checked
                          ? classes.textField
                          : classes.disabledSelect
                      }
                      input={<OutlinedInput labelWidth={0} id="select-language" />}
                    >
                      <MenuItem value={1}>2 Chữ số</MenuItem>
                      <MenuItem value={2}>3 Chữ số</MenuItem>
                      <MenuItem value={3}>4 Chữ số</MenuItem>
                    </Select>
                    <Checkbox
                      checked={this.state.dataConfigCode.find(item => item.name === 'numericalOrderFormat').checked}
                      // TT - UPDATE=CREATE CODE - 1
                      onClick={() => this.handleCheckBoxConfigCode('numericalOrderFormat')}
                      color="primary"
                    />
                  </div>
                  {this.state.dataConfigCode.find(item => item.name === 'moduleType').value === 3 ? (
                    <div className={classes.checkboxGroup}>
                      <TextField
                        // TT - UPDATE=CREATE CODE - 25
                        value={this.state.dataConfigCode.find(item => item.name === 'provincial').checked ? 'KHU VỰC' : ''}
                        // TT - UPDATE=CREATE CODE - 4
                        onChange={this.handleChangeInputForConfigCode}
                        name="provincial"
                        margin="normal"
                        variant={this.state.dataConfigCode.find(item => item.name === 'provincial').checked ? 'outlined' : 'filled'}
                        fullWidth
                        label="KHU VỰC"
                        disabled
                      />
                      <Checkbox
                        checked={this.state.dataConfigCode.find(item => item.name === 'provincial').checked}
                        // TT - UPDATE=CREATE CODE - 1
                        onClick={() => {
                          // console.log('check>>>>>', this.state.dataConfigCode)
                          this.handleCheckBoxConfigCode('provincial');
                        }}
                        color="primary"
                      />
                    </div>
                  ) : this.state.dataConfigCode.find(item => item.name === 'moduleType').value === 2 ? (
                    <div className={classes.checkboxGroup}>
                      <TextField
                        // TT - UPDATE=CREATE CODE - 25
                        value={''}
                        // TT - UPDATE=CREATE CODE - 4
                        onChange={this.handleChangeInputForConfigCode}
                        name="productType"
                        margin="normal"
                        variant={this.state.dataConfigCode.find(item => item.name === 'productType').checked ? 'outlined' : 'filled'}
                        fullWidth
                        label="LOẠI SẢN PHẨM"
                        disabled
                      />
                      <Checkbox
                        checked={this.state.dataConfigCode.find(item => item.name === 'productType').checked}
                        // TT - UPDATE=CREATE CODE - 1
                        onClick={() => {
                          // console.log('check>>>>>', this.state.dataConfigCode)
                          this.handleCheckBoxConfigCode('productType');
                        }}
                        color="primary"
                      />
                    </div>
                  ) : (
                    <div className={classes.checkboxGroup}>
                      <TextField
                        // TT - UPDATE=CREATE CODE - 25
                        value={this.state.dataConfigCode.find(item => item.name === 'intermediate').value}
                        // TT - UPDATE=CREATE CODE - 4
                        onChange={this.handleChangeInputForConfigCode}
                        name="intermediate"
                        margin="normal"
                        variant={this.state.dataConfigCode.find(item => item.name === 'intermediate').checked ? 'outlined' : 'filled'}
                        fullWidth
                        label="TRUNG TỐ"
                        disabled={!this.state.dataConfigCode.find(item => item.name === 'intermediate').checked}
                      />
                      <Checkbox
                        checked={this.state.dataConfigCode.find(item => item.name === 'intermediate').checked}
                        // TT - UPDATE=CREATE CODE - 1
                        onClick={() => {
                          // console.log('check>>>>>', this.state.dataConfigCode)
                          this.handleCheckBoxConfigCode('intermediate');
                        }}
                        color="primary"
                      />
                    </div>
                  )}

                  <div className={classes.checkboxGroup}>
                    <TextField
                      // TT - UPDATE=CREATE CODE - 25
                      value={this.state.dataConfigCode.find(item => item.name === 'suffixes').value}
                      // TT - UPDATE=CREATE CODE - 4
                      onChange={this.handleChangeInputForConfigCode}
                      margin="normal"
                      name="suffixes"
                      fullWidth
                      variant={this.state.dataConfigCode.find(item => item.name === 'suffixes').checked ? 'outlined' : 'filled'}
                      label="HẬU TỐ"
                      disabled={!this.state.dataConfigCode.find(item => item.name === 'suffixes').checked}
                    />
                    <Checkbox
                      checked={this.state.dataConfigCode.find(item => item.name === 'suffixes').checked}
                      // TT - UPDATE=CREATE CODE - 1
                      onClick={() => this.handleCheckBoxConfigCode('suffixes')}
                      color="primary"
                    />
                  </div>
                  {/* NICKNAME */}
                  {this.state.dataConfigCode.find(item => item.name === 'moduleType').value !== 4 && (
                    <div className={classes.checkboxGroup}>
                      <TextField
                        // TT - UPDATE=CREATE CODE - 25
                        value={this.state.dataConfigCode.find(item => item.name === 'nickname').value ? 'BIET DANH' : ''}
                        // TT - UPDATE=CREATE CODE - 4
                        onChange={this.handleChangeInputForConfigCode}
                        margin="normal"
                        name="nickname"
                        variant="filled"
                        fullWidth
                        label="BIỆT DANH"
                        disabled
                      />
                      <Checkbox
                        checked={this.state.dataConfigCode.find(item => item.name === 'nickname').checked}
                        // TT - UPDATE=CREATE CODE - 1
                        onClick={() => this.handleCheckBoxConfigCode('nickname')}
                        color="primary"
                      />
                    </div>
                  )}

                  <InputLabel style={{ fontSize: 12, marginTop: 20, display: 'block' }}>KÍ TỰ NGẮT</InputLabel>
                  <div className={classes.exampleCodeGroup}>
                    <Select
                      className={classes.textField}
                      style={{ 'margin-left': 0, width: '100%' }}
                      // TT - UPDATE=CREATE CODE - 25
                      value={this.state.dataConfigCode.find(item => item.name === 'breakCharacter').value}
                      name="breakCharacter"
                      // TT - UPDATE=CREATE CODE - 4
                      onChange={this.handleChangeInputForConfigCode}
                      input={<OutlinedInput labelWidth={0} id="select-language" />}
                    >
                      <MenuItem value={1}>/</MenuItem>
                      <MenuItem value={2}>-</MenuItem>
                    </Select>
                    <TextField
                      style={{ margin: 0 }}
                      disabled
                      value={this.state.codeExample}
                      margin="normal"
                      variant="filled"
                      fullWidth
                      label="ĐỊNH DẠNG MÃ"
                    />
                  </div>
                  <div className={classes.groupBtnForAction}>
                    {/* // TT - UPDATE=CREATE CODE - 8 - SUBMIT - SEND DATA */}
                    <Button variant="outlined" color="primary" onClick={this.onSubmitSaveConfigCode}>
                      Lưu
                    </Button>
                    <Button variant="outlined">Hủy</Button>
                  </div>
                </Collapse>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }

  onSubmit = () => {
    const {
      avatar,
      companyName,
      nameDisplay,
      website,
      email,
      dateFormat,
      timeFormat,
      startDay,
      timeStart,
      avatarURL,
      timeEnd,
      daysInWeek,
      language,
      holiday,
      mailServer,
      serviceServer,
      passServer,
      smsBrandname,
      host,
      smsAccount,
      smsPass,
      facebook,
      bankAccount,
    } = this.state;
    const workDay = [];
    daysInWeek.forEach(item => {
      if (item === 'Chủ nhật') {
        workDay.push('1');
      } else {
        workDay.push(item[item.length - 1]);
      }
    });
    const firstDayOfTheWeek = startDay + 1;
    const restDay = holiday.split(',').map(item => item.trim());
    const rex = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (companyName === '' || nameDisplay === '') {
      if (companyName === '') {
        this.setState({ errorCompanyName: true });
      }
      if (nameDisplay === '') {
        this.setState({ errorTitleName: true });
      }
    } else if (!rex.test(email.trim()) || email === '') {
      this.setState({ errorEmail: true });
    } else {
      const body = {
        firstDayOfTheWeek,
        name: companyName,
        displayName: nameDisplay,
        website,
        email,
        avatar,
        avatarURL,
        language,
        holidays: restDay,
        workingDay: workDay,
        workingTime: {
          start: timeStart,
          end: timeEnd,
        },
        timeFormat,
        dateFormat,
        mailServer,
        serviceServer,
        passServer,
        host,
        smsBrandname,
        smsAccount,
        smsPass,
        facebook,
        bankAccount,
      };
      this.props.onUpdate(body);
    }
  };

  onSubmitSaveConfigCode = () => {
    const { dataConfigCode } = this.state;

    const body = dataConfigCode.reduce((map, obj) => {
      if (obj.checked === true && obj.value) {
        map[obj.name] = obj.value;
      }
      return map;
    }, {});
    this.props.onCreateConfigCode(body);
  };

  onSelectImg = e => {
    const urlAvt = URL.createObjectURL(e.target.files[0]);
    this.setState({ avatarURL: urlAvt, avatar: e.target.files[0] }); // avatar: e.target.files[0]
  };

  handleChangeInput = e => {
    if (e.target.name === 'email' || e.target.name === 'nameDisplay' || e.target.name === 'companyName') {
      if (e.target.name === 'email') {
        this.setState({ errorEmail: false });
      }
      if (e.target.name === 'nameDisplay') {
        this.setState({ errorTitleName: false });
      }
      if (e.target.name === 'companyName') {
        this.setState({ errorCompanyName: false });
      }
    }
    this.setState({ [e.target.name]: e.target.value });
  };
}

SystemConfigPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

// TT - UPDATE=CREATE CODE - 19
const mapStateToProps = createStructuredSelector({
  systemConfigPage: makeSelectSystemConfigPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onUpdate: body => {
      dispatch(updateSysConfAct(body));
    },
    // TT
    // TT - UPDATE=CREATE CODE - 11
    onCreateConfigCode: body => {
      dispatch(createConfigCodeAct(body));
    },
    onGetConfigCode: body => {
      dispatch(getConfigCodeAct(body));
    },
    onGetConf: () => {
      dispatch(getSysConfAct());
    },
    onReset: () => {
      dispatch(resetNoti());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'systemConfigPage', reducer });
const withSaga = injectSaga({ key: 'systemConfigPage', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(SystemConfigPage);
