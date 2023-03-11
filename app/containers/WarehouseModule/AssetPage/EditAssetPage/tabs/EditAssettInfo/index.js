/* eslint-disable react/no-unused-state */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/**
 *
 * EditAssetInfo
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  Grid,
  withStyles,
  FormHelperText,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  FormControl,
  Typography,
  Fab,
  Checkbox,
  Button,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { CameraAlt, Delete } from '@material-ui/icons';
import { TextField } from 'components/LifetekUi';
import AvatarImg from 'images/product.png';

import { getLabelName } from 'utils/common';
import TextFieldCode from 'components/TextFieldCode';
import styles from './styles';
import { DatePicker } from 'material-ui-pickers';
import NumberFormat from 'react-number-format';
/* eslint-disable react/prefer-stateless-function */

const listStatus = [
  {
    code: 0,
    name: 'Đang hoạt động',
  },
  {
    code: 1,
    name: 'Bảo hành',
  },
  {
    code: 2,
    name: 'Bảo trì',
  },
  {
    code: 3,
    name: 'Hỏng',
  },
  {
    code: 4,
    name: 'Mất',
  },
  {
    code: 5,
    name: 'Thanh lý',
  },
];

const CustomLink = props => (
  <Link
    to="/Stock/config"
    onClick={() => {
      localStorage.setItem('stockConfig', props.number);
    }}
    style={{ display: 'inline-block', textAlign: 'right' }}
  >
    {props.children}
  </Link>
);

function KanbanStep(props) {
  const { listStatus, currentStatus, onChange } = props;

  return (
    <Stepper style={{ background: 'transparent' }} activeStep={currentStatus}>
      {listStatus.map((item, i) => (
        <Step key={i} onClick={() => onChange(item.code)}>
          <StepLabel style={{ cursor: 'pointer' }}>{item.name}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

function NumberFormatCustom(props) {
  const { inputRef, onChange, name, ...other } = props;
  return (
    <NumberFormat
      {...other}
      allowNegative={false}
      getInputRef={inputRef}
      onValueChange={values =>
        onChange({
          target: {
            name: name,
            value: values.floatValue,
          },
        })
      }
      thousandSeparator
      isNumericString
    />
  );
}
class EditAssetInfo extends React.Component {
  state = {
    level: 0,
    assetStatus: 0,
    state: 3,
    code: '',
    image: '',
    name: '',
    unit: '',
    type: '',
    warrantyPeriod: '',
    warrantyPeriodUnit: '',
    errorWarrantyPeriodUnit: '',
    dateAcceptance: null,
    location: '',
    supplierId: '',
    note: '',
    depreciationCalculatedValue: '',
    depreciationCalculatedUnit: '',
    assetSerial: [],
    // image: null,
    errorName: false,
    errorCode: false,
    errorDepreciationCalculatedUnit: false,
    errorSupplier: false,
    errorUnit: false,
    errorType: false,
    avatar: null,
    isSubmit: false,
    showSeries: false,
    expiry: '',
    expiryUnit: '',
    errorExpiryUnit: false,
    coefficient: '',
    meterNumber: '',
    meterNumberNearest: '',
  };

  componentDidMount() {
    this.props.onRef(this);
    this.state.isSubmit = false;
  }

  componentDidUpdate(preProps) {
    const { asset } = this.props;
    if (!this.state.isSubmit && preProps.asset !== asset && asset) {
      this.setState({
        image: asset.image || '',
        name: asset.name || '',
        code: asset.code || '',
        type: asset.type || '',
        assetStatus: asset.assetStatus == null ? 0 : asset.assetStatus,
        location: asset.location || '',
        depreciationCalculatedValue: asset.depreciationCalculatedValue || '',
        warrantyPeriod: asset.warrantyPeriod || '',
        warrantyPeriodUnit: asset.warrantyPeriodUnit || '',
        dateAcceptance: asset.dateAcceptance || '',
        assetSerial: asset.assetSerial || [],
        supplierId: asset.supplierId ? asset.supplierId._id : null,
        unit: asset.unit ? asset.unit._id : '',
        depreciationCalculatedUnit: asset.depreciationCalculatedUnit || '',
        note: asset.note || '',
        expiry: asset.expiry || '',
        expiryUnit: asset.expiryUnit || '',
        coefficient: asset.coefficient || '',
        meterNumber: Number(asset.meterNumber) >= 0 ? asset.meterNumber : '',
        meterNumberNearest: Number(asset.meterNumberNearest) >= 0 ? asset.meterNumberNearest : '',
      });
      // this.state.isSubmit = true;
    }
  }

  handleChangeStatus = status => {
    this.setState({ assetStatus: status });
  };

  handleChangeSerial = (index, name, value) => {
    // console.log(name, index, e.target.value);
    const { assetSerial } = this.state;
    assetSerial[index][name] = value;
    this.setState({ assetSerial });
  };

  handleDeleteSerial = index => {
    const { assetSerial } = this.state;
    assetSerial.splice(index, 1);
    this.setState({ assetSerial });
  };

  handleAddSerial = () => {
    const { assetSerial } = this.state;
    assetSerial.push({
      serial: '',
      price: '',
      date: null,
    });
    this.setState({ assetSerial });
  };

  handleChangeCheckbox = event => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
  };

  handleChangeInput = e => {
    const { name, value } = e.target;
    if (name === 'name' && value.trim().length < 200) {
      this.setState({ errorName: false });
    }
    if (name === 'code' && value.trim().length > 4) {
      this.setState({ errorCode: false });
    }
    if (name === 'calculateUnit') {
      this.setState({ errorValue: false });
    }
    if (name === 'supplierId') {
      this.setState({ errorSupplier: false });
    }
    // if (name === 'warrantyPeriod' && Number(value) >= 0) {
    //   this.setState({ errorWarrantyPeriod: false });
    // }
    if (name === 'warrantyPeriodUnit') {
      this.setState({ errorWarrantyPeriodUnit: false });
    }
    if (name === 'unit') {
      this.setState({ errorUnit: false });
    }

    if (name === 'depreciationCalculatedUnit') {
      this.setState({ errorDepreciationCalculatedUnit: false });
    }
    if (name === 'expiryUnit') {
      this.setState({ errorExpiryUnit: false });
    }
    if (name === 'type') {
      this.setState({ errorType: false });
    }
    this.setState({ [name]: value });
  };
  handleDateChange = (name, value) => {
    this.setState({ [name]: value });
  };

  onHoverIn = () => {
    this.setState({ showAva: true });
  };

  onHoverOut = () => {
    this.setState({ showAva: false });
  };

  // eslint-disable-next-line consistent-return
  onSelectImg = e => {
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
      // check image size > 3mb
    } else if (file.size / 1024 / 1024 > 3) {
      checkFile = false;
      txt = 'Dung lượng file tối đa là 3MB';
    }

    // confirm logo
    if (!checkFile) {
      this.props.enqueueSnackbar(txt, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        autoHideDuration: 3000,
      });
    } else {
      const urlAvt = URL.createObjectURL(e.target.files[0]);
      // eslint-disable-next-line react/no-unused-state
      this.setState({ image: urlAvt, avatar: e.target.files[0] }); // ,
    }
  };

  getData = () => {
    const {
      avatar,
      level,
      assetStatus,
      state,
      code,
      image,
      name,
      type,
      unit,
      warrantyPeriod,
      warrantyPeriodUnit,
      dateAcceptance,
      location,
      supplierId,
      note,
      depreciationCalculatedValue,
      depreciationCalculatedUnit,
      assetSerial,
      expiry,
      expiryUnit,
      meterNumber,
      coefficient,
      meterNumberNearest,
    } = this.state;
    const rex = /^[A-Za-z0-9]+$/;
    if (
      name.trim() === '' ||
      name.trim().length > 200 ||
      code.trim().length < 5 ||
      // !rex.test(code.trim()) ||   //check ký tự đặc biệt bên ngoài EditAssetPage;
      // supplierId === '' ||
      type === '' ||
      type === undefined
      // expiryUnit === ''
    ) {
      if (name.trim() === '' || name.trim().length > 200) {
        this.setState({ errorName: true });
      }

      if (code.trim() === '' || code.trim().length < 5) {
        this.setState({ errorCode: true });
      }

      if (type === '') {
        this.setState({ errorType: true });
      }
      if (supplierId === '') {
        this.setState({ errorSupplier: true });
      }
      // if (warrantyPeriodUnit === '') {
      //   this.setState({ errorWarrantyPeriodUnit: true });
      // }
      // if (expiryUnit === '') {
      //   this.setState({ errorExpiryUnit: true });
      // }
      this.props.handleChangeIndex(0);
    } else {
      // console.log(this.state);
      this.setState({ isSubmit: true });
      const info = {
        avatar,
        level,
        assetStatus,
        state,
        code,
        type,
        image,
        name,
        unit,
        warrantyPeriod,
        warrantyPeriodUnit,
        dateAcceptance,
        location,
        supplierId,
        note,
        depreciationCalculatedValue: parseInt(depreciationCalculatedValue),
        assetSerial,
        expiry,
        expiryUnit,
        meterNumber,
        coefficient,
        meterNumberNearest,
      };

      if (depreciationCalculatedUnit) {
        info.depreciationCalculatedUnit = depreciationCalculatedUnit;
      }
      return info;
    }
  };

  render() {
    const { classes, suppliers, units, assetTypes, id } = this.props;
    const { assetStatus, image } = this.state;
    return (
      <div>
        <Grid container spacing={16}>
          <Grid md={12} item>
            <KanbanStep
              listStatus={listStatus}
              currentStatus={assetStatus}
              onChange={this.handleChangeStatus}
            />
          </Grid>
          <Grid md={2} item>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                borderRadius: 5,
                boxShadow:
                  '0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img src={image || AvatarImg} alt="Ảnh sản phẩm" className={classes.avatar} />
              <input
                accept="image/*"
                className={classes.inputAvt}
                type="file"
                onChange={this.onSelectImg}
                onMouseEnter={this.onHoverIn}
                onMouseLeave={this.onHoverOut}
                name="avatar"
              />
              <span className={classes.spanAva} style={this.state.showAva ? { opacity: 100 } : {}}>
                <CameraAlt className={classes.iconCam} />
              </span>
            </div>
          </Grid>
          <Grid item xs={10}>
            <Grid container spacing={16}>
              <Grid md={6} item>
                <TextField
                  // label={getLabelName('name', 'Asset') || 'Tên tài sản'}
                  label="Tên tài sản"
                  name="name"
                  fullWidth
                  value={this.state.name}
                  onChange={this.handleChangeInput}
                  required
                  error={this.state.errorName}
                />
                {this.state.errorName && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Tên có độ dài không quá 200 kí tự và không được để trống
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  // label={getLabelName('code', 'Asset') || 'Mã tài sản'}
                  label="Mã tài sản"
                  name="code"
                  fullWidth
                  variant="outlined"
                  value={this.state.code}
                  onChange={this.handleChangeInput}
                  margin="dense"
                  required
                  error={this.state.errorCode}
                />
                {this.state.errorCode && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Mã có độ dài không dưới 5 kí tự và không được để trống
                  </FormHelperText>
                )}
              </Grid>
              <Grid md={6} item>
                <Grid container spacing={8}>
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      // label={getLabelName('warrantyPeriod', 'Asset') || 'Thời gian bảo hành'}
                      label="Thời gian bảo hành"
                      value={this.state.warrantyPeriod}
                      onChange={this.handleChangeInput}
                      name="warrantyPeriod"
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      select
                      fullWidth
                      // label={getLabelName('warrantyPeriodUnit', 'Asset') ||'Đơn vị'}
                      label="Đơn vị bảo hành"
                      name="warrantyPeriodUnit"
                      value={this.state.warrantyPeriodUnit}
                      onChange={this.handleChangeInput}
                      // required
                      error={this.state.errorWarrantyPeriodUnit}
                    >
                      {units &&
                        units.map((item, index) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                    {this.state.errorWarrantyPeriodUnit && (
                      <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                        Phải chọn đơn vị tính
                      </FormHelperText>
                    )}
                    <CustomLink number={4}>Quản lý đơn vị tính</CustomLink>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  // label={getLabelName('type', 'Asset') || 'Loại tài sản'}
                  label="Loại tài sản"
                  name="type"
                  value={
                    typeof this.state.type === 'string' ? this.state.type : this.state.type._id
                  }
                  onChange={this.handleChangeInput}
                  required
                  error={this.state.errorType}
                >
                  {assetTypes &&
                    assetTypes.map((item, index) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </TextField>
                {this.state.errorType && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Phải chọn Loại tài sản
                  </FormHelperText>
                )}
                <CustomLink number={2}>Quản lý loại tài sản</CustomLink>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  // label={getLabelName('location', 'Asset') || 'Vị trí'}
                  label="Vị trí"
                  value={this.state.location}
                  onChange={this.handleChangeInput}
                  name="location"
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={this.state.dateAcceptance || null}
                  variant="outlined"
                  label="Thời gian nghiệm thu"
                  margin="dense"
                  fullWidth
                  onChange={date => this.handleDateChange('dateAcceptance', date)}
                />
              </Grid>
              <Grid md={6} item>
                <TextField
                  select
                  fullWidth
                  label="Nhà cung cấp"
                  name="supplierId"
                  value={this.state.supplierId}
                  onChange={this.handleChangeInput}
                  error={this.state.errorSupplier}
                >
                  {suppliers &&
                    suppliers.map((item, index) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </TextField>
                {this.state.errorSupplier && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Phải chọn nhà cung cấp
                  </FormHelperText>
                )}
                <CustomLink number={6}>Quản lý nhà cung cấp</CustomLink>
              </Grid>

              <Grid md={6} item>
                <Grid container spacing={8}>
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      // label={getLabelName('depreciationCalculatedValue', 'Asset') || 'Giá trị tính khấu hao'}
                      label="Giá trị tính khấu hao"
                      value={this.state.depreciationCalculatedValue}
                      onChange={this.handleChangeInput}
                      name="depreciationCalculatedValue"
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      select
                      fullWidth
                      label="Đơn vị tính khấu hao"
                      name="depreciationCalculatedUnit"
                      value={this.state.depreciationCalculatedUnit}
                      onChange={this.handleChangeInput}
                    >
                      {units &&
                        units.map((item, index) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  // label={getLabelName('unit', 'Asset') || 'Đơn vị tính'}
                  label="Đơn vị tính"
                  name="unit"
                  value={this.state.unit}
                  onChange={this.handleChangeInput}
                  // required
                  error={this.state.errorUnit}
                >
                  {units &&
                    units.map((item, index) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </TextField>
                {this.state.errorUnit && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Phải chọn đơn vị tính
                  </FormHelperText>
                )}
                <CustomLink number={4}>Quản lý đơn vị tính</CustomLink>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  // label={getLabelName('coefficient', 'Asset') || 'Hệ số nhân'}
                  label="Hệ số nhân"
                  name="coefficient"
                  fullWidth
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                  variant="outlined"
                  value={this.state.coefficient}
                  onChange={this.handleChangeInput}
                  margin="dense"
                />
              </Grid>
              {id === 'add' ? (
                <Grid item xs={6}>
                  <TextField
                    // label={getLabelName('meterNumber', 'Asset') || 'Số công tơ'}
                    label="Số công tơ ban đầu"
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    name="meterNumber"
                    fullWidth
                    variant="outlined"
                    value={this.state.meterNumber}
                    onChange={this.handleChangeInput}
                    margin="dense"
                  />
                </Grid>
              ) : (
                <Grid item md={6}>
                  <Grid container spacing={8}>
                    <Grid item xs={6}>
                      <TextField
                        // label={getLabelName('meterNumber', 'Asset') || 'Số công tơ'}
                        label="Số công tơ ban đầu"
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                        name="meterNumber"
                        fullWidth
                        variant="outlined"
                        disabled
                        value={this.state.meterNumber}
                        margin="dense"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        // label={getLabelName('meterNumber', 'Asset') || 'Số công tơ'}
                        label="Số công tơ gần nhất"
                        type="number"
                        name="meterNumberNearest"
                        fullWidth
                        disabled
                        variant="outlined"
                        value={this.state.meterNumberNearest}
                        margin="dense"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
              <Grid md={6} item>
                <Grid container spacing={8}>
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      label={getLabelName('expiry ', 'Asset') || 'Hạn sử dụng'}
                      value={this.state.expiry}
                      onChange={this.handleChangeInput}
                      name="expiry"
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      select
                      fullWidth
                      label="Đơn vị hạn sử dụng"
                      name="expiryUnit"
                      value={this.state.expiryUnit}
                      onChange={this.handleChangeInput}
                      // required
                      error={this.state.errorExpiryUnit}
                    >
                      {units &&
                        units.map((item, index) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                    {this.state.errorExpiryUnit && (
                      <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                        Phải chọn đơn vị tính
                      </FormHelperText>
                    )}
                    <CustomLink number={4}>Quản lý đơn vị tính</CustomLink>
                  </Grid>
                </Grid>
              </Grid>

              <Grid md={6} item>
                <TextField
                  // label={getLabelName('note', 'Asset') || 'Mô tả'}
                  label="Ghi chú"
                  multiline
                  rows={3}
                  fullWidth
                  name="note"
                  value={this.state.note}
                  onChange={this.handleChangeInput}
                />
              </Grid>
              <Grid md={6} item>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="showSeries"
                          checked={this.state.showSeries}
                          onChange={e => this.handleChangeCheckbox(e)}
                          color="primary"
                        />
                      }
                      label={getLabelName('isSerial', 'Asset') || 'Hiện Serial'}
                    />
                  </FormControl>
                  {this.state.showSeries && (
                    <React.Fragment>
                      <Typography component="p">Danh sách Serial</Typography>
                      {this.state.assetSerial.length > 0 &&
                        this.state.assetSerial.map((item, index) => (
                          <Grid
                            container
                            spacing={8}
                            key={index}
                            alignItems="center"
                            justify="center"
                          >
                            <Grid item xs>
                              <TextField
                                label="Số Serial"
                                onChange={e =>
                                  this.handleChangeSerial(index, 'serial', e.target.value)
                                }
                                value={item.serial}
                              />
                            </Grid>
                            <Grid item xs>
                              <TextField
                                label="Giá"
                                type="number"
                                value={item.price}
                                onChange={e =>
                                  this.handleChangeSerial(index, 'price', e.target.value)
                                }
                              />
                            </Grid>
                            <Grid item xs>
                              <DatePicker
                                inputVariant="outlined"
                                format="DD/MM/YYYY"
                                value={item.date}
                                variant="outlined"
                                label="Thời gian bảo hành"
                                margin="dense"
                                fullWidth
                                onChange={date => this.handleChangeSerial(index, 'date', date)}
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <Fab
                                size="small"
                                color="secondary"
                                onClick={() => this.handleDeleteSerial(index)}
                              >
                                <Delete />
                              </Fab>
                            </Grid>
                          </Grid>
                        ))}
                      <Button
                        variant="contained"
                        style={{ marginTop: '10px' }}
                        onClick={this.handleAddSerial}
                      >
                        Thêm
                      </Button>
                    </React.Fragment>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

EditAssetInfo.propTypes = {
  classes: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
};

// export default withStyles(styles)(AssetInfo);
export default compose(
  withStyles(styles),
  withSnackbar,
)(EditAssetInfo);
