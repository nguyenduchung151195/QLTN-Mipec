/* eslint-disable eqeqeq */
/**
 *
 * ReportReportCustomer
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { TrendingFlat } from '@material-ui/icons';
import { MuiPickersUtilsProvider, DateTimePicker, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
// import { Add } from '@material-ui/icons';
import { templateColumns, EmaiColumns, EmailReportCols, reportConverCustomer } from 'variable';
import AddProjects from 'containers/AddProjects';
import AddSalesQuotation from 'containers/AddSalesQuotation';
import ListPage from 'components/List';
import { Button, MenuItem, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import dot from 'dot-object';
// import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Progressbar from 'react-progressbar';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Buttons from 'components/CustomButtons/Button';
import FavoritePage from 'containers/FavoritePage';
import { makeSelectMiniActive } from '../Dashboard/selectors';

import CashManager from 'containers/CashManager';
import SalesManager from 'containers/SalesManager/Loadable';
import ExpenseManager from 'containers/ExpenseManager/Loadable';
import GeneralManager from 'containers/GeneralManager/Loadable';
import TaskManager from 'containers/TaskManager/Loadable';
import StockManager from 'containers/StockManager/Loadable';
import Documentary from 'containers/Documentary/Loadable';
import ReceivableManager from 'containers/ReceivableManager/Loadable';
import SalesEmployee from 'containers/SalesEmployee/Loadable';
import ExpandReportManager from 'containers/ExpandReportManager/Loadable';
import GeneralReportPage from 'containers/GeneralReportPage/Loadable';
import PayManager from 'containers/PayManager';
import makeSelectReportReportCustomer from './selectors';
import makeSelectDashboardPage, { makeSelectProfile } from '../Dashboard/selectors';
import { Grid, Paper, Autocomplete, SwipeableDrawer, TaskReport, AsyncAutocomplete } from '../../components/LifetekUi';
import TaskReportWeekly from '../../components/LifetekUi/TaskReportWeekly';
import ReportTaskStatus from './components/ReportTaskStatus';
import ReportBusinessOp from './components/ReportBusinessOp/ReportBusinessOp';
import ReportCustomerContract from './components/ReportCustomerContract/ReportCustomerContract';
import ReportPersonnelStatistics from './components/ReportPersonnelStatistics/ReportPersonnelStatistics';

import ReportTimeForJob from './components/ReportTimeForJob';
import ReportListCustomer from '../ReportReportCustomer/ManagementCustomerInfor/ListCustomer';
import HOCTable from '../HocTable';
import {
  API_TASK_PROJECT,
  API_PRICE,
  GET_CONTRACT,
  API_TEMPLATE,
  API_MAIL,
  API_RNE,
  API_USERS,
  API_REPORT,
  API_CUSTOMERS,
  API_SERVICE_FEE_REPORT,
  API_GROUND_FEE_REPORT,
  API_MAINTENANCE_FEE_REPORT,
  API_WATER_FEE_REPORT,
  API_ELECT_FEE_REPORT,
  API_ROLE_APP,
  API_ROLE,
} from '../../config/urlConfig';
import { mergeData, getReportCustomer, fetchAllBosAction, defaultData } from './actions';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { changeSnackbar } from '../Dashboard/actions';
import { BoDialog } from '../BoDialog';
import { fetchData, getNameByApi } from '../../helper';
import ReportRevenueGeneral from '../../components/ReportPage/ReportRevenueGeneral';
import ReportGetMoney from '../../components/ReportPage/ReportGetMoney';
import ReportDebtOver from '../../components/ReportPage/ReportDebtOver';
import ReportDebtGeneral from '../../components/ReportPage/ReportDebtGeneral';
import ListContractExpires from './ManagementCustomerInfor/ListContractExpires';
import NewContractReport from './ManagementCustomerInfor/NewContractReport';
import ListContract from './ManagementCustomerInfor/ListContract';
import ExpenditureCustomers from './ManagementCustomerInfor/ExpenditureCustomers';
import ReportCustomerManager from '../../components/ReportPage/ReportCustomer';
import ReportAsset from '../../components/ReportPage/ReportAsset';
import ReportTower from '../../components/ReportPage/ReportTower';
import ReportDocumenttary from '../../components/ReportPage/ReportDocumentary';
import ReportUser from '../../components/ReportPage/ReportUser';
import ReportSystem from '../../components/ReportPage/ReportSystem';
import ReportExportReport from '../../components/ReportPage/ReportExportReport';
import ReportImportReport from '../../components/ReportPage/ReportImportReport';
import ReportContractNeedExtended from '../../components/ReportPage/ReportContractNeedExtended';

// import ReportCompletionLevel from './components/ReportCompletionLevel';

const CustomForget = props => {
  const duration = moment.duration(moment().diff(moment(props.item.updatedAt)));
  return <div>{Math.floor(duration.as('day'))} ngày</div>;
};

const CustomName = props => <Link to={`/crm/BusinessOpportunities/${props.item._id}`}>{props.item.name}</Link>;

const CustomKanbanStatus = props => {
  const propsFromTable = props.kanbanProps.slice();
  const laneStart = [];
  const laneAdd = [];
  const laneSucces = [];
  const laneFail = [];

  propsFromTable.forEach(item => {
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

  const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
  const itemFromTable = Object.assign({}, props.item);
  const kanbanStatusNumber = sortedKanbanStatus.findIndex(n => String(n._id) === String(itemFromTable.kanbanStatus));
  const kanbanValue = ((kanbanStatusNumber + 1) / propsFromTable.length) * 100;
  return (
    <div>
      {sortedKanbanStatus[kanbanStatusNumber] !== undefined ? (
        <Progressbar color={sortedKanbanStatus[kanbanStatusNumber].color} completed={kanbanValue} />
      ) : (
        <span>Không xác định</span>
      )}
    </div>
  );
};

const Process = props => (
  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 22, width: '100%', position: 'relative' }}>
    <div
      style={{
        width: `${props.value}%`,
        background: `${props.color2}`,
        height: '100%',
        animation: '2s alternate slidein',
      }}
    />
    <div
      style={{
        width: `${100 - props.value}%`,
        background: `${props.color}`,
        height: '100%',
        animation: '2s alternate slidein',
      }}
    >
      <b style={{ fontSize: 13, marginLeft: 3, color: '#e0e0e0' }}>
        {props.progress}
        %- {props.name} {props.time}
        ngày
      </b>
    </div>
  </div>
);
/* eslint-disable react/prefer-stateless-function */
const VerticalTabs = withStyles(() => ({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

const VerticalTab = withStyles(() => ({
  selected: {
    color: 'white',
    backgroundColor: `#2196F3`,
    borderRadius: '5px',
    boxShadow: '3px 5.5px 7px rgba(0, 0, 0, 0.15)',
  },
  root: {
    minWidth:'100%',
  },
}))(Tab);

const reportTypes = [
  {
    name: 'Định mức',
    value: '0',
  },
  {
    name: '1 giá',
    value: '1',
  },
  {
    name: 'Trọn gói',
    value: '2',
  },
];

const ServiceReportFilter = props => {
  const { type, onSubmit } = props;
  const [reportType, setReportType] = useState(0);
  const [fromMonth, setFromMonth] = useState(null);
  const [toMonth, setToMonth] = useState(null);
  const [customer, setCustomer] = useState(null);

  const handleSubmit = () => {
    // if(!fromMonth || !toMonth || fromMonth.startOf('d') >= toMonth.startOf('d')) {
    //   return;
    // }
    let url = new URL(API_SERVICE_FEE_REPORT);
    if (type == 'ground') {
      url = new URL(API_GROUND_FEE_REPORT);
    } else if (type == 'maintainance') {
      url = new URL(API_MAINTENANCE_FEE_REPORT);
    }

    const params = {
      fromDate: fromMonth.toISOString(),
      toDate: toMonth.toISOString(),
      customerCode: customer ? customer.code : '',
    };
    url.search = new URLSearchParams(params).toString();

    requestDownloadFile(url, {}).then(response => {
      // console.log(response.body.blob());
      response.blob().then(blob => {
        console.log(blob);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = `${type}_${fromMonth.format('DD-MM-YYYY')}_${toMonth.format('DD-MM-YYYY')}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
    });
  };

  return (
    <Grid item container spacing={24}>
      <Grid md={12} item container />
      {/* <Grid item xs={3}>
        <TextFieldLT
          select
          fullWidth
          label="Chọn loại báo cáo"
          value={reportType}
          onChange={e => setReportType(e.target.value)}
        >
          {reportTypes.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.name}
            </MenuItem>
          ))}
        </TextFieldLT>
      </Grid> */}
      <Grid item xs={5}>
        <AsyncAutocomplete
          label="Chọn khách hàng"
          optionValue="value"
          onChange={value => setCustomer(value)}
          url={API_CUSTOMERS}
          value={customer}
          error={!customer}
          cacheOptions={false}
          helperText={!customer && 'Nhập thông tin khách hàng'}
        />
      </Grid>
      <Grid item xs={3}>
        <DatePicker
          inputVariant="outlined"
          format="MM/YYYY"
          fullWidth
          value={fromMonth}
          variant="outlined"
          label="Từ tháng"
          margin="dense"
          views={['month']}
          error={!fromMonth || !toMonth || fromMonth.startOf('d') >= toMonth.startOf('d')}
          onChange={date => setFromMonth(date)}
        />
      </Grid>
      <Grid item xs={3}>
        <DatePicker
          inputVariant="outlined"
          format="MM/YYYY"
          fullWidth
          value={toMonth}
          variant="outlined"
          label="Đến tháng"
          margin="dense"
          error={!fromMonth || !toMonth || fromMonth.startOf('d') >= toMonth.startOf('d')}
          helperText={(!fromMonth || !toMonth || fromMonth.startOf('d') >= toMonth.startOf('d')) && 'Tháng bắt đầu phải nhỏ hơn tháng kết thúc'}
          views={['month']}
          onChange={date => setToMonth(date)}
        />
      </Grid>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Button
            disabled={!customer || !fromMonth || !toMonth || fromMonth.startOf('d') >= toMonth.startOf('d')}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Xuất báo cáo
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

const FeeReportFilter = props => {
  const [date, setDate] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [reportType, setReportType] = useState('water');

  const handleSubmit = () => {
    let url = new URL(API_ELECT_FEE_REPORT);
    if (reportType == 'water') {
      url = new URL(API_WATER_FEE_REPORT);
    }
    const month = date.month();
    const year = date.year();
    const customerCodes = customers.map(c => c.code);

    const params = {
      month,
      year,
      customerCodes: JSON.stringify(customerCodes),
    };
    url.search = new URLSearchParams(params).toString();
    requestDownloadFile(url.toString(), {}).then(response => {
      // console.log(response.body.blob());
      response.blob().then(blob => {
        console.log(blob);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = `${reportType}_${year}_${month}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
    });
  };

  return (
    <Grid item container spacing={24}>
      <Grid item xs={3}>
        <TextFieldLT select fullWidth label="Chọn loại báo cáo" value={reportType} onChange={e => setReportType(e.target.value)}>
          <MenuItem value="electric">Điện</MenuItem>
          <MenuItem value="water">Nước</MenuItem>
        </TextFieldLT>
      </Grid>
      <Grid item xs={6}>
        <AsyncAutocomplete
          isMulti
          filters={['code']}
          label="Chọn khách hàng"
          url={API_CUSTOMERS}
          value={customers}
          cacheOptions={false}
          onChange={value => setCustomers(value)}
        />
      </Grid>
      <Grid item xs={3}>
        <DatePicker
          inputVariant="outlined"
          format="MM/YYYY"
          fullWidth
          value={date}
          variant="outlined"
          label="Tháng"
          margin="dense"
          views={['month']}
          onChange={value => setDate(value)}
        />
      </Grid>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Xuất báo cáo
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export class ReportReportCustomer extends React.Component {
  state = {
    tab: 97,
    tabDad: 97,
    tabIndex: 0,
    tab1: 1,
    bos: [],
    crmStatusSteps: [],
    pageDetail: {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
      skip: 0,
      limit: 10,
    },
    openDialog: false,
    editData: {},
    isEditting: false,
    showReportMonth: null,
    showReportWeek: null,
    openReportTaskStatus: false,
    openReportTimeTaskStatus: false,
    openBusinessOp: false,
    openReportCustomerContract: false,
    openReportPersonnelStatistics: false,
    openReportCompletionLevel: false,
    roles: [],
    isDisplay: null,
  };

  mergeData = data => {
    this.props.mergeData(data);
  };
  getDataChildReports = (roles, tab) => {
    let result;
    if (roles) {
      result = roles.find(i => i.tab === tab);
    }
    if (result && result.data) {
      return result.data;
    }
  };
  getNameByIndex = index => {
    switch (Number(index)) {
      case 0:
        return 'Báo cáo tổng hợp';
      case 1:
        return 'Báo cáo yêu thích';
      case 2:
        return 'Báo cáo quản lý tiền mặt, tiền gửi';
      case 3:
        return 'Báo cáo quản lý bán hàng';
      case 4:
        return 'Báo cáo quản lý chi phí';
      case 5:
        return 'Báo cáo quản lý kho';
      case 6:
        return 'Báo cáo quản lý tổng hợp';
      case 7:
        return 'Báo cáo quản lý công nợ';
      case 8:
        return 'Báo cáo quản lý khách hàng';
      case 9:
        return 'Báo cáo công việc dự án';
      case 10:
        return 'Báo cáo nhân viên';
      case 11:
        return 'Báo cáo mở rộng';
    }
  };
  checkValidGroupReport = data => {
    let result = [];
    if (data) {
      data.map((i, index) => {
        if (i.length > 0) {
          let obj = {
            label: this.getNameByIndex(index),
            data: [...i],
            tab: index,
          };
          result.push(obj);
        }
      });
    }
    return result;
  };
  checkPermission = data => {
    let result = true;
    if (data) {
      data.map(i => {
        if (i.name === 'GET' && i.allow === false) {
          result = false;
        }
      });
    }
    return result;
  };
  groupReport = data => {
    let group1 = [];
    let group2 = []; // null favaroute
    let group3 = []; // quản lý tiền mặt cash
    let group4 = []; //
    let group5 = [];
    let group6 = [];
    let group7 = [];
    let group8 = [];
    let group9 = [];
    let group10 = [];
    let group11 = [];
    let group12 = [];
    let finalResult = [];
    if (data) {
      data.filter(f => f.codeModleFunction !== 'reports').map((i, index) => {
        let { codeModleFunction, methods } = i || {};
        if (this.checkPermission(methods)) {
          if (codeModleFunction === 'reportsBusinessOpportunities' || codeModleFunction === 'reportBusinessSituation') {
            group1.push(i);
          } else if (codeModleFunction === 'reportStatisticalReceipt') {
            group3.push(i);
          } else if (codeModleFunction.includes('Sales') && codeModleFunction !== 'reportsEmployeeKpiSales') {
            group4.push(i);
          } else if (codeModleFunction === 'reportbankBalance' || codeModleFunction === 'ReportFavoriteCostRatioYear') {
            group2.push(i);
          } else if (codeModleFunction === 'reportCostRatio' || codeModleFunction === 'reportCostRatioItem') {
            group5.push(i);
          } else if (codeModleFunction.includes('Inventory') && codeModleFunction !== 'reportRevenueInventory') {
            group6.push(i);
          } else if (
            (codeModleFunction.includes('Cost') && codeModleFunction !== 'reportCostRatio') ||
            codeModleFunction === 'reportRevenueInventory'
          ) {
            group7.push(i);
          } else if (codeModleFunction.includes('reportDebt')) {
            group8.push(i);
          } else if (codeModleFunction.includes('Customer')) {
            group9.push(i);
          } else if (codeModleFunction.includes('Task')) {
            group10.push(i);
          } else if (
            codeModleFunction === 'reportStatsHrm' ||
            codeModleFunction === 'reportsEmployeeKpiSales' ||
            codeModleFunction === 'reportsFinishLevel'
          ) {
            group11.push(i);
          } else {
            group12.push(i);
          }
        }
      });
    }

    finalResult = [group1, group2, group3, group4.reverse(), group5, group6, group7, group8.reverse(), group9, group10, group11, group12];
    finalResult = this.checkValidGroupReport(finalResult);

    return finalResult;
  };

  getRoles = async () => {
    const { profile } = this.props;
    let result = [];

    try {
      const res = await fetchData(`${API_ROLE}/${profile && profile.userId}`);
      const { roles } = res;
      if (roles && Array.isArray(roles)) {
        roles.map(i => {
          if (i.codeModleFunction && i.codeModleFunction.includes('report')) {
            result.push(i);
          }
        });
      }

      let finalResult = result && this.groupReport(result);
      if (finalResult) {
        this.setState({ roles: finalResult, allRoles: result });
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    const isDisplay = JSON.parse(localStorage.getItem('_isDisplay'));
    this.setState({ isDisplay: isDisplay });
    this.props.getReportCustomer();
    this.getRoles();
  }

  componentWillUnmount() {
    try {
      localStorage.removeItem('_isDisplay');
    } catch (error) {
      // fucking care
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.isDisplay && prevState.isDisplay !== this.state.isDisplay) {
      this.setState({ tab: 98 });
    }
  };
  componentWillReceiveProps(props) {
    const { reportReportCustomer } = props;
    const newBos = [];
    if (reportReportCustomer.bos !== undefined) {
      reportReportCustomer.bos.forEach(element => {
        newBos.push(dot.dot(element));
      });

      this.state.bos = newBos;
      this.state.pageDetail.totalCount = reportReportCustomer.pageDetail.count;
      this.state.pageDetail.currentPage = Number(reportReportCustomer.pageDetail.skip);
      this.state.pageDetail.pageSize = reportReportCustomer.pageDetail.limit;
    }
    if (Number(reportReportCustomer.callAPIStatus) === 1 && props.history.isEdit === true) {
      // this.state.openDialog = false;
      this.props.onGetBos(this.state.pageDetail);
      props.history.isEdit = undefined;
      this.setState({
        openDialog: false,
      });
    }

    this.props.onDefaultData();
  }

  handleTab(tab1) {
    this.setState({ tab1 });
  }

  handleTabIndex(tabIndex) {
    this.setState({ tabIndex });
  }

  customFunctionEmail = item => {
    let newItem = [];
    newItem = item.map((it, index) => ({
      ...it,
      index: index + 1,
    }));
    return newItem;
  };

  customFunctionSMS = item => {
    let newItem = [];
    newItem = item.filter(ele => ele.formType === 'sms').map((it, index) => ({
      ...it,
      index: index + 1,
    }));
    return newItem;
  };

  selectCustomer = customer => {
    this.props.mergeData({ customer });
  };

  mapFunctionCustomer = item => ({
    ...item,
    name: (
      // eslint-disable-next-line react/button-has-type
      <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openAddTask: true, id: item._id })}>
        {item.name}
      </button>
    ),
    progress: (
      <Process
        value={item.progress}
        progress={item.progress}
        color={item.taskStatus === 1 ? '#0320ff' : item.taskStatus === 2 ? '#009900' : item.taskStatus === 3 ? '#ff5722' : '#f44336'}
        time={
          new Date(item.endDate) >= new Date()
            ? ((new Date(item.endDate) - new Date()) / 86400000).toFixed()
            : ((new Date() - new Date(item.endDate)) / 86400000).toFixed()
        }
        name={new Date(item.endDate) > new Date() ? 'Còn' : 'Trễ'}
        color2={item.taskStatus === 1 ? '#364896' : item.taskStatus === 2 ? '#70db70' : item.taskStatus === 3 ? '#e07c5c' : '#69201b'}
      />
    ),
  });

  mapFunctionSale = item => ({
    ...item,
    name: (
      // eslint-disable-next-line react/button-has-type
      <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openSale: true, id: item._id })}>
        {item.name}
      </button>
    ),
    typeOfSalesQuotation: item.typeOfSalesQuotation == 1 ? ' Bán hàng' : item.typeOfSalesQuotation == 2 ? 'Báo giá' : 'Đăt hàng',
  });

  handleReportMonth = () => {
    this.setState({
      showReportMonth: !this.state.showReportMonth,
      showReportWeek: (this.state.showReportWeek = false),
    });
  };

  handleReportWeek = () => {
    this.setState({
      showReportWeek: !this.state.showReportWeek,
      showReportMonth: (this.state.showReportMonth = false),
    });
  };
  displayReportByRoles;

  render() {
    const { reportReportCustomer, miniActive, profile } = this.props;
    let isDisplay = '';
    try {
      isDisplay = JSON.parse(localStorage.getItem('_isDisplay'));
    } catch (error) {
      // fucking care
    }
    const { customers, customer, openAddTask, id, openSale, openSalesEmployee, employee, filter } = reportReportCustomer;

    const {
      tab,
      tabDad = 97,
      tabIndex,
      tab1,
      bos,
      crmStatusSteps,
      pageDetail,
      openDialog,
      editData,
      isEditting,
      showReportMonth,
      showReportWeek,
      roles,
      allRoles,
    } = this.state;
    const Tb = props => (
      <Buttons
        onClick={() => this.handleTabIndex(props.tabIndex)}
        {...props}
        color={props.tabIndex === tabIndex ? 'gradient' : 'simple'}
        left
        round
        style={{ fontSize: 11 }}
      >
        {props.children}
      </Buttons>
    );
    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab1)} {...props} color={props.tab1 === tab1 ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </Buttons>
    );
    return (
      <div>
        {/* <Typography style={{ marginLeft: 20, marginTop: 30, marginBottom: 15, fontSize: 20 }}>Danh sách báo cáo</Typography> */}
        <Paper>
          <Grid container spacing={16}>
            <Grid item xs={3}>
              <VerticalTabs
                value={tabDad}
                onChange={(event, value) => {
                  this.setState({ tabDad: value });
                }}
              >
                <VerticalTab
                  style={{ textAlign: 'left', textTransform: 'none'}}
                  label="QUẢN TRỊ HỆ THỐNG"
                  onClick={() => {
                    this.setState({ tab: 95 });
                  }}
                />
                <VerticalTab
                  style={{ textAlign: 'left', textTransform: 'none' }}
                  label="QUẢN LÝ TÒA NHÀ"
                  onClick={() => {
                    this.setState({ tab: 96 });
                  }}
                />
                <VerticalTab
                  style={{ textAlign: 'left', textTransform: 'none' }}
                  label="QUẢN LÝ CÔNG VĂN"
                  onClick={() => {
                    this.setState({ tab: 97 });
                  }}
                />

                <VerticalTab
                  style={{ textAlign: 'left', textTransform: 'none'}}
                  label="QUẢN LÝ TÀI SẢN, CÔNG CỤ, VẬT TƯ"
                  onClick={() => {
                    this.setState({ tab: 98 });
                  }}
                /> 

                <VerticalTab
                  style={{ textAlign: 'left', textTransform: 'none' }}
                  label="BÁO CÁO QUẢN LÝ KHO"
                  onClick={() => {
                    this.setState({ tab: 99 });
                  }}
                />
                <VerticalTab
                  style={{ textAlign: 'left', textTransform: 'none'}}
                  label="BÁO CÁO TỔNG HỢP DOANH THU"
                  onClick={() => {
                    this.setState({ tab: 100 });
                  }}
                />
                <VerticalTab
                  style={{ textAlign: 'left', textTransform: 'none' }}
                  label="BÁO CÁO THU TIỀN"
                  onClick={() => {
                    this.setState({ tab: 101 });
                  }}
                />
                {/* <VerticalTab
                  style={{ textAlign: 'left', textTransform: 'none' }}
                  label="Báo cáo công nợ quá hạn"
                  onClick={() => {
                    this.setState({ tab: 102 });
                  }}
                />
                <VerticalTab
                  style={{ textAlign: 'left', textTransform: 'none' }}
                  label="Báo cáo tổng hợp công nợ"
                  onClick={() => {
                    this.setState({ tab: 103 });
                  }}
                />
                <VerticalTab
                  style={{ textAlign: 'left', textTransform: 'none' }}
                  label="Báo cáo quản lý tài sản, công cụ, vật tư"
                  onClick={() => {
                    this.setState({ tab: 104 });
                  }}
                /> */}


              </VerticalTabs>
            </Grid>
            {tab === 0 ? (
              <Grid item xs={9} style={{ padding: '0px' }}>
                <GeneralReportPage dataRole={this.getDataChildReports(roles, tab)} />
              </Grid>
            ) : (
              ''
            )}
            {tab === 1 ? (
              <Grid item xs={9} style={{ padding: '0px' }}>
                <FavoritePage dataRole={this.getDataChildReports(roles, tab)} />
              </Grid>
            ) : (
              ''
            )}
            {tab === 2 ? (
              <Grid item xs={9}>
                <CashManager dataRole={this.getDataChildReports(roles, tab)} />
              </Grid>
            ) : (
              ''
            )}
            {/* Bán hàng */}
            {tab === 3 ? (
              <Grid item xs={9}>
                <SalesManager dataRole={this.getDataChildReports(roles, tab)} />
              </Grid>
            ) : (
              ''
            )}
            {/* Chi phí */}
            {tab === 4 ? (
              <Grid item xs={9}>
                <ExpenseManager dataRole={this.getDataChildReports(roles, tab)} />
              </Grid>
            ) : (
              ''
            )}
            {/* Kho */}
            {tab === 5 ? (
              <Grid item xs={9}>
                <StockManager dataRole={this.getDataChildReports(roles, tab)} />
              </Grid>
            ) : (
              ''
            )}
            {/* Tổng hợp */}
            {tab === 6 ? (
              <Grid item xs={9}>
                <GeneralManager dataRole={this.getDataChildReports(roles, tab)} />
              </Grid>
            ) : (
              ''
            )}
            {/* Công nợ */}
            {tab === 7 ? (
              <Grid item xs={9}>
                <ReceivableManager dataRole={this.getDataChildReports(roles, tab)} />
              </Grid>
            ) : (
              ''
            )}
            {tab === 11 ? (
              <Grid item xs={9}>
                <ExpandReportManager dataRole={this.getDataChildReports(roles, tab)} />
              </Grid>
            ) : null}

            {/* Custommer */}
            {tab === 8 ? (
              <Grid item xs={9}>
                <Grid item container spacing={24}>
                  <Grid md={12} item container />
                  <Grid item md={6}>
                    {isDisplay ? (
                      <TextField
                        fullWidth
                        label="Khách hàng"
                        value={isDisplay.name}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    ) : (
                      <Autocomplete
                        name="Chọn khách hàng..."
                        label=" Tên khách hàng"
                        suggestions={customers.data}
                        onChange={this.selectCustomer}
                        value={customer}
                        style={{ marginLeft: 10 }}
                      />
                    )}
                  </Grid>
                  {isDisplay ? (
                    <React.Fragment>
                      <Grid item md={6}>
                        <TextField
                          fullWidth
                          label="Công ty"
                          value=""
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item md={6}>
                        <TextField
                          fullWidth
                          label="Địa chỉ"
                          value={isDisplay.address}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item md={6}>
                        <TextField
                          fullWidth
                          label="Điện thoại"
                          value={isDisplay.phoneNumber}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </React.Fragment>
                  ) : null}
                </Grid>

                {tabIndex === 0 ? (
                  <div>
                    <Grid container>
                      <Grid item sm={12}>
                        {/* <Bt tab1={7}>SMS</Bt>
                        <Bt tab1={6}>Email</Bt> */}
                        <Bt tab1={5}>Thu chi</Bt>
                        <Bt tab1={4}>Báo cáo hợp đồng mới kí</Bt>
                        <Bt tab1={3}>Báo cáo hợp đồng hết hạn</Bt>
                        {/* <Bt tab1={3}>Báo giá/Bán hàng</Bt>
                        <Bt tab1={2}>Cơ hội kinh doanh</Bt>
                        <Bt tab1={1}>Công việc dự án</Bt> */}
                        <Bt tab1={1}>Danh sách hợp đồng</Bt>
                        <Bt tab1={0}>Danh sách khách hàng</Bt>
                      </Grid>
                    </Grid>
                    {tab1 === 0 ? <ReportListCustomer /> : null}
                    {tab1 === 1 ? <ListContract /> : null}
                    {tab1 === 3 ? <ListContractExpires /> : null}
                    {tab1 === 4 ? <NewContractReport /> : null}
                    {tab1 === 5 ? <ExpenditureCustomers /> : null}
                  </div>
                ) : null}
              </Grid>
            ) : null}

            {/* Công việc dự án */}
            {/* {tab === 9 ? (
              <>
                <Grid item xs={9}>
                  <TaskManager dataRole={this.getDataChildReports(roles, tab)} />
                </Grid>
                <SwipeableDrawer
                  disableClose
                  anchor="right"
                  onClose={() => this.setState({ openReportTaskStatus: false })}
                  open={this.state.openReportTaskStatus}
                  width={window.innerWidth - 260}
                >
                  <ReportTaskStatus
                    profile={this.props.profile}
                    onClose={() => this.setState({ openReportTaskStatus: false })}
                    onChangeSnackbar={this.props.onChangeSnackbar}
                  />
                </SwipeableDrawer>
                <SwipeableDrawer
                  disableClose
                  anchor="right"
                  onClose={() => this.setState({ openReportTimeTaskStatus: false })}
                  open={this.state.openReportTimeTaskStatus}
                  width={window.innerWidth - 260}
                >
                  <ReportTimeForJob
                    profile={this.props.profile}
                    onClose={() => this.setState({ openReportTimeTaskStatus: false })}
                    onChangeSnackbar={this.props.onChangeSnackbar}
                  />
                </SwipeableDrawer>
              </>
            ) : null} */}

            {tab === 9 && (
              <SwipeableDrawer
                anchor="right"
                onClose={() => this.setState({ showReportMonth: false })}
                open={showReportMonth}
                width={window.innerWidth - 260}
              >
                <div style={{ padding: '15px' }}>
                  <TaskReport />
                </div>
              </SwipeableDrawer>
            )}
            {tab === 9 && (
              <SwipeableDrawer
                anchor="right"
                onClose={() => this.setState({ showReportWeek: false })}
                open={showReportWeek}
                width={window.innerWidth - 260}
              >
                <div style={{ padding: '15px' }}>
                  <TaskReportWeekly />
                </div>
              </SwipeableDrawer>
            )}

            {tab === 11 && (
              <Grid item xs={9}>
                <Grid item container spacing={24}>
                  <Grid md={12} item container>
                    <div>Tạm thời chưa hỗ trợ</div>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {tab === 95 && (
              <Grid item xs={9}>
                <ReportUser />
              </Grid>
            )}
            {tab === 96 && (
              <Grid item xs={9}>
                <ReportTower onSelectCustomer={this.selectCustomer} customer={customer} />
              </Grid>
            )}
            {tab === 97 && (
              <Grid item xs={9}>
                <ReportDocumenttary />
              </Grid>
            )}
            {tab === 98 && (
              <Grid item xs={9}>
                <ReportAsset />
              </Grid>
            )}
            {tab === 99 && (
              <Grid item xs={9}>
                <StockManager roles={allRoles} />
              </Grid>
            )}
            {tab === 100 && (
              <Grid item xs={9}>
                <ReportRevenueGeneral />
              </Grid>
            )}
            {tab === 101 && (
              <Grid item xs={9}>
                <ReportGetMoney />
              </Grid>
            )}
            {tab === 102 && (
              <Grid item xs={9}>
                <ReportDebtOver />
              </Grid>
            )}
            {tab === 103 && (
              <Grid item xs={9}>
                <ReportDebtGeneral />
              </Grid>
            )}
            {tab === 104 && (
              <Grid item xs={9}>
                <ReportAsset />
              </Grid>
            )}
            {tab === 105 && (
              <Grid item xs={9}>
                <ReportUser />
              </Grid>
            )}



            {/* {tab === 13 && (
              <Grid item xs={9}>
                <ServiceReportFilter type="ground" />
              </Grid>
            )}
            {tab === 14 && (
              <Grid item xs={9}>
                <ServiceReportFilter type="maintainance" />
              </Grid>
            )}
            {tab === 15 && (
              <Grid item xs={9}>
                <FeeReportFilter />
              </Grid>
            )} */}
          </Grid>
        </Paper>
        {/* {openDialog ? (
          <BoDialog
            {...this.props}
            isTrading={false}
            path="/crm/BusinessOpportunities"
            handleClose={this.handleCloseDialog}
            callBack={this.callBack}
            open={openDialog}
            editData={editData}
            isEditting={isEditting}
          />
        ) : null}
        <SwipeableDrawer
     
          anchor="right"
          onClose={() => this.props.mergeData({ openSalesEmployee: false })}
          open={openSalesEmployee}
          width={window.innerWidth - 260}
        >
          <SalesEmployee profile={this.props.profile} onChangeSnackbar={this.props.onChangeSnackbar} />
        </SwipeableDrawer>
        <SwipeableDrawer
          disableClose
          anchor="right"
          onClose={() => this.setState({ openBusinessOp: false })}
          open={this.state.openBusinessOp}
          width={window.innerWidth - 260}
        >
          <ReportBusinessOp
            profile={this.props.profile}
            onClose={() => this.setState({ openBusinessOp: false })}
            onChangeSnackbar={this.props.onChangeSnackbar}
          />
        </SwipeableDrawer>
        <SwipeableDrawer
          disableClose
          anchor="right"
          onClose={() => this.setState({ openReportCustomerContract: false })}
          open={this.state.openReportCustomerContract}
          width={window.innerWidth - 260}
        >
          <ReportCustomerContract
            profile={this.props.profile}
            onClose={() => this.setState({ openReportCustomerContract: false })}
            onChangeSnackbar={this.props.onChangeSnackbar}
          />
        </SwipeableDrawer>

        <SwipeableDrawer
          disableClose
          anchor="right"
          onClose={() => this.setState({ openReportPersonnelStatistics: false })}
          open={this.state.openReportPersonnelStatistics}
          width={window.innerWidth - 260}
        >
          <ReportPersonnelStatistics
            profile={this.props.profile}
            onClose={() => this.setState({ openReportPersonnelStatistics: false })}
            onChangeSnackbar={this.props.onChangeSnackbar}
          />
        </SwipeableDrawer> */}
        {/* <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openReportCompletionLevel: false })}
          open={this.state.openReportCompletionLevel}
          width={window.innerWidth - 260}
        >
          <ReportCompletionLevel profile={this.props.profile}  onClose={() => this.setState({ openReportCompletionLevel: false })} onChangeSnackbar={this.props.onChangeSnackbar} />
        </SwipeableDrawer> */}
      </div>
    );
  }

  handleCloseDialog = () => {
    const id = this.props.match.params.id;
    if (id) {
      this.props.history.goBack();
    } else {
      this.props.mergeData({ openDialog: false, isEditting: false });
    }
  };
}

ReportReportCustomer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reportReportCustomer: makeSelectReportReportCustomer(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getReportCustomer: () => dispatch(getReportCustomer()),
    miniActive: makeSelectMiniActive(),
    onGetBos: pageDetail => {
      dispatch(fetchAllBosAction(pageDetail));
    },
    onDefaultData: () => {
      dispatch(defaultData());
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'reportReportCustomer', reducer });
const withSaga = injectSaga({ key: 'reportReportCustomer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(ReportReportCustomer);
