/* eslint-disable spaced-comment */
/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable array-callback-return */
/**
 *
 * AddContractPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import {
  withStyles,
  Paper,
  Grid,
  Typography,
  TextField,
  Tabs,
  IconButton,
  Tab,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  MenuItem,
  DialogContent,
  Button,
  Fab,
  TablePagination,
  AppBar,
  DialogActions,
  TableFooter,
  FormHelperText,
  Drawer,
} from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Close, Add, Delete, Edit } from '@material-ui/icons';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withSnackbar } from 'notistack';
// import AsyncSelect from 'react-select/async';
// import { components } from 'react-select';
import moment from 'moment';
import injectSaga from 'utils/injectSaga';
import { sortTask, fetchData } from '../../helper';
import injectReducer from 'utils/injectReducer';
import TextFieldCode from '../../components/TextFieldCode';
import { AsyncAutocomplete, Autocomplete } from '../../components/LifetekUi';
import makeSelectAddContractPage from './selectors';
import reducer from './reducer';
import saga, { getSaleQuoById } from './saga';
import {
  getAllContractAct,
  getOrderAct,
  createContractAct,
  getProductAct,
  setEmptyAct,
  getContractById,
  updateContractAct,
  getCustomerAct,
  getCustomerInfo,
  resetNoti,
  getAllProductAct,
  getAllAsset,
} from './actions';
import { API_TASK_PROJECT, API_USERS, API_CUSTOMERS, API_TASK_CONTRACT_PROJECT, API_ASSET } from '../../config/urlConfig';
import styles from './styles';
import { serialize, convertDatetimeToDate, getLabelName } from '../../utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import KanbanStepper from '../../components/KanbanStepper';
import ProductInforDrawer from '../../components/ProductInforDrawer';
import UpdatePaymentRequestDialog from '../../components/UpdatePaymentRequestDialog';
import UpdateDepositDialog from '../../components/UpdateDepositDialog';
import UpdateArrearsDialog from '../../components/UpdateArrearsDialog';
import UpdateCarRentaltDialog from '../../components/UpdateCarRentaltDialog';
import messages from './messages';
import FileUpload from '../../components/LifetekUi/FileUpload';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CustomButton from '../../components/Button/CustomButton';
import { viewConfigCheckForm } from 'utils/common';
import { differenceBy } from 'lodash';
import DialogAcceptRemove from '../../components/DialogAcceptRemove';
import CustomAppBar from 'components/CustomAppBar';
import Dialog from '../../components/LifetekUi/Dialog';
import CustomDatePicker from '../../components/CustomDatePicker';

// const tempDate = new Date();
// const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1}-${
//   tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()
// }`;
// const dateRaw = moment().format('YYYY-MM-DD');
const date = null;
const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
    marginBottom: '10px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

function formatNumber(num) {
  if (typeof num !== 'null' && typeof num !== 'undefined') return num;
}

/* eslint-disable react/prefer-stateless-function */
export class AddContractPage extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
  }
  state = {
    value: 0,
    open: false,
    open2: false,
    open3: false,
    open4: false,
    openDialogDeposit: false,
    openDialogArrears: false,
    openChooseSale: false,
    openEditProduct: false,
    openCarRental: false,
    //
    searchStartDay: date,
    searchEndDay: date,
    orderList: [],
    itemChoose: {},
    orderProductChoose: [],
    orderProductChooseAPI: [],
    catalogContract: 0,
    contractSigningDate: date,
    contractHandoverDate: date,
    belong: 0,
    startDay: date,
    // deliveryDay: date,
    paymentOrder: [],
    requestDeposit: [],
    requestArrears: [],
    name: '',
    productType: '',
    code: undefined,
    cycle: '',
    nameOrder: '',
    idCodeOrder: null,
    notice: '',
    // numberOrders: '',
    expirationDay: date,
    // statusContract: 0,
    // contractPrinciples: [],
    kanbanStatus: 0,
    arrKanban: [],
    task: '',
    rowsPerPage: 5, // số hàng hiển thị trên một bảng
    page: 0, // trang hiện tại
    currentStage: {
      name: '',
      statusPay: 0,
      timePay: moment().format('YYYY-MM-DD'),
      amount: 0,
      contractWork: null,
      workCompleted: {},
      currency: 'VNĐ',
      // VAT: false,
      totalPrice: '',
      jobs: null,
    },
    deposit: {
      depositName: '',
      depositStatus: 0,
      depositDate: moment().format('YYYY-MM-DD'),
      depositAmount: 0,
      depositUnit: 'VNĐ',
      note: '',
    },
    arrears: {
      arrearsName: '',
      arrearsDate: moment().format('YYYY-MM-DD'),
      arrearsAmount: 0,
      arrearsUnit: 'VNĐ',
      arrearsStatus: 0,
      arrearsPaidAmount: 0,
      note: '',
      // vat: 0,
    },
    currentDeliverRequest: {
      stage: '', // id của yêu cầu thanh toán paymentRequest
      timeDelivery: '',
      company: '',
      Address: '',
      products: [],
    },
    deliverimentRequest: [],
    isEdit: -1,
    isEditDelivery: -1,
    file: null,
    fileName: '',
    fileNote: '',
    arrFile: [],
    codeError: false,
    codeTypeError: false,
    productTypeError: false,
    nameError: false,
    cycleError: false,
    dateError: false,
    typeContainer: null,
    belongName: '',
    typeContract: this.props.typeContract ? this.props.typeContract : 0,
    saleError: false,

    searchTaskError: false,
    expirationDayError: false,
    startDayError: false,
    contractSigningDateError: false,
    cycleRequire: false,
    cycleMin: false,
    noticeMin: false,
    noticeRequire: false,
    openDetail: false,
    product: {},
    customer: {},
    allProduct: {},
    amountDelivery: [],
    fieldAdded: [],
    totalMoney: 0,
    totalMoney2: 0,
    responsible: null,
    customerName: {},
    jobs: null,
    chooseItem: null,
    chooseProductPrice: null,
    chooseProductAmount: null,
    chooseProductDiscount: null,
    chooseAssets: [],
    localMessages: {},
    contractColumns:
      JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'Contract') &&
      JSON.parse(localStorage.getItem('viewConfig'))
        .find(item => item.code === 'Contract')
        .listDisplay.type.fields.type.columns.map(item => ({
          ...item,
          name: item.name.replace(/\./g, '_'),
        })),
    openAsset: false,

    typeOfContracts: [],
    arrCar: [],
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
      carName: '',
      note: '',
      searchStartDay: '',
      searchEndDay: '',
    },
    chooseProduct: {},
    openDialogRemove: false,
    assetFilter: {
      level: 0,
      status: 1,
    },
  };

  componentWillMount() {
    const { match } = this.props;
    if (window.location.pathname.split('/').includes('edit')) {
      this.props.onGetContractById(this.props.id ? this.props.id : match.params.id);
      this.state.typeContainer = 'edit';
    } else {
      this.props.onGetContractById();
      this.state.typeContainer = 'add';
      // this.props.onGetAllContract(this.props.id ? this.props.id : match.params.id);
    }
    this.props.onDefaultAction();
    this.props.onGetAllProduct();
    if (parseInt(this.state.catalogContract, 10) === 1) {
      this.setState({ value: 0 });
    } else {
      this.setState({ value: 1 });
    }
  }

  componentDidMount() {
    // this.props.getAllAsset();
    const viewConfig = JSON.parse(localStorage.getItem('crmSource'));
    const viewConfigCode = viewConfig.find(item => item.code === 'S15');
    if (viewConfigCode) {
      const { data } = viewConfigCode;
      this.setState({ typeOfContracts: data });
    }
    if (this.state.typeContainer === 'add') {
      this.state.typeContract = this.props.id ? this.props.id : this.props.match.params.id;
    }
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.find(item => item.code === 'Contract');

    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      // const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }
  }

  componentWillUpdate(props) {
    const { successCreate } = props.addContractPage;
    if (successCreate) {
      this.props.onDefaultAction();
      const isEdittingTrading = JSON.parse(localStorage.getItem('edittingTrading'));
      if (isEdittingTrading) {
        isEdittingTrading.routingBackFromTabDialog = true;
        localStorage.setItem('edittingTrading', JSON.stringify(isEdittingTrading));
        this.props.callback ? this.props.callback() : this.props.history.push('/crm/ExchangingAgreement');
      } else {
        props.history.value = 1;
        this.props.callback ? this.props.callback() : this.props.history.push('/tower/Contract');
      }
    }
  }

  getProjectTree(projectId) {
    const filter = serialize({ filter: { projectId, status: 1 } });
    fetchData(`${API_TASK_PROJECT}?${filter}`, 'GET').then(projects => {
      const newProject = sortTask(projects.data, [], projectId, true);
      this.setState({ jobs: { data: newProject } });
    });
  }

  componentWillReceiveProps(props) {
    if (props.addContractPage) {
      const localMessages = viewConfigCheckForm('Contract', props.addContractPage);
      this.setState({
        localMessages,
      });
    }
    if (props !== this.props) {
      const { addContractPage } = props;
      const allProduct = addContractPage.allProduct;
      const { assets, contract = {} } = addContractPage;
      const contractPrinciples = addContractPage.allContract || [];
      console.log('addContractPage', addContractPage);
      const kanbanStatus = addContractPage.status || {};
      const arrOrder = addContractPage.allOrder || [];
      const arrProduct = addContractPage.listProduct || [];
      const customer = contract.customerId || {};
      const arr = [];
      if (this.state.typeContainer === 'edit') {
        //   this.props.onGetCustomerInfo(this.props.addContractPage.contract.customerId)
        this.setState({ customerName: customer });
      }

      contractPrinciples.forEach(item => {
        if (item.catalogContract === 0) {
          arr.push(item);
        }
      });
      // const arrKanban = kanbanStatus.data
      //   ? kanbanStatus.data.map(item => ({
      //       code: item.code,
      //       name: item.name,
      //     }))
      //   : [];
      const laneStart = [];
      const laneAdd = [];
      const laneSucces = [];
      const laneFail = [];
      if (kanbanStatus.data) {
        kanbanStatus.data.forEach(item => {
          switch (item.code) {
            case 1:
              laneStart.push(item);
              break;
            case 2:
              laneAdd.push(item);
              break;
            case 3:
              laneSucces.push(item);
              break;
            case 4:
              laneFail.push(item);
              break;
            default:
              break;
          }
        });
      }
      let amountDelivery = [];
      const arrKanban = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
      const arrOrderSorted = arrOrder.sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
      });

      this.setState({
        arrKanban,
        orderProductChooseAPI: arrProduct,
        // customerName: customer,
        allProduct,
        assets,
        checkAsset: assets,
      }); // contractPrinciples: arr,
      const { listProduct, saleQuo } = addContractPage;

      this.filterOrderList(arrOrderSorted);
      if (this.props.itemSales) {
        this.setState({
          nameOrder: this.props.itemSales.name,
        });
      }
      if (
        (this.props.id ? this.props.id : this.props.match.params.id) !== '1' &&
        (this.props.id ? this.props.id : this.props.match.params.id) !== '2' &&
        this.state.orderProductChoose &&
        this.state.orderProductChoose.length === 0
      ) {
        this.state.orderProductChoose = saleQuo ? (saleQuo.products ? saleQuo.products : []) : [];
        if (saleQuo && saleQuo !== null && Object.keys(saleQuo).length > 0) {
          let totalMoney = 0;
          saleQuo.products.forEach(n => {
            totalMoney += (Number(n.costPrice) * Number(n.amount) * Number(100 - Number(n.discount) || 0)) / 100;
          });
          this.setState({ totalMoney });
        }
      }
      if (
        (this.props.id ? this.props.id : this.props.match.params.id) !== '1' &&
        (this.props.id ? this.props.id : this.props.match.params.id) !== '2' &&
        this.state.itemChoose &&
        Object.keys(this.state.itemChoose).length === 0
      ) {
        this.state.itemChoose = saleQuo;
      }
      if (this.state.typeContainer === 'edit') {
        if (addContractPage.contract.task && addContractPage.contract.task && addContractPage.contract.task.taskId) {
          this.loadOptions2(addContractPage.contract.task.taskId);
        }
      }

      if (
        this.props.addContractPage.contract !== props.addContractPage.contract &&
        this.state.typeContainer === 'edit' &&
        contract !== this.props.contract &&
        contract.code
      ) {
        this.state.catalogContract = contract.catalogContract;
        this.state.name = contract.name;
        this.state.code = contract.code;
        this.state.deliverimentRequest = contract.deliverimentRequest || [];
        if (contract.task) {
          this.state.task = contract.task;
          if (contract.task.taskId) {
            this.getProjectTree(contract.task.taskId);
          }
        }

        this.state.typeContract = contract.typeContract || '';
        this.state.belong = contract.belong ? contract.belong.contractId : '';
        this.state.kanbanStatus = contract.kanbanStatus;
        this.state.contractSigningDate = convertDatetimeToDate(contract.contractSigningDate);
        this.state.contractHandoverDate = contract.contractHandoverDate;
        this.state.expirationDay = contract.expirationDay;
        this.state.startDay = convertDatetimeToDate(contract.startDay);
        this.state.dataPay = contract.paymentOrder || '';
        this.state.cycle = contract.cycle;
        this.state.notice = contract.notice;
        this.state.arrFile = contract.otherRequest;
        this.state.apartmentCode = contract.apartmentCode;
        this.state.paymentOrder = contract.paymentRequest;
        this.state.requestDeposit = contract.deposit;
        this.state.requestArrears = contract.arrears;
        this.state.arrCar = contract.vehicleList;
        this.state.responsible = contract.responsible;
        this.state.productType = contract.productType;
        if (parseInt(contract.catalogContract, 10) === 1) {
          this.state.idCodeOrder = contract.saleQuotation ? contract.saleQuotation.saleQuotationId : '';
          this.state.nameOrder = contract.saleQuotation ? contract.saleQuotation.name : '';
        }
        // this.state.nameOrder = contract.nameOrder|| '';
        this.state.orderProductChooseAPI = listProduct || [];
        this.state.orderProductChoose = addContractPage.contract.listProduct || [];
        this.state.itemChoose = saleQuo;
        if (contract.others && Object.keys(contract.others).length > 0) {
          const { fieldAdded } = this.state;
          const keys = Object.keys(contract.others);
          fieldAdded.forEach(item => {
            const index = keys.findIndex(n => n === item.name.replace('others.', ''));
            if (index > -1) {
              item.value = contract.others[keys[index]];
            }
          });
          this.state.fieldAdded = fieldAdded;
        }
      }
      if (this.state.amountDelivery.length === 0) {
        amountDelivery = arrProduct.map(item => ({
          productId: item._id,
          amount: 0,
        }));
      }
      if (amountDelivery.length > 0 && contract.deliverimentRequest && contract.deliverimentRequest.length > 0) {
        contract.deliverimentRequest.forEach(item => {
          if (item && item.products) {
            item.products.forEach(pro => {
              const x = amountDelivery.findIndex(n => n.productId === pro.productId);
              if (x > -1) {
                amountDelivery[x].amount += Number(pro.amount);
              }
            });
          }
        });
        this.setState({ amountDelivery });
      }
      if (Number(this.state.catalogContract) === 1) {
        const newArr = Array.isArray(this.state.allProduct) && this.state.allProduct.filter(f => f.isService === true);
        this.setState({ allProduct: newArr });
      }
    }
  }

  checkRequest = value => {
    const { contractColumns } = this.state;
    const column = Array.isArray(contractColumns) && contractColumns.filter(data => data.name === value);
    if (!this.isEmptyObject(column)) {
      return column[0].checkedRequireForm;
    }
  };

  checkShowForm = value => {
    const { contractColumns } = this.state;
    const column = Array.isArray(contractColumns) && contractColumns.filter(data => data.name === value);
    if (!this.isEmptyObject(column)) {
      return column[0].checkedShowForm;
    }
  };

  isEmptyObject = obj => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  filterOrderList = data => {
    let orderList2 = null;

    if (this.state.customerName) {
      if (this.isEmptyObject(this.state.customerName)) {
        this.setState({ orderList: data });
      } else {
        orderList2 = data.filter(
          item => item.customer.customerId === this.state.customerName._id || item.customer.customerId === this.state.customerName.customerId,
        );
        this.setState({ orderList: orderList2 });
      }
    } else {
      this.setState({ orderList: data });
    }
  };

  toggleDrawer = product => {
    const { openDetail } = this.state;
    this.setState({
      openDetail: !openDetail,
      product,
    });
  };

  handleResetProduct = () => {
    if (this.props.addContractPage.contract.listProduct) {
      this.setState({
        orderProductChoose: this.props.addContractPage.contract.listProduct,
        nameOrder: '',
      });
    } else {
      this.setState({
        orderProductChoose: [],
        nameOrder: '',
      });
    }
  };

  handlePriceProduct = item => {
    let { totalMoney2 } = this.state;
    let prevTotal = totalMoney2;
    let totalMoneyItem = 0;
    if (item.x) {
      if (item.costPrice) {
        return formatNumber((Number(item.costPrice) * Number(item.amount) * (100 - item.discount)) / 100);
      } else {
        return 0;
      }
    } else {
      if (item.discount) {
        totalMoneyItem = formatNumber((Number(item.costPrice) * Number(item.amount) * (100 - item.discount)) / 100);
        // this.handleTotalPriceProduct(totalMoneyItem)
        return totalMoneyItem;
      } else {
        totalMoneyItem = formatNumber(Number(item.costPrice) * Number(item.amount));
        // this.handleTotalPriceProduct(totalMoneyItem)
        return totalMoneyItem;
      }
    }
  };

  handleTotalPriceProduct = () => {
    let { orderProductChoose } = this.state;
  };
  handleDialogRemove = () => {
    const { openDialogRemove } = this.state;
    this.setState({
      openDialogRemove: !openDialogRemove,
    });
  };

  customCustomer = option => {
    const currentPhoneNumber = option ? option.phoneNumber : '';
    const customerName = option ? option.name : '';
    if (customerName && currentPhoneNumber) {
      return `${customerName} - ${currentPhoneNumber}`;
    } else {
      return customerName ? customerName : '';
    }
  };

  render() {
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    const { classes, addContractPage, match, intl } = this.props;
    let { orderProductChoose, orderList, localMessages } = this.state;
    const { orderProductChooseAPI, deliverimentRequest, arrKanban, kanbanStatus } = this.state;
    const { rowsPerPage, page } = this.state;
    if (orderProductChoose && orderProductChoose.length > 0 && orderProductChooseAPI.length > 0) {
      orderProductChoose = orderProductChoose.map(item => {
        const x = orderProductChooseAPI.find(n => n._id === item.productId);
        return {
          ...item,
          x,
        };
      });
    }

    if (this.state.amountDelivery.length === 0 && this.state.orderProductChooseAPI.length > 0) {
      const amountDelivery = this.state.orderProductChooseAPI.map(item => ({
        productId: item._id,
        amount: 0,
      }));
      this.state.amountDelivery = amountDelivery;
    }
    if (
      deliverimentRequest &&
      deliverimentRequest.length > 0 &&
      deliverimentRequest[0]._id &&
      orderProductChoose.length > 0 &&
      orderProductChooseAPI.length > 0
    ) {
      const temp = [];
      deliverimentRequest.forEach(item => {
        const products = [];
        item.products.forEach(pro => {
          const x = orderProductChoose.find(i => i.productId === pro.productId);
          products.push({
            productId: pro.productId,
            name: pro.name,
            amount: Number(pro.amount),
            exported: pro.exported ? Number(pro.exported) : 0,
            totalAmount: x.amount,
            price: x.costPrice ? x.costPrice : 0,
            unit: x.x.unit ? x.x.unit.name : '',
          });
        });
        const tempDate = new Date(item.timeDelivery);
        const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1}-${
          tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()
        }`;
        temp.push({
          Address: item.Address,
          company: item.company,
          products,
          stage: item.stage,
          timeDelivery: date,
        });
      });
      this.state.deliverimentRequest = temp;
    }
    if (orderList && orderList.length > 0) {
      orderList = orderList.slice(rowsPerPage * page, rowsPerPage * page + rowsPerPage);
    }
    let total = 0;
    const newArr = orderProductChoose.map((x, i) => {
      const totalMoney = Number(this.handlePriceProduct(x)) > 0 ? Number(this.handlePriceProduct(x)) : 0;
      return { totalMoney: totalMoney };
    });
    const totalProductsMoney = newArr.reduce((total, r) => (total += r.totalMoney), 0);
    return (
      <div>
        {addContractPage.loading ? <LoadingIndicator /> : null}
        <CustomAppBar
          title={
            id === '1'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới Hợp đồng KH' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật Hợp đồng KH' })}`
          }
          onGoBack={() => {
            this.props.history.value = 1;
            this.props.history.goBack();
          }}
          onSubmit={this.handleSubmit}
        />
        <Helmet>
          <title>{this.state.typeContainer === 'edit' ? 'Cập nhật hợp đồng' : 'Thêm mới hợp đồng'}</title>
          <meta name="description" content="Description of AddContractPage" />
        </Helmet>
        {console.log('arrKanban', arrKanban)}
        <KanbanStepper
          listStatus={arrKanban}
          onKabanClick={value => {
            this.setState({ kanbanStatus: value });
          }}
          activeStep={kanbanStatus}
        />
        {/* {this.state.openDetail ? ( */}
        <Drawer anchor="right" open={this.state.openDetail} onClose={this.toggleDrawer} className={classes.detailProduct}>
          <div tabIndex={0} role="button" className={classes.detailProduct}>
            {this.state.openDetail ? <ProductInforDrawer product={this.state.product} currentStock={null} onClose={this.toggleDrawer} /> : null}
          </div>
        </Drawer>
        {/* ):null} */}
        {/* <FormattedMessage {...messages.header} /> */}
        <Paper style={{ width: '100%', padding: 20 }}>
          <Grid item container spacing={24}>
            <Grid md={8} item container>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '18px',
                }}
              >
                {intl.formatMessage(
                  messages.thongTinHopDong || {
                    id: 'thongTinHopDong',
                    defaultMessage: 'thongTinHopDong',
                  },
                )}
              </Typography>
            </Grid>

            {/*------------------- Mã hợp đồng ----------------------*/}
            {this.checkShowForm('code') && (
              <Grid item md={6}>
                {/* <TextField
                 label={getLabelName('code', 'Contract')}
                 error={this.state.codeError || this.state.code === '' || this.state.codeTypeError}
                 onChange={this.handleChangeInput}
                 value={this.state.code}
                 variant="outlined"
                 style={{ width: '100%' }}
                 name="code"
               /> */}
                <TextFieldCode
                  label={getLabelName('code', 'Contract')}
                  onChange={this.handleChangeInput}
                  value={this.state.code}
                  variant="outlined"
                  style={{ width: '100%' }}
                  name="code"
                  code={5}
                />

                <FormHelperText
                  id="component-error-text"
                  style={this.state.codeError || this.state.codeTypeError ? { color: 'red' } : { color: 'red', display: 'none' }}
                >
                  {this.state.codeError ? intl.formatMessage(messages.maTrong || { id: 'maTrong', defaultMessage: 'maTrong' }) : ''}
                  {this.state.codeTypeError ? 'Mã không được chứa kí tự đặc biệt' : ''}
                </FormHelperText>
              </Grid>
            )}
            {this.checkShowForm('apartmentCode') && (
              <Grid item md={6}>
                <CustomInputBase
                  label={getLabelName('apartmentCode', 'Contract')}
                  name="apartmentCode"
                  required={this.checkRequest('apartmentCode')}
                  onChange={this.handleChangeInput}
                  value={this.state.apartmentCode}
                />
              </Grid>
            )}

            {/*------------------- tên khách hàng ----------------------*/}
            {this.state.catalogContract && this.state.catalogContract.toString() === '2' ? (
              <Grid item md={6}>
                <TextFieldCode
                  // label={getLabelName('customer', 'Contract')}
                  label={this.checkRequest('customerId')}
                  onChange={this.handleChangeInput}
                  value={this.state.customerName === null ? 'TÊN KHÁCH HÀNG' : this.state.customerName.name}
                  variant="outlined"
                  style={{ width: '100%' }}
                  name="customer"
                />
              </Grid>
            ) : (
              <Grid item md={6}>
                {id == '1' ? (
                  <AsyncAutocomplete
                    style={{ width: '100%', height: '100%' }}
                    required={this.checkRequest('customerId')}
                    label={getLabelName('customerId', 'Contract')}
                    onChange={value => {
                      this.setState({ customerName: value }, () => {
                        if (this.state.customerName) {
                          this.props.onGetCustomerInfo(this.state.customerName._id);
                        }
                      });
                    }}
                    // disabled
                    error={(this.state.customerName === null || this.isEmptyObject(this.state.customerName)) && this.checkRequest('customerId')}
                    url={API_CUSTOMERS}
                    value={this.state.customerName ? this.state.customerName : ''}
                    helperText={
                      (this.state.customerName === null || this.isEmptyObject(this.state.customerName)) &&
                      this.checkRequest('customerId') &&
                      localMessages.customerId
                    }
                    customOptionLabel={this.customCustomer}
                  />
                ) : (
                  <CustomInputBase
                    label={getLabelName('customerId', 'Contract')}
                    name="customer"
                    value={
                      this.state.customerName && this.state.customerName.name && this.state.customerName.phoneNumber
                        ? `${this.state.customerName.name} - ${this.state.customerName.phoneNumber}`
                        : ''
                    }
                    error={this.state.customerName && this.checkRequest('customer')}
                    required={this.checkRequest('customer')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.handleChangeInput}
                    style={{ width: '100%' }}
                  />
                )}
              </Grid>
            )}

            {/*------------------- Loại hợp đồng ----------------------*/}
            {this.checkShowForm('catalogContract') && (
              <Grid item md={6}>
                <CustomInputBase
                  id="standard-select-currency"
                  select
                  label={getLabelName('catalogContract', 'Contract')}
                  // label='Loại hợp đồng'
                  name="catalogContract"
                  value={this.state.catalogContract}
                  onChange={this.handleChangeInput}
                  disabled={this.state.typeContainer === 'edit'}
                  required={this.checkRequest('catalogContract')}
                  // helperText="Please select your currency"
                >
                  {Array.isArray(this.state.typeOfContracts) &&
                    this.state.typeOfContracts.length &&
                    this.state.typeOfContracts.map(item => <MenuItem value={item.value}>{item.title}</MenuItem>)}
                </CustomInputBase>
              </Grid>
            )}

            {/*------------------- Tên dự án -----------------------*/}
            {/* {this.checkShowForm('task_name') && ((this.state.catalogContract == 1 || this.state.catalogContract == 2) ? (
               <Grid item md={6}>
                 <AsyncAutocomplete
                   // isMulti
                   // name="Chọn người quản lý..."
                   label={getLabelName('task.name', 'Contract')}
                   onChange={value => {
                    this.getProjectTree(value._id);

                    this.setState({ task: value }, () => {
                      if (this.state.task && this.state.task !== null) {
                        this.loadOptions2(this.state.task);
                      }
                    });
                   }
                   }
                   url={API_TASK_PROJECT}
                   value={this.state.task}
                   filter={{
                     customer: (!this.state.customerName || this.state.customerName === null) ? {} : this.state.customerName._id || this.state.customerName.customerId,
                     isProject: true,
                   }}
                 />
               </Grid>
             ) : (
               ''
             ))} */}

            {/*------------------- Tên hợp đồng ----------------------*/}
            {this.checkShowForm('name') &&
              ((this.state.catalogContract && this.state.catalogContract.toString() === '1') ||
              (this.state.catalogContract && this.state.catalogContract.toString() === '2') ? (
                <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('name', 'Contract')}
                    name="name"
                    required={this.checkRequest('name')}
                    error={(this.state.nameError || this.state.name === '') && this.checkRequest('name')}
                    onChange={this.handleChangeInput}
                    value={this.state.name}
                    aria-describedby="component-error-text"
                  />
                  <FormHelperText
                    id="component-error-text"
                    style={
                      (this.state.nameError || this.state.name === '') && this.checkRequest('name')
                        ? { color: 'red' }
                        : { color: 'red', display: 'none' }
                    }
                  >
                    {/* {intl.formatMessage(messages.tenTrong || { id: 'tenTrong', defaultMessage: 'tenTrong' })} */}
                    {localMessages.name}
                  </FormHelperText>
                </Grid>
              ) : (
                ''
              ))}

            {/*------------------- báo giá ----------------------*/}

            {this.checkShowForm('saleQuotation') &&
              (parseInt(this.state.catalogContract, 10) === 1 || parseInt(this.state.catalogContract, 10) === 2 ? (
                <React.Fragment>
                  <Grid item md={6}>
                    <CustomInputBase
                      label={getLabelName('saleQuotation.name', 'Contract')}
                      InputProps={{
                        readOnly: true,
                      }}
                      error={this.state.saleError && this.checkRequest('saleQuotation')}
                      onClick={this.chooseOrder}
                      value={this.state.nameOrder}
                      name="nameOrder"
                      required={this.checkRequest('saleQuotation')}
                    />
                    <FormHelperText
                      id="component-error-text"
                      style={this.state.saleError && sthis.checkRequest('saleQuotation') ? { color: 'red' } : { color: 'red', display: 'none' }}
                    >
                      {/* {intl.formatMessage(messages.donHangTrong || { id: 'donHangTrong', defaultMessage: 'donHangTrong' })} */}
                      {localMessages.saleQuotation.name}
                    </FormHelperText>
                  </Grid>
                  {/* <Grid item md={6}>
                   <TextField
                     label="Số đơn hàng"
                     value={this.state.numberOrders}
                     name="numberOrders"
                     InputProps={{
                       readOnly: true,
                     }}
                     variant="outlined"
                     style={{ width: '100%' }}
                   />
                 </Grid> */}
                </React.Fragment>
              ) : null)}

            {/*------------------- thuộc hợp đồng ----------------------*/}
            {this.checkShowForm('belong') &&
              ((this.state.catalogContract && this.state.catalogContract.toString() === '1') ||
              (this.state.catalogContract && this.state.catalogContract.toString() === '2') ? (
                <Grid item md={6}>
                  <CustomInputBase
                    id="standard-select-currency"
                    select
                    disabled={(this.props.id ? this.props.id : match.params.id) !== '1' && (this.props.id ? this.props.id : match.params.id) !== '2'}
                    label={getLabelName('belong.name', 'Contract')}
                    name="belong"
                    value={this.state.belong}
                    onChange={this.handleChangeInput}
                    // error={this.state.belong === 0 && this.checkRequest('belong')}
                    required={this.checkRequest('belong')}
                    // helperText="Please select your currency"
                  >
                    <MenuItem value={0}>
                      {/* {intl.formatMessage(messages.chonHopDongNguyenTac || { id: 'chonHopDongNguyenTac', defaultMessage: 'chonHopDongNguyenTac' })} */}
                      {localMessages.belong.name}
                    </MenuItem>
                    {this.props.addContractPage.allContract
                      // eslint-disable-next-line eqeqeq
                      .filter(item => item.typeContract == this.state.typeContract && item.catalogContract == '0')
                      .map(item => (
                        <MenuItem value={item._id} key={item._id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </CustomInputBase>
                </Grid>
              ) : (
                ''
              ))}

            {/*------------------- người chịu trách nhiệm ----------------------*/}

            {this.checkShowForm('responsible') &&
              ((this.state.catalogContract && this.state.catalogContract.toString() === '1') ||
              (this.state.catalogContract && this.state.catalogContract.toString() === '2') ? (
                <Grid item md={6}>
                  <AsyncAutocomplete
                    isMulti
                    // name="Chọn người quản lý..."
                    label={getLabelName('responsible', 'Contract')}
                    onChange={value => this.setState({ responsible: value })}
                    url={API_USERS}
                    value={this.state.responsible}
                    error={this.state.responsible === null && this.checkRequest('responsible')}
                    helperText={this.state.responsible === null && this.checkRequest('responsible') && localMessages.responsible}
                    required={this.checkRequest('responsible')}
                  />
                </Grid>
              ) : (
                ''
              ))}

            {/*------------------- Tên hợp đồng ----------------------*/}
            {this.checkShowForm('name') &&
              ((this.state.catalogContract && this.state.catalogContract.toString() === '1') ||
              (this.state.catalogContract && this.state.catalogContract.toString() === '2') ? (
                ''
              ) : (
                // check 22
                <Grid item md={6}>
                  <CustomInputBase
                    label={getLabelName('name', 'Contract')}
                    name="name"
                    required={this.checkRequest('name')}
                    error={(this.state.nameError || this.state.name === '') && this.checkRequest('name')}
                    onChange={this.handleChangeInput}
                    value={this.state.name}
                    aria-describedby="component-error-text"
                  />
                  <FormHelperText
                    id="component-error-text"
                    style={
                      (this.state.nameError || this.state.name === '') && this.checkRequest('name')
                        ? { color: 'red' }
                        : { color: 'red', display: 'none' }
                    }
                  >
                    {/* {intl.formatMessage(messages.tenTrong || { id: 'tenTrong', defaultMessage: 'tenTrong' })} */}
                    {localMessages.name}
                  </FormHelperText>
                </Grid>
              ))}

            {/*------------------- Ngày ký hợp đồng ----------------------*/}
            {this.checkShowForm('contractSigningDate') && (
              <Grid item md={6}>
                <CustomDatePicker
                  label={getLabelName('contractSigningDate', 'Contract')}
                  name="contractSigningDate"
                  // required
                  onChange={e => this.handleChangeDate(e, 'contractSigningDate')}
                  value={this.state.contractSigningDate}
                  // InputProps={{ inputProps: { max: dateRaw } }}
                  error={(this.state.contractSigningDateError || this.state.contractSigningDate === date) && this.checkRequest('contractSigningDate')}
                  required={this.checkRequest('contractSigningDate')}
                  right="40px"
                />
                <FormHelperText
                  id="component-error-text"
                  style={
                    (this.state.contractSigningDateError || this.state.contractSigningDate === date) && this.checkRequest('contractSigningDate')
                      ? { color: 'red' }
                      : { color: 'red', display: 'none' }
                  }
                >
                  {localMessages.contractSigningDate}
                  {/* {intl.formatMessage(messages.ngayKiTrong || { id: 'ngayKiTrong', defaultMessage: 'ngayKiTrong' })} */}
                </FormHelperText>
              </Grid>
            )}

            <Grid item md={6}>
              <CustomDatePicker
                label="NGÀY NHẬN BÀN GIAO"
                name="contractHandoverDate"
                onChange={e => this.handleChangeDate(e, 'contractHandoverDate')}
                value={this.state.contractHandoverDate}
                required={this.checkRequest('contractHandoverDate')}
                error={
                  (this.state.dateError || this.state.contractHandoverDateError || this.state.contractHandoverDate === date) &&
                  this.checkRequest('contractHandoverDate')
                }
                right={40}
              />
              <FormHelperText
                id="component-error-text"
                style={
                  (this.state.dateError || this.state.contractHandoverDateError || this.state.contractHandoverDate === date) &&
                  this.checkRequest('contractHandoverDate')
                    ? { color: 'red' }
                    : { color: 'red', display: 'none' }
                }
              >
                {/* {intl.formatMessage(messages.ngayHetHanTrong || { id: 'ngayHetHanTrong', defaultMessage: 'ngayHetHanTrong' })} */}
                {localMessages.contractHandoverDate}
              </FormHelperText>
            </Grid>

            {/*------------------- chu kỳ ----------------------*/}

            {/* {this.checkShowForm('cycle') && (parseInt(this.state.catalogContract, 10) === 1 || parseInt(this.state.catalogContract, 10) === 2 ? (
               <React.Fragment>
                 <Grid item md={6}>
                   <CustomInputBase
                     label={getLabelName('cycle', 'Contract')}
                     type="number"
                     onChange={this.handleChangeInput}
                     value={this.state.cycle}
                     name="cycle"
                     
                   />
                   
                 </Grid>
 
                 
               </React.Fragment>
             ) : null)} */}

            {/*------------------- ngày bắt đầu ----------------------*/}
            {this.checkShowForm('startDay') && (
              <Grid item md={6}>
                <CustomDatePicker
                  label={getLabelName('startDay', 'Contract')}
                  name="startDay"
                  error={(this.state.dateError || this.state.startDayError || this.state.startDay === date) && this.checkRequest('startDay')}
                  required={this.checkRequest('startDay')}
                  value={this.state.startDay}
                  onChange={e => this.handleChangeDate(e, 'startDay')}
                  right="40px"
                />
                <FormHelperText
                  id="component-error-text"
                  style={
                    (this.state.dateError || this.state.startDayError || this.state.startDay === date) && this.checkRequest('startDay')
                      ? { color: 'red' }
                      : { color: 'red', display: 'none' }
                  }
                >
                  {/* {intl.formatMessage(messages.batDauTrong || { id: 'batDauTrong', defaultMessage: 'batDauTrong' })} */}
                  {localMessages.startDay}
                </FormHelperText>
              </Grid>
            )}
            {/*------------------- chú ý ----------------------*/}

            {/* {this.checkShowForm('notice') && (parseInt(this.state.catalogContract, 10) === 1 || parseInt(this.state.catalogContract, 10) === 2 ? (
               <Grid item md={6}>
                 <CustomInputBase
                   label={getLabelName('notice', 'Contract')}
                   name="notice"
                   type="number"
                   value={this.state.notice}
                   onChange={this.handleChangeInput}
                 />
                 
               </Grid>
             ) : null)} */}

            {/*------------------- ngày hết hạn ----------------------*/}

            {this.checkShowForm('expirationDay') &&
              ((this.state.catalogContract && this.state.catalogContract.toString() === '1') ||
              (this.state.catalogContract && this.state.catalogContract.toString() === '2') ? (
                <Grid item md={6}>
                  <CustomDatePicker
                    label={getLabelName('expirationDay', 'Contract')}
                    name="expirationDay"
                    value={this.state.expirationDay}
                    error={
                      (this.state.dateError || this.state.expirationDayError || this.state.expirationDay === date) &&
                      this.checkRequest('expirationDay')
                    }
                    required={this.checkRequest('expirationDay')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={e => this.handleChangeDate(e, 'expirationDay')}
                    style={{ width: '100%' }}
                    right="40px"
                  />
                  <FormHelperText
                    id="component-error-text"
                    style={
                      (this.state.dateError || this.state.expirationDayError || this.state.expirationDay === date) &&
                      this.checkRequest('expirationDay')
                        ? { color: 'red' }
                        : { color: 'red', display: 'none' }
                    }
                  >
                    {/* {intl.formatMessage(messages.ngayHetHanTrong || { id: 'ngayHetHanTrong', defaultMessage: 'ngayHetHanTrong' })} */}
                    {localMessages.expirationDay}
                  </FormHelperText>
                </Grid>
              ) : (
                <Grid item md={6}>
                  <CustomDatePicker
                    label={getLabelName('expirationDay', 'Contract')}
                    name="expirationDay"
                    value={this.state.expirationDay}
                    error={
                      (this.state.dateError || this.state.expirationDayError || this.state.expirationDay === date) &&
                      this.checkRequest('expirationDay')
                    }
                    required={this.checkRequest('expirationDay')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={e => this.handleChangeDate(e, 'expirationDay')}
                    style={{ width: '100%' }}
                    right="40px"
                  />
                  <FormHelperText
                    id="component-error-text"
                    style={
                      (this.state.dateError || this.state.expirationDayError || this.state.expirationDay === date) &&
                      this.checkRequest('expirationDay')
                        ? { color: 'red' }
                        : { color: 'red', display: 'none' }
                    }
                  >
                    {/* {intl.formatMessage(messages.ngayHetHanTrong || { id: 'ngayHetHanTrong', defaultMessage: 'ngayHetHanTrong' })} */}
                    {localMessages.expirationDay}
                  </FormHelperText>
                </Grid>
              ))}

            {/*------------------- người chịu trách nhiệm ----------------------*/}
            {this.checkShowForm('responsible') &&
              ((this.state.catalogContract && this.state.catalogContract.toString() === '0') ||
              (this.state.catalogContract && this.state.catalogContract.toString() === '3') ? (
                <Grid item md={6}>
                  <AsyncAutocomplete
                    isMulti
                    // name="Chọn người quản lý..."
                    label="NGƯỜI CHỊU TRÁCH NHIỆM"
                    onChange={value => this.setState({ responsible: value })}
                    url={API_USERS}
                    value={this.state.responsible}
                    error={this.state.responsible === null && this.checkRequest('responsible')}
                    helperText={this.state.responsible === null && this.checkRequest('responsible') && localMessages.responsible}
                    required={this.checkRequest('responsible')}
                  />
                </Grid>
              ) : (
                ''
              ))}

            {this.state.fieldAdded.length > 0
              ? this.state.fieldAdded.map((item, index) => {
                  if (item.checked) {
                    return (
                      <Grid item md={6} key={item.name}>
                        <TextField
                          label={item.title}
                          variant="outlined"
                          type={item.type === 'string' ? 'text' : item.type}
                          value={item.value}
                          onChange={event => this.handleChangeAddedField(index, event)}
                          style={{ width: '100%' }}
                          margin="normal"
                        />
                      </Grid>
                    );
                  }
                })
              : ''}
          </Grid>

          {/* ----------- Bảng khách hàng ----------- */}

          {this.state.customerName !== null && Object.keys(this.state.customerName).length > 0 ? (
            <Grid item container style={{ marginTop: 20, marginBottom: 20 }} spacing={24}>
              <Grid md={8} item container>
                <Typography
                  component="p"
                  style={{
                    fontWeight: 550,
                    fontSize: '18px',
                  }}
                >
                  {intl.formatMessage(
                    messages.thongTinKhachHang || {
                      id: 'thongTinKhachHang',
                      defaultMessage: 'thongTinKhachHang',
                    },
                  )}
                </Typography>
              </Grid>
              <Grid item md={6}>
                <CustomInputBase
                  label={intl.formatMessage(messages.tenKhachHang || { id: 'tenKhachHang', defaultMessage: 'tenKhachHang' })}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={this.state.customerName.name}
                />
              </Grid>
              {/* <Grid item md={6}>
                 <CustomInputBase
                   label={intl.formatMessage(messages.congty || { id: 'congty', defaultMessage: 'congty' })}
                   InputProps={{
                     readOnly: true,
                   }}
                   value=""
                 />
               </Grid>
               <Grid item md={6}>
                 <CustomInputBase
                   label={intl.formatMessage(messages.diaChi || { id: 'diaChi', defaultMessage: 'diaChi' })}
                   InputProps={{
                     readOnly: true,
                   }}
                   value={this.state.customerName.address}
                 />
               </Grid> */}
              <Grid item md={6}>
                <CustomInputBase
                  label={intl.formatMessage(messages.dienThoai || { id: 'dienThoai', defaultMessage: 'dienThoai' })}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={this.state.customerName.phoneNumber}
                  variant="outlined"
                  style={{ width: '100%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item md={6}>
                {/* <CustomInputBase
                   label={intl.formatMessage(messages.masothue || { id: 'masothue', defaultMessage: 'masothue' })}
                   InputProps={{
                     readOnly: true,
                   }}
                   value={this.state.customerName.taxCode}
                 /> */}
                <CustomInputBase
                  label="Email"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={this.state.customerName.email}
                />
              </Grid>
              <Grid item md={6}>
                {/* <CustomInputBase
                   label={intl.formatMessage(messages.nganhang || { id: 'nganhang', defaultMessage: 'nganhang' })}
                   InputProps={{
                     readOnly: true,
                   }}
                   value={this.state.customerName.bank}
                 /> */}
                <CustomInputBase
                  label="CMND/CCCD"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={this.state.customerName.idetityCardNumber}
                />
              </Grid>
              {/* <Grid item md={6}>
                 <CustomInputBase
                   label={intl.formatMessage(messages.taikhoannganhang || { id: 'taikhoannganhang', defaultMessage: 'taikhoannganhang' })}
                   InputProps={{
                     readOnly: true,
                   }}
                   value={this.state.customerName.bankAccountNumber}
                 />
               </Grid> */}
            </Grid>
          ) : (
            ''
          )}
          <UpdatePaymentRequestDialog
            handleAddtoList={this.onAddToListPayment}
            open={this.state.open2}
            intl={intl}
            messages={messages}
            handleClose={this.handleClose2}
            currentStage={Object.assign({}, this.state.currentStage)}
            classes={classes}
            totalMoney={this.state.totalMoney}
            minday={this.state.contractSigningDate}
            taskChoose={this.state.task}
            jobs={this.state.jobs}
            edit={this.state.typeContainer === 'edit' ? 'true' : 'false'}
          />
          <UpdateDepositDialog
            handleAddtoList={this.onAddToListDeposit}
            open={this.state.openDialogDeposit}
            intl={intl}
            deposit={Object.assign({}, this.state.deposit)}
            messages={messages}
            handleClose={this.handleCloseDialogDeposit}
            taskChoose={this.state.task}
            classes={classes}
            totalMoney={this.state.totalMoney}
            minday={this.state.contractSigningDate}
            edit={this.state.typeContainer === 'edit' ? 'true' : 'false'}
          />
          <UpdateArrearsDialog
            handleAddtoList={this.onAddToListArrears}
            open={this.state.openDialogArrears}
            intl={intl}
            arrears={Object.assign({}, this.state.arrears)}
            messages={messages}
            handleClose={this.handleCloseDialogArrears}
            taskChoose={this.state.task}
            classes={classes}
            totalMoney={this.state.totalMoney}
            minday={this.state.contractSigningDate}
            edit={this.state.typeContainer === 'edit' ? 'true' : 'false'}
          />
          <UpdateCarRentaltDialog
            handleAddtoList={this.AddCarRental}
            open={this.state.openCarRental}
            intl={intl}
            messages={messages}
            handleClose={this.handleCarRental}
            carRental={this.state.carRental}
            classes={classes}
            edit={this.state.typeContainer === 'edit' ? 'true' : 'false'}
          />

          {/* --------- bảng bên dưới ----------- */}
          <Grid item container spacing={48} style={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ marginTop: 10, marginBottom: 10 }} color="default">
              <Tabs value={this.state.value} indicatorColor="primary" textColor="primary" onChange={this.handleChangeTabList}>
                <Tab
                  style={parseInt(this.state.catalogContract, 10) === 0 ? { display: 'none' } : { display: 'block' }}
                  label={intl.formatMessage(
                    messages.yeuCauSanPham || {
                      id: 'yeuCauSanPham',
                      defaultMessage: 'yeuCauSanPham',
                    },
                  )}
                />

                <Tab
                  label={intl.formatMessage(
                    messages.yeuCauThanhToan || {
                      id: 'yeuCauThanhToan',
                      defaultMessage: 'yeuCauThanhToan',
                    },
                  )}
                />
                <Tab style={parseInt(this.state.catalogContract, 10) === 0 ? { display: 'none' } : { display: 'block' }} label="Hợp đồng xe" />
                <Tab label={intl.formatMessage(messages.yeuCauCoc || { id: 'yeuCauCoc', defaultMessage: 'Khoản cọc' })} />
                {/* <Tab
                  style={
                    (parseInt(this.state.catalogContract, 10) === 1 && this.state.typeContainer === 'edit') ||
                      (parseInt(this.state.catalogContract, 10) === 2 && this.state.typeContainer === 'edit')
                      ? { display: 'block' }
                      : { display: 'none' }
                  }
                  label={intl.formatMessage(messages.yeuCauGiaoHang || { id: 'yeuCauGiaoHang', defaultMessage: 'yeuCauGiaoHang' })}
                /> */}
                <Tab label={intl.formatMessage(messages.yeuCauTruyThu || { id: 'yeuCauTruyThu', defaultMessage: 'Truy thu' })} />
                <Tab label={intl.formatMessage(messages.yeuCauKhac || { id: 'yeuCauKhac', defaultMessage: 'yeuCauKhac' })} />
              </Tabs>
            </AppBar>
            {this.state.value === 0 && (
              <Paper style={{ width: '100%' }}>
                {/* ----------------------------------------------------------------------------------- */}
                <Grid style={{ display: 'block' }}>
                  {!this.state.nameOrder ? (
                    <CustomButton style={{ margin: 15 }} color="primary" aria-label="Add" size="small" onClick={this.chooseOrderWithoutSale}>
                      {intl.formatMessage(
                        messages.ycttThemMoi || {
                          id: 'ycttThemMoi',
                          defaultMessage: 'ycttThemMoi',
                        },
                      )}
                    </CustomButton>
                  ) : (
                    <CustomButton style={{ margin: 15 }} color="primary" aria-label="Reset" size="small" onClick={this.handleResetProduct}>
                      {intl.formatMessage(messages.tuyChinh || { id: 'tuyChinh', defaultMessage: 'tuyChinh' })}
                    </CustomButton>
                  )}
                </Grid>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{intl.formatMessage(messages.ycspName || { id: 'ycspName', defaultMessage: 'ycspName' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycspTaisan || { id: 'ycspTaisan', defaultMessage: 'ycspTaisan' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycspGia || { id: 'ycspGia', defaultMessage: 'ycspGia' })}</TableCell>
                      <TableCell>
                        {intl.formatMessage(
                          messages.ycspSoLuong || {
                            id: 'ycspSoLuong',
                            defaultMessage: 'ycspSoLuong',
                          },
                        )}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage(
                          messages.ycspDonViTinh || {
                            id: 'ycspDonViTinh',
                            defaultMessage: 'ycspDonViTinh',
                          },
                        )}
                      </TableCell>
                      {/* remove discount${API_STOCK}/log/list */}
                      {/* <TableCell>{intl.formatMessage(messages.ycspChietKhau || { id: 'ycspChietKhau', defaultMessage: 'ycspChietKhau' })}</TableCell> */}
                      <TableCell>
                        {intl.formatMessage(
                          messages.ycspThanhTien || {
                            id: 'ycspThanhTien',
                            defaultMessage: 'ycspThanhTien',
                          },
                        )}
                      </TableCell>
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderProductChoose
                      ? orderProductChoose.filter(i => i).map(item => {
                          // let { pricePolicy = {} } = item.dataProduct;
                          const pricePolicy = item.dataProduct && item.dataProduct.pricePolicy ? item.dataProduct.pricePolicy : {};
                          const costPrice =
                            pricePolicy && pricePolicy.allPrice
                              ? pricePolicy.allPrice
                              : (pricePolicy && pricePolicy.costPrice) || item.costPrice || 0;

                          return (
                            <TableRow>
                              <TableCell>
                                <Button color="primary" onClick={() => this.toggleDrawer(item)}>
                                  {item.name}
                                </Button>
                              </TableCell>
                              <TableCell>
                                {item.asset && Array.isArray(item.asset) && item.asset.length && item.asset.map(it => it.name).join()}
                              </TableCell>
                              <TableCell>
                                {Number(costPrice).toLocaleString('es-AR', {
                                  maximumFractionDigits: 0,
                                })}
                              </TableCell>
                              <TableCell>{item.amount}</TableCell>
                              <TableCell>{item.x ? (item.x.unit ? item.x.unit.name : '') : item.unit}</TableCell>
                              {/* <TableCell>{item.discount ? item.discount : 0}%</TableCell> */}
                              <TableCell>
                                {(this.handlePriceProduct(item) &&
                                  !isNaN(this.handlePriceProduct(item)) &&
                                  Number(this.handlePriceProduct(item)).toLocaleString('es-AR', {
                                    maximumFractionDigits: 0,
                                  })) ||
                                  0}
                              </TableCell>
                              <TableCell>
                                {!this.state.nameOrder && (
                                  <Fab color="primary" aria-label="Edit" size="small" className="mr-1" onClick={() => this.editProduct(item)}>
                                    <Edit />
                                  </Fab>
                                )}
                                {!this.state.nameOrder && (
                                  <Fab color="primary" aria-label="Delete" size="small" onClick={() => this.confirmDelete(item)}>
                                    <Delete />
                                  </Fab>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      : ''}
                    <TableRow>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell>
                        {intl.formatMessage(
                          messages.ycspGiaTriDonHang || {
                            id: 'ycspGiaTriDonHang',
                            defaultMessage: 'ycspGiaTriDonHang',
                          },
                        )}
                      </TableCell>
                      <TableCell>
                        {formatNumber(totalProductsMoney).toLocaleString('es-AR', {
                          maximumFractionDigits: 0,
                        })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            )}
            {this.state.value === 1 && (
              <Paper style={{ width: '100%' }}>
                <Grid style={{ display: 'block' }}>
                  <CustomButton style={{ margin: 15 }} color="primary" aria-label="Add" size="small" onClick={this.addToPaymentOrder}>
                    {intl.formatMessage(messages.ycttThemMoi || { id: 'ycttThemMoi', defaultMessage: 'ycttThemMoi' })}
                  </CustomButton>
                </Grid>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{intl.formatMessage(messages.ycttTen || { id: 'ycttTen', defaultMessage: 'ycttTen' })}</TableCell>
                      <TableCell>
                        {intl.formatMessage(
                          messages.ycttNgayKiBienBan || {
                            id: 'ycttNgayKiBienBan',
                            defaultMessage: 'ycttNgayKiBienBan',
                          },
                        )}
                      </TableCell>
                      <TableCell>{intl.formatMessage(messages.ycttSoTien || { id: 'ycttSoTien', defaultMessage: 'ycttSoTien' })}</TableCell>
                      <TableCell>
                        {intl.formatMessage(
                          messages.ycttTrangThai || {
                            id: 'ycttTrangThai',
                            defaultMessage: 'ycttTrangThai',
                          },
                        )}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage(
                          messages.ycttHanhDong || {
                            id: 'ycttHanhDong',
                            defaultMessage: 'ycttHanhDong',
                          },
                        )}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.paymentOrder.length > 0
                      ? this.state.paymentOrder.map((item, index) => (
                          <TableRow>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{moment(item.timePay).format('YYYY-MM-DD')}</TableCell>
                            {/* <TableCell>{formatNumber(item.amount)}</TableCell> */}
                            <TableCell>
                              {!isNaN(Number(item.amount)) &&
                                Number(item.amount).toLocaleString('es-AR', {
                                  maximumFractionDigits: 0,
                                })}
                            </TableCell>

                            <TableCell>
                              {item.statusPay === 0
                                ? `${intl.formatMessage(
                                    messages.ycttChuaNghiemThu || {
                                      id: 'ycttChuaNghiemThu',
                                      defaultMessage: 'ycttChuaNghiemThu',
                                    },
                                  )}`
                                : item.statusPay === 1
                                  ? `${intl.formatMessage(
                                      messages.ycttDaThanhLy || {
                                        id: 'ycttDaThanhLy',
                                        defaultMessage: 'ycttDaThanhLy',
                                      },
                                    )}`
                                  : item.statusPay === 2
                                    ? `${intl.formatMessage(
                                        messages.ycttDeNghiThanhToan || {
                                          id: 'ycttDeNghiThanhToan',
                                          defaultMessage: 'ycttDeNghiThanhToan',
                                        },
                                      )}`
                                    : item.statusPay === 3
                                      ? `${intl.formatMessage(
                                          messages.ycttDaNghiemThu || {
                                            id: 'ycttDaNghiemThu',
                                            defaultMessage: 'ycttDaNghiemThu',
                                          },
                                        )}`
                                      : ''}
                            </TableCell>
                            <TableCell>
                              <Fab color="primary" aria-label="Add" size="small" onClick={() => this.editToPaymentOrder(index)}>
                                <Edit />
                              </Fab>
                              {/* &nbsp;&nbsp;
                               <Fab color="inherit" aria-label="Add" size="small" onClick={() => this.deleteToPaymentOrder(index)}>
                                 <InsertDriveFile />
                               </Fab> */}
                              &nbsp;&nbsp;
                              <Fab color="secondary" aria-label="Add" size="small" onClick={() => this.deleteToPaymentOrder(index)}>
                                <Delete />
                              </Fab>
                            </TableCell>
                          </TableRow>
                        ))
                      : ''}
                  </TableBody>
                </Table>
              </Paper>
            )}
            {this.state.value === 2 && (
              <Paper style={{ width: '100%' }}>
                <Grid style={{ display: 'block' }}>
                  <CustomButton style={{ margin: 15 }} color="primary" aria-label="Add" size="small" onClick={() => this.addCarRental()}>
                    Thêm mới
                  </CustomButton>
                </Grid>
                <Table style={{ overflowX: 'auto', display: 'block' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>Sô thứ tự</TableCell>
                      <TableCell style={{ minWidth: 220, padding: '4px 20px 4px 20px' }}>Loại sản phẩm</TableCell>
                      <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>Họ và tên</TableCell>
                      <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>Số điện thoại</TableCell>
                      <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>Email</TableCell>
                      <TableCell style={{ minWidth: 160, padding: '4px 20px 4px 20px' }}>Quan hệ với chủ hộ</TableCell>
                      <TableCell style={{ minWidth: 220, padding: '4px 20px 4px 20px' }}>Loại phương tiện(Xe máy/oto)</TableCell>
                      <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>Biển kiểm soát</TableCell>
                      <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>Màu xe</TableCell>
                      <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>Hãng xe</TableCell>
                      <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>Tên xe </TableCell>
                      <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>Ngày bắt đầu</TableCell>
                      <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>Ngày kết thức</TableCell>
                      <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>Ghi chú</TableCell>
                      <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.arrCar.length > 0
                      ? this.state.arrCar.map((item, index) => (
                          <TableRow>
                            <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>{index + 1}</TableCell>
                            <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>{item.product && item.product.name}</TableCell>
                            <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>{item.namePepple}</TableCell>
                            <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>{item.telephone}</TableCell>
                            <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>{item.email}</TableCell>
                            <TableCell style={{ minWidth: 160, padding: '4px 20px 4px 20px' }}>{item.relative}</TableCell>
                            <TableCell style={{ minWidth: 220, padding: '4px 20px 4px 20px' }}>{item.expediency}</TableCell>
                            <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>{item.carPlate}</TableCell>
                            <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>{item.carColor}</TableCell>
                            <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>{item.carCompany}</TableCell>
                            <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>{item.carName}</TableCell>
                            <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>{item.searchStartDay}</TableCell>
                            <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>{item.searchEndDay}</TableCell>
                            <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>{item.note}</TableCell>
                            <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                              <Fab color="primary" aria-label="Add" size="small" onClick={() => this.editCarRental(index)}>
                                <Edit />
                              </Fab>
                              {/* &nbsp;&nbsp;
                               <Fab color="inherit" aria-label="Add" size="small" onClick={() => this.deleteToPaymentOrder(index)}>
                                 <InsertDriveFile />
                               </Fab> */}
                              &nbsp;&nbsp;
                              <Fab color="secondary" aria-label="Add" size="small" onClick={() => this.setState({ openDialogRemove: true })}>
                                <Delete />
                              </Fab>
                              <DialogAcceptRemove
                                title="Bạn có muốn xóa trạng thái này không?"
                                openDialogRemove={this.state.openDialogRemove}
                                handleClose={this.handleDialogRemove}
                                handleDelete={() => this.deleteCarRental(index)}
                              />{' '}
                            </TableCell>
                          </TableRow>
                        ))
                      : ''}
                  </TableBody>
                </Table>
              </Paper>
            )}
            {this.state.value === 3 && (
              <Paper style={{ width: '100%' }}>
                <Grid style={{ display: 'block' }}>
                  <CustomButton style={{ margin: 15 }} color="primary" aria-label="Add" size="small" onClick={this.addToRequestDeposit}>
                    {intl.formatMessage(messages.ycttThemMoi || { id: 'ycttThemMoi', defaultMessage: 'ycttThemMoi' })}
                  </CustomButton>
                </Grid>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên khoản cọc</TableCell>
                      <TableCell>
                        {intl.formatMessage(
                          messages.yccNgayDatCoc || {
                            id: 'yccNgayDatCoc',
                            defaultMessage: 'Ngày đặt cọc',
                          },
                        )}
                      </TableCell>
                      <TableCell>{intl.formatMessage(messages.ycttSoTien || { id: 'ycttSoTien', defaultMessage: 'ycttSoTien' })}</TableCell>
                      <TableCell>
                        {intl.formatMessage(
                          messages.ycttTrangThai || {
                            id: 'ycttTrangThai',
                            defaultMessage: 'ycttTrangThai',
                          },
                        )}
                      </TableCell>
                      <TableCell>Ghi chú</TableCell>
                      <TableCell>
                        {intl.formatMessage(
                          messages.ycttHanhDong || {
                            id: 'ycttHanhDong',
                            defaultMessage: 'ycttHanhDong',
                          },
                        )}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.requestDeposit.length > 0
                      ? this.state.requestDeposit.map((item, index) => (
                          <TableRow>
                            <TableCell>{item.depositName}</TableCell>
                            <TableCell>{moment(item.depositDate).format('YYYY-MM-DD')}</TableCell>
                            {/* <TableCell>{formatNumber(item.amount)}</TableCell> */}
                            <TableCell>
                              {!isNaN(Number(item.depositAmount)) &&
                                Number(item.depositAmount).toLocaleString('es-AR', {
                                  maximumFractionDigits: 0,
                                })}
                            </TableCell>

                            <TableCell>
                              {item.depositStatus === 0 ? 'Chưa thanh toán' : item.depositStatus === 1 ? 'Hoàn cọc' : 'Đã thanh toán'}
                            </TableCell>

                            <TableCell>{item.note}</TableCell>
                            <TableCell>
                              <Fab color="primary" aria-label="Add" size="small" onClick={() => this.editToRequestDeposit(index)}>
                                <Edit />
                              </Fab>
                              {/* &nbsp;&nbsp;
                               <Fab color="inherit" aria-label="Add" size="small" onClick={() => this.deleteToPaymentOrder(index)}>
                                 <InsertDriveFile />
                               </Fab> */}
                              &nbsp;&nbsp;
                              <Fab color="secondary" aria-label="Add" size="small" onClick={() => this.deleteToRequestDeposit(index)}>
                                <Delete />
                              </Fab>
                            </TableCell>
                          </TableRow>
                        ))
                      : ''}
                  </TableBody>
                </Table>
              </Paper>
            )}
            {this.state.value === 4 && (
              <Paper style={{ width: '100%' }}>
                <Grid style={{ display: 'block' }}>
                  <CustomButton style={{ margin: 15 }} color="primary" aria-label="Add" size="small" onClick={this.addToRequestArrears}>
                    {intl.formatMessage(messages.ycttThemMoi || { id: 'ycttThemMoi', defaultMessage: 'ycttThemMoi' })}
                  </CustomButton>
                </Grid>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên khoản truy thu</TableCell>
                      <TableCell>
                        {intl.formatMessage(
                          messages.yccNgayDatCoc || {
                            id: 'yccNgayDatCoc',
                            defaultMessage: 'Ngày tạo',
                          },
                        )}
                      </TableCell>
                      <TableCell>{intl.formatMessage(messages.ycttSoTien || { id: 'ycttSoTien', defaultMessage: 'ycttSoTien' })}</TableCell>
                      <TableCell>
                        {intl.formatMessage(
                          messages.ycttTrangThai || {
                            id: 'ycttTrangThai',
                            defaultMessage: 'ycttTrangThai',
                          },
                        )}
                      </TableCell>
                      <TableCell>Ghi chú</TableCell>
                      <TableCell>
                        {intl.formatMessage(
                          messages.ycttHanhDong || {
                            id: 'ycttHanhDong',
                            defaultMessage: 'ycttHanhDong',
                          },
                        )}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.requestArrears.length > 0
                      ? this.state.requestArrears.map((item, index) => (
                          <TableRow>
                            <TableCell>{item.arrearsName}</TableCell>
                            <TableCell>{moment(item.arrearsDate).format('YYYY-MM-DD')}</TableCell>
                            {/* <TableCell>{formatNumber(item.amount)}</TableCell> */}
                            <TableCell>
                              {!isNaN(Number(item.arrearsAmount)) &&
                                Number(item.arrearsAmount).toLocaleString('es-AR', {
                                  maximumFractionDigits: 0,
                                })}
                            </TableCell>

                            <TableCell>{item.arrearsStatus === 0 ? 'Chưa thanh toán' : item.arrearsStatus === 1 ? 'Đã thanh toán' : ''}</TableCell>

                            <TableCell>{item.note}</TableCell>
                            <TableCell>
                              <Fab color="primary" aria-label="Add" size="small" onClick={() => this.editToRequestArrears(index)}>
                                <Edit />
                              </Fab>
                              {/* &nbsp;&nbsp;
                               <Fab color="inherit" aria-label="Add" size="small" onClick={() => this.deleteToPaymentOrder(index)}>
                                 <InsertDriveFile />
                               </Fab> */}
                              &nbsp;&nbsp;
                              <Fab color="secondary" aria-label="Add" size="small" onClick={() => this.deleteToRequestArrears(index)}>
                                <Delete />
                              </Fab>
                            </TableCell>
                          </TableRow>
                        ))
                      : ''}
                  </TableBody>
                </Table>
              </Paper>
            )}
            {/* {this.state.value === 5 &&
              Number(id) !== 1 && (
                <Grid item md={12}>
                  <Paper>
                    <FileUpload disableWhenApproved code="Contract" name={this.state.name} id={id} />
                  </Paper>
                </Grid>
              )} */}
            {this.state.value === 5 && (
              <div style={{ width: '100%' }}>
                <TextField
                  label="File upload"
                  type="file"
                  onChange={this.handleChangeInputFile}
                  name="file"
                  // value={this.state.file ? this.state.file : null}
                  variant="outlined"
                  style={{ width: '100%' }}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label={intl.formatMessage(messages.yckTenFile || { id: 'yckTenFile', defaultMessage: 'yckTenFile' })}
                  onChange={this.handleChangeInput}
                  value={this.state.fileName}
                  name="fileName"
                  variant="outlined"
                  style={{ width: '100%' }}
                  margin="normal"
                />
                <TextField
                  label={intl.formatMessage(messages.ycttGhiChu || { id: 'ycttGhiChu', defaultMessage: 'ycttGhiChu' })}
                  multiline
                  rows={4}
                  onChange={this.handleChangeInput}
                  value={this.state.fileNote}
                  name="fileNote"
                  variant="outlined"
                  style={{ width: '100%' }}
                  margin="normal"
                />
                {this.state.arrFile.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{intl.formatMessage(messages.yckTenFile || { id: 'yckTenFile', defaultMessage: 'yckTenFile' })}</TableCell>
                        <TableCell>
                          {intl.formatMessage(messages.ycttNgayTaiLen || { id: 'ycttNgayTaiLen', defaultMessage: 'ycttNgayTaiLen' })}
                        </TableCell>
                        <TableCell>{intl.formatMessage(messages.ycttGhiChu || { id: 'ycttGhiChu', defaultMessage: 'ycttGhiChu' })}</TableCell>
                        <TableCell>{intl.formatMessage(messages.ycttTaiXuong || { id: 'ycttTaiXuong', defaultMessage: 'ycttTaiXuong' })}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.arrFile.length > 0
                        ? this.state.arrFile.map(item => {
                            const date = item.createdAt ? convertDatetimeToDate(item.createdAt) : '';
                            return (
                              <TableRow>
                                <TableCell>{item.nameFile}</TableCell>
                                <TableCell>{date}</TableCell>
                                <TableCell>{item.note}</TableCell>
                                <TableCell>
                                  <SaveAlt style={{ color: '#0795db', cursor: 'pointer' }} onClick={() => window.open(item.urlFile)} />
                                </TableCell>
                              </TableRow>
                            );
                          })
                        : ''}
                    </TableBody>
                  </Table>
                ) : (
                  ''
                )}
              </div>
            )}
            {/* {this.state.value === 3 && (
              <Paper style={{ width: '100%' }}>
                <Grid style={{ display: 'block' }}>
                  <CustomButton style={{ margin: 15 }} color="primary" aria-label="Add" size="small" onClick={this.addToDeliverPayment}>
                    {intl.formatMessage(messages.ycghThemMoi || { id: 'ycghThemMoi', defaultMessage: 'ycghThemMoi' })}
                  </CustomButton>
                </Grid>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{intl.formatMessage(messages.ycghGiaiDoan || { id: 'ycghGiaiDoan', defaultMessage: 'ycghGiaiDoan' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghThoiGian || { id: 'ycghThoiGian', defaultMessage: 'ycghThoiGian' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghCongTy || { id: 'ycghCongTy', defaultMessage: 'ycghCongTy' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghDiaDiem || { id: 'ycghDiaDiem', defaultMessage: 'ycghDiaDiem' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghSanPham || { id: 'ycghSanPham', defaultMessage: 'ycghSanPham' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghHanhDong || { id: 'ycghHanhDong', defaultMessage: 'ycghHanhDong' })}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.deliverimentRequest.length > 0
                      ? this.state.deliverimentRequest.map((item, index) => {
                        let count = 0;
                        item.products.forEach(n => {
                          if (n.exported && Number(n.exported) > 0) {
                            count++;
                          }
                        });
                        return (
                          <TableRow>
                            <TableCell>{this.state.paymentOrder[Number(item.stage)].name}</TableCell>
                            <TableCell>{item.timeDelivery}</TableCell>
                            <TableCell>{item.company}</TableCell>
                            <TableCell>{item.Address}</TableCell>
                            <TableCell>
                              <CustomButton color="primary" onClick={() => this.editTodeliverimentRequest(index, -2)}>
                                {intl.formatMessage(messages.ycghChiTiet || { id: 'ycghChiTiet', defaultMessage: 'ycghChiTiet' })}
                              </CustomButton>
                            </TableCell>
                            {count > 0 ? null : (
                              <TableCell>
                                <Fab color="primary" aria-label="Add" size="small" onClick={() => this.editTodeliverimentRequest(index, -1)}>
                                  <Edit />
                                </Fab>
                                &nbsp;&nbsp;
                                <Fab color="secondary" aria-label="Add" size="small" onClick={() => this.deleteTodeliverimentRequest(index)}>
                                  <Delete />
                                </Fab>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })
                      : ''}
                  </TableBody>
                </Table>
              </Paper>
            )} */}
          </Grid>
        </Paper>

        {/* -------- Danh sách báo giá ---------- */}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title" onClose={this.handleClose}>
            Danh sách báo giá
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            <Grid container spacing={8}>
              <Grid item md={4}>
                <CustomInputBase
                  label={intl.formatMessage(messages.hdTuNgay || { id: 'hdTuNgay', defaultMessage: 'hdTuNgay' })}
                  name="searchStartDay"
                  type="date"
                  value={this.state.searchStartDay}
                  onChange={this.handleChangeInput}
                />
              </Grid>

              <Grid item md={4}>
                <CustomInputBase
                  label={intl.formatMessage(messages.hdDenNgay || { id: 'hdDenNgay', defaultMessage: 'hdDenNgay' })}
                  name="searchEndDay"
                  type="date"
                  value={this.state.searchEndDay}
                  onChange={this.handleChangeInput}
                />
              </Grid>

              <Grid item md={4} className="pt-3">
                <CustomButton size="large" color="primary" onClick={this.searchOrder} className={classes.searchBtn}>
                  {intl.formatMessage(messages.timKiem || { id: 'timKiem', defaultMessage: 'timKiem' })}
                </CustomButton>
              </Grid>
            </Grid>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{intl.formatMessage(messages.hdMa || { id: 'hdMa', defaultMessage: 'hdMa' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.hdName || { id: 'hdName', defaultMessage: 'hdName' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.hdKhachHang || { id: 'hdKhachHang', defaultMessage: 'hdKhachHang' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.hdGiaTri || { id: 'hdGiaTri', defaultMessage: 'hdGiaTri' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.hdHanhDong || { id: 'hdHanhDong', defaultMessage: 'hdHanhDong' })}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.orderList.length > 0
                  ? this.state.orderList
                      .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                      .map((item, index) => {
                        let amount = 0;
                        if (item.products) {
                          item.products.forEach(n => {
                            amount += n.amount ? n.amount : 0;
                          });
                        }
                        return (
                          <TableRow>
                            <TableCell>{item.code}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.customer ? item.customer.name : ''}</TableCell>
                            <TableCell>{amount}</TableCell>
                            <TableCell>
                              <Fab
                                color="primary"
                                aria-label="Add"
                                size="small"
                                onClick={() => this.addToListOrder(index + this.state.page * this.state.rowsPerPage)}
                              >
                                <Add />
                              </Fab>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  : ''}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={this.state.orderList.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              backIconButtonProps={{
                'aria-label': 'Trang trước',
              }}
              nextIconButtonProps={{
                'aria-label': 'Trang tiếp theo',
              }}
              labelRowsPerPage="Hiển thị: "
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </DialogContent>
        </Dialog>

        {/* -------- Sửa sản phẩm ---------------  */}

        <Dialog
          open={this.state.openEditProduct}
          fullWidth
          maxWidth="md"
          onClose={this.handleCloseEditProduct}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onSave={() => {
            this.confirmEditProduct();
          }}
        >
          <DialogTitle id="alert-dialog-title" onClose={this.handleCloseEditProduct}>
            Sửa sản phẩm
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            <ValidatorForm style={{ width: '100%' }} onSubmit={this.handleSave}>
              <Grid item container md={12}>
                <Grid item md={12}>
                  <TextValidator
                    label="Giá sản phẩm"
                    name="costPrice"
                    value={this.state.chooseProductPrice && this.state.chooseProductPrice}
                    onChange={val =>
                      this.setState({
                        chooseProductPrice: Number(val.target.value) >= 0 ? val.target.value : 0,
                      })
                    }
                    variant="outlined"
                    type="number"
                    style={{ width: '100%', display: 'flex !important' }}
                    margin="normal"
                    // validators={['minNumber:0', this.state.currentStage.currency === '%' ? 'maxNumber: 100' : 'matchRegexp:[0-9]']}
                    // errorMessages={[
                    //   `${intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' })}`,
                    //   this.state.currentStage.currency === '%'
                    //     ? 'Không vượt quá 100%'
                    //     : `${intl.formatMessage(messages.canNhapSo || { id: 'canNhapSo', defaultMessage: 'canNhapSo' })}`,
                    // ]}
                  />

                  <TextValidator
                    label="Số lượng sản phẩm"
                    name="amount"
                    value={this.state.chooseProductAmount && this.state.chooseProductAmount}
                    onChange={val =>
                      this.setState({
                        chooseProductAmount: Number(val.target.value) >= 0 ? val.target.value : 1,
                      })
                    }
                    InputProps={{ inputProps: { min: 0 } }}
                    variant="outlined"
                    type="number"
                    style={{ width: '100%', display: 'flex !important' }}
                    margin="normal"
                    // validators={['minNumber:0', this.state.currentStage.currency === '%' ? 'maxNumber: 100' : 'matchRegexp:[0-9]']}
                    // errorMessages={[
                    //   `${intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' })}`,
                    //   this.state.currentStage.currency === '%'
                    //     ? 'Không vượt quá 100%'
                    //     : `${intl.formatMessage(messages.canNhapSo || { id: 'canNhapSo', defaultMessage: 'canNhapSo' })}`,
                    // ]}
                  />

                  {/* <TextValidator
                    label="Chiết khẩu"
                    name="discount"
                    value={this.state.chooseProductDiscount && this.state.chooseProductDiscount}
                    onChange={val =>
                      this.setState(val.target.value >= 0 || val.target.value == '' ? { chooseProductDiscount: val.target.value } : '')

                    }
                    variant="outlined"
                    type="number"
                    style={{ width: '100%', display: 'flex !important' }}
                    margin="normal"
                  // validators={['minNumber:0', this.state.currentStage.currency === '%' ? 'maxNumber: 100' : 'matchRegexp:[0-9]']}
                  // errorMessages={[
                  //   `${intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' })}`,
                  //   this.state.currentStage.currency === '%'
                  //     ? 'Không vượt quá 100%'
                  //     : `${intl.formatMessage(messages.canNhapSo || { id: 'canNhapSo', defaultMessage: 'canNhapSo' })}`,
                  // ]}
                  /> */}
                  {/* <Autocomplete
                    isMulti
                    name="Chọn... "
                    label="Tài sản"
                    suggestions={this.state.checkAsset}
                    onChange={value => this.setState({ chooseAssets: value })}
                    value={this.state.chooseAssets}
                    optionLabel="name"
                    optionValue="_id"
                  /> */}

                  <AsyncAutocomplete
                    isMulti
                    name="Chọn... "
                    label="Tài sản"
                    onChange={value => {
                      console.log('value', value);
                      this.setState({ chooseAssets: value });
                    }}
                    filter={this.state.assetFilter}
                    url={API_ASSET}
                    value={this.state.chooseAssets}
                  />
                </Grid>
              </Grid>
            </ValidatorForm>
          </DialogContent>
          {/* <DialogActions>
            <CustomButton
              onClick={() => {
                this.confirmEditProduct();
              }}
              color="primary"
              autoFocus
            >
              {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })}
            </CustomButton>
            <CustomButton onClick={this.handleCloseEditProduct}>
              {intl.formatMessage(messages.quayLai || { id: 'quayLai', defaultMessage: 'quayLai' })}
            </CustomButton>
          </DialogActions> */}
        </Dialog>

        {/* -------- Danh sách sản phẩm ---------- */}
        <Dialog
          open={this.state.openChooseSale}
          onClose={this.handleCloseChooseSale}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title" onClose={this.handleCloseChooseSale}>
            Danh sách sản phẩm
            {/* 111 */}
          </DialogTitle>
          <div style={{ padding: '0 20px' }}>
            <Autocomplete
              isMulti={false}
              name="Chọn... "
              label="Lọc sản phẩm"
              suggestions={this.state.allProduct}
              onChange={value => this.setState({ chooseProduct: value })}
              value={this.state.chooseProduct}
              optionLabel="name"
              optionValue="_id"
            />
          </div>
          <DialogContent style={{ paddingTop: '10px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{intl.formatMessage(messages.ycspName || { id: 'ycspName', defaultMessage: 'ycspName' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.ycspGia || { id: 'ycspGia', defaultMessage: 'ycspGia' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.ycspSoLuong || { id: 'ycspSoLuong', defaultMessage: 'ycspSoLuong' })}</TableCell>
                  <TableCell>
                    {intl.formatMessage(
                      messages.ycspDonViTinh || {
                        id: 'ycspDonViTinh',
                        defaultMessage: 'ycspDonViTinh',
                      },
                    )}
                  </TableCell>
                  {/* <TableCell>{intl.formatMessage(messages.ycspChietKhau || { id: 'ycspChietKhau', defaultMessage: 'ycspChietKhau' })}</TableCell>
                   <TableCell>{intl.formatMessage(messages.ycspThanhTien || { id: 'ycspThanhTien', defaultMessage: 'ycspThanhTien' })}</TableCell> */}
                  <TableCell>{intl.formatMessage(messages.hdHanhDong || { id: 'hdHanhDong', defaultMessage: 'hdHanhDong' })}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(this.state.allProduct) && this.state.allProduct.length > 0
                  ? this.state.chooseProduct && this.state.chooseProduct.name
                    ? this.state.allProduct
                        .filter(x => x.name === this.state.chooseProduct.name)
                        .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                        .map(item => {
                          let amount = 0;
                          if (item.sellingPoint) {
                            item.sellingPoint.forEach(n => {
                              amount += n.amount ? n.amount : 0;
                            });
                          }
                          return (
                            <TableRow>
                              <TableCell>
                                <CustomButton color="primary" onClick={() => this.toggleDrawer(item)}>
                                  {item.name}
                                </CustomButton>
                              </TableCell>
                              <TableCell>
                                {/* {item.costPrice ? formatNumber(item.costPrice) : item.x.pricePolicy ? formatNumber(item.x.pricePolicy.costPrice) : ''} */}
                                {item && item.pricePolicy && item.pricePolicy.allPrice
                                  ? Number(item.pricePolicy.allPrice).toLocaleString('es-AR', {
                                      maximumFractionDigits: 0,
                                    })
                                  : Number(item.pricePolicy.costPrice).toLocaleString('es-AR', {
                                      maximumFractionDigits: 0,
                                    })}
                              </TableCell>
                              <TableCell>{amount}</TableCell>
                              <TableCell>{item.unit ? item.unit.name : ''}</TableCell>
                              {/* <TableCell>{item.discount}%</TableCell>
                             <TableCell>
                               {item.x
                                 ? item.costPrice
                                   ? formatNumber((Number(item.costPrice) * parseInt(item.amount, 10) * (100 - item.discount)) / 100)
                                   : ''
                                 : ''}
                             </TableCell> */}
                              <TableCell>
                                <Fab color="primary" aria-label="Add" size="small" onClick={() => this.addToListOrder2(item)}>
                                  <Add />
                                </Fab>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    : this.state.allProduct
                        .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                        .map(item => {
                          let amount = 0;
                          if (item.sellingPoint) {
                            item.sellingPoint.forEach(n => {
                              amount += n.amount ? n.amount : 0;
                            });
                          }
                          return (
                            <TableRow>
                              <TableCell>
                                <CustomButton color="primary" onClick={() => this.toggleDrawer(item)}>
                                  {item.name}
                                </CustomButton>
                              </TableCell>
                              <TableCell>
                                {/* {item.costPrice ? formatNumber(item.costPrice) : item.x.pricePolicy ? formatNumber(item.x.pricePolicy.costPrice) : ''} */}
                                {item && item.pricePolicy && item.pricePolicy.allPrice
                                  ? Number(item.pricePolicy.allPrice).toLocaleString('es-AR', {
                                      maximumFractionDigits: 0,
                                    })
                                  : Number(item.pricePolicy.costPrice).toLocaleString('es-AR', {
                                      maximumFractionDigits: 0,
                                    })}
                              </TableCell>
                              <TableCell>{amount}</TableCell>
                              <TableCell>{item.unit ? item.unit.name : ''}</TableCell>
                              {/* <TableCell>{item.discount}%</TableCell>
                             <TableCell>
                               {item.x
                                 ? item.costPrice
                                   ? formatNumber((Number(item.costPrice) * parseInt(item.amount, 10) * (100 - item.discount)) / 100)
                                   : ''
                                 : ''}
                             </TableCell> */}
                              <TableCell>
                                <Fab color="primary" aria-label="Add" size="small" onClick={() => this.addToListOrder2(item)}>
                                  <Add />
                                </Fab>
                              </TableCell>
                            </TableRow>
                          );
                        })
                  : ''}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={this.state.allProduct.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              backIconButtonProps={{
                'aria-label': 'Trang trước',
              }}
              nextIconButtonProps={{
                'aria-label': 'Trang tiếp theo',
              }}
              labelRowsPerPage="Hiển thị: "
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={this.state.open3} onClose={this.handleClose3} fullWidth maxWidth="md">
          <DialogTitle id="alert-dialog-title" onClose={this.handleClose3}>
            {intl.formatMessage(messages.ycghCapnhat || { id: 'ycghCapnhat', defaultMessage: 'ycghCapnhat' })}
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            {/* &nbsp;&nbsp;&nbsp;
             <TextField
               label="Đến ngày"
               name="searchEndDay"
               type="date"
               value={this.state.searchEndDay}
               onChange={this.handleChangeInput}
               InputLabelProps={{
                 shrink: true,
               }}
               variant="outlined"
               style={{ width: '100%' }}
             /> */}
            <ValidatorForm style={{ width: '100%' }} onSubmit={this.handleSubmitForm}>
              <Grid item md={12} container>
                <Grid item md={12}>
                  <TextValidator
                    label={intl.formatMessage(
                      messages.ycghGiaiDoan || {
                        id: 'ycghGiaiDoan',
                        defaultMessage: 'ycghGiaiDoan',
                      },
                    )}
                    name="stage"
                    select
                    disabled={this.state.isEditDelivery === -2}
                    value={this.state.currentDeliverRequest.stage}
                    onChange={this.handleChangeInputDeliverRequest}
                    variant="outlined"
                    style={{ width: '100%' }}
                    validators={['required']}
                    margin="normal"
                    errorMessages={[
                      `${intl.formatMessage(
                        messages.truongBatBuoc || {
                          id: 'truongBatBuoc',
                          defaultMessage: 'truongBatBuoc',
                        },
                      )}`,
                    ]}
                  >
                    {this.state.paymentOrder.map((item, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <MenuItem value={index} key={index}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextValidator>
                </Grid>
                <TextValidator
                  label={intl.formatMessage(messages.ycghThoiGian || { id: 'ycghThoiGian', defaultMessage: 'ycghThoiGian' })}
                  name="timeDelivery"
                  type="date"
                  disabled={this.state.isEditDelivery === -2}
                  value={this.state.currentDeliverRequest.timeDelivery}
                  onChange={this.handleChangeInputDeliverRequest}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                  variant="outlined"
                  style={{ width: '100%' }}
                  validators={['required', 'trim']}
                  errorMessages={[
                    `${intl.formatMessage(
                      messages.truongBatBuoc || {
                        id: 'truongBatBuoc',
                        defaultMessage: 'truongBatBuoc',
                      },
                    )}`,
                    `${intl.formatMessage(
                      messages.truongBatBuoc || {
                        id: 'truongBatBuoc',
                        defaultMessage: 'truongBatBuoc',
                      },
                    )}`,
                  ]}
                />
                <TextValidator
                  label={intl.formatMessage(messages.ycghCongTy || { id: 'ycghCongTy', defaultMessage: 'ycghCongTy' })}
                  name="company"
                  disabled={this.state.isEditDelivery === -2}
                  value={this.state.currentDeliverRequest.company}
                  onChange={this.handleChangeInputDeliverRequest}
                  variant="outlined"
                  style={{ width: '100%' }}
                  margin="normal"
                  validators={['required', 'trim']}
                  errorMessages={[
                    `${intl.formatMessage(
                      messages.truongBatBuoc || {
                        id: 'truongBatBuoc',
                        defaultMessage: 'truongBatBuoc',
                      },
                    )}`,
                    `${intl.formatMessage(
                      messages.truongBatBuoc || {
                        id: 'truongBatBuoc',
                        defaultMessage: 'truongBatBuoc',
                      },
                    )}`,
                  ]}
                />
                <TextValidator
                  label={intl.formatMessage(messages.ycghDiaDiem || { id: 'ycghDiaDiem', defaultMessage: 'ycghDiaDiem' })}
                  name="Address"
                  disabled={this.state.isEditDelivery === -2}
                  value={this.state.currentDeliverRequest.Address}
                  onChange={this.handleChangeInputDeliverRequest}
                  variant="outlined"
                  margin="normal"
                  style={{ width: '100%' }}
                  validators={['required', 'trim']}
                  errorMessages={[
                    `${intl.formatMessage(
                      messages.truongBatBuoc || {
                        id: 'truongBatBuoc',
                        defaultMessage: 'truongBatBuoc',
                      },
                    )}`,
                    `${intl.formatMessage(
                      messages.truongBatBuoc || {
                        id: 'truongBatBuoc',
                        defaultMessage: 'truongBatBuoc',
                      },
                    )}`,
                  ]}
                />
              </Grid>
              <Paper style={{ marginTop: 20 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{intl.formatMessage(messages.ycghTen || { id: 'ycghTen', defaultMessage: 'ycghTen' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghDonGia || { id: 'ycghDonGia', defaultMessage: 'ycghDonGia' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghConLai || { id: 'ycghConLai', defaultMessage: 'ycghConLai' })}</TableCell>
                      <TableCell>
                        {intl.formatMessage(
                          messages.ycghSoLuong || {
                            id: 'ycghSoLuong',
                            defaultMessage: 'ycghSoLuong',
                          },
                        )}
                      </TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghDonVi || { id: 'ycghDonVi', defaultMessage: 'ycghDonVi' })}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.currentDeliverRequest.products.map((item, index) => {
                      const amountDelivery1 = this.state.amountDelivery.find(n => n.productId === item.productId);
                      const amountDelivery = Object.assign({}, amountDelivery1);
                      let amountDeliveryNumberic = Number(item.totalAmount) - (Number(amountDelivery.amount) || 0) - (Number(item.amount) || 0);
                      if (this.state.isEditDelivery > -1) {
                        // sửa
                        let totalDelivery = 0;
                        const { deliverimentRequest } = this.state;
                        deliverimentRequest.forEach((deli, indexDeli) => {
                          if (indexDeli !== this.state.isEditDelivery) {
                            const cur = deli.products.find(n => item.productId === n.productId);
                            totalDelivery += Number(cur.amount);
                          }
                        });
                        amountDeliveryNumberic = item.totalAmount - totalDelivery - (Number(item.amount) || 0);
                      }
                      if (Number(this.state.isEditDelivery) === -2) {
                        // xem
                        amountDeliveryNumberic = Number(item.totalAmount) - Number(amountDelivery.amount);
                      }
                      return (parseInt(amountDelivery.amount, 10) !== item.totalAmount && this.state.isEditDelivery === -1) ||
                        this.state.isEditDelivery === -2 ||
                        this.state.isEditDelivery > -1 ? (
                        <TableRow>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.price}</TableCell>
                          <TableCell>
                            {amountDeliveryNumberic}/{item.totalAmount}
                          </TableCell>
                          <TableCell>
                            <TextValidator
                              type="number"
                              variant="outlined"
                              style={{ width: 100 }}
                              disabled={this.state.isEditDelivery === -2}
                              name="amount"
                              validators={['minNumber:0', `maxNumber:${item.totalAmount - parseInt(amountDelivery.amount, 10)}`]}
                              errorMessages={[
                                `${intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' })}`,
                                `${intl.formatMessage(
                                  messages.khongVuotQuaSoLuong || {
                                    id: 'khongVuotQuaSoLuong',
                                    defaultMessage: 'khongVuotQuaSoLuong',
                                  },
                                )}`,
                              ]}
                              value={item.amount}
                              onChange={e => this.handleChangeInputDeliverRequestProduct(e, index)}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </TableCell>
                          <TableCell>{item.unit}</TableCell>
                        </TableRow>
                      ) : (
                        ''
                      );
                    })}
                  </TableBody>
                  <TableFooter />
                </Table>
              </Paper>
              <div style={{ display: 'none' }}>
                <button ref={this.submitBtn} type="submit" />
              </div>
            </ValidatorForm>
          </DialogContent>
          <DialogActions style={this.state.isEditDelivery === -2 ? { display: 'none' } : {}}>
            <CustomButton
              style={{ margin: 20 }}
              onClick={() => {
                this.submitBtn.current.click();
              }}
              color="primary"
              autoFocus
            >
              {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })}
            </CustomButton>
            <CustomButton style={{ margin: 20 }} onClick={this.handleClose3}>
              {intl.formatMessage(messages.quayLai || { id: 'quayLai', defaultMessage: 'quayLai' })}
            </CustomButton>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.open4} onClose={this.handleClose4}>
          <DialogTitle id="alert-dialog-title" onClose={this.handleClose4}>
            {intl.formatMessage(messages.thongBao || { id: 'thongBao', defaultMessage: 'thongBao' })}
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            {intl.formatMessage(
              messages.noiDungThongBaoXoa || {
                id: 'noiDungThongBaoXoa',
                defaultMessage: 'noiDungThongBaoXoa',
              },
            )}
          </DialogContent>
          <DialogActions style={this.state.isEditDelivery === -2 ? { display: 'none' } : {}}>
            <CustomButton style={{ margin: 20 }} onClick={() => this.deleteFromListOrder()} color="primary" autoFocus>
              {intl.formatMessage({ id: 'dialog.confirm' })}
            </CustomButton>
            <CustomButton style={{ margin: 20 }} onClick={this.handleClose4}>
              {intl.formatMessage({ id: 'dialog.cancel' })}
            </CustomButton>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  chooseOrderWithoutSale = () => {
    this.props.onGetAllProduct();
    this.setState({ openChooseSale: true });
  };

  editProduct = item => {
    this.setState({
      chooseItem: item,
      chooseProductPrice: item.costPrice,
      chooseProductAmount: item.amount,
      chooseProductDiscount: item.discount,
      chooseAssets: item.asset ? item.asset : [],
      openEditProduct: true,
    });
  };

  addAssetForContract = item => {
    this.setState({ openAsset: true });
  };

  confirmEditProduct = () => {
    const { orderProductChoose, chooseItem, chooseProductPrice, chooseProductAmount, chooseProductDiscount, chooseAssets } = this.state;
    const itemIndex = orderProductChoose.map(item => item.id).indexOf(chooseItem.id);
    orderProductChoose[itemIndex].costPrice = chooseProductPrice;
    orderProductChoose[itemIndex].amount = chooseProductAmount;
    orderProductChoose[itemIndex].discount = chooseProductDiscount;
    orderProductChoose[itemIndex].asset = chooseAssets;
    this.checkingUnallocatedAssets(orderProductChoose);
    this.handleCloseEditProduct();
  };

  checkingUnallocatedAssets = orderProductChoose => {
    const { assetFilter } = this.state;

    if (orderProductChoose) {
      let newAsset = [];
      orderProductChoose.map(asset => {
        if (asset && Array.isArray(asset.asset)) {
          newAsset = [...newAsset, ...asset.asset.map(a => a._id)];
        }
      });
      const newAssetFilter = {
        ...assetFilter,
        _id: { $nin: newAsset },
      };
      this.setState({ assetFilter: newAssetFilter });
    }
  };

  handleChangeAddedField = (index, e) => {
    const { fieldAdded } = this.state;
    const fields = [...fieldAdded];
    fieldAdded[index].value = e.target.value;
    this.setState({ fieldAdded: fields });
  };

  handleSubmit = () => {
    // const { match } = this.props;
    // debugger
    let error = false;
    if (!this.state.name) {
      this.setState({
        dateError: true,
      });
      error = true;
      this.props.onChangeSnackbar(true, `Tên hợp đồng không được bỏ trống!`, 'error');
    }
    //  if (this.state.expirationDay === null) {
    //    this.setState({
    //      expirationDayError: true,
    //    });
    //    error = true;
    //  }
    //  if (this.state.startDay === null) {
    //    this.setState({
    //      startDayError: true,
    //    });
    //    error = true;
    //  }
    // if (this.state.task === null && (this.state.catalogContract.toString() === '1' || this.state.catalogContract.toString() === '2')) {
    //   this.setState({
    //     searchTaskError: true,
    //   });
    //   error = true;
    // }
    //  if (this.state.contractSigningDate === null) {
    //    this.setState({
    //      contractSigningDateError: true,
    //    });
    //    error = true;
    //  }
    // if (parseInt(this.state.catalogContract, 10) === 1) {
    //   if (this.state.notice === '') {
    //     this.setState({
    //       noticeRequire: true,
    //     });
    //     error = true;
    //   }
    //   if (this.state.cycle === '') {
    //     this.setState({
    //       cycleRequire: true,
    //     });
    //     error = true;
    //   }
    // }
    //  if (this.state.code === '') {
    //    this.setState({
    //      codeError: true,
    //    });
    //    error = true;
    //  }
    //  const rex = /^[A-Za-z0-9]+$/;
    // if (!rex.test(this.state.code.trim())) {
    //   this.setState({
    //     codeTypeError: true,
    //   });
    //   error = true;
    // }
    //  if (Number(this.state.cycle) < 0) {
    //    this.setState({
    //      cycleMin: true,
    //    });
    //    error = true;
    //  }
    //  if (Number(this.state.notice) < 0) {
    //    this.setState({
    //      noticeMin: true,
    //    });
    //    error = true;
    //  }
    //  if (this.state.notice > this.state.cycle) {
    //    this.setState({
    //      cycleError: true,
    //    });
    //    error = true;
    //  }

    // if (this.state.startDay !== null && this.state.expirationDay !== null && this.state.contractSigningDate !== null) {
    if (this.state.expirationDay !== null && this.state.contractSigningDate !== null) {
      if (this.state.startDay >= this.state.expirationDay) {
        this.setState({
          dateError: true,
        });
        error = true;
        if (Number(this.state.catalogContract) === 1 || Number(this.state.catalogContract) === 2) {
          this.props.onChangeSnackbar(true, `Ngày bắt đầu phải nhỏ hơn bằng ngày bắt đầu và nhỏ hơn bằng ngày giao hàng!`, 'error');
        } else {
          this.props.onChangeSnackbar(true, `Ngày bắt đầu phải nhỏ hơn bằng ngày bắt đầu và nhỏ hơn bằng ngày hết hạn!`, 'error');
        }
      }
      //  if (this.state.contractSigningDate > this.state.startDay) {
      //    this.setState({
      //      dateError: true,
      //    });
      //    error = true;
      //    if (Number(this.state.catalogContract) === 1 || Number(this.state.catalogContract) === 2) {
      //      this.props.onChangeSnackbar(true, `Ngày kí hợp đồng phải nhỏ hơn bằng ngày bắt đầu và nhỏ hơn bằng ngày giao hàng!`, 'error');
      //    } else {
      //      this.props.onChangeSnackbar(true, `Ngày kí hợp đồng phải nhỏ hơn bằng ngày bắt đầu và nhỏ hơn bằng ngày hết hạn!`, 'error');
      //    }
      //  }
      //  if (this.state.contractSigningDate > this.state.expirationDay) {
      //    this.setState({
      //      dateError: true,
      //    });
      //    error = true;
      //    if (Number(this.state.catalogContract) === 1 || Number(this.state.catalogContract) === 2) {
      //      this.props.onChangeSnackbar(true, `Ngày kí hợp đồng phải nhỏ hơn bằng ngày bắt đầu và nhỏ hơn bằng ngày giao hàng!`, 'error');
      //    } else {
      //      this.props.onChangeSnackbar(true, `Ngày kí hợp đồng phải nhỏ hơn bằng ngày bắt đầu và nhỏ hơn bằng ngày hết hạn!`, 'error');
      //    }
      //  }
      if (this.state.expirationDay < this.state.contractSigningDate) {
        this.setState({
          dateError: true,
        });
        error = true;
        this.props.onChangeSnackbar(true, `Ngày hết hạn phải lớn hơn ngày kí hợp đồng!`, 'error');
        //  if (Number(this.state.catalogContract) === 1 || Number(this.state.catalogContract) === 2) {
        //    this.props.onChangeSnackbar(true, `Ngày hết hạn phải lớn hơn ngày kí hợp đồng!`, 'error');
        //  } else {
        //    this.props.onChangeSnackbar(true, `Ngày hết hạn phải lớn hơn ngày kí hợp đồng!`, 'error');
        //  }
      }
      //  if (this.state.expirationDay < moment(new Date()).format("YYYY-MM-DD")){
      //    this.setState({
      //      dateError: true,
      //    });
      //    error = true;
      //    if (Number(this.state.catalogContract) === 1 || Number(this.state.catalogContract) === 2) {
      //      this.props.onChangeSnackbar(true, `Ngày hết hạn phải lớn hơn ngày hiện tại!`, 'error');
      //    } else {
      //      this.props.onChangeSnackbar(true, `Ngày hết hạn phải lớn hơn ngày hiện tại!`, 'error');
      //    }
      //  }
    }

    // if (parseInt(this.state.catalogContract, 10) === 1 && !this.state.idCodeOrder) {
    //   this.props.onChangeSnackbar(
    //     true,
    //     `${this.props.intl.formatMessage(
    //       messages.hopDongThoiVuCanChonDonHang || { id: 'hopDongThoiVuCanChonDonHang', defaultMessage: 'hopDongThoiVuCanChonDonHang' },
    //     )}`,
    //     'error',
    //   );
    //   this.setState({
    //     saleError: true,
    //   });
    //   error = true;
    // }
    if (!error) {
      const others = {};
      if (this.state.fieldAdded.length > 0) {
        this.state.fieldAdded.forEach(item => {
          others[item.name.replace('others.', '')] = item.value;
        });
      }
      let kanbanStatus = 0;
      if (this.state.kanbanStatus === 0) {
        kanbanStatus = this.state.arrKanban[0] && this.state.arrKanban[0]._id;
      } else {
        kanbanStatus = this.state.kanbanStatus;
      }
      const body = {
        customerId: this.state.customerName && this.state.customerName._id,
        phoneCustomer: this.state.customerName && this.state.customerName.phoneNumber,
        name: this.state.name,
        code: this.state.code,
        catalogContract: this.state.catalogContract,
        contractSigningDate: this.state.contractSigningDate,
        contractHandoverDate: this.state.contractHandoverDate,
        startDay: this.state.startDay,
        expirationDay: this.state.expirationDay,
        belong: {
          contractId: this.state.belong,
          name: this.state.belongName,
        },
        cycle: this.state.cycle,
        notice: this.state.notice,
        apartmentCode: this.state.apartmentCode,
        typeContract: 1,
        paymentRequest: this.state.paymentOrder,
        deposit: this.state.requestDeposit,
        arrears: this.state.requestArrears,
        vehicleList: this.state.arrCar,
        saleQuotation:
          parseInt(this.state.catalogContract, 10) === 1 &&
          this.state.nameOrder &&
          this.state.nameOrder !== '' &&
          this.state.idCodeOrder &&
          this.state.idCodeOrder !== ''
            ? {
                name: this.state.nameOrder,
                saleQuotationId: this.state.idCodeOrder,
              }
            : undefined,
        listProduct: this.state.orderProductChoose,
        deliverimentRequest: this.state.deliverimentRequest,
        kanbanStatus,
        task: this.state.task ? { taskId: this.state.task._id || this.state.taskId, name: this.state.task.name } : null,
        // productType: '',
        productType: this.state.productType,
        otherRequest: {
          urlFile: this.state.file,
          nameFile: this.state.fileName,
          note: this.state.fileNote,
          createdAt: new Date(),
        },
        others,
        responsible: this.state.responsible,
      };
      console.log('body', body);
      if (this.state.typeContainer === 'add') {
        if (this.state.name !== '' && this.state.code !== '') {
          const newFile = body.otherRequest;
          body.otherRequest = this.state.arrFile;
          body.newFile = newFile;
          if (body.belong.contractId === 0) {
            body.belong = undefined;
          }

          this.props.onCreateContract(body);
        }
      } else {
        const { addContractPage } = this.props;
        const { contract } = addContractPage;

        const newFile = body.otherRequest;
        body.otherRequest = contract.otherRequest;
        body.newFile = newFile;
        if (body.belong.contractId === 0 || body.belong.contractId === '') {
          body.belong = undefined;
        }
        this.props.onUpdateContract(body);
      }
    }
    // debugger
  };

  handleChangeInputFile = e => {
    this.setState({ file: e.target.files[0] });
  };

  deleteToPaymentOrder = index => {
    const { paymentOrder } = this.state;
    paymentOrder.splice(index, 1);
    this.setState({ paymentOrder });
  };
  deleteToRequestDeposit = index => {
    const { requestDeposit } = this.state;
    requestDeposit.splice(index, 1);
    this.setState({ requestDeposit });
  };
  deleteToRequestArrears = index => {
    const { requestArrears } = this.state;
    requestArrears.splice(index, 1);
    this.setState({ requestArrears });
  };
  deleteCarRental = index => {
    const { arrCar } = this.state;
    arrCar.splice(index - 1, 1);
    this.setState({ arrCar, openDialogRemove: false });
  };

  editToPaymentOrder = index => {
    let { currentStage } = this.state;
    const { paymentOrder } = this.state;
    currentStage = paymentOrder[index];
    this.state.currentStage = currentStage;
    this.setState({ isEdit: index, open2: true });
  };
  editToRequestDeposit = index => {
    let { deposit } = this.state;
    const { requestDeposit } = this.state;
    deposit = requestDeposit[index];
    this.state.deposit = deposit;
    this.setState({ isEdit: index, openDialogDeposit: true });
  };
  editToRequestArrears = index => {
    let { arrears } = this.state;
    const { requestArrears } = this.state;
    arrears = requestArrears[index];
    this.state.arrears = arrears;
    this.setState({ isEdit: index, openDialogArrears: true });
  };
  editCarRental = index => {
    let { carRental } = this.state;
    const { arrCar } = this.state;

    carRental = arrCar[index];
    this.state.carRental = carRental;
    this.setState({ isEdit: index, openCarRental: true });
  };

  deleteTodeliverimentRequest = index => {
    const { deliverimentRequest, amountDelivery } = this.state;
    deliverimentRequest[index].products.forEach(item => {
      const x = amountDelivery.findIndex(n => n.productId === item.productId);
      amountDelivery[x].amount -= item.amount === '' ? 0 : parseInt(item.amount, 10);
    });
    deliverimentRequest.splice(index, 1);
    this.setState({ deliverimentRequest, amountDelivery });
  };

  editTodeliverimentRequest = (index, number) => {
    const { deliverimentRequest } = this.state;
    let { currentDeliverRequest } = this.state;
    currentDeliverRequest = Object.assign({}, deliverimentRequest[index]);
    const numberic = number === -1 ? index : number;
    this.setState({ currentDeliverRequest, isEditDelivery: numberic, open3: true });
  };

  onAddToListPayment = currentStage => {
    const { paymentOrder, isEdit } = this.state;
    // let { currentStage } = this.state;
    if (isEdit === -1) {
      paymentOrder.push(currentStage);
    } else {
      paymentOrder[isEdit] = currentStage;
    }
    currentStage = {
      name: '',
      statusPay: 0,
      timePay: date,
      amount: 0,
      contractWork: null,
      workCompleted: {},
      currency: 'VNĐ',
      totalPrice: '',
    };
    this.setState({ paymentOrder, currentStage, open2: false, isEdit: -1 });
  };
  onAddToListDeposit = deposit => {
    const { requestDeposit, isEdit } = this.state;
    if (isEdit === -1) {
      requestDeposit.push(deposit);
    } else {
      requestDeposit[isEdit] = deposit;
    }
    deposit = {
      depositName: '',
      depositStatus: 0,
      depositDate: moment().format('YYYY-MM-DD'),
      depositAmount: 0,
      depositUnit: 'VNĐ',
      note: '',
    };
    this.setState({ requestDeposit, deposit, openDialogDeposit: false, isEdit: -1 });
  };
  onAddToListArrears = arrears => {
    const { requestArrears, isEdit } = this.state;
    if (isEdit === -1) {
      requestArrears.push(arrears);
    } else {
      requestArrears[isEdit] = arrears;
    }
    arrears = {
      arrearsName: '',
      arrearsDate: moment().format('YYYY-MM-DD'),
      arrearsAmount: 0,
      arrearsUnit: 'VNĐ',
      arrearsStatus: 0,
      arrearsPaidAmount: 0,
      note: '',
    };
    this.setState({ requestArrears, arrears, openDialogArrears: false, isEdit: -1 });
  };
  AddCarRental = carRental => {
    const { arrCar, isEdit } = this.state;
    // let { currentStage } = this.state;

    if (isEdit === -1) {
      arrCar.push(carRental);
    } else {
      arrCar[isEdit] = carRental;
    }
    carRental = {
      product: [],
      namePepple: '',
      telephone: '',
      email: '',
      relative: '',
      expediency: '',
      carPlate: '',
      carColor: '',
      carCompany: '',
      carName: '',
      searchStartDay: '',
      searchEndDay: '',
      note: '',
    };
    this.setState({ arrCar, carRental, openCarRental: false });
  };

  handleSubmitForm = () => {
    const { deliverimentRequest, isEditDelivery, amountDelivery } = this.state;

    let { currentDeliverRequest } = this.state;
    if (isEditDelivery === -1) {
      currentDeliverRequest.products.forEach(pro => {
        const x = amountDelivery.findIndex(item => item.productId === pro.productId);
        amountDelivery[x].amount += pro.amount === '' ? 0 : parseInt(pro.amount, 10);
      });
      deliverimentRequest.push(currentDeliverRequest);
    } else {
      deliverimentRequest[isEditDelivery].products.forEach(item => {
        const x = currentDeliverRequest.products.find(n => n.productId === item.productId);
        if (item.amount !== x.amount) {
          const change = x.amount - item.amount;
          const y = amountDelivery.findIndex(item1 => item1.productId === item.productId);
          amountDelivery[y].amount += change;
        }
      });
      deliverimentRequest[isEditDelivery] = currentDeliverRequest;
    }
    currentDeliverRequest = {
      stage: '', // id của yêu cầu thanh toán paymentRequest
      timeDelivery: '',
      company: '',
      Address: '',
      products: [],
    };
    this.setState({
      deliverimentRequest,
      amountDelivery,
      currentDeliverRequest,
      open3: false,
      isEditDelivery: -1,
    });
  };

  handleAddSale = sale => {
    const choose = {
      taskId: sale._id,
      name: sale.name,
    };
    this.setState({ task: choose });
  };

  handleChangeInputStage = e => {
    const { currentStage } = this.state;
    currentStage[e.target.name] = e.target.value;
    this.setState({ currentStage });
  };

  handleChangeInputDeliverRequest = e => {
    const { currentDeliverRequest } = this.state;
    currentDeliverRequest[e.target.name] = e.target.value;
    this.setState({ currentDeliverRequest });
  };

  handleChangeInputDeliverRequestProduct = (e, index) => {
    const { currentDeliverRequest } = this.state;
    currentDeliverRequest.products[index][e.target.name] = e.target.value;
    this.setState({ currentDeliverRequest });
  };

  addToPaymentOrder = () => {
    const currentStage = {
      name: '',
      statusPay: 0,
      timePay: moment().format('YYYY-MM-DD'),
      amount: 0,
      contractWork: null,
      workCompleted: {},
      currency: 'VNĐ',
      totalPrice: '',
    };
    this.setState({ currentStage, open2: true });
  };
  addToRequestDeposit = () => {
    if (this.state.requestDeposit.length > 0) {
      this.props.onChangeSnackbar(true, `Chỉ được tạo 1 khoản cọc`, 'error');
    } else {
      const deposit = {
        depositName: '',
        depositStatus: 0,
        depositDate: moment().format('YYYY-MM-DD'),
        depositAmount: 0,
        depositUnit: 'VNĐ',
        note: '',
      };
      this.setState({ deposit, openDialogDeposit: true });
    }
  };
  addToRequestArrears = () => {
    const arrears = {
      arrearsName: '',
      arrearsDate: moment().format('YYYY-MM-DD'),
      arrearsAmount: 0,
      arrearsUnit: 'VNĐ',
      arrearsStatus: 0,
      arrearsPaidAmount: 0,
      note: '',
    };
    this.setState({ arrears, openDialogArrears: true });
  };
  addCarRental = () => {
    const { currentStage } = this.state;

    this.setState({ currentStage }, () => {
      this.setState({ openCarRental: true, isEdit: -1 });
    });
  };

  loadOptions2 = value => {
    if (!value.projectId || !value.projectId._id) {
      return;
    }
    const token = localStorage.getItem('token');
    const url = `${API_TASK_CONTRACT_PROJECT}/${value.projectId && value.projectId._id}`;
    let data;

    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(myJson => {
        // data = myJson.splice(0, 1);
        this.setState({
          jobs: myJson,
        });
      });
  };

  // updateProjects = () => {
  //   const token = localStorage.getItem('token');
  //   const url = `${API_TASK_PROJECT}/${this.state.task._id}`
  //   return fetch(url , {
  //     method: 'PUT',
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  // }

  addToDeliverPayment = () => {
    const { itemChoose, orderProductChooseAPI, orderProductChoose } = this.state;
    const products = [];
    if (itemChoose === null) {
      this.props.onChangeSnackbar(
        true,
        `${this.props.intl.formatMessage(
          messages.baoGiaBanHangBiXoa || {
            id: 'baoGiaBanHangBiXoa',
            defaultMessage: 'baoGiaBanHangBiXoa',
          },
        )}`,
        'error',
      );
      return;
    }
    if (itemChoose.products && itemChoose.products.length > 0 && orderProductChooseAPI.length > 0) {
      itemChoose.products.forEach(item => {
        orderProductChooseAPI.forEach(pro => {
          if (pro._id === item.productId) {
            const x = orderProductChoose.find(n => n.productId === item.productId);
            products.push({
              productId: item.productId,
              name: item.name,
              amount: 0,
              price: x.costPrice ? Number(x.costPrice) : 0,
              unit: pro.unit ? pro.unit.name : '',
              totalAmount: Number(x.amount),
            });
          }
        });
      });
    }
    const currentDeliverRequest = {
      stage: '', // id của yêu cầu thanh toán paymentRequest
      timeDelivery: '',
      company: '',
      Address: '',
      products,
    };
    this.setState({ currentDeliverRequest, isEditDelivery: -1, open3: true });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  // Thay đổi số dòng trên một trang
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  addToListOrder = index => {
    const { orderList } = this.state;
    const itemChoose = this.props.itemSales ? this.props.itemSales : orderList[index];

    let totalMoney = 0;
    itemChoose.products.forEach(n => {
      totalMoney += (Number(n.costPrice) * Number(n.amount) * Number(100 - Number(n.discount) || 0)) / 100;
    });

    this.props.onSetEmpty();
    this.props.onGetProduct(itemChoose);
    this.props.onGetCustomer(itemChoose.customer);
    this.setState({
      idCodeOrder: itemChoose._id,
      orderProductChoose: itemChoose.products ? itemChoose.products : [],
      open: false,
      orderList: [],
      itemChoose,
      nameOrder: itemChoose.name,
      totalMoney,
    });
  };

  notiSuccess = value => {
    this.props.enqueueSnackbar('Thêm sản phẩm ' + value + ' thành công', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  };

  addToListOrder2 = value => {
    const { orderProductChoose } = this.state;
    let choose = null;
    if (value) {
      if (orderProductChoose.length > 0) {
        choose = orderProductChoose.find(item => item.id === value._id);
        if (choose === null || !choose) {
          orderProductChoose.push({
            id: value._id,
            name: value.name,
            amount: 1,
            pricePolicy: value.pricePolicy,
            costPrice: value.pricePolicy.costPrice,
            unit: value.unit.name,
            discount: 0,
          });
          this.notiSuccess(value.name);
        } else {
          orderProductChoose.map(item => {
            if (item.id === value._id) {
              item.amount += 1;
            }
          });
          choose = null;
          this.notiSuccess(value.name);
        }
      } else {
        orderProductChoose.push({
          id: value._id,
          name: value.name,
          amount: 1,
          pricePolicy: value.pricePolicy,
          costPrice: value.pricePolicy.costPrice,
          unit: value.unit.name,
          discount: 0,
        });
        this.notiSuccess(value.name);
      }
    }
  };

  deleteFromListOrder = () => {
    const { orderProductChoose, chooseItem } = this.state;
    const removeIndex = orderProductChoose.map(item => item.id).indexOf(chooseItem.id);
    orderProductChoose.splice(removeIndex, 1);
    this.checkingUnallocatedAssets(orderProductChoose);
    this.handleClose4();
  };

  confirmDelete = val => {
    this.setState({
      chooseItem: val,
      open4: true,
    });
  };

  searchOrder = () => {
    const { searchStartDay, searchEndDay } = this.state;
    const start = `${searchStartDay}T00:00:00.000Z`;
    const end = `${searchEndDay}T23:59:00.000Z`;
    const params = serialize({
      filter: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    });

    this.props.onGetOrder(params);
  };

  handleClose = () => {
    this.setState({ open: false, orderList: [] });
  };

  handleClose2 = () => {
    this.setState({ open2: false });
  };

  handleClose3 = () => {
    this.setState({ open3: false });
  };

  handleClose4 = () => {
    this.setState({ open4: false });
  };
  handleCloseDialogDeposit = () => {
    this.setState({ openDialogDeposit: false });
  };
  handleCloseDialogArrears = () => {
    this.setState({ openDialogArrears: false });
  };
  handleCarRental = () => {
    this.setState({ openCarRental: false });
  };

  handleCloseChooseSale = () => {
    this.setState({ openChooseSale: false, orderList: [] });
  };

  handleCloseEditProduct = () => {
    this.setState({
      chooseProductPrice: null,
      chooseProductAmount: null,
      chooseProductDiscount: null,
      chooseAssets: [],
      openEditProduct: false,
    });
  };

  chooseOrder = () => {
    this.setState({ open: true });
  };

  handleFilter = () => {
    if (this.state.customerName === null) {
      return {};
    }
    const customerId = this.state.customerName._id || this.state.customerName.customerId;
    if (!!customerId) {
      return { customer: customerId };
    }
    return {};
  };

  handleChangeInput = e => {
    if (e.target.name === 'catalogContract') {
      this.setState({
        customerName: null,
        belong: 0,
      });
    }
    if (e.target.name === 'catalogContract' && e.target.value === 1) {
      this.setState({ value: 0 });
    }
    if (e.target.name === 'catalogContract' && e.target.value === 0) {
      this.setState({ value: 1 });
    }
    if (e.target.name === 'belong') {
      const item = this.props.addContractPage.allContract.find(item => item._id === e.target.value);

      if (item) {
        this.state.belongName = item.name;
        // this.state.contractSigningDate = convertDatetimeToDate(item.contractSigningDate);
        // this.state.contractHandoverDate = convertDatetimeToDate(item.contractHandoverDate);
        this.state.startDay = convertDatetimeToDate(item.startDay);
        this.state.paymentOrder = item.paymentRequest;
        this.state.requestDeposit = item.deposit;
        this.state.requestArrears = item.arrears;
        this.state.arrFile = item.otherRequest;
        if (item.customerId) {
          this.props.onGetCustomerInfo(item.customerId);
        }
        // if (item.customerId) {
        //   this.props.onGetCustomerInfo(item.customerId._id);
        // }
        // this.state.expirationDay = convertDatetimeToDate(item.expirationDay);
      }
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeDate = (e, name) => {
    const names = name;
    const value = moment(e).format('YYYY-MM-DD');
    console.log('ssss', value, e);
    this.setState({ [names]: value });
  };

  handleChangeTabList = (event, value) => {
    this.setState({ value });
  };

  loadOptions = (newValue, callback, api) => {
    const token = localStorage.getItem('token');
    const url = `${api}?filter%5Bname%5D%5B%24regex%5D=${newValue}&filter%5Bname%5D%5B%24options%5D=gi${
      api === API_TASK_PROJECT ? '&filter%5BisProject%5D=true' : ''
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

AddContractPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addContractPage: makeSelectAddContractPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllContract: params => {
      dispatch(getAllContractAct(params));
    },
    onGetOrder: params => {
      dispatch(getOrderAct(params));
    },
    onGetAllProduct: params => {
      dispatch(getAllProductAct(params));
    },
    onGetProduct: params => {
      dispatch(getProductAct(params));
    },
    onGetCustomer: params => {
      dispatch(getCustomerAct(params));
    },
    onGetCustomerInfo: id => {
      dispatch(getCustomerInfo(id));
    },
    onSetEmpty: () => {
      dispatch(setEmptyAct());
    },
    onCreateContract: body => {
      dispatch(createContractAct(body));
    },
    onUpdateContract: body => {
      dispatch(updateContractAct(body));
    },
    onDefaultAction: body => {
      dispatch(resetNoti(body));
    },
    onGetContractById: id => {
      dispatch(getContractById(id));
    },
    onGetSaleQuoById: id => {
      dispatch(getSaleQuoById(id));
    },
    onChangeSnackbar: (status, message, variant) => {
      dispatch(changeSnackbar({ status, message, variant }));
    },
    getAllAsset: () => dispatch(getAllAsset()),
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

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addContractPage', reducer });
const withSaga = injectSaga({ key: 'addContractPage', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddContractPage);
