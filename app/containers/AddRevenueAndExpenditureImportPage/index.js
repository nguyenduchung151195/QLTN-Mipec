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
  API_RNE,
} from '../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import { changeSnackbar } from '../Dashboard/actions';
import {
  getCatalogAct,
  createRecordAct,
  resetNoti,
  getRecordAct,
  updateRecordAct,
  mergeData,
} from './actions';
import styles from './styles';
import { convertDatetimeToDate, getLabelName, serialize } from '../../utils/common';
import LoadingIndicator from '../../components/LoadingIndicator';
import TextFieldCode from '../../components/TextFieldCode';
import CustomInputBase from '../../components/Input/CustomInputBase';
import {
  viewConfigCheckRequired,
  viewConfigCheckForm,
  viewConfigHandleOnChange,
  viewConfigName2Title,
} from 'utils/common';
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
const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1
  }-${tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()}`;

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
            value: values.floatValue,
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
      power: false,
      water: false,
      carFee: false,
      service: false,
      maintenance: false,
      ground: false,
      showMoney: false,
      checked: {},

      contractValue: 0,
      // paidMoney: 0,
      paymentRequest: [],
      paymentPeriodMoney: 0,
      paymentItem: {},
      contractCode: '',
      lastRevenue: {},
      paymentType: 1,
      fixedPaymentType: null,
      remainingMoney: 0,
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
      costType: typeOfRnE,
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
      let crmKanbanStatus = listKanBan.find(p => p.code === 'ST30') || {};
      this.setState({
        listKanbanStatus: crmKanbanStatus.data || [],
        kanbanStatus: crmKanbanStatus.data && Array.isArray(crmKanbanStatus.data) && crmKanbanStatus.data.length ? crmKanbanStatus.data[0]._id : '',
      });
    }
    const checkAdd = this.props.history.location.state
      ? this.props.history.location.state.add
      : false;
    if (checkAdd) {
      const valuePrevTab = this.props.history.location.state
        ? this.props.history.location.state.typeOfRecord
        : 0;
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

  componentDidUpdate = (prevProps, prevState) => {
    if (
      // console.log("this.state.contractValue", this.state.contractValue)
      prevState.contractValue !== this.state.contractValue &&
      !isNaN(this.state.contractValue)
      // !isNaN(this.state.paidMoney)
    ) {
      const { contractValue, paidMoney, remainingMoney } = this.state;
      this.setState({ money: Number(this.state.contractValue) });
    }
    if (prevState.contractCode !== this.state.contractCode && this.state.contractCode) {
      const filter = {
        limit: 1,
        sort: '-updatedAt',
        filter: {
          costType: 1,
          'contract.code': this.state.contractCode,
        },
      };
      fetch(`${API_RNE}?${serialize(filter)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(data => data.json())
        .then(response => {
          if (response.data.length > 0) {
            const paymentType = response.data[0].paymentType
              ? Number(response.data[0].paymentType)
              : null;
            if (paymentType) {
              this.setState({ fixedPaymentType: paymentType, paymentType: paymentType });
            } else {
              this.setState({ fixedPaymentType: null });
            }
            this.setState({ lastRevenue: response.data[0] });
          } else {
            this.setState({ fixedPaymentType: null });
          }
        });
    }
    const { successCreate } = prevProps.addRevenueAndExpenditurePage;
    if (successCreate) {
      this.props.onResetNoti();
      this.props.history.value = this.state.valueOfPrevTab;
      this.props.history.push('/AllRevenueExpenditure');
    }
  };
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
      if (
        this.state.isEditPage &&
        recordSelected !== this.props.addRevenueAndExpenditurePage.recordSelected
      ) {
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
            if (Number(recordSelected.paymentType) === 2) {
              const paymentType = recordSelected.paymentType;
              const paymentRequest =
                recordSelected.contract.contractId &&
                recordSelected.contract.contractId.paymentRequest;
              const paymentPeriod = recordSelected.contract.paymentRequestId;
              const paymentItem =
                paymentRequest && paymentRequest.find(f => f._id === paymentPeriod);
              const paidMoney =
                Number(paymentItem.paidAmount || 0) - Number(recordSelected.amount || 0);
              const remainingMoney =
                Number(paymentItem.remaining) + Number(recordSelected.amount || 0);
              // console.log('paymentRequest', recordSelected.contract.contractId.paymentRequest);
              this.setState({
                choose: recordSelected.contract,
                paymentType: paymentType,
                paymentRequest: paymentRequest,
                paymentPeriod: paymentPeriod,
                paidMoney: paidMoney,
                remainingMoney: remainingMoney,
              });
            }
            // this.state.choose = recordSelected.contract;
            // this.state.typeOfChoose = 2;
            if (recordSelected.contract) {
              this.state.choose = recordSelected.contract;
              this.state.typeOfChoose = 2;
            }

            const token = localStorage.getItem('token');
            const url = `${GET_CONTRACT}/${recordSelected.contract.contractId ? recordSelected.contract.contractId._id : ''
              }`;
            fetch(url, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then(res => res.json())
              .then(data => {
                if (
                  Number(data.catalogContract) === 1 &&
                  Number(data.typeContract) === 1 &&
                  data.saleQuotation
                ) {
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
                if (
                  Number(data.catalogContract) === 1 &&
                  Number(data.typeContract) === 2 &&
                  data.order
                ) {
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
          // console.log("this.state", this.state);
          // console.log("recordSelected.contract", recordSelected.contract);
          // if (recordSelected.fee) {
          //   this.state.choose = recordSelected.fee;
          //   this.state.power = !!recordSelected.fee.paidElectricityMoney;
          //   this.state.carFee = !!recordSelected.fee.paidCarChargeMoney;
          //   this.state.service = !!recordSelected.fee.paidServiceChargeMoney;
          //   this.state.ground = !!recordSelected.fee.paidGroundChargeMoney;
          //   this.state.water = !!recordSelected.fee.paidWaterChargeMoney;
          //   this.state.maintenance = !!recordSelected.fee.paidMaintenanceChargeMoney;
          //   this.state.typeOfChoose = 5;
          //   console.log('====================================');
          //   this.getCustomerInfo(recordSelected.fee.customerId);
          // }
          // if (recordSelected.contract) {
          //   this.state.choose = recordSelected.contract;
          //   this.state.typeOfChoose = 5;
          // }

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
        this.state.date =
          recordSelected.createDate && convertDatetimeToDate(recordSelected.createDate);
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
        this.state.contractValue =
          recordSelected &&
          recordSelected.contract &&
          recordSelected.contract.contractId &&
          recordSelected.contract.contractId.contractValue;
        // this.state.choose = recordSelected.fee;
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

  handleChangeMoney = e => {
    const { choose, moduleCode, localMessages, typeOfChoose } = this.state;
    // if (typeOfChoose === 5) return;
    if (choose !== null && choose.total && choose.total < e.target.value) {
      this.props.onChangeSnackbar({
        status: true,
        message: 'Ngân sách không được lớn hơn tổng tiền',
        variant: 'error',
      });
      return;
    }
    if (choose !== null && choose.totalAmount && choose.totalAmount < e.target.value) {
      this.props.onChangeSnackbar({
        status: true,
        message: 'Ngân sách không được lớn hơn tổng tiền',
        variant: 'error',
      });
      return;
    }

    if (
      Number(this.state.paymentType) === 2 &&
      this.state.paymentRequest.length > 0 &&
      this.state.paymentPeriodMoney > 0 &&
      this.state.paymentPeriodMoney < Number(e.target.value)
    ) {
      this.props.onChangeSnackbar({
        status: true,
        message: 'Số tiền thanh toán theo giai đoạn không được lớn hơn tổng tiền của giai đoạn',
        variant: 'error',
      });
      return;
    }
    if (
      Number(this.state.paymentType) === 1 &&
      Number(e.target.value) > Number(this.state.remainingMoney)
    ) {
      this.props.onChangeSnackbar({
        status: true,
        message: 'Số tiền thanh toán trực tiếp không được lớn hơn tổng giá trị của hợp đồng',
        variant: 'error',
      });
      return;
    }

    this.setState({ money: e.target.value });
    const messages = viewConfigHandleOnChange(moduleCode, localMessages, 'money', e.target.value);
    this.setState({
      localMessages: messages,
    });

    // if (typeOfChoose === 5 && !Number.isNaN(this.getValue())) {
    //   if (e.target.value <= this.getValue()) {
    //     this.setState({ money: e.target.value });
    //   } else {
    //     this.props.onChangeSnackbar({
    //       status: true,
    //       message: 'Tiền đóng không được lớn hơn tổng thu',
    //       variant: 'error',
    //     });
    //     this.setState({ money: !e.target.value });
    //   }
    // }
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
      paymentType,
      fixedPaymentType,

    } = this.state;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    const combinePaymentType = fixedPaymentType ? Number(fixedPaymentType) : Number(paymentType);
    return (
      <div>
        {addRevenueAndExpenditurePage.loading ? <LoadingIndicator /> : null}
        <Helmet>
          <title>{this.state.isEditPage ? 'Sửa nhập hàng' : 'Thêm mới nhập hàng'}</title>
          <meta name="description" content="Description of AddRevenueAndExpenditureImportPage" />
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
                  ? `${intl.formatMessage(
                    messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới nhập hàng' },
                  )}`
                  : `${intl.formatMessage(
                    messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật nhập hàng' },
                  )}`
              }
              onGoBack={() => {
                this.props.history.goBack();
                this.props.history.value = this.state.valueOfPrevTab;
              }}
              // onGoBack={() => {
              //   if (this.props.history) {
              //     this.props.history.goBack();
              //   } else if (this.props.callback) this.props.callback();
              // }}
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
                <CustomInputBase
                  label="Loại"
                  name="typeOfChoose"
                  select
                  value={2}
                  disabled={true}
                // value={this.state.typeOfChoose}
                // onChange={this.handleChange}
                >
                  <MenuItem value={2}>Hợp đồng</MenuItem>
                  <MenuItem value={5}>Thông báo phí</MenuItem>
                </CustomInputBase>
              </Grid>
              <Grid item md={6}>
                <Typography
                  style={{
                    color: 'grey',
                    margin: '-22px 0 22px 0',
                  }}
                >
                  Hợp đồng
                </Typography>
                <Grid item md={12} style={{ marginTop: '-13px' }}>
                  {this.loadFindOption()}
                </Grid>
              </Grid>
              <Grid item md={6}>
                <CustomInputBase
                  label="HÌNH THỨC THANH TOÁN"
                  select
                  id="add-revenue-paymentType"
                  name="paymentType"
                  value={combinePaymentType}
                  onChange={this.handleChange}
                  InputProps={{
                    readOnly: fixedPaymentType || isEditPage,
                  }}
                >
                  <MenuItem value={1}>Thanh toán trực tiếp</MenuItem>
                  {Array.isArray(this.state.paymentRequest) &&
                    this.state.paymentRequest.length > 0 && (
                      <MenuItem value={2}>Thanh toán theo giai đoạn</MenuItem>
                    )}
                </CustomInputBase>
              </Grid>
              {Number(this.state.paymentType) === 2 &&
                Array.isArray(this.state.paymentRequest) &&
                this.state.paymentRequest.length > 0 && (
                  <Grid item md={6}>
                    <CustomInputBase
                      label="GIAI ĐOẠN THANH TOÁN"
                      select
                      id="add-revenue-import-payment"
                      name="paymentPeriod"
                      value={this.state.paymentPeriod}
                      onChange={this.handleChange}
                    >
                      {this.state.paymentRequest.map(item => {
                        item.title = item.name;
                        return <MenuItem value={item._id}>{item.title}</MenuItem>;
                      })}
                    </CustomInputBase>
                  </Grid>
                )}

              <Grid item md={6}>
                <CustomInputBase
                  // label={getLabelName('amount', 'RevenueExpenditure')}
                  // label={name2Title.amount}
                  label="GIÁ TRỊ HỢP ĐỒNG"
                  name="contractValue"
                  value={Number(this.state.contractValue || 0).toLocaleString('es-AR', {
                    maximumFractionDigits: 0,
                  })}
                  // onChange={this.handleChangeMoney}
                  InputProps={{
                    readOnly: true,
                  }}
                // error={localMessages && localMessages.contractValue}
                // helperText={localMessages && localMessages.contractValue}
                // required={checkRequired.contractValue}
                // checkedShowForm={checkShowForm.contractValue}
                />
              </Grid>
              {/* <Grid item md={6}>
                <CustomInputBase
                  // label={getLabelName('amount', 'RevenueExpenditure')}
                  // label={name2Title.amount}
                  label="ĐÃ THANH TOÁN"
                  name="paidMoney"
                  value={Number(this.state.paidMoney || 0).toLocaleString('es-AR', {
                    maximumFractionDigits: 0,
                  })}
                  // onChange={this.handleChangeMoney}
                  InputProps={{
                    // inputComponent: NumberFormatCustom,
                    readOnly: true,
                  }}
                  error={localMessages && localMessages.paidMoney}
                  helperText={localMessages && localMessages.paidMoney}
                  required={checkRequired.paidMoney}
                  checkedShowForm={checkShowForm.paidMoney}
                />

              </Grid> */}
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
              {this.state.paymentMethod !== 1 ? null : (
                <Grid item md={6}>
                  <AsyncAutocomplete
                    label={'TÀI KHOẢN NGÂN HÀNG'}
                    // onChange={onChange}
                    customOptionLabel={this.customBankAccount}
                    // isMulti={isMulti}
                    url={API_BANK_ACCOUNT}
                    value={this.state.bank}
                    onChange={(newVal, e) => {
                      this.setState({ bank: newVal });
                    }}
                  />
                  {/* <CustomInputField
                configType="crmSource"
                configCode="S04"
                type="Source|CrmSource,S04|Id||_id"
                label={name2Title.bank}
                value={this.state.bank}
                onChange={(newVal, e) => {
                  this.setState({ bank: newVal.target.value });
                }}
              /> */}
                </Grid>
              )}
              {/* <Grid item md={6}>
                {console.log(!isEditPage && Number(this.state.remainingMoney) === 0)}
                <CustomInputBase
                  // label={getLabelName('amount', 'RevenueExpenditure')}
                  // label={name2Title.amount}
                  label="SỐ TIỀN THANH TOÁN"
                  name="money"
                  value={this.state.money}
                  onChange={this.handleChangeMoney}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                    readOnly: !isEditPage && Number(this.state.remainingMoney) === 0 ? true : false,
                  }}
                  error={localMessages && localMessages.amount}
                  helperText={localMessages && localMessages.amount}
                  required={checkRequired.amount}
                  checkedShowForm={checkShowForm.amount}
                />
              </Grid> */}
              <Grid item md={6} style={{ marginTop: '-15px' }}>
                <Typography component="p" style={{ color: '#a4a4a4' }}>
                  {getLabelName('performedBy.name', 'RevenueExpenditure')}
                </Typography>
                <AsyncSelect
                  className={classes.reactSelect}
                  placeholder="Tìm kiếm nhân viên thực hiện ..."
                  loadOptions={(newValue, callback) =>
                    this.loadOptions(newValue, callback, API_USERS, true)
                  }
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

              {/* <Grid item md={6}>
                <CustomInputBase
                  label="SỐ TIỀN CÒN LẠI"
                  name="remainingMoney"
                  value={this.state.remainingMoney}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                    readOnly: true,
                  }}
                  error={localMessages && localMessages.remainingMoney}
                  helperText={localMessages && localMessages.remainingMoney}
                  required={checkRequired.remainingMoney}
                  checkedShowForm={checkShowForm.remainingMoney}
                />
              </Grid> */}
              <Grid item md={6}>
                <CustomDatePicker
                  // label={getLabelName('createDate', 'RevenueExpenditure')}
                  label={name2Title.createDate}
                  // label="Ngày tạo"
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
            </Grid>
          </Paper>
        </Grid>
      </div>
    );
  }

  handleChangeDate = (e, name) => {
    const nameD = name;
    const value = moment(e).format('YYYY-MM-DD');
    this.setState({ [nameD]: value });
  };
  handleChange = e => {
    const { moduleCode, localMessages } = this.state;
    const {
      target: { value, name },
    } = e;
    if (name === 'typeOfChoose') {
      this.setState({ listChild: [], choose: null });
    }
    this.setState({ [name]: value });
    if (name === 'paymentPeriod') {
      const paymentItem = this.state.paymentRequest.find(f => f._id === value);
      const paymentPeriodMoney = Number(paymentItem.amount) > 0 ? Number(paymentItem.amount) : 0;
      // const paidMoney =
      //   paymentItem && Number(paymentItem.paidAmount) > 0 ? Number(paymentItem.paidAmount) : 0;
      // const remainingMoney =
      //   Number(paidMoney) === 0
      //     ? Number(paymentPeriodMonhis.stateey)
      //     : paymentItem && Number(paymentItem.remaining) > 0
      //       ? Number(paymentItem.remaining)
      //       : 0;

      this.setState({
        money: remainingMoney,
        paymentPeriodMoney: paymentPeriodMoney,
        paymentItem: paymentItem,
        remainingMoney: remainingMoney,
        // paidMoney: paidMoney,
      });
    }
    if (name === 'paymentType') {
      if (Number(value) === 1) {
        const { contractValue } = this.state;
        this.setState({ money: contractValue, paymentPeriod: null });
      }
    }
    const messages = viewConfigHandleOnChange(moduleCode, localMessages, name, value);
    this.setState({
      localMessages: messages,
    });
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

  // handleEmployeeApprove = value => {
  //   const approvedBy = {
  //     employeeId: value._id,
  //     name: value.name,
  //   };
  //   this.setState({ approvedBy, errorApproved: false });
  // };

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

    let order;
    let bill;
    let contract;
    let task;
    let orderPo;
    let fee;

    if (valueOfPrevTab !== 0) {
      console.log(typeOfChoose, "typeOfChoose", choose);
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
          if (this.state.isEditPage) {
            contract = {
              contractId: choose !== null && choose.contractId,
              name: choose !== null && choose.name,
              code: choose !== null && choose.code,
            };
          } else {
            contract = {
              contractId: choose !== null && choose.id,
              name: choose !== null && choose.name,
              code: choose !== null && choose.code,
            };
          }
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
          // case 5:
          //   console.log('====================================');
          //   console.log(this.state.fee.electricityMoney);
          //   console.log('====================================');
          //   fee = {
          //     feeId: choose !== null && choose.id,
          //     name: choose !== null && choose.apartmentCode,
          //     id: choose !== null && choose.id,
          //     code: choose !== null && choose.code,
          //     customerId: choose !== null && choose.customerId,

          //     electricityMoney:
          //       this.state.fee.electricityMoney ? this.convertToNumber(this.state.fee.electricityMoney) : 0,
          //     waterChargeMoney:
          //       this.state.fee.waterChargeMoney ? this.convertToNumber(this.state.fee.waterChargeMoney) : 0,
          //     carChargeMoney:
          //       this.state.fee ? this.convertToNumber(this.state.fee.carChargeMoney) : 0,
          //     serviceChargeMoney:
          //       this.state.fee !== null ? this.convertToNumber(this.state.fee.serviceChargeMoney) : 0,
          //     maintenanceChargeMoney:
          //       this.state.fee !== null
          //         ? this.convertToNumber(this.state.fee.maintenanceChargeMoney)
          //         : 0,
          //     groundChargeMoney:
          //       this.state.fee !== null ? this.convertToNumber(this.state.fee.groundChargeMoney) : 0,

          //     paidElectricityMoney:
          //       this.state.fee !== null
          //         ? this.convertToNumber(this.state.fee.paidElectricityMoney)
          //         : 0,
          //     paidWaterChargeMoney:
          //       this.state.fee !== null
          //         ? this.convertToNumber(this.state.fee.paidWaterChargeMoney)
          //         : 0,
          //     paidCarChargeMoney:
          //       this.state.fee !== null ? this.convertToNumber(this.state.fee.paidCarChargeMoney) : 0,
          //     paidServiceChargeMoney:
          //       this.state.fee !== null
          //         ? this.convertToNumber(this.state.fee.paidServiceChargeMoney)
          //         : 0,
          //     paidMaintenanceChargeMoney:
          //       this.state.fee !== null
          //         ? this.convertToNumber(this.state.fee.paidMaintenanceChargeMoney)
          //         : 0,
          //     paidGroundChargeMoney:
          //       this.state.fee !== null
          //         ? this.convertToNumber(this.state.fee.paidGroundChargeMoney)
          //         : 0,

          //     prevElectricityMoney:
          //       this.state.fee !== null
          //         ? this.convertToNumber(this.state.fee.prevElectricityMoney)
          //         : 0,
          //     prevServiceChargeMoney:
          //       this.state.fee !== null
          //         ? this.convertToNumber(this.state.fee.prevServiceChargeMoney)
          //         : 0,
          //     prevCarChargeMoney:
          //       this.state.fee !== null ? this.convertToNumber(this.state.fee.prevCarChargeMoney) : 0,
          //     prevMaintenanceChargeMoney:
          //       this.state.fee !== null
          //         ? this.convertToNumber(this.state.fee.prevMaintenanceChargeMoney)
          //         : 0,
          //     prevWaterChargeMoney:
          //       this.state.fee !== null
          //         ? this.convertToNumber(this.state.fee.prevWaterChargeMoney)
          //         : 0,
          //     prevGroundChargeMoney:
          //       this.state.fee !== null
          //         ? this.convertToNumber(this.state.fee.prevGroundChargeMoney)
          //         : 0,
          //     prevFee: this.state.prevFee,
          //   };
          break;
      }
    }
    if (this.state.paymentPeriod) {
      contract.paymentRequestId = this.state.paymentPeriod;
    }
    if (Number(this.state.paymentType) === 2 && !contract.paymentRequestId) {
      this.props.onChangeSnackbar({
        status: true,
        message: 'Chưa có giai đoạn thanh toán nào được chọn!',
        variant: 'error',
      });
      return;
    }
    const body = {
      type: typeOfRecord,
      costType: valueOfPrevTab,
      expenseType: typeOfRnE,
      kanbanStatus,
      order,
      bill,
      task,
      contract,
      performedBy,
      createDate: date,
      amount: this.state.money,
      tax,
      reason,
      state: this.state.state,
      note,
      payMethod: paymentMethod,
      others,
      code,
      total: this.state.choose !== null ? this.state.choose.total : total,
      totalAmount: this.state.choose !== null ? this.state.choose.totalAmount : totalAmount,
      customer: this.state.choose !== null ? this.state.choose.customer : customer,
      bank,
      paymentType: this.state.paymentType ? this.state.paymentType : 1,

      // fee,
      // paymentRequest: this.state.paymentRequest

      // orderPo,
    };

    // check messages
    const { localMessages } = this.state;
    if (localMessages && Object.keys(localMessages).length === 0) {
      if (!error) {
        if (this.state.isEditPage) {
          const { match } = this.props;
          body.id = match.params.id;
          console.log("body: ", body)
          this.props.onUpdateRecord(body);
        } else {
          this.props.onCreateRecord(body);
        }
      }
    } else {
      this.props.onChangeSnackbar({
        status: true,
        message: 'Thêm dữ liệu thất bại',
        variant: 'error',
      });
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

  handleAddSale = sale => {
    const { typeOfChoose } = this.state;
    const { listProduct } = sale;
    let totalMoneyOfListProduct = 0;
    Array.isArray(listProduct) &&
      listProduct.length > 0 &&
      listProduct.map((product, index) => {
        const price =
          product.pricePolicy && Number(product.pricePolicy.allPrice) > 0
            ? Number(product.pricePolicy.allPrice)
            : Number(product.pricePolicy.costPrice) > 0
              ? Number(product.pricePolicy.costPrice)
              : 0;
        const amount = Number(product.amount || 0);
        const discount = Number(product.discount || 0);
        totalMoneyOfListProduct += price * amount * (1 - discount / 100);
      });
    if (Number(this.state.paymentType) === 1) {
      this.setState({
        // contractValue: totalMoneyOfListProduct,
        contractValue: Number(sale.contractValue) > 0 ? Number(sale.contractValue) : 0,
        // paidMoney: Number(sale.totalPaidAmount) > 0 ? Number(sale.totalPaidAmount) : 0,
        remainingMoney:
          Number(sale.totalRemaining) > 0
            ? Number(sale.totalRemaining)
            : Number(sale.totalPaidAmount) <= 0
              ? Number(sale.contractValue)
              : Number(sale.contractValue) - Number(sale.totalPaidAmount),
        paymentRequest: sale.paymentRequest || [],
        contractCode: sale.code,
      });
    } else if (Number(this.state.paymentType) === 2) {
      this.setState({
        contractValue: Number(sale.contractValue) > 0 ? Number(sale.contractValue) : 0,
        paymentRequest: sale.paymentRequest || [],
        contractCode: sale.code,
      });
    } else {
    }

    const choose = sale && {
      id: sale._id,
      name: sale.name,
      code: sale.code,
      total: typeOfChoose !== 4 ? sale.total : sale.amount,
      customerId: sale.customerId,
      totalAmount: sale.totalAmount,
      customer: sale.customer ? sale.customer.name : sale.supplier ? sale.supplier.name : '',
      customerName: sale.customerName ? sale.customerName : '',
      customerId: sale.customerId ? sale.customerId : '',
      apartmentCode: sale.apartmentCode ? sale.apartmentCode : '',
      periodStr: sale.periodStr ? sale.periodStr : '',
      waterChargeMoney: sale.waterChargeMoney ? sale.waterChargeMoney : 0,
      electricityMoney: sale.electricityMoney ? sale.electricityMoney : 0,
      carChargeMoney: sale.carChargeMoney ? sale.carChargeMoney : 0,
      serviceChargeMoney: sale.serviceChargeMoney ? sale.serviceChargeMoney : 0,
      maintenanceChargeMoney: sale.maintenanceChargeMoney ? sale.maintenanceChargeMoney : 0,
      groundChargeMoney: sale.groundChargeMoney ? sale.groundChargeMoney : 0,

      prevCarChargeMoney: sale.prevCarChargeMoney ? sale.prevCarChargeMoney : 0,
      prevElectricityMoney: sale.prevElectricityMoney ? sale.prevElectricityMoney : 0,
      prevGroundChargeMoney: sale.prevGroundChargeMoney ? sale.prevGroundChargeMoney : 0,
      prevMaintenanceChargeMoney: sale.prevMaintenanceChargeMoney
        ? sale.prevMaintenanceChargeMoney
        : 0,
      prevServiceChargeMoney: sale.prevServiceChargeMoney ? sale.prevServiceChargeMoney : 0,
      prevWaterChargeMoney: sale.prevWaterChargeMoney ? sale.prevWaterChargeMoney : 0,

      paidCarChargeMoney: (sale.carChargeMoney || 0) + (sale.prevCarChargeMoney || 0),
      paidElectricityMoney: (sale.electricityMoney || 0) + (sale.prevElectricityMoney || 0),
      paidGroundChargeMoney: (sale.groundChargeMoney || 0) + (sale.prevGroundChargeMoney || 0),
      paidMaintenanceChargeMoney:
        (sale.maintenanceChargeMoney || 0) + (sale.prevMaintenanceChargeMoney || 0),
      paidServiceChargeMoney: (sale.serviceChargeMoney || 0) + (sale.prevServiceChargeMoney || 0),
      paidWaterChargeMoney: (sale.waterChargeMoney || 0) + (sale.prevWaterChargeMoney || 0),
    };
    this.state.listChild = [];
    if (typeOfChoose === 2) {
      if (
        Number(sale.catalogContract) === 1 &&
        Number(sale.typeContract) === 1 &&
        sale.saleQuotation
      ) {
        const token = localStorage.getItem('token');
        const url = `${API_SALE}/${sale.saleQuotation.saleQuotationId}`;
        fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            this.setState({ listChild: data ? [data] : [] });
          });
      }
      if (Number(sale.catalogContract) === 1 && Number(sale.typeContract) === 2 && sale.order) {
        const token = localStorage.getItem('token');
        const url = `${API_ORDER_PO}/${sale.order.orderId}`;
        fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            this.setState({ listChild: data ? [data] : [] });
          });
      }
    }
    if (typeOfChoose === 3) {
      const params = {
        filter: {
          'task.taskId': sale._id,
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
    if (typeOfChoose === 4) {
      const token = localStorage.getItem('token');
      const url = `${API_ORDER_PO}/${sale._id}`;
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

    // if (typeOfChoose === 5) {
    //   this.getCustomerInfo(sale.customerId);
    // }

    this.setState({ choose });
  };

  loadFindOption = () => {
    const api = GET_CONTRACT;
    const functionHandle = this.handleAddSale;
    return (
      <AsyncSelect
        className={this.props.classes.reactSelect1}
        placeholder="Tìm kiếm ..."
        loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, api)}
        loadingMessage={() => 'Đang tải ...'}
        components={{ Option, SingleValue }}
        onChange={functionHandle}
        value={this.state.choose}
        theme={theme => ({
          ...theme,
          spacing: {
            ...theme.spacing,
            controlHeight: '50px',
          },
        })}
      />
    );
  };

  loadOptions = (newValue, callback, api, employee) => {
    const token = localStorage.getItem('token');
    const filter = employee
      ? {
        filter: {
          $or: [
            {
              name: {
                $regex: newValue,
                $options: 'gi',
              },
            },
            {
              apartmentCode: {
                $regex: newValue,
                $options: 'gi',
              },
            },
          ],
        },
      }
      : {
        filter: {
          $or: [
            {
              name: {
                $regex: newValue,
                $options: 'gi',
              },
            },
            {
              apartmentCode: {
                $regex: newValue,
                $options: 'gi',
              },
            },
          ],
          typeContract: 2,
        },
      };
    const url = `${api}?${serialize(filter)}`;
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
