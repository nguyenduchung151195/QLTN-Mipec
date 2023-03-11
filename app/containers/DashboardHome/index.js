/* eslint-disable no-unused-vars */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * DashboardHome
 *
 */

import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TableBody, TableCell, Table, TableRow, TableHead, Tabs, Tab, Avatar, Tooltip, MenuItem, Menu } from '@material-ui/core';
import { CardTravel, NextWeek, Receipt, PermContactCalendar, Add } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectDashboardHome from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData, getApi, getKpi, getRevenueChartData, getProfitChart } from './actions';
import { Paper, Grid, Typography, Steper, RadarChart } from '../../components/LifetekUi';
import ColumnXYChart, { ProfitChart } from '../../components/Charts/ColumnXYChart';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import { mergeDataProject } from '../ProjectPage/actions';
import { mergeData as mergeDataTask } from '../TaskPage/actions';
import { mergeData as mergeDataRelate } from '../TaskRelatePage/actions';
import { mergeDataContract } from '../ContractPage/actions';
import lang from '../../assets/img/faces/lang.jpg';
import { removeWaterMark } from '../../helper';
import { clientId } from '../../variable';
import ColumnXChart from './EmployeeChart';
import CylinderChart from './CustomerChart';
import { formatNumber } from '../../utils/common';
/* eslint-disable react/prefer-stateless-function */
am4core.useTheme(Am4themesAnimated);

const ReportBox = props => (
  <Grid item md={3} style={{ background: props.color, borderRadius: '3px', padding: '25px 5px', position: 'relative' }}>
    <div style={{ padding: 5, zIndex: 999 }}>
      <Typography style={{ color: 'white' }} variant="h4">
        {props.number}
      </Typography>
      <Typography variant="body1">{props.text}</Typography>
    </div>
    <div
      className="hover-dashboard"
      style={{
        position: 'absolute',
        background: props.backColor,
        textAlign: 'center',
        padding: 'auto',
        display: 'block',
        textDecoration: 'none',
        width: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        cursor: 'pointer',
        zIndex: 555,
      }}
      onClick={props.openDetail}
    >
      Xem chi tiết
    </div>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.2,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 88,
        fontSize: '70px',
        padding: 5,
      }}
    >
      {props.icon}
    </div>
  </Grid>
);


export class DashboardHome extends React.Component {
  state = {
    tabTask: 0,
    tabs: 0,
    isExportRevenueChart: false,
  };

  componentDidMount() {
    this.props.getApi();
    // this.props.getKpi();
    // this.props.onGetRevenueChartData();
    // this.props.getProfitChart();
  }

  componentWillUnmount() {
    if (this.pieChart) {
      this.pieChart.dispose();
    }
    if (this.columnChart) {
      this.columnChart.dispose();
    }
  }

  openContract = () => {
    // this.props.history.push('./crm/Contract');
    this.props.history.push('/tower/contract')
    this.props.mergeDataContract({
      dashboard: 1,
      contractDashboard: this.props.dashboardHome.contracts,
    });
  };

  openProject = () => {
    this.props.history.push('/Task');
    this.props.mergeDataProject({
      filter: {
        isProject: true,
        taskStatus: 2,
      },
    });
    this.props.mergeDataTask({
      tab: 2,
    });
  };

  openCustomer = () => {
    // this.props.history.push('/crm/Customer');
    this.props.history.push('/tower/customer')
  };

  openBusiness = () => {
    this.props.history.push('/crm/BusinessOpportunities');
  };

  // mở cong viec
  openTask = () => {
    const { profile } = this.props.dashboardHome;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // open phu trach
  openInCharge = () => {
    const { profile } = this.props.dashboardHome;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        inCharge: profile ? profile._id : '5d7b1bed6369c11a047844e7',
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // Mở được xem
  openViewable = () => {
    const { profile } = this.props.dashboardHome;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        viewable: profile ? profile._id : '5d7b1bed6369c11a047844e7',
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // Mở đóng dung
  openStop = () => {
    const { profile } = this.props.dashboardHome;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        taskStatus: 4 || 5,
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // CHưa thực hiện
  openCancel = () => {
    const { profile } = this.props.dashboardHome;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        taskStatus: 1,
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // Mở đang thực hiện
  openDoing = () => {
    const { profile } = this.props.dashboardHome;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        taskStatus: 2,
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // Mở chậm tiến độ
  openProgress = () => {
    const { profile } = this.props.dashboardHome;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        taskStatus: { $not: { $eq: 3 } },
        endDate: { $lte: new Date().toISOString() },
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // mở cong viec hoan thanh
  openComplete = () => {
    const { profile } = this.props.dashboardHome;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        taskStatus: 3,
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // mo k thuc hien

  openNotDoing = () => {
    const { profile } = this.props.dashboardHome;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        taskStatus: 6,
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  componentDidUpdate() {
    removeWaterMark();
  }

  render() {
    const { tabTask, tabs } = this.state;
    const { dashboardHome, onGetRevenueChartData, getProfitChart } = this.props;
    const {
      contracts,
      projects,
      customers,
      businessOpportunities,
      tasks,
      inChargeSelect,
      viewableSelect,
      stopSelect,
      cancelSelect,
      doingSelect,
      progressSelect,
      completeSelect,
      profile,
      projectSkip,
      notDoingSelect,
      columnXYRevenueChart,
      profitChart,
      loadingRevenueChart,
      loadingProfitChart
    } = dashboardHome;

    return (
      <div>
        <Paper>
          <Grid spacing={16} style={{ justifyContent: 'space-between' }} container>
            <ReportBox
              icon={<CardTravel style={{ fontSize: 50 }} />}
              number={formatNumber(contracts) || 0}
              text="Tổng hợp đồng đang thực hiện"
              color="linear-gradient(to right, #03A9F4, #03a9f4ad)"
              backColor="rgb(0, 126, 255)"
              openDetail={this.openContract}
            />
            <ReportBox
              icon={<NextWeek style={{ fontSize: 50 }} />}
              number={formatNumber(projects) || 0}
              text="Tổng số dự án đang thực hiện"
              color="linear-gradient(to right, rgb(76, 175, 80), rgba(76, 175, 80, 0.68))"
              backColor="#237f1c"
              openDetail={this.openProject}
            />
            <ReportBox
              icon={<PermContactCalendar style={{ fontSize: 50 }} />}
              number={formatNumber(customers) || 0}
              text="Tổng khách hàng"
              color="linear-gradient(to right, #FFC107, rgba(255, 193, 7, 0.79))"
              backColor="#cd7e2c"
              openDetail={this.openCustomer}
            />
            {clientId === 'MIPEC' ? null :
              <ReportBox
                icon={<Receipt style={{ fontSize: 50 }} />}
                number={formatNumber(businessOpportunities) || 0}
                text="Tổng nhu cầu khách hàng"
                color="linear-gradient(to right, #FF5722, rgba(255, 87, 34, 0.79))"
                backColor="red"
                openDetail={this.openBusiness}
              />
            }

          </Grid>

          <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '30px 0px' }} container>
            <Grid item style={{ display: 'flex', flexDirection: 'column' }} md={7}>
              {clientId === 'MIPEC' ? null :
                <CustomChartWrapper height='650px' onRefresh={onGetRevenueChartData} isLoading={loadingRevenueChart} onExport={() => { this.setState({ isExportRevenueChart: true }) }} >
                  <ColumnXYChart style={{ height: '100%' }} data={columnXYRevenueChart} id="chart1" isExport={this.state.isExportRevenueChart} onExportSuccess={() => this.setState({ isExportRevenueChart: false })} />
                </CustomChartWrapper>
              }

              {/* <ColumnXYChart style={{ width: '100%', height: '650px' }} data={columnXYRevenueChart} id="chart1" /> */}

              {/* <div id="chartdiv" style={{ width: '100%', height: '550px' }} /> */}
              {clientId === 'MIPEC' ? null :
                <CustomChartWrapper height="650px" onRefresh={getProfitChart} isLoading={loadingProfitChart}>
                  <ProfitChart id="chartdiv" style={{ width: '100%', height: '90%' }} data={profitChart} />
                </CustomChartWrapper>
              }

            </Grid>

            <Grid item md={5}>
              {/* <Steper profile={profile} openComplete={this.openComplete} /> */}
            </Grid>
          </Grid>
          <Grid container style={{ display: 'flex', alignItems: 'stretch', paddingTop: '30px' }}>
            <Grid item md={3}>
              <Tabs value={this.state.tabTask} onChange={(e, value) => this.setState({ tabTask: value })}>
                <Tab value={0} label="Tình Trạng công việc" />
                {/* <Tab value={1} label="Dự án" /> */}
                {clientId === 'MIPEC' ? null : <Tab value={2} label="KPI" />}
              </Tabs>
              {tabTask === 0 ? (
                <React.Fragment>
                  <Typography style={{ fontWeight: 'bold', marginTop: 30 }}>TÌNH TRANG CÔNG VIỆC</Typography>
                  <Typography style={{ fontWeight: 'bold' }}>
                    Công việc:
                    <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openTask}>
                      {tasks || 0}
                    </b>
                  </Typography>
                  <Typography style={{ fontWeight: 'bold' }}>
                    Phụ trách:
                    <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openInCharge}>
                      {inChargeSelect || 0}
                    </b>
                  </Typography>
                  <Typography style={{ fontWeight: 'bold' }}>
                    Theo dõi:
                    <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openViewable}>
                      {viewableSelect || 0}
                    </b>
                  </Typography>
                  <Typography style={{ fontWeight: 'bold' }}>
                    Đóng dừng:
                    <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openStop}>
                      {stopSelect || 0}
                    </b>
                  </Typography>
                  <Typography style={{ fontWeight: 'bold' }}>
                    Chưa thực hiện:
                    <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openCancel}>
                      {cancelSelect || 0}
                    </b>
                  </Typography>
                  <Typography style={{ fontWeight: 'bold' }}>
                    Đang tiến hành:
                    <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openDoing}>
                      {doingSelect || 0}
                    </b>
                  </Typography>
                  <Typography style={{ fontWeight: 'bold' }}>
                    Chậm tiến độ:
                    <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openProgress}>
                      {progressSelect || 0}
                    </b>
                  </Typography>
                  <Typography style={{ fontWeight: 'bold' }}>
                    Đã hoàn thành:
                    <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openComplete}>
                      {completeSelect || 0}
                    </b>
                  </Typography>
                  <Typography style={{ fontWeight: 'bold' }}>
                    Không thực hiện:
                    <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openNotDoing}>
                      {notDoingSelect || 0}
                    </b>
                  </Typography>
                </React.Fragment>
              ) : null}

              {tabTask === 2 ? <RadarChart /> : null}
            </Grid>
            <Grid item md={9}>
              <Tabs value={tabs} onChange={(e, value) => this.setState({ tabs: value })}>
                {clientId === 'MIPEC' ? null : <Tab value={2} label="Doanh số" />}
                {clientId === 'MIPEC' ? null : <Tab value={1} label="Khách hàng" />}
                <Tab value={0} label="Dự án" />

              </Tabs>
              {tabs === 2 ? (
                <Grid container md={12}>
                  <ColumnXChart style={{ width: '100%', height: '50vh' }} data={this.props.dashboardHome.columnXChart} id="chart2" />
                </Grid>
              ) : null}
              {tabs === 1 ? (
                <Grid container md={12}>
                  <CylinderChart style={{ width: '100%', height: '50vh' }} data={this.props.dashboardHome.columnCylinder} id="chart3" />
                </Grid>
              ) : (
                ''
              )}
              {tabs === 0 ? (
                <React.Fragment>
                  <Typography style={{ fontWeight: 'bold', marginTop: 30 }}>TOP DỰ ÁN</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Tên dự án </TableCell>
                        <TableCell>Ngày bắt đầu</TableCell>
                        <TableCell>Ngày kết thúc</TableCell>
                        <TableCell>Người tham gia</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(projectSkip) && projectSkip.length > 0
                        ? projectSkip.map((item, index) => (
                          <TableRow>
                            <TableCell align="left">{index + 1}</TableCell>
                            <TableCell align="left">{item.name}</TableCell>
                            <TableCell align="left">{item.startDate}</TableCell>
                            <TableCell align="left">{item.endDate}</TableCell>
                            <TableCell align="left">
                              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 7 }}>
                                <Tooltip className="kanban-avatar" placement="top-start" title={item.join.name ? item.join[0].name : ''}>
                                  <Avatar src={item.join.avatar ? item.join[0].avatar : ''} />
                                </Tooltip>

                                <span style={{ fontWeight: 'bold', padding: 5 }}>
                                  {item.join.length > 1 ? `+${item.join.length - 1}` : item.join.length}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                        : null}
                    </TableBody>
                  </Table>
                </React.Fragment>
              ) : null}
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

// DashboardHome.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  dashboardHome: makeSelectDashboardHome(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getApi: () => dispatch(getApi()),
    getKpi: () => dispatch(getKpi()),
    onGetRevenueChartData: () => dispatch(getRevenueChartData()),
    mergeDataProject: data => dispatch(mergeDataProject(data)),
    mergeDataTask: data => dispatch(mergeDataTask(data)),
    mergeDataRelate: data => dispatch(mergeDataRelate(data)),
    mergeDataContract: data => dispatch(mergeDataContract(data)),
    getProfitChart: () => dispatch(getProfitChart())
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'dashboardHome', reducer });
const withSaga = injectSaga({ key: 'dashboardHome', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DashboardHome);

ReportBox.defaultProps = {
  color: 'linear-gradient(to right, #03A9F4, #03a9f4ad)',
  icon: 'CardTravel',
};
