/**
 *
 * UpdateCarRentaltDialog
 *
 */

import React from 'react';
import {
  Grid,
  Dialog,
  DialogTitle,
  FormHelperText,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  MenuItem,
} from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
// import AsyncSelect from 'react-select/async';
// import { components } from 'react-select';
import moment from 'moment';
import { API_STOCK, API_TASK_CONTRACT_PROJECT } from '../../config/urlConfig';
import CustomInputBase from '../Input/CustomInputBase';
import { AsyncAutocomplete } from 'components/LifetekUi';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import NumberFormat from 'react-number-format';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';
const date = moment().format('YYYY-MM-DD');
/* eslint-disable react/prefer-stateless-function */
class UpdateCarRentaltDialog extends React.Component {
  constructor(props) {
    super(props);
    this.submitCar = React.createRef();
    // if (this.props.taskChoose !== null) {
    //   this.loadOptions();
    // }
    this.state = {
      carRental: {
        product: [],
        namePepple: '',
        telephone: '',
        email: '',
        relative: '',
        expediency: '',
        carPlate: '',
        carColor: '',
        carCompany: '',
        tax: '',
        carName: '',
        searchStartDay: '',
        searchEndDay: '',
        note: '',
        costPrice: 0,
      },
      costPrice: '',
      errorStartDateEndDate: false,
      errorTextStartDate: '',
      errorTextEndDate: '',
    };
  }

  componentWillReceiveProps(props) {
    if (props.open !== this.props.open && props.carRental !== null) {
      this.state.carRental = props.carRental;
      const id =
        props.carRental.product && props.carRental.product._id ? props.carRental.product._id : null;
      if (id) {
        fetch(`${API_STOCK}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            this.setState({ costPrice: data.pricePolicy.costPrice });
          });
      }

      // const carRental = props.carRental;

      // this.setState({carRental})

      this.state.carRental.searchStartDay = moment(props.carRental.searchStartDay).format(
        'YYYY-MM-DD',
      );
      this.state.carRental.searchEndDay = moment(props.carRental.searchEndDay).format('YYYY-MM-DD');

      // this.state.carRental.contractWork = props.carRental.contractWork ? props.carRental.contractWork : null;
      // const { amount } = props.carRental;

      // if (props.carRental.currency === '%' && (Number(amount) / Number(props.totalMoney)) * 100 > 0.1) {
      //   this.state.carRental.amount = (Number(amount) / Number(props.totalMoney)) * 100;
      // }
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.props.carRental !== prevProps.carRental) {
  //     this.state.carRental = this.props.carRental;
  //   }
  // }

  //   }
  //   // console.log(props);
  // }

  // handleChangeInputStage = e => {
  //   const { carRental } = this.state;
  //   carRental[e.target.name] = e.target.value;
  //   this.setState({ carRental });
  // };

  handleChangeInputStage = e => {
    const { carRental } = this.state;
    console.log(carRental);
    this.setState({
      carRental: {
        ...carRental,
        [e.target.name]: e.target.value,
      },
    });

    // console.log('filter',filter)
    const newDate = { ...carRental, [e.target.name]: e.target.value };
    // TT
    if (!newDate.searchStartDay && newDate.searchEndDay) {
      this.setState(state => ({
        ...state,
        errorStartDateEndDate: true,
        errorTextStartDate: 'nhập thiếu: "Từ ngày"',
        errorTextEndDate: '',
      }));
    } else if (newDate.searchStartDay && !newDate.searchEndDay) {
      this.setState(state => ({
        ...state,
        errorStartDateEndDate: true,
        errorTextStartDate: '',
        errorTextEndDate: 'nhập thiếu: "Đến ngày"',
      }));
    } else if (
      newDate.searchStartDay &&
      newDate.searchEndDay &&
      new Date(newDate.searchEndDay) < new Date(newDate.searchStartDay)
    ) {
      this.setState(state => ({
        ...state,
        carRental: { ...newDate },
        errorStartDateEndDate: true,
        errorTextStartDate: '"Từ ngày" phải nhỏ hơn "Đến ngày"',
        errorTextEndDate: '"Đến ngày" phải lớn hơn "Từ ngày"',
      }));
    } else {
      this.setState(state => ({
        ...state,
        errorStartDateEndDate: false,
        errorTextStartDate: '',
        errorTextEndDate: '',
      }));
    }
    this.setState(state => ({ ...state, carRental: { ...newDate } }));
    // if(carRental.)
  };

  // handleChangePrice = e => {
  //   const { carRental } = this.state;
  //   carRental[e.target.name] = e.target.value;
  //   if (carRental.amount >= this.props.totalMoney) {
  //     // alert('số tiền không được vượt quá số tiền của báo giá');
  //   }
  //   this.setState({ carRental });
  // };

  handleSave = () => {
    const { carRental } = this.state;
    // if (carRental.amount >= this.props.totalMoney) {
    //   alert('số tiền không được vượt quá số tiền của báo giá');
    //   return;
    // }
    if (
      (carRental.product && this.state.carRental.product.length === 0) ||
      !this.state.carRental.product
    )
      return;
    if (!carRental.namePepple) return;
    if (!carRental.telephone) return;
    if (!carRental.searchStartDay) return;
    if (!carRental.searchStartDay) return;
    this.props.handleAddtoList(carRental);
  };

  // handleChangeJobs = val => {
  //   this.setState({ contractWork: val.target.value });
  // };
  selectProduct = value => {
    this.setState({ product: { _id: value._id, name: value.name } });
  };

  render() {
    // const { intl, messages } = this.props;
    const { errorStartDateEndDate, errorTextStartDate, errorTextEndDate } = this.state;
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
            Hợp đồng xe
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            <ValidatorForm style={{ width: '100%' }} onSubmit={this.handleSave}>
              <Grid item container md={12}>
                <Grid item md={12}>
                  <AsyncAutocomplete
                    name="product"
                    label="Tên sản phẩm"
                    //  checkedShowForm={checkShowForm.product}
                    required
                    // style={{borderColor:"#f44336" }}
                    defaultOptions
                    onChange={value => {
                      const curr = this.state.carRental;
                      curr.product = value && {
                        _id: value._id,
                        name: value.name,
                        tax: value.tax,
                        costPrice:
                          value.pricePolicy && value.pricePolicy.costPrice
                            ? value.pricePolicy.costPrice
                            : 0,
                        unit: value.unit,
                        tags: value.tags,
                      };
                      this.setState({ carRental: curr });
                    }}
                    filter={{
                      tags: {
                        $in: ['Ô tô 1', 'Ô tô 2', 'Xe máy', 'Xe đạp', 'Xe đạp điện'],
                      },
                    }}
                    url={API_STOCK}
                    value={this.state.carRental.product}
                    error={
                      (this.state.carRental.product && this.state.carRental.product.length === 0) ||
                      !this.state.carRental.product
                    }
                    helperText={
                      (this.state.carRental.product && this.state.carRental.product.length === 0) ||
                      !this.state.carRental.product
                        ? 'Trường này không được để trống'
                        : ''
                    }
                  />
                  <TextValidator
                    label="Giá sản phẩm"
                    name="costPrice"
                    // value={this.state.carRental.product && this.state.carRental.product.costPrice ? this.state.carRental.product.costPrice : this.state.costPrice}
                    // onChange={this.handleChangeInputStage}
                    value={
                      (this.state.carRental.product &&
                        !isNaN(this.state.carRental.product.costPrice || this.state.costPrice) &&
                        Number(
                          this.state.carRental.product.costPrice || this.state.costPrice,
                        ).toLocaleString('es-AR', { maximumFractionDigits: 0 })) ||
                      0
                    }
                    disabled
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    // type="number"
                    type="text"
                  />
                  <TextValidator
                    label="Họ và tên"
                    name="namePepple"
                    value={this.state.carRental.namePepple}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    required
                    error={!this.state.carRental.namePepple}
                    helperText={
                      !this.state.carRental.namePepple && 'Trường này không được để trống'
                    }
                    fullWidth
                    margin="normal"
                  />
                  <NumberFormat
                    label="Số điện thoại"
                    name="telephone"
                    value={this.state.carRental.telephone}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    required
                    error={!this.state.carRental.telephone}
                    helperText={!this.state.carRental.telephone && 'Trường này không được để trống'}
                    fullWidth
                    margin="normal"
                    customInput={TextValidator}
                    allowNegative={false}
                    decimalSeparator={null}
                  />
                  <TextValidator
                    label="Email"
                    name="email"
                    value={this.state.carRental.email}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  <TextValidator
                    label="Quan hệ với chủ "
                    name="relative"
                    value={this.state.carRental.relative}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  <TextValidator
                    label="Loại phương tiện (Xe máy/oto)"
                    name="expediency"
                    value={this.state.carRental.expediency}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  <TextValidator
                    label="Biển kiểm soát"
                    name="carPlate"
                    value={this.state.carRental.carPlate}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  <TextValidator
                    label="Màu xe"
                    name="carColor"
                    value={this.state.carRental.carColor}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  <TextValidator
                    label="Hãng xe"
                    name="carCompany"
                    value={this.state.carRental.carCompany}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  <TextValidator
                    label="Tên xe"
                    name="carName"
                    value={this.state.carRental.carName}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  <TextValidator
                    // label={intl.formatMessage(messages.hdTuNgay || { id: 'hdTuNgay', defaultMessage: 'hdTuNgay' })}
                    label="Từ ngày"
                    name="searchStartDay"
                    type="date"
                    InputProps={{ inputProps: { min: this.props.minDay } }}
                    value={this.state.carRental.searchStartDay}
                    onChange={this.handleChangeInputStage}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    required
                    error={!this.state.carRental.searchStartDay}
                    helperText={
                      !this.state.carRental.searchStartDay && 'Trường này không được để trống'
                    }
                    style={{ width: '100%', display: 'flex !important' }}
                  />
                  {errorStartDateEndDate ? (
                    <p style={{ color: 'red', margin: '0px' }}>{errorTextStartDate}</p>
                  ) : null}
                  <TextValidator
                    //  label={intl.formatMessage(messages.hdDenNgay || { id: 'hdDenNgay', defaultMessage: 'hdDenNgay' })}
                    label="Đến ngày"
                    name="searchEndDay"
                    type="date"
                    InputProps={{ inputProps: { min: this.props.minDay } }}
                    value={this.state.carRental.searchEndDay}
                    onChange={this.handleChangeInputStage}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    required
                    error={!this.state.carRental.searchEndDay}
                    helperText={
                      !this.state.carRental.searchEndDay && 'Trường này không được để trống'
                    }
                    style={{ width: '100%', display: 'flex !important' }}
                  />
                  {errorStartDateEndDate ? (
                    <p style={{ color: 'red', margin: '0px' }}>{errorTextEndDate}</p>
                  ) : null}
                  <TextValidator
                    label="Thuế GTGT"
                    name="tax"
                    value={
                      this.state.carRental && this.state.carRental.tax
                        ? this.state.carRental.tax
                        : ''
                    }
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  <TextValidator
                    label="Ghi chú"
                    name="note"
                    value={this.state.carRental.note}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>

              <div style={{ display: 'none' }}>
                <button ref={this.submitCar} type="submit" />
              </div>
            </ValidatorForm>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.submitCar.current.click();
              }}
              color="primary"
              variant="outlined"
              autoFocus
            >
              {/* {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })} */}
              Lưu
            </Button>
            <Button onClick={this.handleClose} color="secondary" variant="outlined">
              {/* {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'hủy' })} */}
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleClose = () => {
    this.props.handleClose();
  };
}

// const Option = props => (
//   <components.Option {...props}>
//     <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//       {/* <Avatar src={props.data.avatar} /> */}
//       <div style={{ marginTop: 10 }}>{props.data.name}</div>
//     </div>
//   </components.Option>
// );

// const SingleValue = ({ children, ...props }) => (
//   <components.SingleValue {...props}>
//     <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//       {/* <Avatar style={{ height: 30, width: 30 }} src={props.data.avatar} /> */}
//       <div style={{ marginTop: 5 }}>{props.data.name}</div>
//     </div>
//   </components.SingleValue>
// );

UpdateCarRentaltDialog.propTypes = {};

export default UpdateCarRentaltDialog;
