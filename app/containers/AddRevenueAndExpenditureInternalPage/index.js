/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * AddRevenueAndExpenditurePage
 *
 */

import React from 'react';
import PropTypes, { array } from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  withStyles,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Table,
  AppBar,
  Toolbar,
  IconButton,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { Cancel, Delete, Close } from '@material-ui/icons'; // Done, Add
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import NumberFormat from 'react-number-format';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import moment from 'moment';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { FileUpload } from '../../components/LifetekUi';
import makeSelectAddRevenueAndExpenditurePage from './selectors';
import {
  API_USERS,
  API_SALE,
  API_BILLS,
  GET_CONTRACT,
  API_TASK_PROJECT,
  API_ORDER_PO,
  API_BANK_ACCOUNT,
  API_FEE,
  API_CUSTOMERS,
} from '../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import { changeSnackbar } from '../Dashboard/actions';
import { getCatalogAct, createRecordAct, resetNoti, getRecordAct, updateRecordAct, mergeData } from './actions';
import styles from './styles';
import { convertDatetimeToDate, getLabelName, serialize } from '../../utils/common';
import LoadingIndicator from '../../components/LoadingIndicator';
import TextFieldCode from '../../components/TextFieldCode';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { viewConfigCheckRequired, viewConfigCheckForm, viewConfigHandleOnChange, viewConfigName2Title } from 'utils/common';
import dot from 'dot-object';
import messages from './messages';
import { AsyncAutocomplete } from 'components/LifetekUi';
import { injectIntl } from 'react-intl';
import KanbanStepper from '../../components/KanbanStepper';
import CustomAppBar from 'components/CustomAppBar';
import CustomInputField from '../../components/Input/CustomInputField';
import CustomDatePicker from '../../components/CustomDatePicker';

// import messages from './messages';

const tempDate = new Date();
const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1}-${tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()
  }`;

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
      thousandSeparator={'.'}
      decimalSeparator={','}
      decimalScale={0}
    />
  );
}

/* eslint-disable react/prefer-stateless-function */
export class AddRevenueAndExpenditurePage extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
    const moduleCode = 'RevenueExpenditure';
    const checkRequired = viewConfigCheckRequired(moduleCode, 'required');
    const checkShowForm = viewConfigCheckRequired(moduleCode, 'showForm');
    this.state = {
      typeOfRecord: 0,
      typeOfRnE: 0,
      typeOfChoose: 2,
      choose: null,
      date: moment(),
      money: 0,
      tax: 0,
      reason: '',
      performedBy: {},
      approvedBy: {},
      paymentMethod: 0,
      note: '',
      paymentMethodList: [],
      fieldAdded: [],
      isEditPage: false,
      errorPerform: false,
      code: undefined,
      total: 0,
      totalAmount: 0,
      inlineFilter: {},
      customer: '',
      customerInfo: {},
      // errorApproved: false,
      statusList: [
        {
          code: 0,
          name: 'Yêu cầu phê duyệt',
        },
        {
          code: 1,
          name: 'Đã phê duyệt',
        },
        {
          code: 2,
          name: 'Không phê duyệt',
        },
        {
          code: 3,
          name: 'Không cần phê duyệt',
        },

        {
          code: 4,
          name: 'Đã hoàn thành',
        },
      ],
      state: 0,
      listChild: [],
      checkRequired,
      checkShowForm,
      moduleCode,
      localMessages: {},
      name2Title: {},
      sourceData: [],
      valueOfPrevTab: 0,
      listKanbanStatus: [],
      prevFee: [],
      fee: {
        paidElectricityMoney: '',
        paidWaterChargeMoney: '',
        paidCarChargeMoney: '',
        paidServiceChargeMoney: '',
        paidMaintenanceChargeMoney: '',
        paidGroundChargeMoney: '',
        electricityMoney: '',
        waterChargeMoney: '',
        carChargeMoney: '',
        serviceChargeMoney: '',
        maintenanceChargeMoney: '',
        groundChargeMoney: '',
      },
      power: false,
      water: false,
      carFee: false,
      service: false,
      maintenance: false,
      ground: false,
      showMoney: false,
      checked: {},
      totalCheck: {},
      totalRowMoney: {},
      totalPaid: 0,
    };
  }

  getMessages() {
    const {
      typeOfRecord,
      typeOfChoose,
      choose,
      typeOfRnE,
      // approvedBy,
      state: localState,
      performedBy,
      date,
      money,
      tax,
      reason,
      note,
      paymentMethod,
      fieldAdded,
      code,
      total,
      totalAmount,
      customer,
    } = this.state;

    const others = {};
    if (fieldAdded && fieldAdded.length > 0) {
      fieldAdded.forEach(item => {
        others[item.name.replace('others.', '')] = item.value;
      });
    }

    let order;
    let bill;
    let contract;
    let task;
    let orderPo;
    let fee;
    if (typeOfRnE !== 0) {
      switch (typeOfChoose) {
        case 0:
          order = {
            orderId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
        case 1:
          bill = {
            billId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
        case 2:
          contract = {
            contractId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
        case 3:
          task = {
            taskId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
        case 4:
          orderPo = {
            orderId: choose !== null && choose.id,
            name: choose !== null && choose.name,
          };
          break;
      }
    }
    const body = {
      type: typeOfRecord,
      // costType: typeOfRnE,
      costType: 0,
      order,
      bill,
      task,
      contract,
      performedBy,
      createDate: date,
      amount: money,
      tax,
      reason,
      state: localState,
      note,
      payMethod: paymentMethod,
      others,
      code,
      total: this.state.choose !== null ? this.state.choose.total : total,
      totalAmount: this.state.choose !== null ? this.state.choose.totalAmount : totalAmount,
      customer: this.state.choose !== null ? this.state.choose.customer : customer,
      orderPo,
      fee,
    };

    // check messages
    const { moduleCode } = this.state;
    const data = dot.dot(body);
    const messages = viewConfigCheckForm(moduleCode, data);
    this.setState({
      localMessages: messages,
    });
  }

  componentWillMount() {
    // this.props.onGetCategory();
    const { match } = this.props;
    if (match.params.id) {
      this.props.onGetRecordById(match.params.id);
      this.state.isEditPage = true;
    } else {
      this.state.isEditPage = false;
    }
  }

  componentDidMount() {
    const listKanBan = JSON.parse(localStorage.getItem('crmStatus'));
    if (listKanBan) {
      let crmKanbanStatus = listKanBan.find(p => p.code === 'trangthaithuchinoibo');
      this.setState({
        listKanbanStatus: crmKanbanStatus.data,
        kanbanStatus: crmKanbanStatus ? crmKanbanStatus.data[0]._id : '',
      });
    }
    const checkAdd = this.props.history.location.state ? this.props.history.location.state.add : false;
    if (checkAdd) {
      const valuePrevTab = this.props.history.location.state ? this.props.history.location.state.typeOfRecord : 0;
      this.setState({ valueOfPrevTab: valuePrevTab });
    }
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    const paymentMethodLocal = crmSource.find(item => item.code === 'S17');
    const paymentMethod = paymentMethodLocal.data;
    const sourceDataLocal = crmSource.find(item => item.code === 'S24');
    const sourceData = sourceDataLocal.data;
    this.setState({ paymentMethodList: paymentMethod, sourceData: sourceData });
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.find(item => item.code === 'RevenueExpenditure');
    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }
    if (this.props.history.value) {
      this.setState({ valueOfPrevTab: this.props.history.value });
      this.props.history.value = undefined;
    }
    const { moduleCode } = this.state;
    const { addRevenueAndExpenditurePage } = this.props;
    const { recordSelected } = addRevenueAndExpenditurePage;
    if (recordSelected && Object.keys(recordSelected).length !== 0) {
      const messages = viewConfigCheckForm(moduleCode, recordSelected);
      this.setState({
        localMessages: messages,
      });
    }

    const name2Title = viewConfigName2Title('RevenueExpenditure');
    this.setState({
      name2Title,
    });
    this.getMessages();
    // const messages = viewConfigCheckForm(moduleCode, this.state);
    // this.setState({
    //   localMessages: messages
    // })
  }
  convertToNumber = str => {
    if (typeof str === 'number') return str;
    if (!str || typeof str !== 'string') return 0;
    return Number(str.replaceAll('.', '').replaceAll(',', '.'));
  };
  componentWillReceiveProps(props) {
    const paidKeys = [
      'paidElectricityMoney',
      'paidWaterChargeMoney',
      'paidCarChargeMoney',
      'paidServiceChargeMoney',
      'paidMaintenanceChargeMoney',
      'paidGroundChargeMoney',
    ];
    if (props !== this.props) {
      const { addRevenueAndExpenditurePage } = props;
      const { recordSelected } = addRevenueAndExpenditurePage;
      const { moduleCode } = this.state;

      if (recordSelected) {
        const data = dot.dot(recordSelected);
        const messages = viewConfigCheckForm(moduleCode, data);
        this.setState({
          localMessages: messages,
        });
      }
      if (this.state.isEditPage && recordSelected !== this.props.addRevenueAndExpenditurePage.recordSelected) {
        this.setState({ totalPaid: recordSelected.totalPaid });
        this.state.typeOfRecord = recordSelected.type;
        this.state.typeOfRnE = recordSelected.expenseType;
        this.state.valueOfPrevTab = recordSelected.costType;
        if (recordSelected.costType !== 0) {
          if (recordSelected.order) {
            this.state.choose = recordSelected.order;
            this.state.typeOfChoose = 0;
          }
          if (recordSelected.bill) {
            this.state.choose = recordSelected.bill;
            this.state.typeOfChoose = 1;
          }
          if (recordSelected.contract) {
            this.state.choose = recordSelected.contract;
            this.state.typeOfChoose = 2;
            const token = localStorage.getItem('token');
            const url = `${GET_CONTRACT}/${recordSelected.contract.contractId}`;
            fetch(url, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then(res => res.json())
              .then(data => {
                if (Number(data.catalogContract) === 1 && Number(data.typeContract) === 1 && data.saleQuotation) {
                  const token = localStorage.getItem('token');
                  const url = `${API_SALE}/${data.saleQuotation.saleQuotationId}`;
                  fetch(url, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                    .then(res => res.json())
                    .then(data => {
                      this.setState({ listChild: data !== null ? [data] : [] });
                    });
                }
                if (Number(data.catalogContract) === 1 && Number(data.typeContract) === 2 && data.order) {
                  const token = localStorage.getItem('token');
                  const url = `${API_ORDER_PO}/${data.order.orderId}`;
                  fetch(url, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                    .then(res => res.json())
                    .then(data => {
                      this.setState({ listChild: data !== null ? [data] : [] });
                    });
                }
              });
          }

          if (recordSelected.orderPo) {
            this.state.choose = recordSelected.orderPo;
            this.state.typeOfChoose = 4;
          }

          if (recordSelected.fee) {
            this.state.choose = recordSelected.fee;
            this.state.power = !!recordSelected.fee.paidElectricityMoney;
            this.state.carFee = !!recordSelected.fee.paidCarChargeMoney;
            this.state.service = !!recordSelected.fee.paidServiceChargeMoney;
            this.state.ground = !!recordSelected.fee.paidGroundChargeMoney;
            this.state.water = !!recordSelected.fee.paidWaterChargeMoney;
            this.state.maintenance = !!recordSelected.fee.paidMaintenanceChargeMoney;
            this.state.typeOfChoose = 5;
            this.getCustomerInfo(recordSelected.fee.customerId);
          }

          if (recordSelected.task) {
            this.state.choose = recordSelected.task;
            this.state.typeOfChoose = 3;
            const params = {
              filter: {
                'task.taskId': recordSelected.task.taskId,
              },
            };
            const filter = serialize(params);
            const token = localStorage.getItem('token');
            const url = `${GET_CONTRACT}?${filter}`;
            fetch(url, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then(res => res.json())
              .then(data => {
                this.setState({ listChild: data.data });
              });
          }
        }
        console.log('recordSelected', recordSelected);
        this.state.date = convertDatetimeToDate(recordSelected.createDate);
        this.state.money = recordSelected.amount;
        this.state.tax = recordSelected.tax;
        this.state.code = recordSelected.code;
        this.state.reason = recordSelected.reason;
        this.state.note = recordSelected.note;
        this.state.state = recordSelected.state || 0;
        this.state.performedBy = recordSelected.performedBy;
        this.state.approvedBy = recordSelected.approvedBy;
        this.state.paymentMethod = recordSelected.payMethod;
        this.state.bank = recordSelected.bank;
        this.state.kanbanStatus = recordSelected.kanbanStatus;
        this.state.choose = recordSelected.fee;
        if (this.state.choose !== null) {
          this.state.choose.total = recordSelected.total;
          this.state.choose.totalAmount = recordSelected.totalAmount;
          this.state.choose.customer = recordSelected.customer;
        }

        if (recordSelected.others && Object.keys(recordSelected.others).length > 0) {
          const { fieldAdded } = this.state;
          const keys = Object.keys(recordSelected.others);
          fieldAdded.forEach(item => {
            const index = keys.findIndex(n => n === item.name.replace('others.', ''));
            if (index > -1) {
              item.value = recordSelected.others[keys[index]];
            }
          });
          this.state.fieldAdded = fieldAdded;
        }
      }
    }
  }
  customBankAccount = option => {
    const currentBalance = option.bank ? option.bank.title : '';
    const customerName = option.name ? option.name : '';
    if (customerName || currentBalance) {
      return `${customerName} - ${currentBalance}`;
    }
    return '';
  };

  customFee = option => {
    return option.code;
  };
  componentDidUpdate(props, prevState) {
    const { successCreate } = props.addRevenueAndExpenditurePage;
    if (successCreate) {
      this.props.onResetNoti();
      this.props.history.value = this.state.valueOfPrevTab;
      this.props.history.push('/AllRevenueExpenditure');
    }
    if (this.state.choose !== prevState.choose) {
      let result = [];
      const token = localStorage.getItem('token');
      let { choose } = this.state;
      let queryFilter = {
        filter: {
          debt: { $gt: 0 },
          apartmentCode: choose ? choose.apartmentCode : '',
          periodStr: { $lte: choose && choose.periodStr ? choose.periodStr : '' },
        },
        sort: '-periodStr',
      };
      fetch(`${API_FEE}?${serialize(queryFilter)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
            let result = [];
          }
        });
    }
  }

  handleCheckTotal = (i, status) => {
    const { fee, prevFee } = this.state;
    this.setState({ totalCheck: { ...this.state.totalCheck, [i]: status } }, () => {
      // Object.keys(fee).filter(f => f.includes("paid")).map((fee, feeIndex) => {
      //   Array.isArray(prevFee) && prevFee.map((prev, prevIndex) => {
      //     this.handleCheckedPrevFee(status, prev.periodStr, i)
      //   })
      // })
      this.handleCheckedPrevFee(status, fee.periodStr, i, 'checkRow');
      Array.isArray(prevFee) &&
        prevFee.map((prev, prevIndex) => {
          this.handleCheckedPrevFee(status, prev.periodStr, i, 'checkRow');
        });
    });
  };
  handleChangeMoney = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const id = this.props.match.params.id;
    const { classes, addRevenueAndExpenditurePage, intl, totalRowMoney } = this.props;
    const {
      localMessages,
      checkRequired,
      checkShowForm,
      name2Title,
      sourceData,
      kanbanStatus,
      listKanbanStatus,
      choose,
      isEditPage,
      fee,
      prevFee,
    } = this.state;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);

    return (
      <div>
        {addRevenueAndExpenditurePage.loading ? <LoadingIndicator /> : null}
        <Helmet>
          <title>{this.state.isEditPage ? 'Sửa thu chi' : 'Thêm mới thu chi'}</title>
          <meta name="description" content="Description of AddRevenueAndExpenditurePage" />
        </Helmet>
        <KanbanStepper
          listStatus={listKanbanStatus}
          onKabanClick={value => {
            this.setState({ kanbanStatus: value });
          }}
          activeStep={kanbanStatus}
        />
        <Grid>
          <Paper style={{ padding: '20px' }}>
            <CustomAppBar
              title={
                addStock === 'add'
                  ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới nội bộ' })}`
                  : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật nội bộ' })}`
              }
              onGoBack={() => {
                this.props.history.goBack();
                this.props.history.value = this.state.valueOfPrevTab;
              }}
              // onSubmit={() => this.handleSubmitForm()}
              onSubmit={() => {
                if (this.submitBtn.current) clearTimeout(this.submitBtn.current);
                this.submitBtn.current = setTimeout(() => {
                  this.handleSubmitForm();
                }, 200);
              }}
            />
            <Grid container md={12} item spacing={24} style={{ width: '100%' }}>
              <Grid item md={6}>
                <CustomInputBase
                  // label={getLabelName('type', 'RevenueExpenditure')}
                  label={name2Title.type}
                  name="typeOfRecord"
                  select
                  value={this.state.typeOfRecord}
                  onChange={this.handleChange}
                  error={localMessages && localMessages.type}
                  helperText={localMessages && localMessages.type}
                  required={checkRequired.type}
                  checkedShowForm={checkShowForm.type}
                >
                  <MenuItem value={0}>Thu</MenuItem>
                  <MenuItem value={1}>Chi</MenuItem>
                </CustomInputBase>
              </Grid>
              <Grid item md={6}>
                <TextFieldCode
                  // label={getLabelName('code', 'RevenueExpenditure')}
                  label={name2Title.code}
                  name="code"
                  value={this.state.code}
                  // onChange={this.handleChangeNumber('code')}
                  onChange={this.handleChange}
                  error={localMessages && localMessages.code}
                  helperText={localMessages && localMessages.code}
                  required={checkRequired.code}
                  checkedShowForm={checkShowForm.code}
                  code={13}
                />
              </Grid>
              <Grid item md={6}>
                <CustomDatePicker
                  // label={getLabelName('createDate', 'RevenueExpenditure')}
                  label={name2Title.createDate}
                  onChange={e => this.handleChangeDate(e, 'date')}
                  name="date"
                  value={this.state.date}
                  error={localMessages && localMessages.createDate}
                  helperText={localMessages && localMessages.createDate}
                  required={checkRequired.createDate}
                  checkedShowForm={checkShowForm.createDate}
                  right={40}
                />
              </Grid>
              <Grid item md={6}>
                <CustomInputBase
                  // label={getLabelName('amount', 'RevenueExpenditure')}
                  // label={name2Title.amount}
                  label="Số tiền"
                  name="money"
                  disabled={this.state.typeOfChoose === 5}
                  value={this.state.money}
                  onChange={this.handleChangeMoney}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                  error={localMessages && localMessages.amount}
                  helperText={localMessages && localMessages.amount}
                  required={checkRequired.amount}
                  checkedShowForm={checkShowForm.amount}
                />
              </Grid>
              <Grid item md={6}>
                <CustomInputBase
                  // label={getLabelName('reason', 'RevenueExpenditure')}
                  label={name2Title.reason}
                  name="reason"
                  value={this.state.reason}
                  onChange={this.handleChange}
                  error={localMessages && localMessages.reason}
                  helperText={localMessages && localMessages.reason}
                  required={checkRequired.reason}
                  checkedShowForm={checkShowForm.reason}
                />
              </Grid>
              <Grid item md={6} style={{ marginTop: '-15px' }}>
                <Typography component="p" style={{ color: '#a4a4a4' }}>
                  {getLabelName('performedBy.name', 'RevenueExpenditure')}
                </Typography>
                <AsyncSelect
                  className={classes.reactSelect}
                  placeholder="Tìm kiếm nhân viên thực hiện ..."
                  loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, API_USERS)}
                  loadingMessage={() => 'Đang tải ...'}
                  value={this.state.performedBy}
                  components={{ Option, SingleValue }}
                  onChange={this.handleEmployee}
                  theme={theme => ({
                    ...theme,
                    spacing: {
                      ...theme.spacing,
                      controlHeight: '55px',
                    },
                  })}
                />
                {this.state.errorPerform ? (
                  <Typography component="p" style={{ color: 'red' }}>
                    Không được để trống trường này
                  </Typography>
                ) : (
                  ''
                )}
              </Grid>
              <Grid item md={6}>
                <CustomInputBase
                  // label={getLabelName('payMethod', 'RevenueExpenditure')}
                  label={name2Title.payMethod}
                  value={this.state.paymentMethod}
                  name="paymentMethod"
                  select
                  onChange={this.handleChange}
                  error={localMessages && localMessages.payMethod}
                  helperText={localMessages && localMessages.payMethod}
                  required={checkRequired.payMethod}
                  checkedShowForm={checkShowForm.payMethod}
                >
                  {this.state.paymentMethodList.map((item, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <MenuItem value={index} key={index}>
                      {item.title}
                    </MenuItem>
                  ))}
                </CustomInputBase>
              </Grid>
              {Number(this.state.paymentMethod) !== 1 ? null : (
                <Grid item md={6}>
                  <AsyncAutocomplete
                    label={'Tài khoản ngân hàng'}
                    // onChange={onChange}
                    customOptionLabel={this.customBankAccount}
                    // isMulti={isMulti}
                    url={API_BANK_ACCOUNT}
                    value={this.state.bank}
                    onChange={(newVal, e) => {
                      this.setState({ bank: newVal });
                    }}
                  />
                </Grid>
              )}

              <Grid item md={6}>
                <CustomInputBase
                  // label={getLabelName('note', 'RevenueExpenditure')}
                  label={name2Title.note}
                  name="note"
                  onChange={this.handleChange}
                  value={this.state.note}
                  multiline
                  rows={4}
                  error={localMessages && localMessages.note}
                  helperText={localMessages && localMessages.note}
                  required={checkRequired.note}
                  checkedShowForm={checkShowForm.note}
                />
              </Grid>
              <Grid item md={6}>
                <FileUpload name={this.state.typeOfRecord} id={id} code="RevenueExpenditure" />
              </Grid>
              {this.state.fieldAdded && this.state.fieldAdded.length > 0
                ? this.state.fieldAdded.map((item, index) => {
                  if (item.checked) {
                    return (
                      <Grid item md={6} key={item.name}>
                        <CustomInputBase
                          label={item.title}
                          type={item.type === 'string' ? 'text' : item.type}
                          value={item.value}
                          onChange={event => this.handleChangeAddedField(index, event)}
                          error={localMessages && localMessages[`${item.name}`]}
                          helperText={localMessages && localMessages[`${item.name}`]}
                          required={checkRequired[`${item.name}`]}
                          checkedShowForm={checkShowForm[`${item.name}`]}
                        />
                      </Grid>
                    );
                  }
                })
                : ''}
            </Grid>
          </Paper>
        </Grid>
      </div>
    );
  }

  handleChange = e => {
    const { moduleCode, localMessages } = this.state;
    const {
      target: { value, name },
    } = e;
    if (name === 'typeOfChoose') {
      this.setState({ listChild: [], choose: null });
    }
    this.setState({ [name]: value });
    const messages = viewConfigHandleOnChange(moduleCode, localMessages, name, value);
    this.setState({
      localMessages: messages,
    });
  };

  handleChangeDate = (e, name) => {
    const nameD = name;
    const value = moment(e).format('YYYY-MM-DD');
    this.setState({ [nameD]: value });
  };
  handleInputChange = (e, _name, _value) => {
    const name = e && e.target ? e.target.name : _name;
    const value = e && e.target ? e.target.value : _value;
    setLocalState(pre => ({ ...pre, [name]: value }));
  };

  handleChangeNumber = name => e => {
    const { moduleCode, localMessages } = this.state;
    this.setState({ [name]: e.target.value });
    const messages = viewConfigHandleOnChange(moduleCode, localMessages, name, e.target.value);
    this.setState({
      localMessages: messages,
    });
  };

  handleEmployee = value => {
    const performedBy = {
      employeeId: value._id,
      name: value.name,
    };
    this.setState({ performedBy, errorPerform: false });
  };
  handleChangeAddedField = (index, e) => {
    const { fieldAdded } = this.state;
    const fields = [...fieldAdded];
    fieldAdded[index].value = e.target.value;
    this.setState({ fieldAdded: fields });
  };

  handleSubmitForm = () => {
    this.props.history.value = this.state.valueOfPrevTab;
    const {
      valueOfPrevTab,
      typeOfRecord,
      typeOfChoose,
      choose,
      typeOfRnE,
      // approvedBy,
      performedBy,
      date,
      money,
      tax,
      reason,
      note,
      paymentMethod,
      fieldAdded,
      code,
      total,
      totalAmount,
      customer,
      kanbanStatus,
      bank,
    } = this.state;

    let error = false;
    if (Object.keys(performedBy).length === 0) {
      error = true;
      // if (Object.keys(approvedBy).length === 0) {
      //   this.setState({ errorApproved: true });
      // }
      if (Object.keys(performedBy).length === 0) {
        this.setState({ errorPerform: true });
      }
    }
    const others = {};
    if (fieldAdded && fieldAdded.length > 0) {
      fieldAdded.forEach(item => {
        others[item.name.replace('others.', '')] = item.value;
      });
    }
    const body = {
      type: typeOfRecord,
      costType: 0,
      code: code,
      createDate: date,
      amount: Number(money),
      reason: reason,
      performedBy: performedBy,
      payMethod: paymentMethod,
      bank: bank,
      note: note,
      kanbanStatus: kanbanStatus,
    };

    // check messages
    const { localMessages } = this.state;

    if (localMessages && Object.keys(localMessages).length === 0) {
      if (!error) {
        if (this.state.isEditPage) {
          const { match } = this.props;
          body.id = match.params.id;
          this.props.onUpdateRecord(body);
        } else {
          this.props.onCreateRecord(body);
        }
      }
    } else {
      this.props.onChangeSnackbar({ status: true, message: 'Thêm dữ liệu thất bại', variant: 'error' });
    }
  };

  getCustomerInfo = customerId => {
    const token = localStorage.getItem('token');
    const url = `${API_CUSTOMERS}/${customerId}`;
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ customerInfo: data });
      });
  };
  loadOptions = (newValue, callback, api) => {
    const token = localStorage.getItem('token');
    const url = `${api}?filter%5Bname%5D%5B%24regex%5D=${newValue}&filter%5Bname%5D%5B%24options%5D=gi${api === API_TASK_PROJECT ? '&filter%5BisProject%5D=true' : ''
      }`;
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(myJson => {
        const { data } = myJson;
        callback(
          data.map(item => ({
            ...item,
            value: item._id,
          })),
        );
      });
  };
}

AddRevenueAndExpenditurePage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addRevenueAndExpenditurePage: makeSelectAddRevenueAndExpenditurePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetCategory: () => {
      dispatch(getCatalogAct());
    },
    onCreateRecord: body => {
      dispatch(createRecordAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    onGetRecordById: id => {
      dispatch(getRecordAct(id));
    },
    onUpdateRecord: body => {
      dispatch(updateRecordAct(body));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    mergeData: data => {
      dispatch(mergeData(data));
    },
  };
}

const Option = props => (
  <components.Option {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      {/* <Avatar src={props.data.avatar} /> */}
      <div style={{ marginTop: 10 }}>{props.data.name}</div>
    </div>
  </components.Option>
);

const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      {/* <Avatar style={{ height: 30, width: 30 }} src={props.data.avatar} /> */}
      <div style={{ marginTop: 5 }}>{props.data.name}</div>
    </div>
  </components.SingleValue>
);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addRevenueAndExpenditurePage', reducer });
const withSaga = injectSaga({ key: 'addRevenueAndExpenditurePage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddRevenueAndExpenditurePage);
