/**
 *
 * RevenueAndExpenditure
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  withStyles,
  Grid,
  Paper,
  Tabs,
  Tab,
  Typography,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  // Button,
  TextField,
  MenuItem,
  Tooltip,
} from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import dot from 'dot-object';
import HOCTable from '../HocTable';
import makeSelectRevenueAndExpenditure from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import Kanban from '../KanbanPlugin';
import {
  getAllRecordAct,
  deleteRecordAct,
  resetNoti,
  getAdvanceRecordAct,
  resetList,
  deleteAdvanceRecordAct,
  getReibursementRecordAct,
  deleteReibursementRecordAct,
  getPaymentRecordAct,
  deletePaymentRecordAct,
  updateRecord,
  updateRecordAdvance,
  updateRecordReibursement,
  updateRecordPayment,
  mergeDataRevenueAndExpenditure,
} from './actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import { serialize } from '../../utils/common';
import messages from './messages';
import { injectIntl } from 'react-intl';
import Button from 'components/CustomButtons/Button';
import { API_RNE, API_RNE_REMBUR, API_PAYMENT, API_RNE_ADVANCE } from 'config/urlConfig';
import BODialog from '../../components/LifetekUi/Planner/BODialog';
import makeSelectEditProfilePage from '../EditProfilePage/selectors';
import makeSelectDashboardPage from 'containers/Dashboard/selectors';
import ListPage from '../../components/List';
import { Add } from '@material-ui/icons';

function formatNumber(num) {
  if (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  return '';
}

const CustomAmount = props => {
  const item = dot.object(props.item);
  return <div>{formatNumber(Number(item.amount))}</div>;
};

const CustomTax = props => {
  const item = dot.object(props.item);
  return <div>{formatNumber(item.tax)}</div>;
};

const CustomCostType = props => {
  const item = dot.object(props.item);
  if (Number(item.costType) === 0) return <div>Chi phí nội bộ</div>;
  if (Number(item.costType) === 1) return <div>Chi phí nhập hàng</div>;
  return <div>Chi phí bán hàng</div>;
};

const CustomType = props => {
  const item = dot.object(props.item);
  if (Number(item.type) === 1) return <div>Chi</div>;
  return <div>Thu</div>;
};
const crmSource = JSON.parse(localStorage.getItem('crmSource')) || [];
const expenseTypeSource = crmSource.find(item => item.code === 'S24') || {};
const CustomExpenseType = props => {
  const item = dot.object(props.item);
  if (expenseTypeSource.data) {
    const foundExpense = expenseTypeSource.data.find(s => s.value === item.expenseType);
    if (foundExpense) return foundExpense.title;
  }
  return item.expenseType;
};

/* eslint-disable react/prefer-stateless-function */
export class RevenueAndExpenditure extends React.Component {
  state = {
    valueOfTab: 0,
    tab: 0,
    kanbanFilter: {
      status: 1,
    },
    recordList: [],
    advanceList: [],
    reibursementList: [],
    paymentList: [],
    onDelete: false,
    arrDelete: [],
    valueOfFilter: -1,
    pageDetail: {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    },
    body: '',
    kanbanData: {},
    openKanbanDialog: false,
    settingRole: {},
    AdvanceRequire: {},
    ReimbursementRequire: {},
    PaymentRequire: {},
    synModuleLogRole: {},
    tab: 0,
  };

  // componentWillMount() {
  //   this.props.onGetAllRecord('');
  // }
  componentDidMount() {
    const { dashboardPage } = this.props;
    const { role = {} } = dashboardPage;
    const { roles } = role;
    const fakeModule = [
      { name: 'RevenueExpenditureInternal', valueOfTab: 0 },
      { name: 'RevenueExpenditureImports', valueOfTab: 1 },
      { name: 'RevenueExpenditure', valueOfTab: 2 },
    ];
    if (!Object.keys(this.state.settingRole).length) {
      const getRole = moduleCode => {
        // console.log(moduleCode)
        const roleCode = roles.find(item => item.codeModleFunction === moduleCode);
        const newRoleModule = roleCode ? roleCode.methods : [];
        let getRole = newRoleModule.find(elm => elm.name === 'GET');
        let putRole = newRoleModule.find(elm => elm.name === 'PUT');
        let postRole = newRoleModule.find(elm => elm.name === 'POST');
        let deleteRole = newRoleModule.find(elm => elm.name === 'DELETE');
        let exportRole = newRoleModule.find(elm => elm.name === 'EXPORT');
        let importRole = newRoleModule.find(elm => elm.name === 'IMPORT');
        let viewConfigRole = newRoleModule.find(elm => elm.name === 'VIEWCONFIG');
        getRole = getRole && getRole.allow;
        putRole = putRole && putRole.allow;
        postRole = postRole && postRole.allow;
        deleteRole = deleteRole && deleteRole.allow;
        exportRole = exportRole && exportRole.allow;
        importRole = importRole && importRole.allow;
        viewConfigRole = viewConfigRole && viewConfigRole.allow;
        // console.log(getRole,moduleCode,'dddd')
        return { getRole, putRole, postRole, deleteRole, exportRole, importRole, viewConfigRole };
      };
      if (roles) {
        // this.setState({ synModuleLogRole: getRole('SynModuleLog')});
        // this.setState({ settingRole: getRole('RevenueExpenditure')});
        const RevenueExpenditureInternalRole = getRole('RevenueExpenditureInternal');
        const RevenueExpenditureImportsRole = getRole('RevenueExpenditureImports');
        const RevenueExpenditureRole = getRole('RevenueExpenditure');
        this.setState({ RevenueExpenditureInternalRole: RevenueExpenditureInternalRole });
        this.setState({ RevenueExpenditureImportsRole: RevenueExpenditureImportsRole });
        this.setState({ RevenueExpenditureRole: RevenueExpenditureRole });
        // setSettingRole(getRole('setting'));
        const newFakeModule = fakeModule
          .map(item => {
            if (getRole(item.name).getRole) {
              return item;
            }
          })
          .filter(f => f);
        this.setState({ valueOfTab: newFakeModule[0].valueOfTab });
      }
    }
  }
  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { revenueAndExpenditure } = props;
      if (revenueAndExpenditure.recordList) {
        const recordList = revenueAndExpenditure.recordList || [];
        this.setState({ recordList });
      }
      if (revenueAndExpenditure.advanceRecordList) {
        const advanceRecordList = revenueAndExpenditure.advanceRecordList || [];
        this.setState({ advanceList: advanceRecordList });
      }
      if (revenueAndExpenditure.reibursementRecordList) {
        const reibursementList = revenueAndExpenditure.reibursementRecordList || [];
        this.setState({ reibursementList });
      }
      if (revenueAndExpenditure.paymentRecordList) {
        const paymentList = revenueAndExpenditure.paymentRecordList || [];
        this.setState({ paymentList });
      }
      this.state.pageDetail.totalCount = revenueAndExpenditure.count || 0;
      this.state.pageDetail.currentPage = Number(revenueAndExpenditure.skip || 0) || 0;
      this.state.pageDetail.pageSize = revenueAndExpenditure.limit || 0;

      if (props.history.value) {
        this.setState({ valueOfTab: props.history.value });
        props.history.value = undefined;
      }
    }
  }

  componentDidUpdate(props) {
    const { revenueAndExpenditure } = props;
    if (revenueAndExpenditure.successDelete) {
      this.props.onResetNoti();
      this.state.onDelete = false;
    }
  }

  callBack = (cmd, data) => {
    switch (cmd) {
      case 'kanban-dragndrop':
        if (valueOfTab === 0 || valueOfTab === 1 || valueOfTab === 2) {
          this.props.updateRecord(data);
        } else if (valueOfTab === 3) {
          this.props.updateRecordAdvance(data);
        } else if (valueOfTab === 4) {
          this.props.updateRecordReibursement(data);
        } else if (valueOfTab === 5) {
          this.props.updateRecordPayment(data);
        }
        break;
      case 'kanban-dragndrop-re': {
        this.props.mergeDataRevenueAndExpenditure(data);
        break;
      }
      case 'quick-add': {
        this.props.history.push(`/RevenueExpenditure/add`);
        // this.props.mergeData({ openDrawer: true });
        break;
      }
      case 'CommentDialog': {
        this.setState({ openKanbanDialog: true, kanbanData: data });
        break;
      }
      default:
        break;
    }
  };
  mapFunction1 = item => {
    return {
      ...item,
      amount: Number(item.amount).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      totalPaid: Number(item.totalPaid).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      totalMoney: Number(item.totalMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      type: Number(item.type) === 0 ? 'Thu' : 'Chi',
      payMethod:
        Number(item.payMethod) === 0
          ? 'Tiền mặt'
          : Number(item.payMethod) == 1
            ? 'Chuyển khoản'
            : Number(item.payMethod) == 2
              ? 'Thẻ quà tặng'
              : 'khác',
    };
  };
  mapFunction2 = item => {
    return {
      ...item,
      amount: Number(item.amount).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      totalPaid: Number(item.totalPaid).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      'contract.contractId.contractValue': Number(item['contract.contractId.contractValue']).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      totalMoney: Number(item.totalMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      debt: Number(item.debt).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      type: Number(item.type) === 0 ? 'Thu' : 'Chi',
      payMethod:
        Number(item.payMethod) === 0
          ? 'Tiền mặt'
          : Number(item.payMethod) == 1
            ? 'Chuyển khoản'
            : Number(item.payMethod) == 2
              ? 'Thẻ quà tặng'
              : 'khác',
    };
  };
  mapFunction3 = item => {
    const keys = Object.keys(item).filter(f => f.startsWith('fee.') && f.endsWith('Money') && f.split('.').length <= 2);
    const newItem = { ...item };
    console.log(item.feeType, 'item', keys);

    Array.isArray(keys) &&
      keys.map((name, i) => {
        // (newItem.type = item.type === 0 ? 'Thu' : 'Chi'),
        //   (newItem.costType = item.costType === 0 ? 'Chi phí nội bộ' : 'Chi phí nhập hàng'),
        //   (newItem.payMethod =
        //     item.payMethod == 0 ? 'Tiền mặt' : item.payMethod == 1 ? 'Chuyển khoản' : item.payMethod == 2 ? 'Thẻ quà tặng' : 'khác'),
        //   (newItem.feeType =
        //     item.feeType == 0
        //       ? 'Thông Báo Phí'
        //       : item.feeType == 1
        //         ? 'Đặt Cọc'
        //         : item.feeType == 2
        //           ? 'Hoàn Cọc'
        //           : item.feeType == 3
        //             ? 'Hoàn Tiền Chuyển Nhầm'
        //             : item.feeType == 4
        //               ? 'Truy Thu'
        //               : item.feeType == 5
        //                 ? 'Giai đoạn thanh toán'
        //                 : item.feeType == 6
        //                   ? 'Thu hồi'
        //                   : '');
        newItem[name] = Number(item[name]).toLocaleString('es-AR', { maximumFractionDigits: 0 });
      });
    return {
      ...newItem,
      type: newItem.type === 0 ? 'Thu' : 'Chi',
      costType: newItem.costType === 0 ? 'Chi phí nội bộ' : 'Chi phí nhập hàng',
      payMethod: newItem.payMethod == 0 ? 'Tiền mặt' : newItem.payMethod == 1 ? 'Chuyển khoản' : newItem.payMethod == 2 ? 'Thẻ quà tặng' : 'khác',
      feeType:
        newItem.feeType == 0
          ? 'Thông Báo Phí'
          : newItem.feeType == 1
            ? 'Đặt Cọc'
            : newItem.feeType == 2
              ? 'Hoàn Cọc'
              : newItem.feeType == 3
                ? 'Hoàn Tiền Chuyển Nhầm'
                : newItem.feeType == 4
                  ? 'Truy Thu'
                  : newItem.feeType == 5
                    ? 'Giai đoạn thanh toán'
                    : newItem.feeType == 6
                      ? 'Thu hồi'
                      : '',
      totalPaid: Number(item.totalPaid).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      total: Number(item.total).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      totalMoney: Number(item.totalMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      debt: Number(item.debt).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
    };
    // return {
    //   ...item,
    //   type: item.type === 0 ? "Thu" : "Chi",
    //   costType: item.costType === 0 ? "Chi phí nội bộ" : "Chi phí nhập hàng",
    //   payMethod: item.payMethod == 0 ? "Tiền mặt"
    //   :  item.payMethod == 1 ? "Chuyển khoản"
    //   : item.payMethod == 2 ? "Thẻ quà tặng"
    //   : "khác"
    // };
  };

  handleFilter = (name, value) => {
    this.setState({ [name]: value });
  };

  render() {
    const { classes, revenueAndExpenditure, intl, profile } = this.props;
    const {
      valueOfTab,
      recordList,
      advanceList,
      reibursementList,
      paymentList,
      tab,
      RevenueExpenditureImportsRole,
      RevenueExpenditureInternalRole,
      RevenueExpenditureRole,
    } = this.state;
    const { reload } = revenueAndExpenditure;
    // const newRecordList = recordList.map(item => dot.dot(item));
    // const newAdvanceList = advanceList.map(item => dot.dot(item));
    // const newReibursementList = reibursementList.map(item => dot.dot(item));
    // const newPaymentList = paymentList.map(item => dot.dot(item));
    const nameCallBack = 're';

    const Bt = props => (
      <Button
        onClick={() => {
          this.setState({ tab: props.tab });
        }}
        {...props}
        color={props.tab === tab ? 'gradient' : 'simple'}
        right
        round
        size="sm"
      >
        {props.children}
      </Button>
    );

    return (
      <div>
        {revenueAndExpenditure.loading ? <LoadingIndicator /> : null}
        <Helmet>
          <title>Tài chính nội bộ </title>
          <meta name="description" content="Description of RevenueAndExpenditure" />
        </Helmet>
        <Grid>
          <Paper className={classes.paper}>
            <Tabs value={valueOfTab} indicatorColor="primary" textColor="primary" onChange={this.handleChangeTabValue}>
              {RevenueExpenditureInternalRole &&
                RevenueExpenditureInternalRole.getRole && (
                  <Tab
                    value={0}
                    label={
                      <Badge color="primary" badgeContent={revenueAndExpenditure.internalCost || 0} max={9999}>
                        <Typography className={classes.padding}>Nội bộ</Typography>
                      </Badge>
                    }
                  />
                )}
              {RevenueExpenditureImportsRole &&
                RevenueExpenditureImportsRole.getRole && (
                  <Tab
                    value={1}
                    label={
                      <Badge color="primary" badgeContent={revenueAndExpenditure.importCost || 0} max={9999}>
                        <Typography className={classes.padding}>Nhập hàng</Typography>
                      </Badge>
                    }
                  />
                )}
              {RevenueExpenditureRole &&
                RevenueExpenditureRole.getRole && (
                  <Tab
                    value={2}
                    label={
                      <Badge color="primary" badgeContent={revenueAndExpenditure.exportCost || 0} max={9999}>
                        <Typography className={classes.padding}>Bán hàng</Typography>
                      </Badge>
                    }
                  />
                )}
            </Tabs>
            {valueOfTab === 0 ? (
              <TabContainer>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={1}>Kanban</Bt>
                    <Bt tab={0}>Danh sách</Bt>
                  </Grid>
                </Grid>
                {tab === 0 && (
                  <>
                    <ListPage
                      code="RevenueExpenditureInternal"
                      apiUrl={API_RNE}
                      exportExcel
                      kanban="ST19"
                      kanbanKey="_id"
                      withPagination
                      reload={reload}
                      onEdit={this.handleEditClick1}
                      settingBar={[this.addClick1()]}
                      disableAdd
                      filter={{
                        costType: this.state.valueOfTab,
                      }}
                      mapFunction={this.mapFunction1}
                    />
                  </>
                )}
                {tab === 1 && (
                  <Kanban
                    dashboardPage={this.props.dashboardPage}
                    isOpenSinglePage
                    statusType="crmStatus"
                    // enableTotal
                    enableAdd
                    callBack={this.callBack}
                    // titleField="reason" // tên trường sẽ lấy làm title trong kanban
                    // callBack={this.callBack} // sự kiện trả về kanban
                    // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                    // data={bos} // list dữ liệu
                    reload={reload}
                    path={`${API_RNE}`}
                    code="ST19" // code của danh sách trạng thái kanban
                    filter={{
                      costType: this.state.valueOfTab,
                    }}
                    // customFilter={
                    //   <React.Fragment>
                    //      <Grid container spacing={16}>
                    //       <Grid item xs={4}>
                    //             <DepartmentAndEmployee
                    //               department={this.state.kanbanFilter.organizationUnit}
                    //               employee={this.state.kanbanFilter.employee ? this.state.kanbanFilter.employee : ''}
                    //               onChange={this.handleChangeDepartmentAndEmployeeKanban}
                    //               profile={profile}
                    //             />
                    //           </Grid>
                    //      </Grid>
                    //   </React.Fragment>
                    // }
                    nameCallBack={nameCallBack}
                    customContent={customContent}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params="RevenueExpenditure/edit"
                  />
                )}
                <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
                  <BODialog
                    setCoverTask={() => {}}
                    profile={profile}
                    taskId={this.state.kanbanData._id}
                    // filterItem={innerFilterItem}
                    data={this.state.kanbanData}
                    API={API_RNE}
                    customContent={customContent}
                  />
                </Dialog>
              </TabContainer>
            ) : (
              ''
            )}
            {console.log('valueOfTab', valueOfTab)}
            {valueOfTab === 1 ? (
              <TabContainer>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={1}>Kanban</Bt>
                    <Bt tab={0}>Danh sách</Bt>
                  </Grid>
                </Grid>
                {tab === 0 && (
                  <>
                    <ListPage
                      code="RevenueExpenditureImports"
                      apiUrl={API_RNE}
                      exportExcel
                      kanban="ST19"
                      kanbanKey="_id"
                      withPagination
                      reload={reload}
                      onEdit={this.handleEditClick2}
                      settingBar={[this.addClick2()]}
                      disableAdd
                      filter={{
                        costType: this.state.valueOfTab,
                      }}
                      mapFunction={this.mapFunction2}
                    />
                  </>
                )}
                {tab === 1 && (
                  <Kanban
                    dashboardPage={this.props.dashboardPage}
                    isOpenSinglePage
                    statusType="crmStatus"
                    // enableTotal
                    enableAdd
                    callBack={this.callBack}
                    // titleField="reason" // tên trường sẽ lấy làm title trong kanban
                    // callBack={this.callBack} // sự kiện trả về kanban
                    // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                    // data={bos} // list dữ liệu
                    reload={reload}
                    path={`${API_RNE}`}
                    code="ST19" // code của danh sách trạng thái kanban
                    filter={{
                      costType: this.state.valueOfTab,
                    }}
                    // customFilter={
                    //   <React.Fragment>
                    //      <Grid container spacing={16}>
                    //       <Grid item xs={4}>
                    //             <DepartmentAndEmployee
                    //               department={this.state.kanbanFilter.organizationUnit}
                    //               employee={this.state.kanbanFilter.employee ? this.state.kanbanFilter.employee : ''}
                    //               onChange={this.handleChangeDepartmentAndEmployeeKanban}
                    //               profile={profile}
                    //             />
                    //           </Grid>
                    //      </Grid>
                    //   </React.Fragment>
                    // }
                    nameCallBack={nameCallBack}
                    customContent={customContent}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params="RevenueExpenditure/edit"
                  />
                )}
                <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
                  <BODialog
                    setCoverTask={() => {}}
                    profile={profile}
                    taskId={this.state.kanbanData._id}
                    // filterItem={innerFilterItem}
                    data={this.state.kanbanData}
                    API={API_RNE}
                    customContent={customContent}
                  />
                </Dialog>
              </TabContainer>
            ) : (
              ''
            )}
            {valueOfTab === 2 ? (
              <TabContainer>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={1}>Kanban</Bt>
                    <Bt tab={0}>Danh sách</Bt>
                  </Grid>
                </Grid>
                {tab === 0 && (
                  <>
                    <ListPage
                      code="RevenueExpenditure"
                      apiUrl={API_RNE}
                      exportExcel
                      kanban="ST19"
                      kanbanKey="_id"
                      withPagination
                      reload={reload}
                      onEdit={this.handleEditClick3}
                      settingBar={[this.addClick3()]}
                      disableAdd
                      filter={{
                        costType: this.state.valueOfTab,
                      }}
                      mapFunction={this.mapFunction3}
                      saleSearch={true}
                      newFilter={event => this.handleFilter(event.target.name, event.target.value)}
                    />
                  </>
                )}
                {tab === 1 && (
                  <Kanban
                    dashboardPage={this.props.dashboardPage}
                    isOpenSinglePage
                    statusType="crmStatus"
                    // enableTotal
                    enableAdd
                    callBack={this.callBack}
                    // titleField="reason" // tên trường sẽ lấy làm title trong kanban
                    // callBack={this.callBack} // sự kiện trả về kanban
                    // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                    // data={bos} // list dữ liệu
                    reload={reload}
                    path={`${API_RNE}`}
                    code="ST19" // code của danh sách trạng thái kanban
                    filter={{
                      costType: this.state.valueOfTab,
                    }}
                    // customFilter={
                    //   <React.Fragment>
                    //      <Grid container spacing={16}>
                    //       <Grid item xs={4}>
                    //             <DepartmentAndEmployee
                    //               department={this.state.kanbanFilter.organizationUnit}
                    //               employee={this.state.kanbanFilter.employee ? this.state.kanbanFilter.employee : ''}
                    //               onChange={this.handleChangeDepartmentAndEmployeeKanban}
                    //               profile={profile}
                    //             />
                    //           </Grid>
                    //      </Grid>
                    //   </React.Fragment>
                    // }
                    nameCallBack={nameCallBack}
                    customContent={customContent}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params="RevenueExpenditure/edit"
                  />
                )}
                <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
                  <BODialog
                    setCoverTask={() => {}}
                    profile={profile}
                    taskId={this.state.kanbanData._id}
                    // filterItem={innerFilterItem}
                    data={this.state.kanbanData}
                    API={API_RNE}
                    customContent={customContent}
                  />
                </Dialog>
              </TabContainer>
            ) : (
              ''
            )}
            {valueOfTab === 3 ? (
              <TabContainer>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={1}>Kanban</Bt>
                    <Bt tab={0}>Danh sách</Bt>
                  </Grid>
                </Grid>
                {tab === 0 && (
                  <ListPage
                    code="AdvanceRequire"
                    apiUrl={API_RNE_ADVANCE}
                    exportExcel
                    kanban="ST19"
                    kanbanKey="_id"
                    withPagination
                    reload={reload}
                    onEdit={this.handleEditAdvanceClick}
                    settingBar={[this.addAdvanceClick()]}
                    disableAdd
                    //  mapFunction={this.mapFunctionAdvance}
                  />
                )}
                {tab === 1 && (
                  <Kanban
                    dashboardPage={this.props.dashboardPage}
                    isOpenSinglePage
                    statusType="crmStatus"
                    enableTotal
                    callBack={this.callBack}
                    titleField="name" // tên trường sẽ lấy làm title trong kanban
                    // callBack={this.callBack} // sự kiện trả về kanban
                    // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                    // data={bos} // list dữ liệu
                    reload={reload}
                    path={`${API_RNE_ADVANCE}`}
                    code="ST19" // code của danh sách trạng thái kanban
                    filter={this.state.kanbanFilter}
                    // customFilter={
                    //   <React.Fragment>
                    //      <Grid container spacing={16}>
                    //       <Grid item xs={4}>
                    //             <DepartmentAndEmployee
                    //               department={this.state.kanbanFilter.organizationUnit}
                    //               employee={this.state.kanbanFilter.employee ? this.state.kanbanFilter.employee : ''}
                    //               onChange={this.handleChangeDepartmentAndEmployeeKanban}
                    //               profile={profile}
                    //             />
                    //           </Grid>
                    //      </Grid>
                    //   </React.Fragment>
                    // }
                    customContent={customContent}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params="RevenueExpenditure/edit"
                  />
                )}
                <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
                  <BODialog
                    setCoverTask={() => {}}
                    profile={profile}
                    taskId={this.state.kanbanData._id}
                    // filterItem={innerFilterItem}
                    data={this.state.kanbanData}
                    API={API_RNE_ADVANCE}
                    customContent={customContent}
                  />
                </Dialog>
              </TabContainer>
            ) : (
              ''
            )}
            {valueOfTab === 4 ? (
              <TabContainer>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={1}>Kanban</Bt>
                    <Bt tab={0}>Danh sách</Bt>
                  </Grid>
                </Grid>
                {tab === 0 && (
                  <ListPage
                    code="ReimbursementRequire"
                    apiUrl={API_RNE_REMBUR}
                    exportExcel
                    kanban="ST19"
                    kanbanKey="_id"
                    withPagination
                    reload={reload}
                    onEdit={this.handleEditReimbursementClick}
                    settingBar={[this.addReimbursementClick()]}
                    disableAdd
                    mapFunction={this.mapFunction}
                  />
                )}
                {tab === 1 && (
                  <Kanban
                    dashboardPage={this.props.dashboardPage}
                    isOpenSinglePage
                    statusType="crmStatus"
                    enableTotal
                    callBack={this.callBack}
                    titleField="name" // tên trường sẽ lấy làm title trong kanban
                    // callBack={this.callBack} // sự kiện trả về kanban
                    // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                    // data={bos} // list dữ liệu
                    reload={reload}
                    path={`${API_RNE_REMBUR}`}
                    code="ST19" // code của danh sách trạng thái kanban
                    filter={this.state.kanbanFilter}
                    customContent={customContent}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params="RevenueExpenditure/edit"
                  />
                )}
                <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
                  <BODialog
                    setCoverTask={() => {}}
                    profile={profile}
                    taskId={this.state.kanbanData._id}
                    // filterItem={innerFilterItem}
                    data={this.state.kanbanData}
                    API={API_RNE_REMBUR}
                    customContent={customContent}
                  />
                </Dialog>
              </TabContainer>
            ) : (
              ''
            )}
            {valueOfTab === 5 ? (
              <TabContainer>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={1}>Kanban</Bt>
                    <Bt tab={0}>Danh sách</Bt>
                  </Grid>
                </Grid>
                {tab === 0 && (
                  <ListPage
                    code="PaymentRequire"
                    apiUrl={API_PAYMENT}
                    exportExcel
                    kanban="ST19"
                    kanbanKey="_id"
                    withPagination
                    reload={reload}
                    onEdit={this.handleEditPaymentClick}
                    settingBar={[this.addPaymentClick()]}
                    disableAdd
                    // mapFunction={this.mapFunction}
                  />
                )}
                {tab === 1 && (
                  <Kanban
                    dashboardPage={this.props.dashboardPage}
                    isOpenSinglePage
                    statusType="crmStatus"
                    enableTotal
                    callBack={this.callBack}
                    titleField="name" // tên trường sẽ lấy làm title trong kanban
                    // callBack={this.callBack} // sự kiện trả về kanban
                    // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                    // data={bos} // list dữ liệu
                    reload={reload}
                    path={`${API_PAYMENT}`}
                    code="ST19" // code của danh sách trạng thái kanban
                    filter={this.state.kanbanFilter}
                    customContent={customContent}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params="RevenueExpenditure/edit"
                  />
                )}
                <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
                  <BODialog
                    setCoverTask={() => {}}
                    profile={profile}
                    taskId={this.state.kanbanData._id}
                    // filterItem={innerFilterItem}
                    data={this.state.kanbanData}
                    API={API_PAYMENT}
                    customContent={customContent}
                  />
                </Dialog>
              </TabContainer>
            ) : (
              ''
            )}
          </Paper>
        </Grid>
        <Dialog
          open={this.state.onDelete}
          onClose={this.handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Bạn có chắc chắn muốn xóa?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="primary" onClick={() => this.handleDelete()}>
              LƯU
            </Button>
            <Button variant="outlined" onClick={this.handleCloseDelete} color="secondary" autoFocus>
              hủy
            </Button>
          </DialogActions>
        </Dialog>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }
  confirmDelete = val => {
    this.setState({
      chooseItem: val,
      open4: true,
    });
  };
  onGetAllItemsCustom = params1 => {
    let body = '';
    body = serialize(params1);
    const { valueOfFilter } = this.state;
    let { valueOfTab } = this.state;
    if (this.props.history.value) {
      valueOfTab = this.props.history.value;
    }
    let params = {
      filter: {
        costType: valueOfTab,
      },
    };
    if (Number(valueOfFilter) !== -1) {
      params = {
        filter: {
          costType: valueOfTab,
          type: valueOfFilter,
        },
      };
    }
    body += `&${serialize(params)}`;
    this.setState({ body });
    this.props.onGetAllRecord(body);
  };

  handleChangeFilter = e => {
    const filter = {
      filter: {
        type: e.target.value,
        costType: this.state.valueOfTab,
      },
      skip: 0,
      limit: 5,
    };
    if (Number(e.target.value) === -1) {
      const filter1 = {
        filter: {
          costType: this.state.valueOfTab,
        },
        skip: 0,
        limit: 5,
      };
      this.props.onGetAllRecord(serialize(filter1));
    } else {
      this.props.onGetAllRecord(serialize(filter));
    }
    this.setState({ valueOfFilter: e.target.value });
  };

  handleDelete = () => {
    const { valueOfTab } = this.state;
    if (valueOfTab === 0 || valueOfTab === 1 || valueOfTab === 2) {
      this.props.onDelete(this.state.arrDelete);
    }
    if (valueOfTab === 3) {
      this.props.onDeleteAdvance(this.state.arrDelete);
    }
    if (valueOfTab === 4) {
      this.props.onDeleteReibursement(this.state.arrDelete);
    }
    if (valueOfTab === 5) {
      this.props.onDeletePayment(this.state.arrDelete);
    }
  };

  handleCloseDelete = () => {
    this.setState({ onDelete: false });
  };

  handleDeleteClick = item => {
    const { recordList, advanceList, reibursementList, valueOfTab, paymentList } = this.state;
    const arrDelete = [];
    if (valueOfTab === 0 || valueOfTab === 1 || valueOfTab === 2) {
      item.forEach(n => {
        arrDelete.push(recordList[n]._id);
      });
    } else if (valueOfTab === 3) {
      item.forEach(n => {
        arrDelete.push(advanceList[n]._id);
      });
    } else if (valueOfTab === 4) {
      item.forEach(n => {
        arrDelete.push(reibursementList[n]._id);
      });
    } else {
      item.forEach(n => {
        arrDelete.push(paymentList[n]._id);
      });
    }
    this.setState({ onDelete: true, arrDelete });
  };

  handleChangeTabValue = (event, value) => {
    this.setState({ tab: 0 });
    const pageDetail = {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    };
    if (Number(value) === 3) {
      this.props.onResetList();
      // this.props.onGetAdvanceRecord();
      this.setState({ recordList: [], reibursementList: [], paymentList: [] });
    } else if (Number(value) === 0 || Number(value) === 1 || Number(value) === 2) {
      this.props.onResetList();
      const { valueOfFilter } = this.state;
      const filter = {
        filter: {
          type: valueOfFilter,
          costType: value,
        },
        skip: 0,
        limit: 5,
      };
      if (Number(valueOfFilter) === -1) {
        const filter1 = {
          filter: {
            costType: value,
          },
          skip: 0,
          limit: 5,
        };
        this.setState({ body: serialize(filter1), reload: true });
        this.props.onGetAllRecord(serialize(filter1));
      } else {
        this.setState({ body: serialize(filter), reload: true });
        this.props.onGetAllRecord(serialize(filter));
      }
      this.setState({ advanceList: [], reibursementList: [], paymentList: [] });
    } else if (Number(value) === 4) {
      this.props.onResetList();
      // this.props.onGetReibursementRecord();
      this.setState({ recordList: [], advanceList: [], paymentList: [] });
    } else if (Number(value) === 5) {
      this.props.onResetList();
      // this.props.onGetPaymentRecord();
      this.setState({ recordList: [], advanceList: [], reibursementList: [] });
    }
    this.setState({ valueOfTab: value, pageDetail, reload: true });
  };

  handleEditClick1 = item => {
    const { history } = this.props;
    history.push({
      pathname: `/RevenueExpenditure/internal/edit/${item._id}`,
      state: { add: false },
    });
  };
  handleEditClick2 = item => {
    const { history } = this.props;
    history.push({
      pathname: `/RevenueExpenditure/import/edit/${item._id}`,
      state: { add: false },
    });
  };
  handleEditClick3 = item => {
    const { history } = this.props;
    history.push({
      pathname: `/RevenueExpenditure/edit/${item._id}`,
      state: { add: false },
    });
  };

  handleEditAdvanceClick = item => {
    const { history } = this.props;
    history.push(`/RevenueExpenditure/advance/edit/${item._id}`);
  };

  handleEditReimbursementClick = item => {
    const { history } = this.props;
    history.push(`/RevenueExpenditure/reimbursement/edit/${item._id}`);
  };

  handleEditPaymentClick = item => {
    const { history } = this.props;
    history.push(`/RevenueExpenditure/payment/edit/${item._id}`);
  };

  hanldeAddPaymentClick = () => {
    this.props.history.push('/RevenueExpenditure/payment/add');
  };

  addPaymentClick = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.hanldeAddPaymentClick} />
    </Tooltip>
  );

  handleAddReimbursementClick = () => {
    this.props.history.push('/RevenueExpenditure/reimbursement/add');
  };

  addReimbursementClick = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.handleAddReimbursementClick} />
    </Tooltip>
  );

  handleAddClick1 = () => {
    this.props.history.value = this.state.valueOfTab;
    this.props.history.push({
      pathname: '/RevenueExpenditure/internal/add',
      state: { typeOfRecord: this.state.valueOfTab, add: true },
    });
  };
  handleAddClick2 = () => {
    this.props.history.value = this.state.valueOfTab;
    this.props.history.push({
      pathname: '/RevenueExpenditure/import/add',
      state: { typeOfRecord: this.state.valueOfTab, add: true },
    });
  };
  handleAddClick3 = () => {
    this.props.history.value = this.state.valueOfTab;
    this.props.history.push({
      pathname: '/RevenueExpenditure/add',
      state: { typeOfRecord: this.state.valueOfTab, add: true },
    });
  };

  addClick1 = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.handleAddClick1} />
    </Tooltip>
  );
  addClick2 = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.handleAddClick2} />
    </Tooltip>
  );
  addClick3 = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.handleAddClick3} />
    </Tooltip>
  );

  handleAddAdvanceClick = () => {
    this.props.history.push('/RevenueExpenditure/advance/add');
  };

  addAdvanceClick = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.handleAddAdvanceClick} />
    </Tooltip>
  );
}

RevenueAndExpenditure.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  revenueAndExpenditure: makeSelectRevenueAndExpenditure(),
  profile: makeSelectEditProfilePage(),
  dashboardPage: makeSelectDashboardPage(),
});

function TabContainer(props) {
  return <Grid style={{ padding: '20px 0' }}>{props.children}</Grid>;
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllRecord: params => {
      dispatch(getAllRecordAct(params));
    },
    onDelete: body => {
      dispatch(deleteRecordAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    onResetList: () => {
      dispatch(resetList());
    },
    onGetAdvanceRecord: body => {
      dispatch(getAdvanceRecordAct(body));
    },
    onGetPaymentRecord: body => {
      dispatch(getPaymentRecordAct(body));
    },
    onDeleteAdvance: body => {
      dispatch(deleteAdvanceRecordAct(body));
    },
    onGetReibursementRecord: body => {
      dispatch(getReibursementRecordAct(body));
    },
    onDeleteReibursement: body => {
      dispatch(deleteReibursementRecordAct(body));
    },
    onDeletePayment: body => {
      dispatch(deletePaymentRecordAct(body));
    },
    updateRecord: body => dispatch(updateRecord(body)),
    updateRecordAdvance: body => dispatch(updateRecordAdvance(body)),
    updateRecordReibursement: body => dispatch(updateRecordReibursement(body)),
    updateRecordPayment: body => dispatch(updateRecordPayment(body)),
    mergeDataRevenueAndExpenditure: val => {
      dispatch(mergeDataRevenueAndExpenditure(val));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'revenueAndExpenditure', reducer });
const withSaga = injectSaga({ key: 'revenueAndExpenditure', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(RevenueAndExpenditure);

// function filerType() {
//   const test = customContent.type;
//   console.log('test',test)
// }

const customContent = [
  // {
  //   title: 'Loại thu chi',
  //   fieldName: 'type' ,
  //   type: 'type',
  // },
  {
    title: 'Số tiền',
    fieldName: 'amount',
    type: 'number',
  },
];
