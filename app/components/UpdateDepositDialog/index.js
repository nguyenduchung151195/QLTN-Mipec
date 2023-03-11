/**
 *
 * UpdateDepositDialog
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
class UpdateDepositDialog extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn1 = React.createRef();
    // if (this.props.taskChoose !== null) {
    //   this.loadOptions();
    // }
  }

  state = {
    deposit: {
      depositName: '',
      depositStatus: 0,
      depositDate: date,
      depositAmount: 0,
      //  contractWork: 0,
      workCompleted: {},
      depositUnit: 'VNĐ',
      //  VAT: false,
      // jobs: null,
      note: '',
      // jobChoose: {},
    },
    // jobs: null,
  };

  componentWillReceiveProps(props) {
    // if (props !== this.props) {
    if (props.open !== this.props.open && props.deposit !== null) {
      this.state.deposit = props.deposit;
      this.state.deposit.depositDate = moment(props.deposit.depositDate).format('YYYY-MM-DD');
      this.state.deposit.contractWork = props.deposit.contractWork ? props.deposit.contractWork : null;
      const { depositAmount } = props.deposit;
      if (props.deposit.depositUnit === '%' && (Number(depositAmount) / Number(props.debtMoney)) * 100 > 0.1) {
        this.state.deposit.depositAmount = (Number(depositAmount) / Number(props.debtMoney)) * 100;
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
    if (props.open !== this.props.open && !isNaN(props.debtMoney) && props.deposit.depositAmount <= 0) {
      const { deposit } = this.state;
      deposit.depositAmount = Number(props.debtMoney);
      this.setState({ deposit: deposit });
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
    const { deposit } = this.state;
    deposit[e.target.name] = e.target.value;
    this.setState({ deposit });
  };
  handleChangePrice = e => {
    const { deposit } = this.state;
    if (e.target.name !== 'depositAmount') {
      deposit[e.target.name] = e.target.value;
      this.setState({ deposit });
    } else {
      if (Number(e.target.value) < 0) {
        deposit.depositAmount = 0;
        this.setState({ deposit });
      }
      if (Number(e.target.value) > Number(this.props.debtMoney)) {
        this.props.onChangeSnackbar(true, 'số tiền không được vượt quá số tiền của báo giá', 'error');
        return;
      } else {
        deposit.depositAmount = e.target.value;
        this.setState({ deposit });
      }
    }
  };

  handleSave = () => {
    const { deposit } = this.state;
    if (deposit.depositUnit === '%') {
      const { depositAmount } = deposit;
      deposit.depositAmount = (Number(this.props.debtMoney) * Number(depositAmount)) / 100;
    }
    // if (deposit.depositAmount >= this.props.debtMoney) {
    //   alert('số tiền không được vượt quá số tiền của báo giá');
    //   return;
    // }
    this.props.handleAddtoList(deposit);
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
            CẬP NHẬT KHOẢN CỌC
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            <ValidatorForm style={{ width: '100%' }} onSubmit={this.handleSave}>
              <Grid item container md={12}>
                <Grid item md={12}>
                  <TextValidator
                    label="Tên khoản cọc"
                    name="depositName"
                    value={this.state.deposit.depositName}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    validators={['required', 'trim']}
                    errorMessages={[`Không được để trống`, `Không được để trống`]}
                  />
                </Grid>
                {/* &nbsp;&nbsp;&nbsp;
               <TextField
                 label="Đến ngày"
                 depositName="searchEndDay"
                 type="date"
                 value={this.state.searchEndDay}
                 onChange={this.handleChangeInput}
                 InputLabelProps={{
                   shrink: true,
                 }}
                 variant="outlined"
                 style={{ width: '100%' }}
               /> */}
                <Grid item md={12}>
                  <TextField
                    label={intl.formatMessage(messages.ycttTrangThai || { id: 'ycttTrangThai', defaultMessage: 'ycttTrangThai' })}
                    name="depositStatus"
                    select
                    value={this.state.deposit.depositStatus}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value={0}>Chưa thanh toán</MenuItem>
                    <MenuItem value={1}>Hoàn cọc</MenuItem>
                    <MenuItem value={2}>Đã thanh toán</MenuItem>
                  </TextField>
                </Grid>
                <Grid item md={12}>
                  <TextValidator
                    label="Ngày đặt cọc"
                    name="depositDate"
                    type="date"
                    InputProps={{ inputProps: { min: this.props.minDay } }}
                    value={this.state.deposit.depositDate}
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
                {/* <Grid item md={12}> */}
                {/* <Typography
                     style={{
                       color: 'grey',
                     }}
                   >
                     Chọn quy trình mẫu
                   </Typography>
 
                   <AsyncSelect
                     classdepositName={classes.reactSelect1}
                     placeholder="Tìm kiếm ..."
                     loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, API_TASK_CONTRACT_PROJECT)}
                     loadingMessage={() => 'Đang tải ...'}
                     components={{ Option, SingleValue }}
                     onChange={this.handleAddTemplate}
                     value={this.state.deposit.template}
                     theme={theme => ({
                       ...theme,
                       spacing: {
                         ...theme.spacing,
                         controlHeight: '55px',
                       },
                     })}
                   /> */}

                {/* <TextField
                     // id="standard-select-depositUnit"
                     select
                     // disabled={(this.props.id ? this.props.id : match.params.id) !== '1' && (this.props.id ? this.props.id : match.params.id) !== '2'}
                     label="Chọn công việc"
                     // depositName="belong"
                     variant="outlined"
                     depositName="contractWork"
                     value={this.state.deposit.contractWork}
                     style={{ width: '100%' }}
                     onChange={this.handleChangeInputStage}
 
                     // helperText="Please select your depositUnit"
                   >
                     {this.state.jobs && Array.isArray(this.state.jobs.data) 
                       ? this.state.jobs.data.map(item => (
                           <MenuItem
                             value={item._id}
                             key={item._id}
                             style={item.level !== 0 ? { paddingLeft: `${parseInt(item.level, 10) * 1.5 * 2 * 10}px` } : {}}
                           >
                             {item.depositName}
                           </MenuItem>
                         )) : ''}
                   </TextField> */}
                {/* </Grid> */}
                <Grid container item md={12} spacing={8}>
                  <Grid item md={8}>
                    <TextValidator
                      label={intl.formatMessage(messages.ycttSoTien || { id: 'ycttSoTien', defaultMessage: 'ycttSoTien' })}
                      name="depositAmount"
                      value={this.state.deposit.depositAmount}
                      onChange={this.handleChangePrice}
                      variant="outlined"
                      type="number"
                      // style={{ width: '80%', display: 'flex !important' }}
                      InputProps={{ inputProps: { min: 0 } }}
                      margin="normal"
                      validators={['minNumber:0', this.state.deposit.depositUnit === '%' ? 'maxNumber: 100' : 'matchRegexp:[0-9]']}
                      errorMessages={[
                        `${intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' })}`,
                        this.state.deposit.depositUnit === '%'
                          ? 'Không vượt quá 100%'
                          : `${intl.formatMessage(messages.canNhapSo || { id: 'canNhapSo', defaultMessage: 'canNhapSo' })}`,
                      ]}
                      fullWidth
                    />
                  </Grid>
                  <Grid item md={4}>
                    <TextField
                      label="Đơn vị"
                      name="depositUnit"
                      select
                      value={this.state.deposit.depositUnit}
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
                <Grid item md={12}>
                  <TextValidator
                    label="Ghi chú"
                    name="note"
                    value={this.state.deposit.note}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    // validators={['required', 'trim']}
                    // errorMessages={[`Không được để trống`, `Không được để trống`]}
                  />
                </Grid>
                {/* <TextField
                   label="VAT"
                   depositName="VAT"
                   select
                   value={this.state.deposit.VAT}
                   onChange={this.handleChangeInputStage}
                   InputLabelProps={{
                     shrink: true,
                   }}
                   variant="outlined"
                   margin="normal"
                   style={{ width: '100%', display: 'flex !important' }}
                 >
                   <MenuItem value={false}>{intl.formatMessage(messages.ycttKhong || { id: 'ycttKhong', defaultMessage: 'ycttKhong' })}</MenuItem>
                   <MenuItem value>{intl.formatMessage(messages.ycttCo || { id: 'ycttCo', defaultMessage: 'ycttCo' })}</MenuItem>
                 </TextField> */}
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
      depositName: temp.depositName,
    };
    const { deposit } = this.state;
    deposit.contractWork = choose;
    this.setState({ deposit });
  };
}

// const Option = props => (
//   <components.Option {...props}>
//     <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//       {/* <Avatar src={props.data.avatar} /> */}
//       <div style={{ marginTop: 10 }}>{props.data.depositName}</div>
//     </div>
//   </components.Option>
// );

// const SingleValue = ({ children, ...props }) => (
//   <components.SingleValue {...props}>
//     <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//       {/* <Avatar style={{ height: 30, width: 30 }} src={props.data.avatar} /> */}
//       <div style={{ marginTop: 5 }}>{props.data.depositName}</div>
//     </div>
//   </components.SingleValue>
// );

UpdateDepositDialog.propTypes = {};

export default UpdateDepositDialog;
