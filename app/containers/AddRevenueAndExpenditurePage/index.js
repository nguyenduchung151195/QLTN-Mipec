/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * AddRevenueAndExpenditurePage
 *
 */

import React from 'react';
import PropTypes, { array, number } from 'prop-types';
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
  Input,
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
            value: values.floatValue,
          },
        });
      }}
      isNumericString
      thousandSeparator
    // thousandSeparator={'.'}
    // decimalSeparator={','}
    // decimalScale={0}
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
      typeOfChoose: 0,
      typeOfDeposit: 0,
      choose: null,
      date,
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
      paymentRequest: [],
      deposit: [],
      arrears: [],
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
        oldPaidElectricityMoney: '',
        oldPaidWaterChargeMoney: '',
        oldPaidCarChargeMoney: '',
        oldPaidServiceChargeMoney: '',
        oldPaidMaintenanceChargeMoney: '',
        oldPaidGroundChargeMoney: '',
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
      debt: 0,
      totalMoney: 0,
      paidCustomer: 0,
      amountReceivables: 0,
      moneyInCustomerAccount: 0,
      moneyCustomerAccount: 0,
      checkMoneyInCustomerAccount: true,
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
      let crmKanbanStatus = listKanBan.find(p => p.code === 'ST19');
      this.setState({
        listKanbanStatus: crmKanbanStatus.data,
        kanbanStatus: crmKanbanStatus ? crmKanbanStatus.data[0]._id : '',
      });
    }
    const checkAdd = this.props.history.location.state ? this.props.history.location.state.add : false;
    if (checkAdd) {
      const valuePrevTab = this.props.history.location.state ? this.props.history.location.state.typeOfRecord : 0;
      console.log(valuePrevTab, 'valuePrevTab');
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
    if (this.state.isEditPage && recordSelected && recordSelected.fee) {
      this.setState({
        fee: {
          periodStr: recordSelected.fee.periodStr,
          paidElectricityMoney: Math.round(Number(recordSelected.fee.paidElectricityMoney)) || 0,
          paidWaterChargeMoney: Math.round(Number(recordSelected.fee.paidWaterChargeMoney)) || 0,
          paidCarChargeMoney: Math.round(Number(recordSelected.fee.paidCarChargeMoney)) || 0,
          paidServiceChargeMoney: Math.round(Number(recordSelected.fee.paidServiceChargeMoney)) || 0,
          paidMaintenanceChargeMoney: Math.round(Number(recordSelected.fee.paidMaintenanceChargeMoney)) || 0,
          paidGroundChargeMoney: Math.round(Number(recordSelected.fee.paidGroundChargeMoney)) || 0,

          electricityMoney: Math.round(Number(recordSelected.fee.electricityMoney)) || 0,
          waterChargeMoney: Math.round(Number(recordSelected.fee.waterChargeMoney)) || 0,
          carChargeMoney: Math.round(Number(recordSelected.fee.carChargeMoney)) || 0,
          serviceChargeMoney: Math.round(Number(recordSelected.fee.serviceChargeMoney)) || 0,
          maintenanceChargeMoney: Math.round(Number(recordSelected.fee.maintenanceChargeMoney)) || 0,
          groundChargeMoney: Math.round(Number(recordSelected.fee.groundChargeMoney)) || 0,

          oldPaidElectricityMoney: Math.round(Number(recordSelected.fee.paidElectricityMoney)) || 0,
          oldPaidWaterChargeMoney: Math.round(Number(recordSelected.fee.paidWaterChargeMoney)) || 0,
          oldPaidCarChargeMoney: Math.round(Number(recordSelected.fee.paidCarChargeMoney)) || 0,
          oldPaidServiceChargeMoney: Math.round(Number(recordSelected.fee.paidServiceChargeMoney)) || 0,
          oldPaidMaintenanceChargeMoney: Math.round(Number(recordSelected.fee.paidMaintenanceChargeMoney)) || 0,
          oldPaidGroundChargeMoney: Math.round(Number(recordSelected.fee.paidGroundChargeMoney)) || 0,
        },
        prevFee:
          Array.isArray(recordSelected.fee.prevFee) &&
          recordSelected.fee.prevFee.map(item => ({
            _id: item._id,
            prevElectricityMoney: Math.round(Number(item.prevElectricityMoney)) || 0,
            prevWaterChargeMoney: Math.round(Number(item.prevWaterChargeMoney)) || 0,
            prevCarChargeMoney: Math.round(Number(item.prevCarChargeMoney)) || 0,
            prevServiceChargeMoney: Math.round(Number(item.prevServiceChargeMoney)) || 0,
            prevMaintenanceChargeMoney: Math.round(Number(item.prevMaintenanceChargeMoney)) || 0,
            prevGroundChargeMoney: Math.round(Number(item.prevGroundChargeMoney)) || 0,

            paidElectricityMoney: Math.round(Number(item.paidElectricityMoney)) || 0,
            paidWaterChargeMoney: Math.round(Number(item.paidWaterChargeMoney)) || 0,
            paidCarChargeMoney: Math.round(Number(item.paidCarChargeMoney)) || 0,
            paidServiceChargeMoney: Math.round(Number(item.paidServiceChargeMoney)) || 0,
            paidMaintenanceChargeMoney: Math.round(Number(item.paidMaintenanceChargeMoney)) || 0,
            paidGroundChargeMoney: Math.round(Number(item.paidGroundChargeMoney)) || 0,

            oldPaidElectricityMoney: Math.round(Number(item.paidElectricityMoney)) || 0,
            oldPaidWaterChargeMoney: Math.round(Number(item.paidWaterChargeMoney)) || 0,
            oldPaidCarChargeMoney: Math.round(Number(item.paidCarChargeMoney)) || 0,
            oldPaidServiceChargeMoney: Math.round(Number(item.paidServiceChargeMoney)) || 0,
            oldPaidMaintenanceChargeMoney: Math.round(Number(item.paidMaintenanceChargeMoney)) || 0,
            oldPaidGroundChargeMoney: Math.round(Number(item.paidGroundChargeMoney)) || 0,

            period: item.period,
            periodStr: item.periodStr,
            apartmentCode: item.apartmentCode,
          })),
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
        this.setState({
          totalPaid: recordSelected.totalPaid,
          paidCustomer: recordSelected.paidCustomer,
        });
        this.setState({ debt: recordSelected.debt });
        this.setState({ totalMoney: recordSelected.totalMoney });
        this.state.typeOfRecord = recordSelected.type;
        this.state.typeOfRnE = recordSelected.expenseType;
        this.state.valueOfPrevTab = recordSelected.costType;
        if (recordSelected.costType !== 0) {
          // if (recordSelected.order) {
          //   this.state.choose = recordSelected.order;
          //   this.state.typeOfChoose = 0;
          // }
          // if (recordSelected.bill) {
          //   this.state.choose = recordSelected.bill;
          //   this.state.typeOfChoose = 1;
          // }

          // if (recordSelected.orderPo) {
          //   this.state.choose = recordSelected.orderPo;
          //   this.state.typeOfChoose = 4;
          // }

          if (recordSelected.fee) {
            this.state.choose = recordSelected.fee;
            this.state.power = !!recordSelected.fee.paidElectricityMoney;
            this.state.carFee = !!recordSelected.fee.paidCarChargeMoney;
            this.state.service = !!recordSelected.fee.paidServiceChargeMoney;
            this.state.ground = !!recordSelected.fee.paidGroundChargeMoney;
            this.state.water = !!recordSelected.fee.paidWaterChargeMoney;
            this.state.maintenance = !!recordSelected.fee.paidMaintenanceChargeMoney;
            this.state.typeOfChoose = 0;
            this.getCustomerInfo(recordSelected.fee.customerId);
            this.setState({ amountReceivables: recordSelected.amountReceivables });
          }
          if (recordSelected.contract) {
            this.state.choose = recordSelected.contract;
            const token = localStorage.getItem('token');
            const url = `${GET_CONTRACT}/${recordSelected.contract.contractId && recordSelected.contract.contractId._id}`;
            fetch(url, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then(res => res.json())
              .then(data => {
                // if (Number(data.catalogContract) === 1 && Number(data.typeContract) === 1 && data.saleQuotation) {
                //   const token = localStorage.getItem('token');
                //   const url = `${API_SALE}/${data.saleQuotation.saleQuotationId}`;
                //   fetch(url, {
                //     headers: {
                //       Authorization: `Bearer ${token}`,
                //     },
                //   })
                //     .then(res => res.json())
                //     .then(data => {
                //       this.setState({ listChild: data !== null ? [data] : [], customerInfo: data.customerId, paymentRequest: data.paymentRequest });
                //     });
                // }
                if (Number(data.catalogContract) === 1 && Number(data.typeContract) === 1) {
                  this.getCustomerInfo(data.customerId._id);
                  if (this.state.typeOfDeposit === 1) {
                    const amountReceivables = data.paymentRequest.reduce((total, item) => total + item.amount, 0);
                    this.setState({ amountReceivables: amountReceivables });
                  }
                  if (this.state.typeOfDeposit === 0) {
                    const amountReceivables = data.deposit.reduce((total, item) => total + item.depositAmount, 0);
                    this.setState({ amountReceivables: amountReceivables });
                  }
                  if (this.state.typeOfChoose === 4) {
                    const amountReceivables = data.arrears.reduce((total, item) => total + item.arrearsAmount, 0);
                    this.setState({ amountReceivables: amountReceivables });
                  }
                  this.setState({
                    listChild: data !== null ? [data] : [],
                    customerInfo: data.customerId,
                    paymentRequest: data.paymentRequest,
                    deposit: data.deposit,
                    arrears: data.arrears,
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
          if (recordSelected.task) {
            this.state.choose = recordSelected.task;
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
        this.state.typeOfChoose =
          recordSelected.feeType === 1 || recordSelected.feeType === 2 || recordSelected.feeType === 5 ? 1 : recordSelected.feeType;
        this.state.typeOfDeposit = recordSelected.fee === 5 ? 1 : 0;
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
        this.state.kanbanStatus = recordSelected.kanbanStatus;
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
        if (recordSelected.fee) {
          this.setState({
            fee: {
              periodStr: recordSelected.fee.periodStr,
              paidElectricityMoney: Number(recordSelected.fee.paidElectricityMoney).toFixed(0) || 0,
              paidWaterChargeMoney: Number(recordSelected.fee.paidWaterChargeMoney).toFixed(0) || 0,
              paidCarChargeMoney: Number(recordSelected.fee.paidCarChargeMoney).toFixed(0) || 0,
              paidServiceChargeMoney: Number(recordSelected.fee.paidServiceChargeMoney).toFixed(0) || 0,
              paidMaintenanceChargeMoney: Number(recordSelected.fee.paidMaintenanceChargeMoney) || 0,
              paidGroundChargeMoney: Number(recordSelected.fee.paidGroundChargeMoney).toFixed(0) || 0,

              electricityMoney: Number(recordSelected.fee.electricityMoney).toFixed(0) || 0,
              waterChargeMoney: Number(recordSelected.fee.waterChargeMoney).toFixed(0) || 0,
              carChargeMoney: Number(recordSelected.fee.carChargeMoney).toFixed(0) || 0,
              serviceChargeMoney: Number(recordSelected.fee.serviceChargeMoney).toFixed(0) || 0,
              maintenanceChargeMoney: Number(recordSelected.fee.maintenanceChargeMoney).toFixed(0) || 0,
              groundChargeMoney: Number(recordSelected.fee.groundChargeMoney).toFixed(0) || 0,

              oldPaidElectricityMoney: Number(recordSelected.fee.paidElectricityMoney).toFixed(0) || 0,
              oldPaidWaterChargeMoney: Number(recordSelected.fee.paidWaterChargeMoney).toFixed(0) || 0,
              oldPaidCarChargeMoney: Number(recordSelected.fee.paidCarChargeMoney).toFixed(0) || 0,
              oldPaidServiceChargeMoney: Number(recordSelected.fee.paidServiceChargeMoney).toFixed(0) || 0,
              oldPaidMaintenanceChargeMoney: Number(recordSelected.fee.paidMaintenanceChargeMoney).toFixed(0) || 0,
              oldPaidGroundChargeMoney: Number(recordSelected.fee.paidGroundChargeMoney).toFixed(0) || 0,
            },
            prevFee:
              Array.isArray(recordSelected.fee.prevFee) &&
              recordSelected.fee.prevFee.map(item => ({
                _id: item._id,
                prevElectricityMoney: Number(item.prevElectricityMoney).toFixed(0) || 0,
                prevWaterChargeMoney: Number(item.prevWaterChargeMoney) || 0,
                prevCarChargeMoney: Number(item.prevCarChargeMoney).toFixed(0) || 0,
                prevServiceChargeMoney: Number(item.prevServiceChargeMoney).toFixed(0) || 0,
                prevMaintenanceChargeMoney: Number(item.prevMaintenanceChargeMoney).toFixed(0) || 0,
                prevGroundChargeMoney: Number(item.prevGroundChargeMoney).toFixed(0) || 0,

                paidElectricityMoney: Number(item.paidElectricityMoney || 0).toFixed(0),
                paidWaterChargeMoney: Number(item.paidWaterChargeMoney || 0),
                paidCarChargeMoney: Number(item.paidCarChargeMoney || 0).toFixed(0),
                paidServiceChargeMoney: Number(item.paidServiceChargeMoney || 0).toFixed(0),
                paidMaintenanceChargeMoney: Number(item.paidMaintenanceChargeMoney || 0).toFixed(0),
                paidGroundChargeMoney: Number(item.paidGroundChargeMoney || 0).toFixed(0),

                oldPaidElectricityMoney: Number(item.paidElectricityMoney).toFixed(0) || 0,
                oldPaidWaterChargeMoney: Number(item.paidWaterChargeMoney).toFixed(0) || 0,
                oldPaidCarChargeMoney: Number(item.paidCarChargeMoney).toFixed(0) || 0,
                oldPaidServiceChargeMoney: Number(item.paidServiceChargeMoney).toFixed(0) || 0,
                oldPaidMaintenanceChargeMoney: Number(item.paidMaintenanceChargeMoney).toFixed(0) || 0,
                oldPaidGroundChargeMoney: Number(item.paidGroundChargeMoney).toFixed(0) || 0,

                period: item.period,
                periodStr: item.periodStr,
                apartmentCode: item.apartmentCode,
              })),
          });
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

  // handleCheckbox = e => {
  //   // const {cheker} = this.state;
  //   this.setState({[e.target.name]: e.target.checked });
  //   console.log('[e.target.name]',e.target.name)

  // };

  handleCheckbox = name => event => {
    if (name === 'showMoney') {
      this.setState({ [name]: event.target.checked }, () => {
        this.setState({
          power: this.state.showMoney,
          water: this.state.showMoney,
          carFee: this.state.showMoney,
          service: this.state.showMoney,
          maintenance: this.state.showMoney,
          ground: this.state.showMoney,
          money: this.getValue(),
        });
      });
      this.handleCheckedPrevFee(event.target.checked, null, null, name);
    } else this.setState({ [name]: event.target.checked }, () => this.setState({ money: this.getValue() }));
  };
  handleCheckboxList = (feeIndex, keyIndex) => {
    let { prevFee = [] } = this.state;
    if (feeIndex && keyIndex && prevFee) {
      prevFee[feeIndex] = {
        ...prevFee[feeIndex],
        [keyIndex]: !prevFee[feeIndex][keyIndex],
      };
    }
    this.setState({ prevFee });
  };

  onBlurFee = (name, e, isEditPage) => {
    const { fee = [] } = this.state;
    if (e.target.value == null || e.target.value === '') {
      this.setState({
        fee: {
          ...fee,
          [name]: 0,
        },
      });
    }
  };
  handlePayMoney = (name, e, isEditPage) => {
    const rex = /[0-9]/;
    const test = rex.test(this.convertToNumber(e.target.value));
    if (test === false && e.target.value !== '') return;
    const { choose, fee = [] } = this.state;
    const value = e.target.value === '' ? e.target.value : this.convertToNumber(e.target.value);
    // this.setState({ [name]: e.target.value })
    if (!isEditPage) {
      if (name === 'paidElectricityMoney') {
        if (value <= this.state.fee.electricityMoney) {
          this.setState(
            {
              fee: {
                // ...choose,
                ...fee,
                [name]: value,
                // ['debtElectricityMoney']: Number(fee['electric.toFixed(3).toFixed(3) || 0ityMoney']) - Number(e.target.value)
              },
            },
            () => {
              this.setState({ money: this.getValue() });
            },
          );
        } else {
          this.props.onChangeSnackbar({
            status: true,
            message: 'Tiền đóng phí điện không được lớn hơn tổng thu',
            variant: 'error',
          });
        }
      }

      if (name === 'paidWaterChargeMoney') {
        if (value <= this.state.fee.waterChargeMoney) {
          this.setState(
            {
              fee: {
                // ...choose,
                ...fee,
                [name]: value,
                // ['debtWaterChargeMoney']: Number(fee['waterChargeMoney']) - Number(e.target.value)
              },
            },
            () => {
              this.setState({ money: this.getValue() });
            },
          );
        } else {
          this.props.onChangeSnackbar({
            status: true,
            message: 'Tiền đóng phí nước không được lớn hơn tổng thu',
            variant: 'error',
          });
        }
      }

      if (name === 'paidCarChargeMoney') {
        if (value <= this.state.fee.carChargeMoney) {
          this.setState(
            {
              fee: {
                // ...choose,
                ...fee,
                [name]: value,
                // ['debtCarChargeMoney']: Number(fee['carChargeMoney']) - Number(e.target.value)
              },
            },
            () => {
              this.setState({ money: this.getValue() });
            },
          );
        } else {
          this.props.onChangeSnackbar({
            status: true,
            message: 'Tiền đóng phí xe không được lớn hơn tổng thu',
            variant: 'error',
          });
        }
      }

      if (name === 'paidServiceChargeMoney') {
        if (value <= this.state.fee.serviceChargeMoney) {
          this.setState(
            {
              fee: {
                // ...choose,
                ...fee,
                [name]: value,
                // ['debtServiceChargeMoney']: Number(fee['serviceChargeMoney']) - Number(e.target.value)
              },
            },
            () => {
              this.setState({ money: this.getValue() });
            },
          );
        } else {
          this.props.onChangeSnackbar({
            status: true,
            message: 'Tiền đóng phí dịch vụ không được lớn hơn tổng thu',
            variant: 'error',
          });
        }
      }

      if (name === 'paidMaintenanceChargeMoney') {
        if (value <= this.state.fee.maintenanceChargeMoney) {
          this.setState(
            {
              fee: {
                // ...choose,
                ...fee,
                [name]: value,
                // ['debtMaintenanceChargeMoney']: Number(fee['maintenanceChargeMoney']) - Number(e.target.value)
              },
            },
            () => {
              this.setState({ money: this.getValue() });
            },
          );
        } else {
          this.props.onChangeSnackbar({
            status: true,
            message: 'Tiền đóng phí bảo trì không được lớn hơn tổng thu',
            variant: 'error',
          });
        }
      }
      if (name === 'paidGroundChargeMoney') {
        if (value <= this.state.fee.groundChargeMoney) {
          this.setState(
            {
              fee: {
                // ...choose,
                ...fee,
                [name]: value,
                // ['debtGroundChargeMoney']: Number(fee['groundChargeMoney']) - Number(e.target.value)
              },
            },
            () => {
              this.setState({ money: this.getValue() });
            },
          );
        } else {
          this.props.onChangeSnackbar({
            status: true,
            message: 'Tiền đóng phí mặt bằng không được lớn hơn tổng thu',
            variant: 'error',
          });
        }
      }
    } else {
      if (name === 'paidElectricityMoney') {
        if (value <= this.state.fee.electricityMoney) {
          this.setState(
            {
              fee: {
                // ...choose,
                ...fee,
                [name]: value,
              },
            },
            () => {
              this.setState({ money: this.getValue() });
            },
          );
        } else {
          this.props.onChangeSnackbar({
            status: true,
            message: 'Tiền đóng phí điện không được lớn hơn tổng thu',
            variant: 'error',
          });
        }
      }

      if (name === 'paidWaterChargeMoney') {
        if (value <= this.state.fee.waterChargeMoney) {
          this.setState(
            {
              fee: {
                // ...choose,
                ...fee,
                [name]: value,
              },
            },
            () => {
              this.setState({ money: this.getValue() });
            },
          );
        } else {
          this.props.onChangeSnackbar({
            status: true,
            message: 'Tiền đóng phí nước không được lớn hơn tổng thu',
            variant: 'error',
          });
        }
      }

      if (name === 'paidCarChargeMoney') {
        if (value <= this.state.fee.carChargeMoney) {
          this.setState(
            {
              fee: {
                // ...choose,
                ...fee,
                [name]: value,
              },
            },
            () => {
              this.setState({ money: this.getValue() });
            },
          );
        } else {
          this.props.onChangeSnackbar({
            status: true,
            message: 'Tiền đóng phí xe không được lớn hơn tổng thu',
            variant: 'error',
          });
        }
      }

      if (name === 'paidServiceChargeMoney') {
        if (value <= this.state.fee.serviceChargeMoney) {
          this.setState(
            {
              fee: {
                // ...choose,
                ...fee,
                [name]: value,
              },
            },
            () => {
              this.setState({ money: this.getValue() });
            },
          );
        } else {
          this.props.onChangeSnackbar({
            status: true,
            message: `Tiền đóng phí dịch vụ không được lớn hơn tổng thu `,
            variant: 'error',
          });
        }
      }

      if (name === 'paidMaintenanceChargeMoney') {
        if (value <= this.state.fee.maintenanceChargeMoney) {
          this.setState(
            {
              fee: {
                // ...choose,
                ...fee,
                [name]: value,
              },
            },
            () => {
              this.setState({ money: this.getValue() });
            },
          );
        } else {
          this.props.onChangeSnackbar({
            status: true,
            message: 'Tiền đóng phí bảo trì không được lớn hơn tổng thu',
            variant: 'error',
          });
        }
      }
      if (name === 'paidGroundChargeMoney') {
        if (value <= this.state.fee.groundChargeMoney) {
          this.setState(
            {
              fee: {
                // ...choose,
                ...fee,
                [name]: value,
              },
            },
            () => {
              this.setState({ money: this.getValue() });
            },
          );
        } else {
          this.props.onChangeSnackbar({
            status: true,
            message: 'Tiền đóng phí mặt bằng không được lớn hơn tổng thu',
            variant: 'error',
          });
        }
      }
    }
  };
  onBlurPrev = (name, e, index) => {
    const { prevFee = [] } = this.state;
    this.setState({
      prevFee: prevFee.map((x, i) => {
        if ((index === i && x[name] == null) || x[name] === '') {
          x[name] = 0;
        }
        return x;
      }),
    });
  };
  handlePayPrevMoney = (name, e, index) => {
    const rex = /[0-9]/;
    const test = rex.test(this.convertToNumber(e.target.value));
    if (test === false && e.target.value !== '') return;
    const value = e.target.value === '' ? e.target.value : this.convertToNumber(e.target.value);
    const { prevFee = [] } = this.state;
    if (name === 'paidElectricityMoney') {
      if (value <= prevFee[index].prevElectricityMoney) {
        this.setState(
          {
            prevFee: prevFee.map((x, i) => {
              if (index === i) {
                x[name] = value;
              }
              return x;
            }),
          },
          () => {
            this.setState({ money: this.getValue() });
          },
        );
      } else {
        this.props.onChangeSnackbar({
          status: true,
          message: 'Tiền đóng phí điện không được lớn hơn tổng thu',
          variant: 'error',
        });
      }
    }

    if (name === 'paidWaterChargeMoney') {
      if (value <= prevFee[index].prevWaterChargeMoney) {
        this.setState(
          {
            prevFee: prevFee.map((x, i) => {
              if (index === i) {
                x[name] = value;
              }
              return x;
            }),
          },
          () => {
            this.setState({ money: this.getValue() });
          },
        );
      } else {
        this.props.onChangeSnackbar({
          status: true,
          message: 'Tiền đóng phí nước không được lớn hơn tổng thu',
          variant: 'error',
        });
      }
    }

    if (name === 'paidCarChargeMoney') {
      if (value <= prevFee[index].prevCarChargeMoney) {
        this.setState(
          {
            prevFee: prevFee.map((x, i) => {
              if (index === i) {
                x[name] = value;
              }
              return x;
            }),
          },
          () => {
            this.setState({ money: this.getValue() });
          },
        );
      } else {
        this.props.onChangeSnackbar({
          status: true,
          message: 'Tiền đóng phí xe không được lớn hơn tổng thu',
          variant: 'error',
        });
      }
    }

    if (name === 'paidServiceChargeMoney') {
      if (value <= prevFee[index].prevServiceChargeMoney) {
        this.setState(
          {
            prevFee: prevFee.map((x, i) => {
              if (index === i) {
                x[name] = value;
              }
              return x;
            }),
          },
          () => {
            this.setState({ money: this.getValue() });
          },
        );
      } else {
        this.props.onChangeSnackbar({
          status: true,
          message: 'Tiền đóng phí dịch vụ không được lớn hơn tổng thu',
          variant: 'error',
        });
      }
    }

    if (name === 'paidMaintenanceChargeMoney') {
      if (value <= prevFee[index].prevMaintenanceChargeMoney) {
        this.setState(
          {
            prevFee: prevFee.map((x, i) => {
              if (index === i) {
                x[name] = value;
              }
              return x;
            }),
          },
          () => {
            this.setState({ money: this.getValue() });
          },
        );
      } else {
        this.props.onChangeSnackbar({
          status: true,
          message: 'Tiền đóng phí bảo trì không được lớn hơn tổng thu',
          variant: 'error',
        });
      }
    }
    if (name === 'paidGroundChargeMoney') {
      if (value <= prevFee[index].prevGroundChargeMoney) {
        this.setState(
          {
            prevFee: prevFee.map((x, i) => {
              if (index === i) {
                x[name] = value;
              }
              return x;
            }),
          },
          () => {
            this.setState({ money: this.getValue() });
          },
        );
      } else {
        this.props.onChangeSnackbar({
          status: true,
          message: 'Tiền đóng phí mặt bằng không được lớn hơn tổng thu',
          variant: 'error',
        });
      }
    }
  };
  getValue() {
    const { fee } = this.state;

    // customerChoose = choose ? choose : '';
    let electricityMoney = 0;
    let waterChargeMoney = 0;
    let carChargeMoney = 0;
    let serviceChargeMoney = 0;
    let maintenanceChargeMoney = 0;
    let groundChargeMoney = 0;
    if (this.state.power) {
      electricityMoney = parseFloat(fee.paidElectricityMoney) || 0;
    }
    if (this.state.water) {
      waterChargeMoney = parseFloat(fee.paidWaterChargeMoney) || 0;
    }
    if (this.state.carFee) {
      carChargeMoney = parseFloat(fee.paidCarChargeMoney) || 0;
    }
    if (this.state.service) {
      serviceChargeMoney = parseFloat(fee.paidServiceChargeMoney) || 0;
    }
    if (this.state.maintenance) {
      maintenanceChargeMoney = parseFloat(fee.paidMaintenanceChargeMoney) || 0;
    }
    if (this.state.ground) {
      groundChargeMoney = parseFloat(fee.paidGroundChargeMoney) || 0;
    }
    return electricityMoney + waterChargeMoney + carChargeMoney + serviceChargeMoney + maintenanceChargeMoney + groundChargeMoney;
  }

  handleChangeMoney = e => {
    const { choose, moduleCode, localMessages, typeOfChoose } = this.state;
    if (typeOfChoose === 0) return;
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

    this.setState({ money: e.target.value });
    const messages = viewConfigHandleOnChange(moduleCode, localMessages, 'money', e.target.value);
    this.setState({
      localMessages: messages,
    });

    if (typeOfChoose === 0 && !Number.isNaN(this.getValue())) {
      if (e.target.value <= this.getValue()) {
        this.setState({ money: e.target.value });
      } else {
        this.props.onChangeSnackbar({
          status: true,
          message: 'Tiền đóng không được lớn hơn tổng thu',
          variant: 'error',
        });
        this.setState({ money: !e.target.value });
      }
    }
  };

  getMoney() {
    // const {reload} = this.state;
    // this.setState({reload: true})
    return this.state.money ? this.state.money : this.getValue();
  }
  getTotalRowMoney = (name, index) => {
    const { prevFee, fee, checked } = this.state;
    let totalPrevFee = 0;
    // Array.isArray(prevFee) && prevFee.length > 0 && prevFee.filter(f => !!f).map((x, i) => {
    //   if (checked[x.periodStr] && checked[x.periodStr][index] === true) {
    //     totalPrevFee += Number(x[name]);
    //   }
    // })
    // if (checked[fee.periodStr] && checked[fee.periodStr][index] === true) {
    //   totalPrevFee += Number(fee[name]);
    // }
    Array.isArray(prevFee) &&
      prevFee.length > 0 &&
      prevFee.filter(f => !!f).map((x, i) => {
        totalPrevFee += Number(x[name]);
      });
    totalPrevFee += Number(fee[name]);
    return totalPrevFee;
  };
  getTotalMoney = () => {
    let totalMoney = {};
    const paidKeys = [
      'paidElectricityMoney',
      'paidWaterChargeMoney',
      'paidCarChargeMoney',
      'paidServiceChargeMoney',
      'paidMaintenanceChargeMoney',
      'paidGroundChargeMoney',
    ];
    paidKeys.map((name, index) => {
      totalMoney[name] = this.getTotalRowMoney(name, index);
    });
    let total = 0;
    Object.keys(totalMoney).map(x => {
      total += totalMoney[x];
    });
    return Number(total);
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
          totalDebt: { $gt: 0 },
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
            const feeData = data.data.shift();
            console.log('feeData', feeData);
            let result = [];
            if (this.state.isEditPage) {
              result = data.data.map(item => ({
                _id: item._id,
                prevElectricityMoney: Math.round(Number(item.prevElectricityMoney || 0)),
                prevWaterChargeMoney: Math.round(Number(item.prevWaterChargeMoney || 0)),
                prevCarChargeMoney: Math.round(Number(item.prevCarChargeMoney || 0)),
                prevServiceChargeMoney: Math.round(Number(item.prevServiceChargeMoney || 0)),
                prevMaintenanceChargeMoney: Math.round(Number(item.prevMaintenanceChargeMoney || 0)),
                prevGroundChargeMoney: Math.round(Number(item.prevGroundChargeMoney || 0)),
                paidElectricityMoney: Math.round(Number(item.paidElectricityMoney || 0)),
                paidWaterChargeMoney: Math.round(Number(item.paidWaterChargeMoney || 0)),
                paidCarChargeMoney: Math.round(Number(item.paidCarChargeMoney || 0)),
                paidServiceChargeMoney: Math.round(Number(item.paidServiceChargeMoney || 0)),
                paidMaintenanceChargeMoney: Math.round(Number(item.paidMaintenanceChargeMoney || 0)),
                paidGroundChargeMoney: Math.round(Number(item.paidGroundChargeMoney || 0)),

                period: item.period,
                periodStr: item.periodStr,
                apartmentCode: item.apartmentCode,
              }));
            } else {
              result = data.data.map(item => ({
                _id: item._id,
                // old
                prevElectricityMoney: Math.round(Number(item.debtElectricityMoney) || 0),
                prevWaterChargeMoney: Math.round(Number(item.debtWaterChargeMoney) || 0),
                prevCarChargeMoney: Math.round(Number(item.debtCarChargeMoney) || 0),
                prevServiceChargeMoney: Math.round(Number(item.debtServiceChargeMoney) || 0),
                prevMaintenanceChargeMoney: Math.round(Number(item.debtMaintenanceChargeMoney) || 0),
                prevGroundChargeMoney: Math.round(Number(item.debtGroundChargeMoney) || 0),

                // new
                // debtElectricityMoney: Math.round(Number(item.debtElectricityMoney) || 0),
                // debtWaterChargeMoney: Math.round(Number(item.debtWaterChargeMoney) || 0),
                // debtCarChargeMoney: Math.round(Number(item.debtCarChargeMoney) || 0),
                // debtServiceChargeMoney: Math.round(Number(item.debtServiceChargeMoney) || 0),
                // debtMaintenanceChargeMoney: Math.round(Number(item.debtMaintenanceChargeMoney) || 0),
                // debtGroundChargeMoney: Math.round(Number(item.debtGroundChargeMoney) || 0),

                paidElectricityMoney: 0,
                paidWaterChargeMoney: 0,
                paidCarChargeMoney: 0,
                paidServiceChargeMoney: 0,
                paidMaintenanceChargeMoney: 0,
                paidGroundChargeMoney: 0,

                period: item.period,
                periodStr: item.periodStr,
                apartmentCode: item.apartmentCode,
              }));
            }
            const fee = this.state.isEditPage === false &&
              feeData &&
              feeData.periodStr && {
              paidElectricityMoney: 0,
              paidWaterChargeMoney: 0,
              paidCarChargeMoney: 0,
              paidServiceChargeMoney: 0,
              paidMaintenanceChargeMoney: 0,
              paidGroundChargeMoney: 0,
              // electricityMoney: Math.round(Number(feeData.debtElectricityMoney) || 0),
              // waterChargeMoney: Math.round(Number(feeData.debtWaterChargeMoney) || 0),
              // carChargeMoney: Math.round(Number(feeData.debtCarChargeMoney) || 0),
              // serviceChargeMoney: Math.round(Number(feeData.debtServiceChargeMoney) || 0),
              // maintenanceChargeMoney: Math.round(Number(feeData.debtMaintenanceChargeMoney) || 0),
              // groundChargeMoney: Math.round(Number(feeData.debtGroundChargeMoney) || 0),
              electricityMoney: Math.round(Number(feeData.debtElectricityMoney) || 0),
              waterChargeMoney: Math.round(Number(feeData.debtWaterChargeMoney) || 0),
              carChargeMoney: Math.round(Number(feeData.debtCarChargeMoney) || 0),
              serviceChargeMoney: Math.round(Number(feeData.debtServiceChargeMoney) || 0),
              maintenanceChargeMoney: Math.round(Number(feeData.debtMaintenanceChargeMoney) || 0),
              groundChargeMoney: Math.round(Number(feeData.debtGroundChargeMoney) || 0),
              periodStr: feeData.periodStr,
            };
            this.setState({ prevFee: result, fee: fee ? fee : false });
          }
        });
    }
    // if(this.state.choose && prevState.choose && this.state.choose.apartmentCode && prevState.choose.apartmentCode && prevState.choose.apartmentCode !== this.state.choose.apartmentCode){

    // //  this.setState({ choose: totalMoney });
    // //  console.log('totalMoney',totalMoney)

    // // console.log('totalSelect',totalSelect)

    //   console.log('thay doi aparment!');

    // }
    // if(this.state.typeOfChoose && prevState.typeOfChoose ) {
    //   console.log('thay doi tab')
    //   // this.setState({totalSelect})
    // }
    // if(prevState.choose.apartmentCode ) {
    //   // this.setState({totalSelect})
    // }
  }
  getLabelBy = key => {
    switch (key) {
      case 'electricityMoney':
        return 'Tiền điện';
      case 'waterChargeMoney':
        return 'Tiền nước';
      case 'serviceChargeMoney':
        return 'Tiền dịch vụ';
      case 'maintenanceChargeMoney':
        return 'Tiền bảo trì';
      case 'groundChargeMoney':
        return 'Tiền mặt bằng';
      case 'carChargeMoney':
        return 'Tiền xe';
      case 'prevWaterChargeMoney':
        return `Tiền nước  `;
      case 'prevServiceChargeMoney':
        return `Tiền dịch vụ `;
      case 'prevMaintenanceChargeMoney':
        return `Tiền bảo trì`;
      case 'prevGroundChargeMoney':
        return `Tiền mặt bằng`;
      case 'prevElectricityMoney':
        return `Tiền điện`;
      case 'prevCarChargeMoney':
        return `Tiền xe `;
      case 'paidWaterChargeMoney':
        return `Tiền đóng phí nước `;
      case 'paidServiceChargeMoney':
        return `Tiền đóng phí dịch vụ `;
      case 'paidMaintenanceChargeMoney':
        return `Tiền đóng phí bảo trì `;
      case 'paidGroundChargeMoney':
        return `Tiền đóng phí mặt bằng`;
      case 'paidElectricityMoney':
        return `Tiền đóng phí điện`;
      case 'paidCarChargeMoney':
        return `Tiền đóng phí xe `;
    }
  };
  handleCheckedPrevFee = (status, periodStr, index, nameCheck) => {
    const { checked, prevFee, fee } = this.state;
    checked[periodStr] = (Array.isArray(checked[periodStr]) && checked[periodStr].length > 0 && checked[periodStr]) || [];
    checked[periodStr][index] = status;
    const paidKeys = [
      'paidElectricityMoney',
      'paidWaterChargeMoney',
      'paidCarChargeMoney',
      'paidServiceChargeMoney',
      'paidMaintenanceChargeMoney',
      'paidGroundChargeMoney',
    ];
    const prevKeys = [
      'prevElectricityMoney',
      'prevWaterChargeMoney',
      'prevCarChargeMoney',
      'prevServiceChargeMoney',
      'prevMaintenanceChargeMoney',
      'prevGroundChargeMoney',
    ];

    // const prevKeys = [
    //   'debtElectricityMoney',
    //   'debtWaterChargeMoney',
    //   'debtCarChargeMoney',
    //   'debtServiceChargeMoney',
    //   'debtMaintenanceChargeMoney',
    //   'debtGroundChargeMoney',
    // ];

    const moneyKeys = ['electricityMoney', 'waterChargeMoney', 'carChargeMoney', 'serviceChargeMoney', 'maintenanceChargeMoney', 'groundChargeMoney'];

    let newPrevFee = [];
    let newFee = {};
    if (nameCheck === 'showMoney') {
      const arrayPeriodStr =
        Array.isArray(prevFee) &&
        prevFee
          .map(x => ({
            periodStr: x.periodStr,
          }))
          .concat([{ periodStr: fee && fee.periodStr }]);
      arrayPeriodStr.forEach((item, i) => {
        const periodStrItem = item.periodStr;
        checked[periodStrItem] = (Array.isArray(checked[periodStrItem]) && checked[periodStrItem].length > 0 && checked[periodStrItem]) || [];
        paidKeys.forEach((x, i) => {
          checked[periodStrItem][i] = status;
        });
      });
      const { totalCheck } = this.state;
      paidKeys.map((x, i) => {
        totalCheck[i] = status;
      });
      this.setState({ totalCheck });
    }

    if (status === true) {
      if (nameCheck === 'showMoney') {
        newPrevFee = prevFee.map(item => {
          const items = { ...item };
          paidKeys.map((x, i) => {
            items[x] = item[prevKeys[i]];
          });
          return items;
        });
        // })
        newFee = fee;
        paidKeys.forEach((x, i) => {
          newFee[x] = fee[moneyKeys[i]];
        });
      } else {
        newFee = nameCheck === 'checkRow' || periodStr === fee.periodStr ? { ...fee, [paidKeys[index]]: (fee && fee[moneyKeys[index]]) || 0 } : fee;
        newPrevFee = prevFee.map(item => {
          if (item.periodStr === periodStr) {
            item[paidKeys[index]] = item[prevKeys[index]];
          }
          return item;
        });
      }
    } else {
      if (nameCheck === 'showMoney') {
        newPrevFee = prevFee.map(item => {
          paidKeys.forEach((x, i) => {
            item[x] = 0;
          });
          return item;
        });
        newFee = fee;
        paidKeys.forEach((x, i) => {
          newFee[x] = 0;
        });
      } else {
        newFee = nameCheck === 'checkRow' || periodStr === fee.periodStr ? { ...fee, [paidKeys[index]]: 0 } : fee;
        newPrevFee = prevFee.map(item => {
          if (item.periodStr === periodStr) {
            item[paidKeys[index]] = 0;
          }
          return item;
        });
      }
    }
    this.setState({
      checked: checked,
      prevFee: newPrevFee,
      fee: newFee,
    });
  };
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
  // check tính giai đoạn thanh toán
  handleCheckPaymentRequest = (e, i) => {
    const event = e.target.checked;
    const { paymentRequest } = this.state;
    if (event) {
      paymentRequest[i].paidAmount = paymentRequest[i].amount;
      const total = paymentRequest.reduce((total, item) => total + item.paidAmount, 0);
      this.setState({ paymentRequest, paidCustomer: total });
    } else {
      paymentRequest[i].paidAmount = 0;
      this.setState({ paymentRequest, paidCustomer: 0 });
    }
  };
  // check tính truy thu
  handleCheckArrears = (e, i) => {
    const event = e.target.checked;
    const { arrears } = this.state;
    if (event) {
      arrears[i].arrearsPaidAmount = arrears[i].arrearsAmount;
      const total = arrears.reduce((total, item) => total + item.arrearsPaidAmount, 0);
      this.setState({ arrears, paidCustomer: total });
    } else {
      arrears[i].arrearsPaidAmount = 0;
      this.setState({ arrears, paidCustomer: 0 });
    }
  };
  //check tính cọc
  handleCheckDeposit = (e, i) => {
    const event = e.target.checked;
    const { deposit } = this.state;
    if (event) {
      deposit[i].depositPaidAmount = deposit[i].depositAmount;
      const total = deposit.reduce((total, item) => total + item.depositPaidAmount, 0);
      this.setState({ deposit, paidCustomer: total });
    } else {
      deposit[i].depositPaidAmount = 0;
      this.setState({ deposit, paidCustomer: 0 });
    }
  };
  // check nhập tài khoản khách hàng
  handleCheckMoneyInCustomerAccount = e => {
    const event = e.target.checked;
    const newPaidCustomer = this.getTotalMoney() - this.state.moneyInCustomerAccount;
    if (event) {
      this.setState({
        checkMoneyInCustomerAccount: false,
        paidCustomer: newPaidCustomer < 0 ? 0 : newPaidCustomer,
      });
    } else {
      this.setState({ checkMoneyInCustomerAccount: true, paidCustomer: this.getTotalMoney() });
    }
  };

  render() {
    const id = this.props.match.params.id;
    const { classes, addRevenueAndExpenditurePage, intl, totalRowMoney } = this.props;
    const { recordSelected } = addRevenueAndExpenditurePage;
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
      amountReceivables,
      paidCustomer,
    } = this.state;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    const paidKeys = [
      'paidElectricityMoney',
      'paidWaterChargeMoney',
      'paidCarChargeMoney',
      'paidServiceChargeMoney',
      'paidMaintenanceChargeMoney',
      'paidGroundChargeMoney',
    ];
    const prevKeys = [
      'prevElectricityMoney',
      'prevWaterChargeMoney',
      'prevCarChargeMoney',
      'prevServiceChargeMoney',
      'prevMaintenanceChargeMoney',
      'prevGroundChargeMoney',
    ];

    // const prevKeys = [
    //   'debtElectricityMoney',
    //   'debtWaterChargeMoney',
    //   'debtCarChargeMoney',
    //   'debtServiceChargeMoney',
    //   'debtMaintenanceChargeMoney',
    //   'debtGroundChargeMoney',
    // ];
    const moneyKeys = ['electricityMoney', 'waterChargeMoney', 'carChargeMoney', 'serviceChargeMoney', 'maintenanceChargeMoney', 'groundChargeMoney'];
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
                  ? `${intl.formatMessage(
                    messages.themmoi || {
                      id: 'themmoi',
                      defaultMessage: 'Thêm mới tài chính nội bộ',
                    },
                  )}`
                  : `${intl.formatMessage(
                    messages.chinhsua || {
                      id: 'chinhsua',
                      defaultMessage: 'cập nhật tài chính nội bộ',
                    },
                  )}`
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
                  disabled={addStock !== 'add'}
                >
                  <MenuItem value={0}>Thu</MenuItem>
                  {this.state.typeOfChoose === 4 ? '' : <MenuItem value={1}>Chi</MenuItem>}
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
                  value={this.state.typeOfChoose}
                  onChange={this.handleChange}
                  disabled={addStock !== 'add'}
                >
                  <MenuItem value={0}>Thông báo phí</MenuItem>
                  <MenuItem value={1}>Hợp Đồng</MenuItem>
                  <MenuItem value={4}>Truy Thu</MenuItem>
                  {isEditPage === true && this.state.typeOfChoose === 3 && <MenuItem value={3}>Hoàn Tiền Chuyển Nhầm</MenuItem>}
                  {isEditPage === true && this.state.typeOfChoose === 6 && <MenuItem value={6}>Thu hồi</MenuItem>}
                </CustomInputBase>
              </Grid>
              <Grid item md={6}>
                <Typography
                  style={{
                    color: 'grey',
                    margin: '-22px 0 22px 0',
                  }}
                >
                  {this.state.typeOfChoose === 0 ? 'Thông báo phí' : 'Hợp đồng'}
                </Typography>
                {this.state.typeOfChoose === 0 ? (
                  <Grid item md={12} style={{ marginTop: '-22px' }}>
                    <AsyncAutocomplete
                      url={API_FEE}
                      customOptionLabel={this.customFee}
                      filters={['apartmentCode', 'code']}
                      value={this.state.choose}
                      className={this.props.classes.reactSelect1}
                      placeholder="Tìm kiếm ..."
                      loadingMessage={() => 'Đang tải ...'}
                      // components={{ Option, SingleValue }}
                      onChange={this.handleAddSale}
                      isDisabled={addStock !== 'add'}
                    // loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, api)}
                    />
                  </Grid>
                ) : (
                  ''
                )}
                {this.state.typeOfChoose === 0 ? null : (
                  <Grid item md={12} style={{ marginTop: '-13px' }}>
                    {this.loadFindOption()}
                  </Grid>
                )}
              </Grid>

              <React.Fragment>
                <Grid item md={12}>
                  {this.state.typeOfChoose === 0 || this.state.typeOfChoose === 3 ? (
                    <div>
                      {this.state.customerInfo && this.state.customerInfo.name ? (
                        <>
                          <Typography variant="h5" gutterBottom component="div" style={{ display: 'block' }}>
                            {/* Check 11 */}
                            Thông tin khách hàng
                          </Typography>
                          <Grid container spacing={8} md={12}>
                            <Grid item md={6}>
                              <CustomInputBase label="Tên khách hàng" value={this.state.customerInfo.name} />
                            </Grid>
                            <Grid item md={6}>
                              <CustomInputBase label="Số điện thoại" value={this.state.customerInfo.phoneNumber} />
                            </Grid>
                            <Grid item md={6}>
                              <CustomInputBase label="Email" value={this.state.customerInfo.email} />
                            </Grid>
                            <Grid item md={6}>
                              <CustomInputBase
                                // label="Ngân hàng"
                                label="CMND/CCCD"
                                // value={`${this.state.customerInfo.bank || ''} ${this.state.customerInfo.bankAccountNumber || ''}`}
                                value={this.state.customerInfo.idetityCardNumber || ''}
                                disabled
                              />
                            </Grid>
                            {/* <Grid item md={12}>
                              <FormControlLabel
                                control={<Checkbox checked={this.state.showMoney} value="showMoney" onChange={this.handleCheckbox('showMoney')} />}
                                label="Hiển thị tất cả số tiền phải đóng"
                              />
                            </Grid> */}
                          </Grid>
                        </>
                      ) : null}
                      <Grid item md={12}>
                        <FormControlLabel
                          control={<Checkbox checked={this.state.showMoney} value="showMoney" onChange={this.handleCheckbox('showMoney')} />}
                          label="Hiển thị tất cả số tiền phải đóng"
                        />
                      </Grid>
                      {/* Map */}
                      {/* Thong bao phi */}
                      <Grid container spacing={8}>
                        <Grid item container spacing={8} md={7}>
                          <div style={{ width: 900, display: 'flex', overflowX: 'auto' }}>
                            {Array.isArray(prevFee) && prevFee.length > 0
                              ? prevFee.map((fee, prevFeeIndex) => (
                                <Grid
                                  item
                                  container
                                  md={12}
                                  style={{
                                    border: '1px solid gray',
                                    borderRight: `${prevFeeIndex === prevFee.length - 1 ? '' : '0'}`,
                                    minWidth: 400,
                                  }}
                                  key={prevFeeIndex}
                                >
                                  <Grid item md={12}>
                                    <Typography align="center">{`Tháng ${moment(fee && fee.periodStr, 'YYYY-MM').format('MM')}`}</Typography>
                                    <hr style={{ border: '0.2px solid gray' }} />
                                  </Grid>
                                  <Grid container md={12} spacing={8}>
                                    <Grid item md={6} style={{ paddingLeft: 10 }}>
                                      {Array.isArray(prevKeys) &&
                                        prevKeys.map((key, indexKey) => (
                                          <Grid item md={12} key={indexKey}>
                                            <CustomInputBase
                                              disabled
                                              label={key && fee && fee.periodStr && this.getLabelBy(key)}
                                              value={
                                                fee &&
                                                !isNaN(fee[key]) &&
                                                Number(fee[key]).toLocaleString('es-AR', {
                                                  maximumFractionDigits: 0,
                                                })
                                              }
                                            />
                                          </Grid>
                                        ))}
                                    </Grid>
                                    <Grid item md={6}>
                                      {Array.isArray(paidKeys) &&
                                        paidKeys.map((key, indexKey) => (
                                          <Grid item container md={12} key={indexKey} align="center">
                                            <Grid item md={10}>
                                              <CustomInputBase
                                                label={key && fee && fee.periodStr && this.getLabelBy(key)}
                                                // type="number"
                                                name={key}
                                                // value={fee && fee[key].toLocaleString("es-AR", {maximumFractionDigits: 0 })}
                                                value={fee && fee[key]}
                                                InputProps={{
                                                  inputComponent: NumberFormatCustom,
                                                }}
                                                onChange={e => this.handlePayPrevMoney(key, e, prevFeeIndex)}
                                                onBlur={e => this.onBlurPrev(key, e, prevFeeIndex)}
                                                disabled={
                                                  !this.state.checked[fee && fee.periodStr] || !this.state.checked[fee && fee.periodStr][indexKey]
                                                }
                                              />
                                            </Grid>
                                            <Grid item md={2} style={{ margin: 'auto 0 auto -4px' }}>
                                              <FormControlLabel
                                                // label="Đóng tiền"
                                                style={{ margin: 0 }}
                                                control={
                                                  <Checkbox
                                                    checked={
                                                      this.state.checked[fee && fee.periodStr] && this.state.checked[fee && fee.periodStr][indexKey]
                                                        ? true
                                                        : false
                                                    }
                                                    onChange={event =>
                                                      this.handleCheckedPrevFee(event.target.checked, fee && fee.periodStr, indexKey, null)
                                                    }
                                                  />
                                                }
                                              />
                                            </Grid>
                                          </Grid>
                                        ))}
                                    </Grid>
                                  </Grid>
                                </Grid>
                              ))
                              : ''}
                          </div>
                        </Grid>
                        <Grid item container spacing={8} md={5}>
                          {fee && fee.periodStr ? (
                            <>
                              <Grid item container md={7} style={{ border: '1px solid gray', borderRight: '0' }}>
                                <Grid item md={12} align="center">
                                  <Typography align="center">{`Tháng ${moment(fee.periodStr, 'YYYY-MM').format('MM')}`}</Typography>
                                  <hr style={{ border: '0.2px solid gray' }} />
                                </Grid>
                                <Grid container md={12} spacing={8}>
                                  <Grid item md={6}>
                                    {moneyKeys.map((key, indexKey) => (
                                      <Grid item md={12} key={indexKey}>
                                        <CustomInputBase
                                          disabled
                                          label={key && fee && fee.periodStr && this.getLabelBy(key)}
                                          value={
                                            fee &&
                                            !isNaN(fee[key]) &&
                                            Number(fee[key]).toLocaleString('es-AR', {
                                              maximumFractionDigits: 0,
                                            })
                                          }
                                        />
                                      </Grid>
                                    ))}
                                  </Grid>
                                  <Grid item md={6}>
                                    {paidKeys.map((key, indexKey) => (
                                      <Grid item container md={12} key={indexKey} spacing={4}>
                                        <Grid item md={10} key={indexKey}>
                                          <CustomInputBase
                                            label={key && fee && fee.periodStr && this.getLabelBy(key)}
                                            // type="number"
                                            name={key}
                                            // value={fee && fee[key].toLocaleString("es-AR", {maximumFractionDigits: 0 })}
                                            value={fee && fee[key]}
                                            onChange={e => this.handlePayMoney(key, e, this.state.isEditPage)}
                                            onBlur={e => this.onBlurFee(key, e, this.state.isEditPage)}
                                            disabled={!this.state.checked[fee.periodStr] || !this.state.checked[fee.periodStr][indexKey]}
                                            InputProps={{
                                              inputComponent: NumberFormatCustom,
                                            }}
                                          />
                                        </Grid>
                                        <Grid item md={2} style={{ textAlign: 'right', margin: 'auto 0' }}>
                                          <FormControlLabel
                                            // label="Đóng tiền"
                                            style={{ marginLeft: '-4px' }}
                                            control={
                                              <Checkbox
                                                checked={
                                                  this.state.checked[fee.periodStr] && this.state.checked[fee.periodStr][indexKey] ? true : false
                                                }
                                                onChange={event =>
                                                  this.handleCheckedPrevFee(event.target.checked, fee && fee.periodStr, indexKey, null)
                                                }
                                              />
                                            }
                                          />
                                        </Grid>
                                      </Grid>
                                    ))}
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item container md={5} style={{ border: '1px solid gray' }}>
                                <Grid item md={12} align="center">
                                  <Typography align="center">Tổng tiền</Typography>
                                  <hr style={{ border: '0.1px solid gray' }} />
                                </Grid>
                                {Array.isArray(paidKeys) &&
                                  paidKeys.map((x, i) => (
                                    <Grid item container md={12} spacing={8}>
                                      <Grid item md={10}>
                                        <CustomInputBase
                                          disabled
                                          label={'Tổng tiền'}
                                          value={this.getTotalRowMoney(x, i).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                        />
                                      </Grid>
                                      <Grid item md={2} style={{ textAlign: 'right', margin: 'auto 0 ' }}>
                                        <FormControlLabel
                                          // label="Đóng tiền"
                                          control={
                                            <Checkbox
                                              checked={this.state.totalCheck && this.state.totalCheck[i] ? true : false}
                                              onChange={event => this.handleCheckTotal(i, event.target.checked)}
                                            />
                                          }
                                        />
                                      </Grid>
                                    </Grid>
                                  ))}
                              </Grid>
                            </>
                          ) : (
                            ''
                          )}
                        </Grid>
                      </Grid>
                    </div>
                  ) : null}
                </Grid>
              </React.Fragment>

              {this.state.valueOfPrevTab !== 0 && this.state.typeOfChoose === 6 ? (
                <React.Fragment>
                  <Grid item md={6}>
                    <CustomInputBase
                      // label="Tổng tiền"
                      // label={name2Title.total}
                      label={name2Title && name2Title.total ? name2Title.tota : 'Tổng tiền'}
                      name="total"
                      onChange={this.handleChange}
                      value={this.state.choose !== null ? this.state.choose.total : this.state.total}
                      multiline
                      error={localMessages && localMessages.total}
                      helperText={localMessages && localMessages.total}
                      required={checkRequired.total}
                      checkedShowForm={checkShowForm.total}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <CustomInputBase
                      // label="Tên khách hàng"
                      label={name2Title.customer}
                      onChange={this.handleChange}
                      name="customer"
                      value={this.state.choose !== null ? this.state.choose.customer : this.state.customer}
                      error={localMessages && localMessages.customer}
                      helperText={localMessages && localMessages.customer}
                      required={checkRequired.customer}
                      checkedShowForm={checkShowForm.customer}
                    />
                  </Grid>
                </React.Fragment>
              ) : (
                ''
              )}
              {console.log('typeOfChoose', this.state.typeOfChoose, this.state.typeOfDeposit, this.state.customerInfo, this.state.typeOfRecord)}
              {this.state.typeOfChoose === 1 ? (
                <Grid item md={6}>
                  <CustomInputBase
                    label="Loại phiếu thu chi "
                    name="typeOfDeposit"
                    select
                    value={this.state.typeOfDeposit}
                    onChange={this.handleChange}
                  >
                    <MenuItem value={0}>Cọc</MenuItem>
                    <MenuItem value={1}>Giai Đoạn Thanh Toán</MenuItem>
                  </CustomInputBase>
                </Grid>
              ) : (
                ''
              )}

              {this.state.typeOfChoose !== 0 && this.state.typeOfChoose !== 3 ? (
                <Grid item md={12}>
                  {this.state.customerInfo && this.state.customerInfo.name ? (
                    <>
                      <Typography variant="h5" gutterBottom component="div" style={{ display: 'block' }}>
                        {/* Check 11 */}
                        Thông tin khách hàng
                      </Typography>
                      <Grid container spacing={8} md={12}>
                        <Grid item md={6}>
                          <CustomInputBase label="Tên khách hàng" value={this.state.customerInfo.name} />
                        </Grid>
                        <Grid item md={6}>
                          <CustomInputBase label="Số điện thoại" value={this.state.customerInfo.phoneNumber} />
                        </Grid>
                        <Grid item md={6}>
                          <CustomInputBase label="Email" value={this.state.customerInfo.email} />
                        </Grid>
                        <Grid item md={6}>
                          <CustomInputBase
                            // label="Ngân hàng"
                            label="CMND/CCCD"
                            // value={`${this.state.customerInfo.bank || ''} ${this.state.customerInfo.bankAccountNumber || ''}`}
                            value={this.state.customerInfo.idetityCardNumber || ''}
                            disabled
                          />
                        </Grid>
                        {/* <Grid item md={12}>
                              <FormControlLabel
                                control={<Checkbox checked={this.state.showMoney} value="showMoney" onChange={this.handleCheckbox('showMoney')} />}
                                label="Hiển thị tất cả số tiền phải đóng"
                              />
                            </Grid> */}
                      </Grid>
                    </>
                  ) : null}
                </Grid>
              ) : (
                ''
              )}
              {this.state.valueOfPrevTab !== 0 &&
                this.state.typeOfChoose === 1 &&
                this.state.typeOfDeposit === 1 &&
                this.state.listChild &&
                this.state.listChild.length > 0 &&
                this.state.listChild[0] !== null ? (
                <Grid item md={12}>
                  <Typography variant="h5" gutterBottom component="div" style={{ display: 'block' }}>
                    {/* Check 11 */}
                    Giai đoạn thanh toán
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Giai đoạn</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Ngày thanh toán</TableCell>
                        <TableCell>Tổng tiền</TableCell>
                        <TableCell>Đơn vị</TableCell>
                        {/* <TableCell>VAT</TableCell> */}
                        <TableCell>Số tiền thanh toán</TableCell>
                        <TableCell>Chọn</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.paymentRequest.map((item, i) => (
                        <TableRow>
                          <TableCell>{item ? item.name : ''}</TableCell>
                          <TableCell>
                            {item
                              ? item.statusPay === 0
                                ? `${intl.formatMessage(
                                  messages.ycttChuaNghiemThu || {
                                    id: 'ycttChuaNghiemThu',
                                    defaultMessage: 'Chưa nghiệm thu',
                                  },
                                )}`
                                : item.statusPay === 1
                                  ? `${intl.formatMessage(
                                    messages.ycttDaThanhLy || {
                                      id: 'ycttDaThanhLy',
                                      defaultMessage: 'Đã thanh lý',
                                    },
                                  )}`
                                  : item.statusPay === 2
                                    ? `${intl.formatMessage(
                                      messages.ycttDenNghiThanhToan || {
                                        id: 'ycttDenNghiThanhToan',
                                        defaultMessage: 'Đề nghị thanh toán',
                                      },
                                    )}`
                                    : `${intl.formatMessage(
                                      messages.ycttDaNghiemThu || {
                                        id: 'ycttDaNghiemThu',
                                        defaultMessage: 'Đã nghiệm thu',
                                      },
                                    )}`
                              : ''}
                          </TableCell>
                          <TableCell>{item ? moment(item.timePay).format('YYYY-MM-DD') : ''}</TableCell>
                          <TableCell>{item ? item.amount : ''}</TableCell>
                          <TableCell>{item ? item.currency : ''}</TableCell>
                          {/* <TableCell>{item ? (item.VAT === false ? 'Không' : 'Có') : ''}</TableCell> */}
                          <TableCell>
                            <Input
                              name="paidAmount"
                              defaultValue={item.paidAmount}
                              // onChange={e => this.handleChangeInput(e, i)}
                              value={item.paidAmount}
                              disabled={true}
                              disableUnderline
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox style={{ paddingLeft: 0 }} onChange={e => this.handleCheckPaymentRequest(e, i)} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              ) : (
                ''
              )}

              {this.state.valueOfPrevTab !== 0 &&
                this.state.typeOfChoose === 1 &&
                this.state.typeOfDeposit === 0 &&
                this.state.listChild &&
                this.state.listChild.length > 0 &&
                this.state.deposit &&
                this.state.deposit[0] &&
                // this.state.deposit[0].depositStatus !== 2 &&
                this.state.listChild[0] !== null ? (
                <Grid item md={12}>
                  <Typography variant="h5" gutterBottom component="div" style={{ display: 'block' }}>
                    {/* Check 11 */}
                    {this.state.typeOfRecord === 0 ? 'Đặt cọc' : 'Hoàn cọc'}
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên khoản cọc</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Ngày đặt cọc</TableCell>
                        <TableCell>Số tiền</TableCell>
                        <TableCell>Đơn vị</TableCell>
                        <TableCell>Số tiền thanh toán</TableCell>
                        <TableCell>Chọn</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.deposit.map((item, i) => (
                        <TableRow>
                          <TableCell>{item ? item.depositName : ''}</TableCell>
                          <TableCell>
                            {item
                              ? item.depositStatus === 0
                                ? 'Chưa thanh toán'
                                : item.depositStatus === 1
                                  ? 'Hoàn cọc'
                                  : item.depositStatus === 2
                                    ? 'Đã thanh toán'
                                    : ''
                              : ''}
                          </TableCell>
                          <TableCell>{item ? moment(item.depositDate).format('YYYY-MM-DD') : ''}</TableCell>
                          <TableCell>
                            {item
                              ? item.depositAmount.toLocaleString('es-AR', {
                                maximumFractionDigits: 0,
                              })
                              : ''}
                          </TableCell>
                          <TableCell>{item ? item.depositUnit : ''}</TableCell>
                          <TableCell>
                            <Input
                              name="depositPaidAmount"
                              defaultValue={item.depositPaidAmount}
                              onChange={e => this.handleChangeInput(e, i)}
                              disabled={true}
                              value={item.depositPaidAmount}
                              disableUnderline
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox disabled={item.depositStatus === 2} style={{ paddingLeft: 0 }} onChange={e => this.handleCheckDeposit(e, i)} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              ) : (
                ''
              )}
              {this.state.valueOfPrevTab !== 0 &&
                this.state.typeOfChoose === 4 &&
                this.state.listChild &&
                this.state.listChild.length > 0 &&
                this.state.listChild[0] !== null ? (
                <Grid item md={12}>
                  <Typography variant="h5" gutterBottom component="div" style={{ display: 'block' }}>
                    {/* Check 11 */}
                    TRUY THU
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên khoản truy thu</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Ngày tạo</TableCell>
                        <TableCell>Số tiền</TableCell>
                        <TableCell>Đơn vị</TableCell>
                        {/* <TableCell>VAT</TableCell> */}
                        <TableCell>Số tiền thanh toán</TableCell>
                        <TableCell>Chọn</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.arrears.map((item, i) => (
                        <TableRow>
                          <TableCell>{item ? item.arrearsName : ''}</TableCell>
                          <TableCell>
                            {item ? (item.arrearsStatus === 0 ? 'Chưa thanh toán' : item.arrearsStatus === 1 ? 'Đã thanh toán' : '') : ''}
                          </TableCell>
                          <TableCell>{item ? moment(item.arrearsDate).format('YYYY-MM-DD') : ''}</TableCell>
                          <TableCell>{item ? item.arrearsAmount : ''}</TableCell>
                          <TableCell>{item ? item.arrearsUnit : ''}</TableCell>
                          {/* <TableCell>{item ? (item.vat === false ? 'Không' : 'Có') : ''}</TableCell> */}
                          <TableCell>
                            <Input
                              name="arrearsPaidAmount"
                              defaultValue={item.arrearsPaidAmount}
                              onChange={e => this.handleChangeInput(e, i)}
                              disabled={true}
                              value={item.arrearsPaidAmount}
                              disableUnderline
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox style={{ paddingLeft: 0 }} onChange={e => this.handleCheckArrears(e, i)} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              ) : (
                ''
              )}
              <Grid item md={6}>
                <CustomInputBase
                  // label={getLabelName('createDate', 'RevenueExpenditure')}
                  label={name2Title.createDate}
                  type="date"
                  onChange={this.handleChange}
                  name="date"
                  value={this.state.date}
                  error={localMessages && localMessages.createDate}
                  helperText={localMessages && localMessages.createDate}
                  required={checkRequired.createDate}
                  checkedShowForm={checkShowForm.createDate}
                />
              </Grid>
              <Grid item md={6}>
                {/* thông báo phí */}
                {this.state.typeOfChoose === 0 ? (
                  <CustomInputBase
                    label="Tổng tiền thanh toán"
                    name="money"
                    disabled={this.state.typeOfChoose === 0}
                    value={
                      Object.keys(this.state.checked).length > 0
                        ? this.getTotalMoney().toLocaleString('es-AR', { maximumFractionDigits: 0 })
                        : Number(this.state.totalPaid).toLocaleString('es-AR', {
                          maximumFractionDigits: 0,
                        })
                    }
                  />
                ) : (
                  ''
                )}
                {/* cọc */}
                {this.state.typeOfDeposit === 0 && this.state.typeOfChoose === 1 ? (
                  <CustomInputBase
                    label="Tổng tiền thanh toán"
                    name="money"
                    disabled={this.state.typeOfDeposit === 0}
                    value={this.state.deposit ? this.state.deposit.reduce((total, item) => total + item.depositPaidAmount, 0) : 0}
                  />
                ) : (
                  ''
                )}
                {/* giai đoạn thanh toán */}
                {this.state.typeOfDeposit === 1 && this.state.typeOfChoose === 1 ? (
                  <CustomInputBase
                    label="Tổng tiền thanh toán"
                    name="money"
                    disabled={this.state.typeOfChoose !== 0}
                    value={this.state.paymentRequest ? this.state.paymentRequest.reduce((total, item) => total + item.paidAmount, 0) : 0}
                    // onChange={this.handleChangeMoney}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    error={localMessages && localMessages.amount}
                    helperText={localMessages && localMessages.amount}
                    required={checkRequired.amount}
                  />
                ) : (
                  ''
                )}
                {/* hoàn tiền chuyển nhầm */}
                {this.state.typeOfChoose === 3 ? (
                  <CustomInputBase label="Tổng tiền thanh toán" name="money" disabled={this.state.typeOfChoose === 3} value={0} />
                ) : (
                  ''
                )}
                {/* truy thu */}
                {this.state.typeOfChoose === 4 ? (
                  <CustomInputBase
                    label="Tổng tiền thanh toán"
                    name="money"
                    disabled={this.state.typeOfChoose === 4}
                    value={this.state.arrears ? this.state.arrears.reduce((total, item) => total + item.arrearsPaidAmount, 0) : 0}
                  />
                ) : (
                  ''
                )}
              </Grid>

              <Grid item md={6}>
                {/* cọc */}
                {this.state.typeOfChoose === 1 && this.state.typeOfDeposit === 0 ? (
                  <CustomInputBase
                    label={'Số tiền phải thu'}
                    name="amountReceivables"
                    disabled={this.state.typeOfDeposit === 0}
                    value={
                      this.state.amountReceivables && this.state.deposit && this.state.deposit[0] && this.state.deposit[0].depositStatus !== 2
                        ? this.state.amountReceivables.toLocaleString('es-AR', {
                          maximumFractionDigits: 0,
                        })
                        : 0
                    }
                  />
                ) : (
                  ''
                )}
                {/* yêu cầu thanh toán */}
                {this.state.typeOfDeposit === 1 && this.state.typeOfChoose === 1 ? (
                  <CustomInputBase
                    label={'Số tiền phải thu'}
                    name="amountReceivables"
                    disabled={this.state.typeOfDeposit === 1}
                    value={
                      this.state.amountReceivables
                        ? this.state.amountReceivables.toLocaleString('es-AR', {
                          maximumFractionDigits: 0,
                        })
                        : 0
                    }
                  />
                ) : (
                  ''
                )}
                {/* hoàn tiền chuyển nhầm */}
                {this.state.typeOfChoose === 3 ? (
                  <CustomInputBase label={'Số tiền phải thu'} name="amountReceivables" disabled={this.state.typeOfChoose === 3} value={0} />
                ) : (
                  ''
                )}
                {/* truy thu */}
                {this.state.typeOfChoose === 4 ? (
                  <CustomInputBase
                    label={'Số tiền phải thu'}
                    name="amountReceivables"
                    disabled={this.state.typeOfChoose === 4}
                    value={
                      this.state.amountReceivables
                        ? this.state.amountReceivables.toLocaleString('es-AR', {
                          maximumFractionDigits: 0,
                        })
                        : 0
                    }
                  />
                ) : (
                  ''
                )}
                {/* thông báo phí */}
                {this.state.typeOfChoose === 0 ? (
                  <CustomInputBase
                    label={'Số tiền phải thu'}
                    name="amountReceivables"
                    disabled={this.state.typeOfChoose === 0}
                    value={
                      this.state.amountReceivables
                        ? this.state.amountReceivables.toLocaleString('es-AR', {
                          maximumFractionDigits: 0,
                        })
                        : 0
                    }
                  />
                ) : (
                  ''
                )}
              </Grid>
              {this.state.typeOfChoose === 0 || this.state.typeOfChoose === 3 ? (
                <Grid item md={6}>
                  {/* thông báo phí */}
                  {this.state.typeOfChoose === 0 ? (
                    <CustomInputBase
                      label={'Số tiền khách trả'}
                      name="paidCustomer"
                      // disabled={this.state.typeOfChoose === 0}
                      value={this.state.paidCustomer}
                      onChange={e => this.handleChangePaidCustomer(e)}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                    />
                  ) : (
                    ''
                  )}

                  {/* hoàn tiền chuyển nhầm */}
                  {this.state.typeOfChoose === 3 ? (
                    <CustomInputBase
                      label={'Số tiền khách trả'}
                      name="paidCustomer"
                      // disabled={this.state.typeOfChoose === 0}
                      value={this.state.paidCustomer}
                      onChange={e => this.handleChangePaidCustomer(e)}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                    />
                  ) : (
                    ''
                  )}
                </Grid>
              ) : (
                ''
              )}
              {this.state.typeOfChoose === 0 || this.state.typeOfChoose === 3 ? (
                <Grid item md={6}>
                  {/* thông báo phí */}
                  {this.state.typeOfChoose === 0 ? (
                    <CustomInputBase
                      // label={getLabelName('amount', 'RevenueExpenditure')}
                      label="Số tiền còn lại"
                      name="money"
                      disabled={this.state.typeOfChoose === 0}
                      value={
                        Object.keys(this.state.checked).length > 0
                          ? (this.state.totalMoney - this.getTotalMoney()).toLocaleString('es-AR', {
                            maximumFractionDigits: 0,
                          })
                          : Number(this.state.debt).toLocaleString('es-AR', {
                            maximumFractionDigits: 0,
                          })
                      }
                    />
                  ) : (
                    ''
                  )}
                  {/* hoàn tiền chuyển nhầm */}
                  {this.state.typeOfChoose === 3 ? (
                    <CustomInputBase
                      // label={getLabelName('amount', 'RevenueExpenditure')}
                      label="Số tiền còn lại"
                      name="money"
                      disabled={this.state.typeOfChoose === 0}
                      value={
                        Object.keys(this.state.checked).length > 0
                          ? (this.state.totalMoney - this.getTotalMoney()).toLocaleString('es-AR', {
                            maximumFractionDigits: 0,
                          })
                          : Number(this.state.debt).toLocaleString('es-AR', {
                            maximumFractionDigits: 0,
                          })
                      }
                    />
                  ) : (
                    ''
                  )}
                </Grid>
              ) : (
                ''
              )}
              {this.state.typeOfChoose === 0 || this.state.typeOfChoose === 3 ? (
                <Grid item md={6}>
                  {/* thông báo phí */}
                  {this.state.typeOfChoose === 0 ? (
                    <CustomInputBase
                      // label={getLabelName('amount', 'RevenueExpenditure')}
                      label={'Số dư'}
                      name="money"
                      disabled={this.state.typeOfChoose === 0}
                      value={
                        this.state.paidCustomer + this.state.moneyInCustomerAccount > this.getTotalMoney() &&
                          this.state.checkMoneyInCustomerAccount === false
                          ? this.state.paidCustomer + this.state.moneyInCustomerAccount - this.getTotalMoney()
                          : this.state.paidCustomer > amountReceivables &&
                            this.state.paymentRequest.reduce((total, item) => total + item.amount, 0) -
                            this.state.paymentRequest.reduce((total, item) => total + item.paidAmount, 0) ==
                            0
                            ? (this.state.paidCustomer - this.state.amountReceivables).toLocaleString('es-AR', { maximumFractionDigits: 0 })
                            : this.getTotalMoney() - this.state.moneyInCustomerAccount < 0 && this.state.checkMoneyInCustomerAccount === false
                              ? (this.getTotalMoney() - this.state.moneyInCustomerAccount).toLocaleString('es-AR', { maximumFractionDigits: 0 })
                              : 0
                      }
                    />
                  ) : (
                    ''
                  )}
                  {/* Hoàn tiền chuyển nhầm */}
                  {this.state.typeOfChoose === 3 ? (
                    <CustomInputBase
                      // label={getLabelName('amount', 'RevenueExpenditure')}
                      label={'Số dư'}
                      name="money"
                      disabled={this.state.typeOfChoose === 0}
                      value={
                        this.state.paidCustomer + this.state.moneyInCustomerAccount > this.getTotalMoney() &&
                          this.state.checkMoneyInCustomerAccount === false
                          ? this.state.paidCustomer + this.state.moneyInCustomerAccount - this.getTotalMoney()
                          : this.state.paidCustomer > amountReceivables &&
                            this.state.paymentRequest.reduce((total, item) => total + item.amount, 0) -
                            this.state.paymentRequest.reduce((total, item) => total + item.paidAmount, 0) ==
                            0
                            ? (this.state.paidCustomer - this.state.amountReceivables).toLocaleString('es-AR', { maximumFractionDigits: 0 })
                            : this.getTotalMoney() - this.state.moneyInCustomerAccount < 0 && this.state.checkMoneyInCustomerAccount === false
                              ? (this.getTotalMoney() - this.state.moneyInCustomerAccount).toLocaleString('es-AR', { maximumFractionDigits: 0 })
                              : 0
                      }
                    />
                  ) : (
                    ''
                  )}
                </Grid>
              ) : (
                ''
              )}
              <Grid item md={6}>
                <CustomInputBase
                  // label={getLabelName('amount', 'RevenueExpenditure')}
                  label={'Số tiền tài khoản khách hàng'}
                  name="moneyInCustomerAccount"
                  disabled={this.state.checkMoneyInCustomerAccount}
                  value={this.state.moneyInCustomerAccount}
                  onChange={e => this.handleChangeInput(e)}
                  style={{ width: '90%' }}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                />
                <Checkbox style={{ marginTop: 10 }} onChange={this.handleCheckMoneyInCustomerAccount} />
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
              {/* <Grid item md={6}>
                  <Typography component="p" style={{ color: '#a4a4a4' }}>
                    {getLabelName('approvedBy.name', 'RevenueExpenditure')}
                  </Typography>
                  <AsyncSelect
                    className={classes.reactSelect}
                    placeholder="Tìm kiếm nhân viên phê duyệt..."
                    loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, API_USERS)}
                    loadingMessage={() => 'Đang tải ...'}
                    value={this.state.approvedBy}
                    components={{ Option, SingleValue }}
                    onChange={this.handleEmployeeApprove}
                    theme={theme => ({
                      ...theme,
                      spacing: {
                        ...theme.spacing,
                        controlHeight: '55px',
                      },
                    })}
                  />
                  {this.state.errorApproved ? (
                    <Typography component="p" style={{ color: 'red' }}>
                      Không được để trống trường này
                    </Typography>
                  ) : (
                    ''
                  )}
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
              <Grid item md={6}>
                <CustomInputBase
                  // label="Trạng thái"
                  label={name2Title.state}
                  name="state"
                  select
                  disabled
                  value={this.state.state}
                  onChange={this.handleChange}
                  error={localMessages && localMessages.state}
                  helperText={localMessages && localMessages.state}
                  required={checkRequired.state}
                  checkedShowForm={checkShowForm.state}
                >
                  {this.state.statusList.map(item => (
                    <MenuItem value={item.code} key={item.code}>
                      {item.name}
                    </MenuItem>
                  ))}
                </CustomInputBase>
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

            {/* <Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSubmitForm}
              >
                Lưu
              </Button>
              &nbsp;&nbsp;
              <Button
                variant="contained"
                onClick={() => {
                  this.props.history.goBack();
                  this.props.history.value = this.state.valueOfPrevTab;
                }}
              >
                Quay lại
              </Button>
            </Grid> */}
          </Paper>
        </Grid>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  handleChange = e => {
    console.log('AAAAAAAAAAAAAAAAAAAAAA');
    const { moduleCode, localMessages } = this.state;
    const {
      target: { value, name },
    } = e;
    if (name === 'typeOfChoose') {
      this.setState({ listChild: [], choose: null, amountReceivables: 0, customerInfo: {} });
    }
    if (name === 'typeOfDeposit') {
      if (value === 0) {
        const amountReceivables = this.state.deposit.reduce((total, item) => total + item.depositAmount, 0);
        this.setState({ amountReceivables: amountReceivables });
      }
      if (value === 1) {
        const amountReceivables = this.state.paymentRequest.reduce((total, item) => total + item.amount, 0);
        this.setState({ amountReceivables: amountReceivables });
      }
    }
    this.setState({ [name]: value });
    const messages = viewConfigHandleOnChange(moduleCode, localMessages, name, value);
    this.setState({
      localMessages: messages,
    });
  };
  handleChangeInput = (e, i) => {
    if (e.target.name === 'paidAmount') {
      const { paymentRequest } = this.state;
      paymentRequest[i].paidAmount = Number(e.target.value);
      if (paymentRequest[i].paidAmount <= paymentRequest[i].amount) {
        this.setState({ paymentRequest });
      } else {
        paymentRequest[i].paidAmount = paymentRequest[i].amount;
        this.props.onChangeSnackbar({
          status: true,
          message: 'số tiền thanh toán không được lớn hơn tổng tiền',
          variant: 'error',
        });
      }
    }
    if (e.target.name === 'depositPaidAmount') {
      const { deposit } = this.state;
      deposit[i].depositPaidAmount = Number(e.target.value);
      if (deposit[i].depositPaidAmount <= deposit[i].depositAmount) {
        this.setState({ deposit });
      } else {
        deposit[i].depositPaidAmount = deposit[i].depositAmount;
        this.props.onChangeSnackbar({
          status: true,
          message: 'số tiền thanh toán không được lớn hơn tổng tiền',
          variant: 'error',
        });
      }
    }
    if (e.target.name === 'arrearsPaidAmount') {
      const { arrears } = this.state;
      arrears[i].arrearsPaidAmount = Number(e.target.value);
      if (arrears[i].arrearsPaidAmount <= arrears[i].arrearsAmount) {
        this.setState({ arrears });
      } else {
        arrears[i].arrearsPaidAmount = arrears[i].arrearsAmount;
        this.props.onChangeSnackbar({
          status: true,
          message: 'số tiền thanh toán không được lớn hơn tổng tiền',
          variant: 'error',
        });
      }
    }
    if (e.target.name === 'moneyInCustomerAccount') {
      const value = e.target.value === '' ? e.target.value : this.convertToNumber(e.target.value);
      if (e.target.value <= this.state.moneyCustomerAccount) {
        this.setState({ moneyInCustomerAccount: e.target.value });
      } else {
        this.props.onChangeSnackbar({
          status: true,
          message: `số tiền phải lớn hơn 0 và nhỏ hơn ${this.state.moneyCustomerAccount}`,
          variant: 'error',
        });
      }
    }
  };
  handleChangeNumber = name => e => {
    const { moduleCode, localMessages } = this.state;
    this.setState({ [name]: e.target.value });
    const messages = viewConfigHandleOnChange(moduleCode, localMessages, name, e.target.value);
    this.setState({
      localMessages: messages,
    });
  };
  handleChangePaidCustomer = e => {
    this.setState({ paidCustomer: e.target.value });
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
      paymentRequest,
      paidCustomer,
      amountReceivables,
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
    let feeType;
    if (valueOfPrevTab !== 0) {
      switch (typeOfChoose) {
        // case 0:
        //   order = {
        //     orderId: choose !== null && choose.id,
        //     name: choose !== null && choose.name,
        //   };

        //   break;
        // case 1:
        //   bill = {
        //     billId: choose !== null && choose.id,
        //     name: choose !== null && choose.name,
        //   };
        //   break;
        case 0:
          fee = {
            feeId: choose !== null && choose.id,
            name: choose !== null && choose.apartmentCode,
            id: choose !== null && choose.id,
            code: choose !== null && choose.code,
            customerId: choose !== null && choose.customerId,

            electricityMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.electricityMoney) : 0,
            waterChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.waterChargeMoney) : 0,
            carChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.carChargeMoney) : 0,
            serviceChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.serviceChargeMoney) : 0,
            maintenanceChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.maintenanceChargeMoney) : 0,
            groundChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.groundChargeMoney) : 0,

            paidElectricityMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.paidElectricityMoney) : 0,
            paidWaterChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.paidWaterChargeMoney) : 0,
            paidCarChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.paidCarChargeMoney) : 0,
            paidServiceChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.paidServiceChargeMoney) : 0,
            paidMaintenanceChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.paidMaintenanceChargeMoney) : 0,
            paidGroundChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.paidGroundChargeMoney) : 0,

            prevElectricityMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.prevElectricityMoney) : 0,
            prevServiceChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.prevServiceChargeMoney) : 0,
            prevCarChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.prevCarChargeMoney) : 0,
            prevMaintenanceChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.prevMaintenanceChargeMoney) : 0,
            prevWaterChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.prevWaterChargeMoney) : 0,
            prevGroundChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.prevGroundChargeMoney) : 0,

            oldPaidElectricityMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.oldPaidElectricityMoney) : 0,
            oldPaidWaterChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.oldPaidWaterChargeMoney) : 0,
            oldPaidCarChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.oldPaidCarChargeMoney) : 0,
            oldPaidServiceChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.oldPaidServiceChargeMoney) : 0,
            oldPaidMaintenanceChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.oldPaidMaintenanceChargeMoney) : 0,
            oldPaidGroundChargeMoney: this.state.fee !== null ? this.convertToNumber(this.state.fee.oldPaidGroundChargeMoney) : 0,
            prevFee: this.state.prevFee,
          };
          feeType = 0;
          break;
        case 1:
          if (this.state.typeOfDeposit === 0) {
            contract = {
              contractId: choose !== null && choose.id ? choose.id : choose.contractId._id,
              name: choose !== null && choose.name,
              code: choose !== null && choose.code,
              customerId: choose !== null && choose.customerId,
              // deposit: choose !== null && this.state.deposit,
              depositPaidAmount: choose !== null && this.state.deposit[0].depositPaidAmount,
            };
            if (this.state.typeOfRecord === 0) {
              feeType = 1;
            } else feeType = 2;
          }
          if (this.state.typeOfDeposit === 1) {
            contract = {
              contractId: choose !== null && choose.id ? choose.id : choose.contractId._id,
              name: choose !== null && choose.name,
              code: choose !== null && choose.code,
              customerId: choose !== null && choose.customerId,
              // paymentRequest: choose !== null && this.state.paymentRequest,
              paymentRequestId: choose !== null && this.state.paymentRequest[0]._id,
            };
            feeType = 5;
          }

          break;
        case 3:
          feeType = 3;
          break;
        case 4:
          contract = {
            contractId: choose !== null && choose.id ? choose.id : choose.contractId._id,
            name: choose !== null && choose.name,
            code: choose !== null && choose.code,
            customerId: choose !== null && choose.customerId,
            // arrears: choose !== null && this.state.arrears,
            arrearsPaidAmount: choose !== null && this.state.arrears[0].arrearsPaidAmount,
          };
          feeType = 4;
          break;
        case 6:
          feeType = 6;
          break;
      }
    }
    const body = {
      type: typeOfRecord,
      costType: valueOfPrevTab,
      expenseType: typeOfRnE,
      feeType: feeType,
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
      paidCustomer,
      amountReceivables,
      customerId: choose !== null && choose.customerId,
      code,
      total: this.state.choose !== null ? this.state.choose.total : total,
      totalAmount: this.state.choose !== null ? this.state.choose.totalAmount : totalAmount,
      customer: this.state.choose !== null ? this.state.choose.customer : customer,
      bank,
      fee,
      paidMoneyInCustomerAccount: this.state.checkMoneyInCustomerAccount === false ? this.state.moneyInCustomerAccount : 0,
      // orderPo,
    };
    // check messages
    const { localMessages } = this.state;

    if (localMessages && Object.keys(localMessages).length === 0) {
      if (!error) {
        if (this.state.isEditPage) {
          const { match } = this.props;
          body.id = match.params.id;
          console.log('body', body);
          this.props.onUpdateRecord(body);
        } else {
          console.log('body', body);
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
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          customerInfo: data,
          moneyInCustomerAccount: data.moneyInCustomerAccount ? data.moneyInCustomerAccount : 0,
          moneyCustomerAccount: data.moneyInCustomerAccount ? data.moneyInCustomerAccount : 0,
        });
      });
  };

  handleAddSale = sale => {
    const { typeOfChoose } = this.state;
    const choose = sale && {
      id: sale._id,
      totalMoney: sale.totalMoney,
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
      prevMaintenanceChargeMoney: sale.prevMaintenanceChargeMoney ? sale.prevMaintenanceChargeMoney : 0,
      prevServiceChargeMoney: sale.prevServiceChargeMoney ? sale.prevServiceChargeMoney : 0,
      prevWaterChargeMoney: sale.prevWaterChargeMoney ? sale.prevWaterChargeMoney : 0,

      paidCarChargeMoney: (sale.carChargeMoney || 0) + (sale.prevCarChargeMoney || 0),
      paidElectricityMoney: (sale.electricityMoney || 0) + (sale.prevElectricityMoney || 0),
      paidGroundChargeMoney: (sale.groundChargeMoney || 0) + (sale.prevGroundChargeMoney || 0),
      paidMaintenanceChargeMoney: (sale.maintenanceChargeMoney || 0) + (sale.prevMaintenanceChargeMoney || 0),
      paidServiceChargeMoney: (sale.serviceChargeMoney || 0) + (sale.prevServiceChargeMoney || 0),
      paidWaterChargeMoney: (sale.waterChargeMoney || 0) + (sale.prevWaterChargeMoney || 0),
    };
    this.state.listChild = [];
    // hop dong
    console.log('typeOfChoose typeOfChoose ', typeOfChoose);

    if (typeOfChoose !== 0) {
      console.log('typeOfChoose: ', sale);
      if (Number(sale.catalogContract) === 1 && Number(sale.typeContract) === 1) {
        const token = localStorage.getItem('token');
        const url = `${GET_CONTRACT}/${sale._id}`;
        fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            if (this.state.typeOfDeposit === 1) {
              const amountReceivables = data.paymentRequest.reduce((total, item) => total + item.amount, 0);
              this.setState({ amountReceivables: amountReceivables });
            }
            if (this.state.typeOfDeposit === 0) {
              const amountReceivables = data.deposit.reduce((total, item) => total + item.depositAmount, 0);
              this.setState({ amountReceivables: amountReceivables });
            }
            if (this.state.typeOfChoose === 4) {
              const amountReceivables = data.arrears.reduce((total, item) => total + item.arrearsAmount, 0);
              this.setState({ amountReceivables: amountReceivables });
            }
            console.log(data, 'data');
            this.setState({
              listChild: data ? [data] : [],
              customerInfo: data.customerId,
              paymentRequest: data.paymentRequest,
              deposit: data.deposit,
              arrears: data.arrears,
            });
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
    // if (typeOfChoose === 3) {
    //   const params = {
    //     filter: {
    //       'task.taskId': sale._id,
    //     },
    //   };
    //   const filter = serialize(params);
    //   const token = localStorage.getItem('token');
    //   const url = `${GET_CONTRACT}?${filter}`;
    //   fetch(url, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //     .then(res => res.json())
    //     .then(data => {
    //       this.setState({ listChild: data.data });
    //     });
    // }
    // if (typeOfChoose === 4) {
    //   const token = localStorage.getItem('token');
    //   const url = `${API_ORDER_PO}/${sale._id}`;
    //   fetch(url, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //     .then(res => res.json())
    //     .then(data => {
    //       this.setState({ listChild: data.data });
    //     });
    // }

    if (typeOfChoose === 0) {
      this.getCustomerInfo(sale.customerId);
      this.setState({ debt: sale.totalDebt, totalMoney: sale.totalDebt, amountReceivables: sale.totalDebt });
    }
    // this.setState({ totalMoney: sale.totalMoney })
    // this.setState({ totalMoney: sale.totalMoney })
    // this.setState({ debt: sale.debt })
    this.setState({ choose });
  };

  loadFindOption = () => {
    const { typeOfChoose } = this.state;
    let api = '';
    let functionHandle = this.handleAddSale;
    switch (typeOfChoose) {
      case 0:
        api = API_SALE;
        functionHandle = this.handleAddSale;
        break;
      case 1:
        api = GET_CONTRACT;
        functionHandle = this.handleAddSale;
        break;
      case 2:
        api = GET_CONTRACT;
        functionHandle = this.handleAddSale;
        break;
      case 3:
        api = GET_CONTRACT;
        functionHandle = this.handleAddSale;
        break;
      case 4:
        api = GET_CONTRACT;
        functionHandle = this.handleAddSale;
        break;
      default:
        api = GET_CONTRACT;
        functionHandle = this.handleAddSale;
        break;
    }
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
