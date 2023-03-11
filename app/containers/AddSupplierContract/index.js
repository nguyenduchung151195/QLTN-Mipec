/* eslint-disable consistent-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable array-callback-return */
/**
 *
 * AddSupplierContract
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
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
  Dialog,
  DialogContent,
  Button,
  Toolbar,
  Fab,
  TablePagination,
  AppBar,
  DialogActions,
  TableFooter,
  FormHelperText,
  Drawer,
} from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Close, Add, Delete, Edit, SaveAlt } from '@material-ui/icons';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import moment from 'moment';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddSupplierContract from './selectors';
import reducer from './reducer';
import saga, { getSaleQuoById } from './saga';
import CustomInputBase from 'components/Input/CustomInputBase';
import {
  getAllContractAct,
  getOrderAct,
  createContractAct,
  getProductAct,
  setEmptyAct,
  getContractById,
  updateContractAct,
  getCustomerAct,
  resetNoti,
  getAllProductAct,
} from './actions';
import styles from './styles';
import { sortTask, fetchData } from '../../helper';
import { serialize, convertDatetimeToDate, getLabelName } from '../../utils/common';
import { API_TASK_PROJECT, API_USERS, API_SUPPLIERS } from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import KanbanStepper from '../../components/KanbanStepper';
import ProductInforDrawer from '../../components/ProductInforDrawer';
import UpdatePaymentRequestDialog from '../../components/UpdatePaymentRequestDialog';
import UpdateDepositDialog from '../../components/UpdateDepositDialog';
import UpdateArrearsDialog from '../../components/UpdateArrearsDialog';
import UpdateCarRentaltDialog from '../../components/UpdateCarRentaltDialog';
import DialogAcceptRemove from '../../components/DialogAcceptRemove';

import messages from './messages';
import TextFieldCode from '../../components/TextFieldCode';
import CustomDatePicker from '../../components/CustomDatePicker';
import CustomAppBar from 'components/CustomAppBar';
import { AsyncAutocomplete, Autocomplete } from '../../components/LifetekUi';
import { viewConfigCheckForm } from 'utils/common';
import CustomButton from '../../components/Button/CustomButton';
import { withSnackbar } from 'notistack';
import { format } from 'date-fns';

// const tempDate = new Date();
// const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1}-${
//   tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()
// }`;
const dateRaw = moment().format('YYYY-MM-DD');
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
  if (num) return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return '';
}

/* eslint-disable react/prefer-stateless-function */
export class AddSupplierContract extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
  }

  state = {
    value: 0,
    open: false,
    open2: false,
    open3: false,
    //
    openDialogDeposit: false,
    openDialogArrears: false,
    openEditProduct: false,
    openCarRental: false,
    //
    searchStartDay: date,
    searchEndDay: date,
    orderList: [],
    itemChoose: {},
    orderProductChoose: [],
    orderProductChooseAPI: [],
    catalogContract: '1',
    contractSigningDate: date,
    belong: 0,
    startDay: date,
    deliveryDay: date,
    // deliveryDay: date,
    paymentOrder: [],
    name: '',
    code: '',
    cycle: '',
    nameOrder: '',
    idCodeOrder: '',
    notice: '',
    // numberOrders: '',
    expirationDay: date,
    // statusContract: 0,
    // contractPrinciples: [],
    kanbanStatus: 0,
    arrKanban: [],
    rowsPerPage: 5, // số hàng hiển thị trên một bảng
    page: 0, // trang hiện tại
    currentStage: {
      name: '',
      statusPay: 0,
      timePay: moment().format('YYYY-MM-DD'),
      amount: 0,
      template: null,
      workCompleted: {},
      currency: 'VNĐ',
      VAT: false,
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
    nameError: false,
    cycleError: false,
    dateError: false,
    typeContainer: null,
    belongName: '',
    typeContract: 0,
    saleError: false,

    expirationDayError: false,
    startDayError: false,
    contractSigningDateError: false,
    deliveryDayError: false,
    cycleRequire: false,
    noticeRequire: false,
    openDetail: false,
    cycleMin: false,
    noticeMin: false,
    task: null,
    product: {},
    customer: {},
    amountDelivery: [],
    fieldAdded: [],
    totalMoney: 0,
    debtMoney: 0,
    jobs: null,
    listContractTypes: [],
    responsible: null,

    localMessages: {},
    contractColumns:
      JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'ContractSupper') &&
      JSON.parse(localStorage.getItem('viewConfig'))
        .find(item => item.code === 'ContractSupper')
        .listDisplay.type.fields.type.columns.map(item => ({ ...item, name: item.name.replace(/\./g, '_') })),

    supplierId: {},
    supplierIdCode: '',

    openChooseSale: false,
    orderProductChoose: [],
    nameOrder: '',
    allProduct: [],
    chooseItem: null,
    chooseProductPrice: null,
    chooseProductAmount: null,
    chooseProductDiscount: null,
    chooseAssets: [],
    open4: false,

    totalPaidMoney: 0,
    //update 15/11/2022
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
    requestDeposit: [],
    arrCar: [],
    requestArrears: [],
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
  };

  componentWillMount() {
    const { match } = this.props;
    if (window.location.pathname.split('/').includes('edit')) {
      this.props.onGetContractById(match.params.id);
      this.state.typeContainer = 'edit';
    } else {
      this.state.typeContainer = 'add';
      // this.props.onGetAllContract(match.params.id);
    }
    this.props.onDefaultAction();
  }

  componentDidMount() {
    const listCrmSource = JSON.parse(localStorage.getItem('crmSource')) || [];
    const contractTypeSource = listCrmSource.find(i => i.code === 'S15');
    let newListContractTypes = [];
    if (contractTypeSource) {
      newListContractTypes = contractTypeSource.data;
    }
    this.setState({ listContractTypes: newListContractTypes });
    if (this.state.typeContainer === 'add') {
      this.state.typeContract = this.props.match.params.id;
    }
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.find(item => item.code === 'Contract');
    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }
  }

  componentWillUpdate(props) {
    const { successCreate } = props.addSupplierContract;
    if (successCreate) {
      this.props.onDefaultAction();
      props.history.value = 2;
      // this.props.history.push('/crm/Contract');
      this.props.history.push('/tower/contract');
    }
  }

  componentWillReceiveProps(props) {
    if (props.addSupplierContract) {
      const localMessages = viewConfigCheckForm('Contract', props.addSupplierContract);
      this.setState({
        localMessages,
      });
    }
    if (props !== this.props) {
      const { addSupplierContract } = props;
      const contractPrinciples = addSupplierContract.allContract || [];
      const allProduct =
        (addSupplierContract && Array.isArray(addSupplierContract.allProduct) && addSupplierContract.allProduct.filter(f => f.isService === false)) ||
        [];
      // const kanbanStatus = addSupplierContract.status || {};
      const arrOrder = addSupplierContract.allOrder || [];
      const arrProduct = addSupplierContract.listProduct || [];
      const customer = addSupplierContract.customer || {};
      const arr = [];
      contractPrinciples.forEach(item => {
        if (item.catalogContract === 0) {
          arr.push(item);
        }
      });
      const status = JSON.parse(localStorage.getItem('crmStatus'));
      const kanbanStatus = status.find(item => item.code === 'ST30');
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
      const amountDelivery = arrProduct.map(item => ({
        productId: item._id,
        amount: 0,
      }));
      const arrKanban = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
      this.setState({ arrKanban, amountDelivery, orderList: arrOrder, orderProductChooseAPI: arrProduct, customer, allProduct }); // contractPrinciples: arr,
      const { contract, saleQuo } = addSupplierContract;
      const listProduct = contract && Array.isArray(contract.listProduct) ? contract.listProduct : [];
      if (this.props.match.params.id !== '1' && this.props.match.params.id !== '2' && this.state.orderProductChoose.length === 0) {
        //   this.state.orderProductChoose = saleQuo ? (saleQuo.products ? saleQuo.products : []) : [];
        //   if (Object.keys(saleQuo).length > 0) {
        //     let totalMoney = 0;
        //     saleQuo.products.forEach(n => {
        //       totalMoney += (Number(n.costPrice) * Number(n.amount) * Number(100 - Number(n.discount) || 0)) / 100;
        //     });
        //     this.setState({ totalMoney });
        //   }
        // }
        this.state.orderProductChoose = listProduct;
        let totalMoney = 0;
        listProduct.forEach(n => {
          const amount = Number(n.amount) || 0;
          const discount = Number(n.discount) || 0;
          const price = n.pricePolicy
            ? Number(n.pricePolicy.allPrice) > 0
              ? Number(n.pricePolicy.allPrice)
              : Number(n.pricePolicy.costPrice) > 0
                ? Number(n.pricePolicy.costPrice)
                : 0
            : 0;
          totalMoney += (Number(price) * Number(amount) * Number(100 - Number(discount))) / 100;
        });
        this.setState({ totalMoney });
      }
      if (
        this.props.match.params.id !== '1' &&
        this.props.match.params.id !== '2' &&
        this.state.itemChoose &&
        Object.keys(this.state.itemChoose).length === 0
      ) {
        this.state.itemChoose = saleQuo;
      }
      if (
        this.props.addSupplierContract.contract !== props.addSupplierContract.contract &&
        this.state.typeContainer === 'edit' &&
        contract !== this.props.contract &&
        contract.code
      ) {
        this.state.catalogContract = contract.catalogContract;
        this.state.name = contract.name;
        this.state.code = contract.code;
        if (contract.task) {
          this.state.task = contract.task;
          if (contract.task.taskId) {
            this.getProjectTree(contract.task.taskId);
          }
        }
        convertDatetimeToDate(contract.expirationDay);
        this.state.deliverimentRequest = contract.deliverimentRequest || [];
        this.state.typeContract = contract.typeContract || '';
        this.state.belong = contract.belong ? contract.belong.contractId : '';
        this.state.kanbanStatus = contract.kanbanStatus;
        this.state.contractSigningDate = contract.contractSigningDate && convertDatetimeToDate(contract.contractSigningDate);
        this.state.expirationDay = contract.expirationDay && convertDatetimeToDate(contract.expirationDay);
        this.state.startDay = contract.startDay && convertDatetimeToDate(contract.startDay);
        this.state.deliveryDay = contract.deliveryDay && convertDatetimeToDate(contract.deliveryDay);
        this.state.dataPay = contract.paymentOrder || '';
        this.state.cycle = contract.cycle || null;
        this.state.supplierId = contract.supplierId || {};
        this.state.responsible = contract.responsible || {};
        // this.state.notice = contract.notice || null;
        this.state.note = contract.note || null;
        this.state.arrFile = contract.otherRequest;
        this.state.paymentOrder = contract.paymentRequest;
        this.state.currentStage = contract.paymentRequest || {};
        this.state.arrCar = contract.vehicleList;
        this.state.requestDeposit = contract.deposit;
        this.state.requestArrears = contract.arrears;
        if (parseInt(contract.catalogContract, 10) === 1) {
          this.state.idCodeOrder = contract.order ? contract.order.orderId : '';
          this.state.nameOrder = contract.order ? contract.order.name : '';
        }
        // this.state.nameOrder = contract.nameOrder|| '';
        this.state.orderProductChooseAPI = listProduct || [];
        this.state.orderProductChoose = saleQuo.products || [];
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
    }
  }

  toggleDrawer = product => {
    const { openDetail } = this.state;
    this.setState({
      openDetail: !openDetail,
      product,
    });
  };

  getProjectTree(projectId) {
    const filter = serialize({ filter: { projectId, status: 1 } });
    fetchData(`${API_TASK_PROJECT}?${filter}`, 'GET').then(projects => {
      const newProject = sortTask(projects.data, [], projectId, true);
      this.setState({ jobs: { data: newProject } });
    });
  }
  checkRequest = value => {
    const { contractColumns } = this.state;
    const column = Array.isArray(contractColumns) ? contractColumns.filter(data => data.name === value) : [];
    if (!this.isEmptyObject(column)) {
      return column[0].checkedRequireForm;
    }
  };

  checkShowForm = value => {
    const { contractColumns } = this.state;
    const column = Array.isArray(contractColumns) ? contractColumns.filter(data => data.name === value) : [];
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
  render() {
    const { classes, addSupplierContract, match, intl } = this.props;
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    let { orderProductChoose, orderList, currentStage, paymentOrder, totalMoney } = this.state;
    const { orderProductChooseAPI, deliverimentRequest, arrKanban, kanbanStatus } = this.state;
    const { rowsPerPage, page } = this.state;

    if (orderProductChoose.length > 0 && orderProductChooseAPI.length > 0) {
      orderProductChoose = orderProductChoose.map(item => {
        const x = orderProductChooseAPI.find(n => n._id === item.productId);
        return {
          ...item,
          x,
        };
      });
    }
    if (deliverimentRequest.length > 0 && deliverimentRequest[0]._id && orderProductChoose.length > 0 && orderProductChooseAPI.length > 0) {
      const temp = [];
      deliverimentRequest.forEach(item => {
        const products = [];
        item.products.forEach(pro => {
          const x = orderProductChoose.find(i => i.productId === pro.productId);
          products.push({
            productId: pro.productId,
            name: pro.name,
            amount: pro.amount,
            totalAmount: x.amount,
            price: x.pricePolicy ? x.x.pricePolicy.costPrice : 0,
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
    const newListContractTypes = [
      {
        index: 1,
        title: 'Hợp đồng nhà cung cấp',
        value: '1',
        _id: '60e2b7a51719ae0649aa7278',
      },
      {
        index: 1,
        title: 'Hợp đồng kinh tế',
        value: '0',
        _id: '60e2b7a51719ae0649aa7279',
      },
    ];

    let total = 0;
    Array.isArray(orderProductChoose) &&
      orderProductChoose.map(item => {
        total += Number(item.costPrice) * parseInt(item.amount, 10) * (1 - item.discount / 100);
      });
    let totalPaidMoney = 0;
    Array.isArray(paymentOrder) &&
      paymentOrder.map(item => {
        totalPaidMoney += Number(item.amount);
      });
    const debtMoney = Number(total) - Number(totalPaidMoney);

    return (
      <div>
        {addSupplierContract.loading ? <LoadingIndicator /> : null}
        <CustomAppBar
          title={
            id === '2'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới Hợp đồng NCC' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật Hợp đồng NCC' })}`
          }
          onGoBack={() => {
            this.props.history.value = 2;
            this.props.history.goBack();
          }}
          onSubmit={this.handleSubmit}
        />
        <Helmet>
          <title>{this.state.typeContainer === 'edit' ? 'Cập nhật hợp đồng' : 'Thêm mới hợp đồng'}</title>
          <meta name="description" content="Description of addSupplierContract" />
        </Helmet>
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
            {this.state.openDetail ? <ProductInforDrawer product={this.state.product.x} currentStock={null} onClose={this.toggleDrawer} /> : null}
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
                {intl.formatMessage(messages.thongTinHopDong || { id: 'thongTinHopDong', defaultMessage: 'thongTinHopDong' })}
              </Typography>
            </Grid>
            <Grid item md={6}>
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
            <Grid item md={6}>
              <CustomInputBase
                label={getLabelName('name', 'Contract')}
                name="name"
                required
                error={this.state.nameError}
                onChange={this.handleChangeInput}
                value={this.state.name}
                variant="outlined"
                fullWidth
                aria-describedby="component-error-text"
              />
              <FormHelperText id="component-error-text" style={this.state.nameError ? { color: 'red' } : { color: 'red', display: 'none' }}>
                {intl.formatMessage(messages.tenTrong || { id: 'tenTrong', defaultMessage: 'tenTrong' })}
              </FormHelperText>
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                id="standard-select-currency"
                select
                label={getLabelName('catalogContract', 'Contract')}
                name="catalogContract"
                value={this.state.catalogContract}
                onChange={this.handleChangeInput}
                disabled={this.state.typeContainer === 'edit'}
                required
              >
                {/* {this.state.listContractTypes.map((i, index) => (
                  <MenuItem value={i.value}>{i.title}</MenuItem>
                ))} */}
                {newListContractTypes.map((i, index) => (
                  <MenuItem value={i.value}>{i.title}</MenuItem>
                ))}
              </CustomInputBase>
            </Grid>

            <Grid item md={6}>
              <CustomDatePicker
                label={getLabelName('contractSigningDate', 'Contract')}
                name="contractSigningDate"
                variant="outlined"
                onChange={e => this.handleChangeInput(e, true)}
                value={this.state.contractSigningDate}
                style={{ width: '100%' }}
                // InputProps={{ inputProps: { max: dateRaw } }}
                InputLabelProps={{
                  shrink: true,
                }}
                error={this.state.contractSigningDateError}
                right={40}
              />
              <FormHelperText
                id="component-error-text"
                style={this.state.contractSigningDateError ? { color: 'red' } : { color: 'red', display: 'none' }}
              >
                {intl.formatMessage(messages.ngayKiTrong || { id: 'ngayKiTrong', defaultMessage: 'ngayKiTrong' })}
              </FormHelperText>
            </Grid>
            <Grid item md={6}>
              <AsyncAutocomplete
                label="TÊN NHÀ CUNG CẤP"
                onChange={value => this.setState({ supplierId: value, supplierIdCode: value && value.code ? value.code : '' })}
                url={API_SUPPLIERS}
                value={this.state.supplierId}
                error={this.state.supplierId === null && this.checkRequest('supplierId')}
                helperText={this.state.supplierId === null && this.checkRequest('supplierId') && localMessages.supplierId}
                required={this.checkRequest('supplierId')}
              />
            </Grid>
            {/* <Grid item md={6}>
              <CustomInputBase
                label='MÃ NHÀ CUNG CẤP'
                name="supplierIdCode"
                value={this.state.supplierIdCode}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true
                }}

              />
            </Grid> */}

            <Grid item md={6}>
              <CustomDatePicker
                label="NGÀY GIAO HÀNG"
                name="deliveryDay"
                // error={this.state.dateError || this.state.deliveryDayError}
                value={this.state.deliveryDay}
                InputLabelProps={{
                  shrink: true,
                }}
                // onChange={e => this.handleChangeInput(e, false)}
                onChange={e => this.setState({ deliveryDay: moment(e).format('YYYY-MM-DD') })}
                required={this.checkRequest('deliveryDay')}
                error={
                  (this.state.dateError ||
                    this.state.deliveryDayError ||
                    this.state.deliveryDay === date) &&
                  this.checkRequest('deliveryDay')
                }
                variant="outlined"
                style={{ width: '100%' }}
                right={40}
              />

              <FormHelperText id="component-error-text"
               style={this.state.deliveryDayError && this.checkRequest('deliveryDay') ? { color: 'red' } : { color: 'red', display: 'none' }}>
                {intl.formatMessage(messages.ngayGiaoHangTrong || { id: 'ngayGiaoHangTrong', defaultMessage: 'ngayGiaoHangTrong' })}
                {/* {localMessages.deliveryDay} */}
              </FormHelperText>
            </Grid>
            {/* <Grid item md={6}>
                <CustomDatePicker
                  label="Ngày hết hạn"
                  name="expirationDay"
                  value={this.state.expirationDay}
                  error={this.state.dateError || this.state.expirationDayError}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e => this.handleChangeInput(e, false)}
                  variant="outlined"
                  style={{ width: '100%' }}
                />
                <FormHelperText
                  id="component-error-text"
                  style={this.state.expirationDayError ? { color: 'red' } : { color: 'red', display: 'none' }}
                >
                  {intl.formatMessage(messages.ngayHetHanTrong || { id: 'ngayHetHanTrong', defaultMessage: 'ngayHetHanTrong' })}
                </FormHelperText>
              </Grid> */}
            {this.checkShowForm('responsible') ? (
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
            )}
            <Grid item md={6}>
              <CustomDatePicker
                label="NGÀY KẾT THÚC"
                name="expirationDay"
                value={this.state.expirationDay}
                error={this.state.dateError || this.state.expirationDayError}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={e => this.setState({ expirationDay: moment(e).format('YYYY-MM-DD') })}
                variant="outlined"
                style={{ width: '100%' }}
                right={40}
              />
              <FormHelperText id="component-error-text" style={this.state.expirationDayError ? { color: 'red' } : { color: 'red', display: 'none' }}>
                {/* {intl.formatMessage(messages.ngayHetHanTrong || { id: 'ngayHetHanTrong', defaultMessage: 'ngayHetHanTrong' })} */}
                Ngày kết thúc không được để trống
              </FormHelperText>
            </Grid>

            <Grid item md={6}>
              <CustomInputBase
                // label={getLabelName('note', 'RevenueExpenditure')}
                label="Ghi chú"
                name="note"
                onChange={e => this.setState({ note: e.target.value })}
                value={this.state.note}
                multiline
                rows={4}
                // error={localMessages && localMessages.note}
                // helperText={localMessages && localMessages.note}
                // required={checkRequired.note}
                // checkedShowForm={checkShowForm.note}
              />
            </Grid>
          </Grid>
          <UpdatePaymentRequestDialog
            handleAddtoList={this.onAddToListPayment}
            open={this.state.open2}
            intl={intl}
            jobs={this.state.jobs}
            messages={messages}
            handleClose={this.handleClose2}
            currentStage={Object.assign({}, currentStage)}
            classes={classes}
            // totalMoney={this.state.totalMoney}
            totalMoney={total}
            // debtMoney={debtMoney}
            minday={this.state.contractSigningDate}
            onChangeSnackbar={this.props.onChangeSnackbar}
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
          <Grid item container spacing={48} style={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ marginTop: 10, marginBottom: 10, zIndex: 0 }} color="default">
              <Tabs value={this.state.value} indicatorColor="primary" textColor="primary" onChange={this.handleChangeTabList}>
                {/* <Tab label={intl.formatMessage(messages.yeuCauKhac || { id: 'yeuCauKhac', defaultMessage: 'yeuCauKhac' })} />
                <Tab label={intl.formatMessage(messages.yeuCauThanhToan || { id: 'yeuCauThanhToan', defaultMessage: 'yeuCauThanhToan' })} />
                <Tab
                  style={parseInt(this.state.catalogContract, 10) === 1 ? { display: 'block' } : { display: 'none' }}
                  label={intl.formatMessage(messages.yeuCauSanPham || { id: 'yeuCauSanPham', defaultMessage: 'yeuCauSanPham' })}
                /> */}
                {/* <Tab
                  style={
                    parseInt(this.state.catalogContract, 10) === 1 && this.state.typeContainer === 'edit' ? { display: 'block' } : { display: 'none' }
                  }
                  label={intl.formatMessage(messages.yeuCauGiaoHang || { id: 'yeuCauGiaoHang', defaultMessage: 'yeuCauGiaoHang' })}
                /> */}
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
                <Tab label={intl.formatMessage(messages.yeuCauTruyThu || { id: 'yeuCauTruyThu', defaultMessage: 'Truy thu' })} />
                <Tab label={intl.formatMessage(messages.yeuCauKhac || { id: 'yeuCauKhac', defaultMessage: 'yeuCauKhac' })} />
              </Tabs>
            </AppBar>
            {/* {Number(this.state.value) === 2 && (
              <Paper style={{ width: '100%' }}>
                <Grid style={{ display: 'block' }}>
                  {!this.state.nameOrder ? (
                    <CustomButton style={{ margin: 15 }} color="primary" aria-label="Add" size="small" onClick={this.chooseOrderWithoutSale}>
                      {intl.formatMessage(messages.ycttThemMoi || { id: 'ycttThemMoi', defaultMessage: 'ycttThemMoi' })}
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
                      <TableCell>{intl.formatMessage(messages.ycspGia || { id: 'ycspGia', defaultMessage: 'ycspGia' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycspSoLuong || { id: 'ycspSoLuong', defaultMessage: 'ycspSoLuong' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycspDonViTinh || { id: 'ycspDonViTinh', defaultMessage: 'ycspDonViTinh' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycspThanhTien || { id: 'ycspThanhTien', defaultMessage: 'ycspThanhTien' })}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderProductChoose.length > 0
                      ? orderProductChoose.map(item => {
                          return (
                            <TableRow>
                              <TableCell>
                                <Button color="primary" onClick={() => this.toggleDrawer(item)}>
                                  {item.name}
                                </Button>
                              </TableCell>
                              <TableCell>
                                {item.pricePolicy
                                  ? Number(item.pricePolicy.allPrice) > 0
                                    ? formatNumber(item.pricePolicy.allPrice)
                                    : Number(item.pricePolicy.costPrice) > 0
                                      ? formatNumber(item.pricePolicy.costPrice)
                                      : 0
                                  : 0}
                              </TableCell>
                              <TableCell>{item.amount}</TableCell>
                              <TableCell>{item.unit ? item.unit : ''}</TableCell>
                              <TableCell>
                                {formatNumber(
                                  Number(item.pricePolicy.allPrice || item.pricePolicy.costPrice || 0) *
                                    Number(item.amount) *
                                    (1 - Number(item.discount || 0) / 100),
                                )}
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
                      <TableCell>
                        {intl.formatMessage(messages.ycspGiaTriDonHang || { id: 'ycspGiaTriDonHang', defaultMessage: 'ycspGiaTriDonHang' })}
                      </TableCell>
                      <TableCell>{formatNumber(total)}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            )} */}
            {/* {this.state.value === 3 && (
              <Paper style={{ width: '100%' }}>
                <Grid style={{ display: 'block' }}>
                  <Button style={{ margin: 15 }} variant="outlined" color="primary" aria-label="Add" size="small" onClick={this.addToDeliverPayment}>
                    {intl.formatMessage(messages.ycghThemMoi || { id: 'ycghThemMoi', defaultMessage: 'ycghThemMoi' })}
                  </Button>
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
                      ? this.state.deliverimentRequest.map((item, index) => (
                          <TableRow>
                            <TableCell>
                              {this.state.paymentOrder.find(ele => ele._id === item.stage)
                                ? this.state.paymentOrder.find(ele => ele._id === item.stage).name
                                : ''}
                            </TableCell>
                            <TableCell>{item.timeDelivery}</TableCell>
                            <TableCell>{item.company}</TableCell>
                            <TableCell>{item.Address}</TableCell>
                            <TableCell>
                              <Button color="primary" onClick={() => this.editTodeliverimentRequest(index, -2)}>
                                {intl.formatMessage(messages.ycghChiTiet || { id: 'ycghChiTiet', defaultMessage: 'ycghChiTiet' })}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Fab color="primary" aria-label="Add" size="small" onClick={() => this.editTodeliverimentRequest(index, -1)}>
                                <Edit />
                              </Fab>
                              &nbsp;&nbsp;
                              <Fab color="secondary" aria-label="Add" size="small" onClick={() => this.deleteTodeliverimentRequest(index)}>
                                <Delete />
                              </Fab>
                            </TableCell>
                          </TableRow>
                        ))
                      : ''}
                  </TableBody>
                </Table>
              </Paper>
            )} */}
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
                      {/* <TableCell>
                        {formatNumber(totalProductsMoney).toLocaleString('es-AR', {
                          maximumFractionDigits: 0,
                        })}
                      </TableCell> */}
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            )}
            {Number(this.state.value) === 1 && (
              <Paper style={{ width: '100%' }}>
                <Grid style={{ display: 'block' }}>
                  <Button style={{ margin: 15 }} variant="outlined" color="primary" aria-label="Add" size="small" onClick={this.addToPaymentOrder}>
                    {intl.formatMessage(messages.ycttThemMoi || { id: 'ycttThemMoi', defaultMessage: 'ycttThemMoi' })}
                  </Button>
                </Grid>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{intl.formatMessage(messages.ycttTen || { id: 'ycttTen', defaultMessage: 'ycttTen' })}</TableCell>
                      <TableCell>
                        {intl.formatMessage(messages.ycttNgayKiBienBan || { id: 'ycttNgayKiBienBan', defaultMessage: 'ycttNgayKiBienBan' })}
                      </TableCell>
                      <TableCell>{intl.formatMessage(messages.ycttSoTien || { id: 'ycttSoTien', defaultMessage: 'ycttSoTien' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycttTrangThai || { id: 'ycttTrangThai', defaultMessage: 'ycttTrangThai' })}</TableCell>
                      {/* <TableCell>VAT</TableCell> */}
                      <TableCell>{intl.formatMessage(messages.ycttHanhDong || { id: 'ycttHanhDong', defaultMessage: 'ycttHanhDong' })}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.paymentOrder.length > 0
                      ? this.state.paymentOrder.map((item, index) => (
                          <TableRow>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{convertDatetimeToDate(item.timePay)}</TableCell>
                            <TableCell>{formatNumber(item.amount)}</TableCell>
                            <TableCell>
                              {item.statusPay === 0
                                ? 'Chưa nhiệm thu'
                                : item.statusPay === 1
                                  ? 'Đã thanh lý'
                                  : item.statusPay === 2
                                    ? 'Đề nghị thanh toán'
                                    : 'Đã nhiệm thu'}
                            </TableCell>
                            {/* <TableCell>{item.VAT === false ? 'Không' : 'Có'}</TableCell> */}
                            <TableCell>
                              <Fab color="primary" aria-label="Add" size="small" onClick={() => this.editToPaymentOrder(index)}>
                                <Edit />
                              </Fab>
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
                    {this.state.arrCar && this.state.arrCar.length > 0
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
                    {this.state.requestDeposit && this.state.requestDeposit.length > 0
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
                    {this.state.requestArrears && this.state.requestArrears.length > 0
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
            {Number(this.state.value) === 5 && (
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
          </Grid>
        </Paper>

        {/* Sửa sản phẩm */}
        <Dialog
          open={this.state.openEditProduct}
          fullWidth
          maxWidth="md"
          onClose={this.handleCloseEditProduct}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" onClose={this.handleCloseEditProduct}>
            Sửa sản phẩm
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            <ValidatorForm style={{ width: '100%' }} onSubmit={this.handleSave}>
              <Grid item container md={12}>
                <Grid item md={12}>
                  <TextValidator
                    label="Số lượng sản phẩm"
                    name="amount"
                    value={this.state.chooseProductAmount && this.state.chooseProductAmount}
                    onChange={val => this.setState({ chooseProductAmount: Number(val.target.value) >= 0 ? val.target.value : 1 })}
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
                </Grid>
              </Grid>
            </ValidatorForm>
          </DialogContent>
          <DialogActions>
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
          </DialogActions>
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
                  <TableCell>{intl.formatMessage(messages.ycspDonViTinh || { id: 'ycspDonViTinh', defaultMessage: 'ycspDonViTinh' })}</TableCell>
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
                                  ? Number(item.pricePolicy.allPrice).toLocaleString('es-AR', { maximumFractionDigits: 0 })
                                  : Number(item.pricePolicy.costPrice).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
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
                                  ? Number(item.pricePolicy.allPrice).toLocaleString('es-AR', { maximumFractionDigits: 0 })
                                  : Number(item.pricePolicy.costPrice).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
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

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title" onClose={this.handleClose}>
            {intl.formatMessage(messages.hdDanhSachHoaDon || { id: 'hdDanhSachHoaDon', defaultMessage: 'hdDanhSachHoaDon' })}
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            <TextField
              label={intl.formatMessage(messages.hdTuNgay || { id: 'hdTuNgay', defaultMessage: 'hdTuNgay' })}
              name="searchStartDay"
              type="date"
              value={this.state.searchStartDay}
              onChange={this.handleChangeInput}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{ width: '30%' }}
            />
            &nbsp;&nbsp;&nbsp;
            <TextField
              label={intl.formatMessage(messages.hdDenNgay || { id: 'hdDenNgay', defaultMessage: 'hdDenNgay' })}
              name="searchEndDay"
              type="date"
              value={this.state.searchEndDay}
              onChange={this.handleChangeInput}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{ width: '30%' }}
            />
            &nbsp;&nbsp;&nbsp;
            <Button size="large" variant="outlined" color="primary" onClick={this.searchOrder} className={classes.searchBtn}>
              {intl.formatMessage(messages.timKiem || { id: 'timKiem', defaultMessage: 'timKiem' })}
            </Button>
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
                            <TableCell>{item.supplierId ? item.supplierId.name : ''}</TableCell>
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
              rowsPerPageOptions={[10, 50, 100]}
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
            <ValidatorForm style={{ width: '100%', display: 'inline' }} onSubmit={this.handleSubmitForm}>
              <Grid item md={12} container>
                <Grid item md={12}>
                  <TextValidator
                    label={intl.formatMessage(messages.ycghGiaiDoan || { id: 'ycghGiaiDoan', defaultMessage: 'ycghGiaiDoan' })}
                    name="stage"
                    select
                    disabled={this.state.isEditDelivery === -2}
                    value={this.state.currentDeliverRequest.stage}
                    onChange={this.handleChangeInputDeliverRequest}
                    variant="outlined"
                    margin="normal"
                    style={{ width: '100%' }}
                    validators={['required']}
                    errorMessages={[`${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`]}
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
                  variant="outlined"
                  margin="normal"
                  style={{ width: '100%' }}
                  validators={['required', 'trim']}
                  errorMessages={[
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
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
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                  ]}
                />
                <TextValidator
                  label={intl.formatMessage(messages.ycghDiaDiem || { id: 'ycghDiaDiem', defaultMessage: 'ycghDiaDiem' })}
                  name="Address"
                  disabled={this.state.isEditDelivery === -2}
                  value={this.state.currentDeliverRequest.Address}
                  onChange={this.handleChangeInputDeliverRequest}
                  variant="outlined"
                  style={{ width: '100%' }}
                  validators={['required', 'trim']}
                  margin="normal"
                  errorMessages={[
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
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
                      <TableCell>{intl.formatMessage(messages.ycghSoLuong || { id: 'ycghSoLuong', defaultMessage: 'ycghSoLuong' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghDonVi || { id: 'ycghDonVi', defaultMessage: 'ycghDonVi' })}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.currentDeliverRequest.products.map((item, index) => {
                      const amountDelivery1 = this.state.amountDelivery.find(n => n.productId === item.productId);
                      const amountDelivery = Object.assign({}, amountDelivery1);
                      let amountDeliveryNumberic = item.totalAmount - parseInt(amountDelivery.amount, 10) - (parseInt(item.amount, 10) || 0);
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
                        amountDeliveryNumberic = item.totalAmount - totalDelivery - (parseInt(item.amount, 10) || 0);
                      }
                      if (Number(this.state.isEditDelivery) === -2) {
                        // xem
                        amountDeliveryNumberic = item.totalAmount - parseInt(amountDelivery.amount, 10);
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
                                  messages.khongVuotQuaSoLuong || { id: 'khongVuotQuaSoLuong', defaultMessage: 'khongVuotQuaSoLuong' },
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
            <Button
              style={{ margin: 20 }}
              onClick={() => {
                this.submitBtn.current.click();
              }}
              variant="outlined"
              color="primary"
              autoFocus
            >
              {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
            </Button>
            <Button style={{ margin: 20 }} onClick={this.handleClose3} color="secondary" variant="outlined">
              {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'huy' })}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.open4} onClose={this.handleClose4}>
          <DialogTitle id="alert-dialog-title" onClose={this.handleClose4}>
            {intl.formatMessage(messages.thongBao || { id: 'thongBao', defaultMessage: 'thongBao' })}
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            {intl.formatMessage(messages.noiDungThongBaoXoa || { id: 'noiDungThongBaoXoa', defaultMessage: 'noiDungThongBaoXoa' })}
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
  deleteFromListOrder = () => {
    const { orderProductChoose, chooseItem } = this.state;
    const removeIndex = orderProductChoose.map(item => item.id).indexOf(chooseItem.id);
    orderProductChoose.splice(removeIndex, 1);
    // this.checkingUnallocatedAssets(orderProductChoose)
    this.handleClose4();
  };
  handleClose4 = () => {
    this.setState({ open4: false });
  };
  confirmDelete = val => {
    this.setState({
      chooseItem: val,
      open4: true,
    });
  };

  editProduct = item => {
    this.setState({
      chooseItem: item,
      chooseProductPrice: item.costPrice,
      chooseProductAmount: item.amount,
      chooseProductDiscount: item.discount,
      chooseAssets: item.assetId ? item.assetId : [],
      openEditProduct: true,
    });
  };
  addAssetForContract = item => {
    this.setState({ openAsset: true });
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
  confirmEditProduct = () => {
    const { orderProductChoose, chooseItem, chooseProductPrice, chooseProductAmount, chooseProductDiscount, chooseAssets } = this.state;
    const itemIndex = orderProductChoose.map(item => item.id).indexOf(chooseItem.id);
    orderProductChoose[itemIndex].costPrice = chooseProductPrice;
    orderProductChoose[itemIndex].amount = chooseProductAmount;
    orderProductChoose[itemIndex].discount = chooseProductDiscount;
    orderProductChoose[itemIndex].assetId = chooseAssets;
    // this.checkingUnallocatedAssets(orderProductChoose);
    this.handleCloseEditProduct();
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
    // let totalMoney = 0;
    // Array.isArray(orderProductChoose) && orderProductChoose.map((item, index) => {
    //   const price = item.pricePolicy && !isNaN(item.pricePolicy.costPrice) ? Number(item.pricePolicy.costPrice) : 0;
    //   const amount = Number(item.amount);
    //   totalMoney += price * amount * (1 - Number(item.discount) / 100)
    // })
    // this.setState({ totalMoney: totalMoney })
  };

  chooseOrderWithoutSale = () => {
    this.props.onGetAllProduct();
    this.setState({ openChooseSale: true });
  };
  // handle hop dong xe
  addCarRental = () => {
    const { currentStage } = this.state;

    this.setState({ currentStage }, () => {
      this.setState({ openCarRental: true, isEdit: -1 });
    });
  };
  editCarRental = index => {
    let { carRental } = this.state;
    const { arrCar } = this.state;

    carRental = arrCar[index];
    this.state.carRental = carRental;
    this.setState({ isEdit: index, openCarRental: true });
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
  handleCarRental = () => {
    this.setState({ openCarRental: false });
  };

  // handle Khoan coc
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
  handleCloseDialogDeposit = () => {
    this.setState({ openDialogDeposit: false });
  };

  // handle truy thu
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
  handleCloseDialogArrears = () => {
    this.setState({ openDialogArrears: false });
  };
  // handle khoan coc
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
  // handle truy thu
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
  handleResetProduct = () => {
    if (this.props.addSupplierContract.contract.listProduct) {
      this.setState({
        orderProductChoose: this.props.addSupplierContract.contract.listProduct,
        nameOrder: '',
      });
    } else {
      this.setState({
        orderProductChoose: [],
        nameOrder: '',
      });
    }
  };

  handleCloseChooseSale = () => {
    this.setState({ openChooseSale: false, orderList: [] });
  };

  handleChangeAddedField = (index, e) => {
    const { fieldAdded } = this.state;
    const fields = [...fieldAdded];
    fieldAdded[index].value = e.target.value;
    this.setState({ fieldAdded: fields });
  };

  handleSubmit = () => {
    // const { match } = this.props;
    let error = false;
    if (this.state.expirationDay === null) {
      this.setState({
        expirationDayError: true,
      });
      error = true;
    }
    // if (this.state.startDay === null) {
    //   this.setState({
    //     startDayError: true,
    //   });
    //   error = true;
    // }
    if (this.state.contractSigningDate === null) {
      this.setState({
        contractSigningDateError: true,
      });
      error = true;
    }
    // if (this.state.deliveryDay === null) {
    //   this.setState({
    //     deliveryDayError: true,
    //   });
    //   error = true;
    // }
    if (this.state.code === '') {
      this.setState({
        codeError: true,
      });
      error = true;
    }
    const rex = /^[A-Za-z0-9]+$/;
    // if (!rex.test(this.state.code.trim())) {
    //   this.setState({
    //     codeTypeError: true,
    //   });
    //   error = true;
    // }
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
    // if (Number(this.state.cycle) < 0) {
    //   this.setState({
    //     cycleMin: true,
    //   });
    //   error = true;
    // }
    // if (Number(this.state.notice) < 0) {
    //   this.setState({
    //     noticeMin: true,
    //   });
    //   error = true;
    // }
    // if (this.state.notice > this.state.cycle) {
    //   this.setState({
    //     cycleError: true,
    //   });
    //   error = true;
    // }

    if (!error) {
      const { deliverimentRequest } = this.state;
      deliverimentRequest.forEach(item => {
        const pro = [];
        item.products.forEach(prod => {
          pro.push({
            productId: prod.productId,
            name: prod.name,
            amount: prod.amount,
          });
        });
        item.products = pro;
      });
      const others = {};
      if (this.state.fieldAdded.length > 0) {
        this.state.fieldAdded.forEach(item => {
          others[item.name.replace('others.', '')] = item.value;
        });
      }
      let kanbanStatus = 0;
      if (this.state.kanbanStatus === 0) {
        kanbanStatus = this.state.arrKanban[0]._id;
      } else {
        kanbanStatus = this.state.kanbanStatus;
      }
      let responsibleId = [];
      Array.isArray(this.state.responsible) &&
        this.state.responsible.filter(f => !!f._id).map(item => {
          responsibleId.push(item._id);
        });
      const body = {
        name: this.state.name,
        code: this.state.code,
        catalogContract: this.state.catalogContract,
        contractSigningDate: this.state.contractSigningDate,
        expirationDay: this.state.expirationDay,
        deliveryDay: this.state.deliveryDay,
        supplierId: this.state.supplierId && this.state.supplierId._id ? this.state.supplierId._id : '',
        responsible: responsibleId,
        belong: {
          contractId: this.state.belong,
          name: this.state.belongName,
        },
        // cycle: this.state.cycle,
        // notice: this.state.notice,
        note: this.state.note,
        typeContract: this.state.typeContract,
        paymentRequest: this.state.paymentOrder,
        task: this.state.task || undefined,
        // order:
        //   parseInt(this.state.catalogContract, 10) === 1
        //     ? {
        //       name: this.state.nameOrder,
        //       orderId: this.state.idCodeOrder,
        //     }
        //     : undefined,
        listProduct: this.state.orderProductChoose,
        deliverimentRequest,
        kanbanStatus,
        otherRequest: {
          urlFile: this.state.file,
          nameFile: this.state.fileName,
          note: this.state.fileNote,
          createdAt: new Date(),
        },
        others,
        vehicleList: this.state.arrCar,
        deposit: this.state.requestDeposit,
        arrears: this.state.requestArrears,
        // numberOrders:this.state.
      };
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
        const { addSupplierContract } = this.props;
        const { contract } = addSupplierContract;
        const newFile = body.otherRequest;
        body.otherRequest = contract.otherRequest;
        body.newFile = newFile;
        if (body.belong.contractId === 0 || body.belong.contractId === '') {
          body.belong = undefined;
        }
        this.props.onUpdateContract(body);
      }
    }
  };

  handleChangeInputFile = e => {
    this.setState({ file: e.target.files[0] });
  };

  deleteToPaymentOrder = index => {
    const { paymentOrder } = this.state;
    paymentOrder.splice(index, 1);
    this.setState({ paymentOrder });
  };

  editToPaymentOrder = index => {
    let { currentStage } = this.state;
    const { paymentOrder } = this.state;
    currentStage = paymentOrder[index];
    this.state.currentStage = currentStage;
    this.setState({ isEdit: index, open2: true });
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
      template: null,
      workCompleted: {},
      currency: 'VNĐ',
      VAT: false,
    };
    this.setState({ paymentOrder, currentStage, open2: false, isEdit: -1 });
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
    this.setState({ deliverimentRequest, amountDelivery, currentDeliverRequest, open3: false, isEditDelivery: -1 });
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
      workCompleted: {},
      currency: 'VNĐ',
      VAT: false,
    };
    this.setState({ currentStage }, () => {
      this.setState({ open2: true });
    });
  };

  addToDeliverPayment = () => {
    const { itemChoose, orderProductChooseAPI, orderProductChoose } = this.state;
    const products = [];
    if (itemChoose === null) {
      this.props.onChangeSnackbar(
        true,
        `${this.props.intl.formatMessage(messages.baoGiaBanHangBiXoa || { id: 'baoGiaBanHangBiXoa', defaultMessage: 'baoGiaBanHangBiXoa' })}`,
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
              price: pro.pricePolicy ? pro.pricePolicy.costPrice : 0,
              unit: pro.unit ? pro.unit.name : '',
              totalAmount: x.amount,
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
    const itemChoose = orderList[index];
    let totalMoney = 0;
    itemChoose.products.forEach(n => {
      const price = n.pricePolicy
        ? Number(n.pricePolicy.allPrice) > 0
          ? Number(n.pricePolicy.allPrice)
          : Number(n.pricePolicy.costPrice) > 0
            ? Number(n.pricePolicy.costPrice)
            : 0
        : 0;
      totalMoney += (Number(price) * Number(n.amount) * Number(100 - Number(n.discount || 0))) / 100;
    });
    this.props.onSetEmpty();
    this.props.onGetProduct(itemChoose);
    this.props.onGetCustomer(itemChoose.supplierId);
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

  choosePO = () => {
    this.setState({ open: true });
  };

  chooseOrder = () => {
    this.setState({ open: true });
  };

  handleChangeDate = e => {
    const name = 'startDay';
    const value = moment(e).format('YYYY-MM-DD');
    this.setState({ [name]: value });
  };

  handleChangeInput = (e, isDate) => {
    const name = isDate ? 'contractSigningDate' : date;
    const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    this.setState({ [name]: value });
    if (e.target) {
      if (e.target.name === 'catalogContract' && e.target.value === 1) {
        this.setState({ value: 0 });
      }
      if (e.target.name === 'catalogContract' && e.target.value === 0) {
        this.setState({ value: 1 });
      }
      if (e.target.name === 'belong') {
        const item = this.props.addSupplierContract.allContract.find(item => item._id === e.target.value);
        if (item) {
          this.state.belongName = item.name;
          this.state.contractSigningDate = convertDatetimeToDate(item.contractSigningDate);
          this.state.startDay = convertDatetimeToDate(item.startDay);
          this.state.deliveryDay = convertDatetimeToDate(item.deliveryDay);
          this.state.paymentOrder = item.paymentRequest;
          this.state.arrFile = item.otherRequest;
          // this.state.expirationDay = convertDatetimeToDate(item.expirationDay);
        }
      }
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  handleChangeTabList = (event, value) => {
    this.setState({ value });
  };

  handleAddSale = sale => {
    const choose = {
      taskId: sale._id,
      name: sale.name,
    };
    this.setState({ task: choose });
    this.getProjectTree(sale._id);
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

AddSupplierContract.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

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

const mapStateToProps = createStructuredSelector({
  addSupplierContract: makeSelectAddSupplierContract(),
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
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addSupplierContract', reducer });
const withSaga = injectSaga({ key: 'addSupplierContract', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddSupplierContract);
