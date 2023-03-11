/* eslint-disable react/no-access-state-in-setstate */
/**
 *
 * EditPricePolicy
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  TextField,
  withStyles,
  MenuItem,
  FormHelperText,
  FormControl,
  Grid,
  Button,
} from '@material-ui/core'; // Typography, Fab, Button
import NumberFormat from 'react-number-format';
import { Delete } from '@material-ui/icons';

import styles from './styles';
import { getLabelName } from '../../utils/common';
import CustomInputBase from '../Input/CustomInputBase';
// import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { injectIntl } from 'react-intl';
import { viewConfigHandleOnChange, viewConfigCheckForm } from 'utils/common';
import dot from 'dot-object';
import { compose } from 'redux';
function NumberFormatCustom(props) {
  const { inputRef, onChange, name, ...other } = props;
  return (
    <NumberFormat
      {...other}
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
/* eslint-disable react/prefer-stateless-function */
class EditPricePolicy extends React.Component {
  state = {
    costPrice: 0,
    profitRate: 0,
    sellPrice: 0,
    allPrice: 0,
    agencyList: [],
    taxOption: [],
    currentTax: 0,
    product: null,
    errorRate: false,
    isSubmit: false,
    localMessages: {},
    typeofPrice: 0,
    priceLadderList: [
      {
        minkWh: 0,
        maxkWh: 0,
        pricekWh: 0,
      },
    ],
  };

  timeChange = null;

  timerValue = null;

  handleChangeMoney = (e, fieldName) => {
    this.setState({ [e.target.name]: e.target.value });
    const messages = viewConfigHandleOnChange(
      'Stock',
      this.state.localMessages,
      fieldName,
      e.target.value,
    );
    this.setState({
      localMessages: messages,
    });
    if (e.target.name === 'costPrice') {
      let { profitRate } = this.state;
      let newProfitRate = 0;
      if (profitRate === '') newProfitRate = 0;
      else newProfitRate = profitRate;
      let sourcePrice = e.target.value.split(',').join('');
      const x = Math.floor((sourcePrice * (100 + Number(newProfitRate) || 0)) / 100);
      this.setState({ costPrice: x });
    }
  };

  handleChange = (e, fieldName) => {
    // this.setState({ [e.target.name]: e.target.value });
    //-->test
    if (e.target.name === 'typeofPrice') {
      const value = e.target.value;
      if (Number(value) === 0) {
        this.setState({ allPrice: 0, priceLadderList: [] });
      } else if (Number(value) === 1) {
        this.setState({ sellPrice: 0, allPrice: 0 });
      } else {
        this.setState({ sellPrice: 0, priceLadderList: [] });
      }
    }
    //<--test
    const messages = viewConfigHandleOnChange(
      'Stock',
      this.state.localMessages,
      fieldName,
      e.target.value,
    );
    this.setState({
      localMessages: messages,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'profitRate') {
      if (e.target.value > 100) {
        // this.setState({ errorRate: true });
        const newMessagesFieldName = {};
        newMessagesFieldName[fieldName] = 'Lỗi không được nhập lớn hơn 100';
        this.setState(prevState => ({
          ...prevState,
          localMessages: newMessagesFieldName,
        }));
      } else {
        // this.setState({ errorRate: false });
      }
      let { costPrice } = this.state;
      let sourcePrice = 0;
      if (costPrice === '') sourcePrice = 0;
      else sourcePrice = costPrice;
      sourcePrice = sourcePrice.split(',').join('');
      const x = Math.floor((sourcePrice * (100 + Number(e.target.value) || 0)) / 100);
      this.setState({ sellPrice: x });
    }
  };
  getMessages() {
    const { costPrice, profitRate, agencyList, taxOption, sellPrice } = this.state;
    const body = {
      pricePolicy: {
        sourcePrice: costPrice,
        profitRate,
        costPrice: sellPrice,
        agentPrice: agencyList,
      },
      taxs: taxOption,
    };

    const data = dot.dot(body);
    const messages = viewConfigCheckForm(this.props.moduleCode, data);
    this.state.localMessages = messages;
  }

  handleChangePrice = (e, index) => {
    const listData = this.state.priceLadderList;
    const name = e.target.name;
    listData[index][name] = e.target.value;
    console.log(e.target.value);
    this.setState({
      priceLadderList: listData,
    });
  };

  handleAddPrice = () => {
    const add = {
      minkWh: 0,
      maxkWh: 0,
      pricekWh: 0,
    };
    const newCls = this.state.priceLadderList.concat(add);
    this.setState({ priceLadderList: newCls });
  };

  handleDeletePrice = value => {
    const listData = this.state.priceLadderList;
    if (value.id && value.id !== '') {
      const removeIndex = listData.map(item => item.equipmentId).indexOf(value.equipmentId);
      listData.splice(removeIndex, 1);
      this.setState({ priceLadderList: listData });
    } else {
      const newCls = listData.pop();
      this.setState({
        priceLadderList: listData,
      });
    }
  };

  componentDidMount() {
    this.props.onRef(this);
    this.state.isSubmit = false;
  }

  componentWillReceiveProps(props) {
    const { product } = props;
    const { pricePolicy } = product;
    // const costPrice = pricePolicy ? pricePolicy.costPrice : { priceLadderList: [] };
    // const typePrice = pricePolicy ? pricePolicy.priceLadderList : [];
    if (pricePolicy && Number(pricePolicy.costPrice) > 0) {
      this.setState({ typeofPrice: 0 });
    }
    if (pricePolicy && Number(pricePolicy.allPrice) > 0) {
      this.setState({ typeofPrice: 2 });
    }
    if (
      pricePolicy &&
      Array.isArray(pricePolicy.priceLadderList) &&
      pricePolicy.priceLadderList.length > 0
    ) {
      this.setState({ typeofPrice: 1 });
    }
    if (
      Object.keys(product).length > 0 &&
      !this.state.isSubmit &&
      props.product !== this.props.product
    ) {
      this.state.product = product;
      const { pricePolicy } = product;
      this.state.costPrice = pricePolicy.sourcePrice;
      this.state.profitRate = pricePolicy.profitRate;
      this.state.allPrice = pricePolicy.allPrice;
      this.state.sellPrice = pricePolicy.costPrice;
      // this.state.typeofPrice = pricePolicy.typeofPrice;
      this.state.priceLadderList = pricePolicy.priceLadderList;
      const list = [];
      pricePolicy.agentPrice.forEach(item => {
        list.push({
          id: item._id,
          name: item.name,
          option: item.changePrice,
          value: item.costPrice,
        });
      });
      this.state.agencyList = list;
      this.state.isSubmit = true;
    }
  }

  componentDidUpdate(props) {
    const { agencyList, product } = props;
    if (this.state.agencyList.length === 0 && agencyList.length > 0) {
      agencyList.forEach(item => {
        this.state.agencyList.push({
          id: item.index,
          name: item.title,
          value: '',
          option: 0,
        });
      });
    }
    if (
      Object.keys(product).length > 0 &&
      !this.state.isSubmit &&
      props.product !== this.props.product
    ) {
      this.state.product = product;
      const { pricePolicy } = product;
      this.state.costPrice = pricePolicy.sourcePrice;
      this.state.profitRate = pricePolicy.profitRate;
      this.state.sellPrice = pricePolicy.costPrice;
      this.state.allPrice = Number(pricePolicy.allPrice);

      const list = [];
      pricePolicy.agentPrice.forEach(item => {
        list.push({
          id: item._id,
          name: item.name,
          option: item.changePrice,
          value: item.costPrice,
        });
      });
      this.state.agencyList = list;
      this.state.isSubmit = true;
    }
    this.getMessages();
  }

  render() {
    const { classes, name2Title } = this.props;
    const { sellPrice, allPrice, costPrice, profitRate, typeofPrice, priceLadderList } = this.state;
    const { checkRequired, checkShowForm, intl } = this.props;
    const { localMessages } = this.state;
    // console.log(this.state.priceLadderList)
    return (
      <div>
        <CustomInputBase
          value={typeofPrice}
          onChange={e => this.handleChange(e, 'typeofPrice')}
          name="typeofPrice"
          select
          // label={name2Title["shift.title"] || "CA LÀM VIỆC"}
          label="Loại giá"
          checkedShowForm={checkShowForm['typeofPrice']}
          required={checkRequired['typeofPrice']}
          error={localMessages && localMessages['typeofPrice']}
          helperText={localMessages && localMessages['typeofPrice']}
        >
          <MenuItem value={0}>Một giá</MenuItem>
          <MenuItem value={1}>Theo bậc thang</MenuItem>
          <MenuItem value={2}>Trọn gói</MenuItem>
          {/* <MenuItem value={2}>Theo lượt</MenuItem> */}
        </CustomInputBase>
        {typeofPrice === 1 && (
          <div>
            {Array.isArray(priceLadderList) &&
              priceLadderList.length > 0 &&
              priceLadderList.map((item, index) => (
                <Grid container md={12} spacing={16}>
                  <Grid item xs={4}>
                    <CustomInputBase
                      value={item.minkWh}
                      onChange={e => this.handleChangePrice(e, index)}
                      name="minkWh"
                      label={'Từ số'}
                      // checkedShowForm={localCheckShowForm && localCheckShowForm.timekeepingCode}
                      type="Number"
                      // required={localCheckRequired && localCheckRequired.timekeepingCode}
                      // error={localMessages && localMessages.timekeepingCode}
                      // helperText={localMessages && localMessages.timekeepingCode}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomInputBase
                      value={item.maxkWh}
                      onChange={e => this.handleChangePrice(e, index)}
                      name="maxkWh"
                      label={'Đến số'}
                      type="Number"
                      // checkedShowForm={localCheckShowForm && localCheckShowForm.timekeepingCode}
                      // required={localCheckRequired && localCheckRequired.timekeepingCode}
                      // error={localMessages && localMessages.timekeepingCode}
                      // helperText={localMessages && localMessages.timekeepingCode}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    {/* <NumberFormatCustom
                      value={item.pricekWh}
                      onChange={e => this.handleChangePrice(e, index)}
                      name="pricekWh"
                      label={'Giá tiền trên số'}
                      type="Number"
                      // checkedShowForm={localCheckShowForm && localCheckShowForm["shift.title"]}
                      // required={localCheckRequired && localCheckRequired["shift.title"]}
                      // error={localMessages && localMessages["shift.title"]}
                      // helperText={localMessages && localMessages["shift.title"]}
                    /> */}
                    <NumberFormat
                      allowNegative={false}
                      thousandSeparator="."
                      decimalSeparator={false}
                      customInput={CustomInputBase}
                      allowLeadingZeros={false}
                      name="pricekWh"
                      label={'Giá tiền trên số'}
                      value={item.pricekWh}
                      onChange={e => this.handleChangePrice(e, index)}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Delete
                      onClick={() => this.handleDeletePrice(item)}
                      style={{ cursor: 'pointer', marginTop: 20 }}
                    />
                  </Grid>
                </Grid>
              ))}
            <Button onClick={() => this.handleAddPrice()} variant="outlined" color="primary">
              Thêm trường
            </Button>
          </div>
        )}
        {typeofPrice === 0 && (
          <div>
            <TextField
              className={classes.textField}
              label="Giá bán"
              name="sellPrice"
              value={sellPrice}
              // onChange={this.handleChange('numberformat')}
              onChange={e => this.handleChangeMoney(e, 'pricePolicy.costPrice')}
              id="formatted-numberformat-input"
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
              variant="outlined"
              fullWidth
              onKeyDown={e => e.keyCode === 189 && e.preventDefault()}
              onPress={e => e.keyCode === 189 && e.preventDefault()}
              error={localMessages && localMessages['pricePolicy.costPrice']}
              helperText={localMessages && localMessages['pricePolicy.costPrice']}
              required={checkRequired['pricePolicy.costPrice']}
            />
            <div />
          </div>
        )}
        {typeofPrice === 2 && (
          <div>
            <TextField
              label="GIÁ TRỌN GÓI"
              className={classes.textField}
              value={allPrice}
              name="allPrice"
              onChange={e => this.handleChangeMoney(e, 'pricePolicy.allPrice')}
              id="formatted-numberformat-input"
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
              variant="outlined"
              fullWidth
              onKeyDown={e => e.keyCode === 189 && e.preventDefault()}
              onPress={e => e.keyCode === 189 && e.preventDefault()}
              error={localMessages && localMessages['pricePolicy.allPrice']}
              helperText={localMessages && localMessages['pricePolicy.allPrice']}
              required={checkRequired['pricePolicy.allPrice']}
            />
            <div />
          </div>
        )}
      </div>
    );
  }

  handleDeleteTax = indexTax => {
    const { taxOption } = this.state;
    taxOption.splice(indexTax, 1);
    this.setState({ taxOption });
  };

  handleChangeOptionTaxName = (indexTax, e) => {
    const { taxOption } = this.state;
    taxOption[indexTax].option.name = e.target.value;
    this.setState({ taxOption });
  };

  handleChangeOptionTaxValue = (indexTax, e) => {
    const { taxOption } = this.state;
    taxOption[indexTax].option.value = e.target.value;
    this.setState({ taxOption });
  };

  handleAddField = () => {
    const { taxOption } = this.state;
    taxOption.push({ title: `Thuế ${this.state.currentTax + 1}`, option: { name: '', value: '' } });
    this.setState({ taxOption, currentTax: this.state.currentTax + 1 });
  };

  handleChangeOption = (index, e) => {
    const { agencyList } = this.state;
    agencyList[index].option = e.target.value;
    this.setState({ agencyList });
  };

  handleChangeValueAgency = (index, e) => {
    const { agencyList } = this.state;
    agencyList[index].value = e.target.value;
    this.setState({ agencyList });
  };

  getData = () => {
    // if (!this.state.errorRate) {
    //   this.setState({ isSubmit: true });
    //   this.props.pricePolicy.data = this.state;
    // }
    this.setState({ isSubmit: true });
    //debugger

    this.props.pricePolicy.data = this.state;
  };
}

EditPricePolicy.propTypes = {
  classes: PropTypes.object,
};

export default compose(
  withStyles(styles),
  injectIntl,
)(EditPricePolicy);
