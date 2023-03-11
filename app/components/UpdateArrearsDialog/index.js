/**
 *
 * UpdateArrearsDialog
 *
 */

import React from 'react';
import { Grid, Dialog, DialogTitle, FormHelperText, DialogActions, DialogContent, TextField, Button, MenuItem } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
// import AsyncSelect from 'react-select/async';
// import { components } from 'react-select';
import moment from 'moment';
import { API_TASK_CONTRACT_PROJECT } from '../../config/urlConfig';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';
const date = moment().format('YYYY-MM-DD');
/* eslint-disable react/prefer-stateless-function */
class UpdateArrearsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn1 = React.createRef();
    // if (this.props.taskChoose !== null) {
    //   this.loadOptions();
    // }
  }

  state = {
    arrears: {
      arrearsName: '',
      arrearsDate: moment().format('YYYY-MM-DD'),
      arrearsAmount: 0,
      arrearsUnit: 'VNĐ',
      arrearsStatus: 0,
      arrearsPaidAmount: 0,
      note: '',
    },
  };

  componentWillReceiveProps(props) {
    // if (props !== this.props) {
    if (props.open !== this.props.open && props.arrears !== null) {
      this.state.arrears = props.arrears;
      this.state.arrears.arrearsDate = moment(props.arrears.arrearsDate).format('YYYY-MM-DD');
      const { arrearsAmount } = props.arrears;
      if (props.arrears.arrearsUnit === '%' && (Number(arrearsAmount) / Number(props.debtMoney)) * 100 > 0.1) {
        this.state.arrears.arrearsAmount = (Number(arrearsAmount) / Number(props.debtMoney)) * 100;
      }
    }
    // }
    if (this.props.taskChoose !== null) {
      if (this.props.edit === 'true') {
        this.loadOptions2(this.props.taskChoose);
      }
      // else {
      //   this.setState({ jobs: this.props.jobs }, () => {});
      // }
    }
    if (props.open !== this.props.open && !isNaN(props.debtMoney) && props.arrears.arrearsAmount <= 0) {
      const { arrears } = this.state;
      arrears.arrearsAmount = Number(props.debtMoney);
      this.setState({ arrears: arrears });
    }
  }

  loadOptions2 = value => {
    if (!value.taskId) return;
    const token = localStorage.getItem('token');
    const url = `${API_TASK_CONTRACT_PROJECT}/${value.taskId}`;
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => response.json());
    // .then(myJson => {
    //   this.setState({
    //     jobs: myJson,
    //   });
    // });
  };

  handleChangeInputStage = e => {
    const { arrears } = this.state;
    arrears[e.target.name] = e.target.value;
    this.setState({ arrears });
  };
  handleChangePrice = e => {
    const { arrears } = this.state;
    if (e.target.name !== 'arrearsAmount') {
      arrears[e.target.name] = e.target.value;
      this.setState({ arrears });
    } else {
      if (Number(e.target.value) < 0) {
        arrears.arrearsAmount = 0;
        this.setState({ arrears });
      }
      if (Number(e.target.value) > Number(this.props.debtMoney)) {
        this.props.onChangeSnackbar(true, 'số tiền không được vượt quá số tiền của báo giá', 'error');
        return;
      } else {
        arrears.arrearsAmount = e.target.value;
        this.setState({ arrears });
      }
    }
  };

  handleSave = () => {
    const { arrears } = this.state;
    if (arrears.arrearsUnit === '%') {
      const { arrearsAmount } = arrears;
      arrears.arrearsAmount = (Number(this.props.debtMoney) * Number(arrearsAmount)) / 100;
    }
    // if (arrears.arrearsAmount >= this.props.debtMoney) {
    //   alert('số tiền không được vượt quá số tiền của báo giá');
    //   return;
    // }
    this.props.handleAddtoList(arrears);
  };

  // handleChangeJobs = val => {
  //   this.setState({ contractWork: val.target.value });
  // };

  render() {
    const { intl, messages } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          fullWidth
          maxWidth="md"
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" onClose={this.handleClose}>
            CẬP NHẬT YÊU CẦU TRUY THU
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            <ValidatorForm style={{ width: '100%' }} onSubmit={this.handleSave}>
              <Grid item container md={12}>
                <Grid item md={12}>
                  <TextValidator
                    label="Tên khoản truy thu"
                    name="arrearsName"
                    value={this.state.arrears.arrearsName}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    validators={['required', 'trim']}
                    errorMessages={[`Không được để trống`, `Không được để trống`]}
                  />
                </Grid>

                <Grid item md={12}>
                  <TextField
                    label={intl.formatMessage(messages.ycttTrangThai || { id: 'ycttTrangThai', defaultMessage: 'ycttTrangThai' })}
                    name="arrearsStatus"
                    select
                    value={this.state.arrears.arrearsStatus}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value={0}>Chưa thanh toán</MenuItem>
                    <MenuItem value={1}>Đã thanh toán</MenuItem>
                  </TextField>
                </Grid>
                <Grid item md={12}>
                  <TextValidator
                    label="Ngày tạo"
                    name="arrearsDate"
                    type="date"
                    InputProps={{ inputProps: { min: this.props.minDay } }}
                    value={this.state.arrears.arrearsDate}
                    onChange={this.handleChangeInputStage}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    style={{ width: '100%', display: 'flex !important' }}
                    validators={['required', 'trim']}
                    errorMessages={[`Không được để trống`, `Không được để trống`]}
                  />
                </Grid>

                <Grid container item md={12} spacing={8}>
                  <Grid item md={8}>
                    <TextValidator
                      label={intl.formatMessage(messages.ycttSoTien || { id: 'ycttSoTien', defaultMessage: 'ycttSoTien' })}
                      name="arrearsAmount"
                      value={this.state.arrears.arrearsAmount}
                      onChange={this.handleChangePrice}
                      variant="outlined"
                      type="number"
                      // style={{ width: '80%', display: 'flex !important' }}
                      InputProps={{ inputProps: { min: 0 } }}
                      margin="normal"
                      validators={['minNumber:0', this.state.arrears.arrearsUnit === '%' ? 'maxNumber: 100' : 'matchRegexp:[0-9]']}
                      errorMessages={[
                        `${intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' })}`,
                        this.state.arrears.arrearsUnit === '%'
                          ? 'Không vượt quá 100%'
                          : `${intl.formatMessage(messages.canNhapSo || { id: 'canNhapSo', defaultMessage: 'canNhapSo' })}`,
                      ]}
                      fullWidth
                    />
                  </Grid>
                  <Grid item md={4}>
                    <TextField
                      label="Đơn vị"
                      name="arrearsUnit"
                      select
                      value={this.state.arrears.arrearsUnit}
                      onChange={this.handleChangeInputStage}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      // style={{ width: '20%', display: 'flex !important' }}
                      margin="normal"
                      fullWidth
                    >
                      <MenuItem value="VNĐ">VNĐ</MenuItem>
                      <MenuItem value="$">$</MenuItem>
                    </TextField>
                    <FormHelperText id="component-error-text" style={this.state.amountError ? { color: 'red' } : { color: 'red', display: 'none' }}>
                      {intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}
                    </FormHelperText>
                  </Grid>
                </Grid>
                {/* <Grid item md={12}>
                  <TextValidator
                    label="vat"
                    name="vat"
                    value={this.state.arrears.vat}
                    onChange={this.handleChangeInputStage}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type="number"
                    validators={['minNumber:0', 'maxNumber:100']}
                    errorMessages={[
                      `${intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' })}`,
                      this.state.arrears.vat > 100
                        ? 'Không vượt quá 100%'
                        : `${intl.formatMessage(messages.canNhapSo || { id: 'canNhapSo', defaultMessage: 'canNhapSo' })}`,
                    ]}
                  />
                </Grid> */}
                <Grid item md={12}>
                  <TextValidator
                    label="Ghi chú"
                    name="note"
                    value={this.state.arrears.note}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    // validators={['required', 'trim']}
                    // errorMessages={[`Không được để trống`, `Không được để trống`]}
                  />
                </Grid>
              </Grid>
              <div style={{ display: 'none' }}>
                <button ref={this.submitBtn1} type="submit" />
              </div>
            </ValidatorForm>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.submitBtn1.current.click();
              }}
              color="primary"
              variant="outlined"
              autoFocus
            >
              {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
            </Button>
            <Button onClick={this.handleClose} color="secondary" variant="outlined">
              {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'hủy' })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleAddTemplate = temp => {
    const choose = {
      contractWorkId: temp._id,
      arrearsName: temp.arrearsName,
    };
    const { arrears } = this.state;
    arrears.contractWork = choose;
    this.setState({ arrears });
  };
}

// const Option = props => (
//   <components.Option {...props}>
//     <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//       {/* <Avatar src={props.data.avatar} /> */}
//       <div style={{ marginTop: 10 }}>{props.data.arrearsName}</div>
//     </div>
//   </components.Option>
// );

// const SingleValue = ({ children, ...props }) => (
//   <components.SingleValue {...props}>
//     <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//       {/* <Avatar style={{ height: 30, width: 30 }} src={props.data.avatar} /> */}
//       <div style={{ marginTop: 5 }}>{props.data.arrearsName}</div>
//     </div>
//   </components.SingleValue>
// );

UpdateArrearsDialog.propTypes = {};

export default UpdateArrearsDialog;
