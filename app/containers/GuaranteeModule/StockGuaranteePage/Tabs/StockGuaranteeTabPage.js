/**
 *
 * StockGuaranteeTabPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import makeSelectStockGuaranteePage from '../selectors';
import { Grid, Paper, withStyles } from '@material-ui/core';
import styles from '../styles';
import { CalendarContainer } from '../../../CalendarContainer';
import { API_STOCK_GUARANTEE, API_ORIGANIZATION, API_TASK_PROJECT, API_USERS } from '../../../../config/urlConfig';
import ListPage from '../../../../components/List';
import Automation from '../../../PluginAutomation/Loadable';
import Button from 'components/CustomButtons/Button';
import { DateTimePicker } from 'material-ui-pickers';
import { AsyncAutocomplete, Grid as GridLT, SwipeableDrawer } from '../../../../components/LifetekUi';
import Planner from '../../../../components/LifetekUi/Planner/TaskKanban';
import AddProjects from '../../../AddProjects';
import makeSelectDashboardPage from '../../../Dashboard/selectors';

const Bt = props => (
  <Button onClick={() => props.onChangeTab(props.tab)} {...props} color={props.tab == props.currentTab ? 'gradient' : 'simple'} round size="sm">
    {props.children}
  </Button>
);
function StockGuaranteeTabPage(props) {
  const { classes, history, createSuccess, onCreateStockGuaranteeTask } = props;

  const [currentTab, setTab] = useState(2);

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const [employee, setEmployee] = useState(null);

  const [org, setOrg] = useState(null);

  const [open, setOpen] = useState(false);

  const [data, setData] = useState({});

  const [reload, setReload] = useState(0);

  const [filter, setFilter] = useState({})

  useEffect(() => {
    if (reload > 0) {
      setReload(reload + 1);
    }
  }, [filter])

  const handleChangeEmployee = (employee) => {
    setEmployee(employee);
    if (employee) {
      setFilter({
        ...filter,
        employeeId: employee._id,
      });
    } else {
      delete filter.employeeId;
    }
  }

  const handleChangeStartDate = startDate => {
    setStartDate(startDate);
    if (startDate) {
      setFilter({
        ...filter,
        startDate: {
          ...filter.startDate,
          $gte: startDate.toISOString(),
        },
      });
    } else {
      delete filter.startDate.$gte;
    }
  };

  const handleChangeEndDate = endDate => {
    setEndDate(endDate);
    if (startDate) {
      setFilter({
        ...filter,
        startDate: {
          ...filter.startDate,
          $lte: endDate.toISOString(),
        },
      });
    } else {
      delete filter.startDate.$lte;
    }
  };

  // const handleChangeOrg = org => {
  //   setOrg(org);
  //   setFilter({
  //     ...filter,
  //     organizationUnit: organizationUnit ? organizationUnit._id : '',
  //   })
  // };
  const addNewStockGuarantee = () => {
    history.push('/Guarantee/Stock/add');
  };

  const handleCreateTask = (type, code) => {
    setOpen(true);
    setData({ kanbanStatus: type, taskStatus: code, isProject: false });
  }

  const handleClose = () => {
    setOpen(false);
  }

  const callbackTask = () => {
    setReload(reload + 1);
    setOpen(false);
  }

  return (
    <Paper style={{ marginTop: 20 }}>
      <Grid container justify="flex-end">
        <Grid item>
          <Bt tab={1} onChangeTab={setTab} currentTab={currentTab}>Lịch</Bt>
          <Bt tab={2} onChangeTab={setTab} currentTab={currentTab}>Danh sách</Bt>
          <Bt tab={3} onChangeTab={setTab} currentTab={currentTab}>Kế hoạch</Bt>
          <Bt tab={4} onChangeTab={setTab} currentTab={currentTab}>Automation</Bt>
        </Grid>
      </Grid>
      <Grid container>

        <Grid item sm={12}>
          {currentTab === 1 && (
            <CalendarContainer
              column={{
                Id: 'Id',
                Subject: 'Subject',
                Location: 'Location',
                StartTime: 'StartTime',
                EndTime: 'EndTime',
                CategoryColor: 'CategoryColor',
              }}
              url={API_TASK_PROJECT}
              // handleAdd={this.handleAddClick}
              // handleEdit={this.handleClickEdit}
              code="ST01"
            />
          )}
          {currentTab === 2 && (
            <div>
              <GridLT container spacing={16}>
                <Grid item xs={3}>
                  <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    value={startDate}
                    variant="outlined"
                    label="Ngày bắt đầu"
                    margin="dense"
                    fullWidth
                    clearable
                    onChange={date => handleChangeStartDate(date)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    value={endDate}
                    variant="outlined"
                    label="Ngày kết thúc"
                    fullWidth
                    clearable
                    margin="dense"
                    onChange={date => handleChangeEndDate(date)}
                  />
                </Grid>
                {/* <Grid item xs={3}>
                  <AsyncAutocomplete
                    name="Chọn phòng ban..."
                    label="Phòng/ban"
                    onChange={value => handleChangeOrg(value)}
                    url={API_ORIGANIZATION}
                    value={org}
                  />
                </Grid> */}
                <Grid item xs={3}>
                  <AsyncAutocomplete
                    name="Chọn nhân viên..."
                    label="nhân viên"
                    onChange={value => handleChangeEmployee(value)}
                    url={API_USERS}
                    value={employee}
                  />
                </Grid>
              </GridLT>
              <ListPage exportExcel code="GuaranteeStock" filter={filter} apiUrl={API_STOCK_GUARANTEE} addFunction={addNewStockGuarantee} reload={reload} />
            </div>
          )}
          {currentTab === 3 && (
            <Planner code="GUARANTEE" filterItem="planerStatus" apiUrl={API_TASK_PROJECT} category={6} addItem={handleCreateTask} reload={reload} />
          )}

          {currentTab === 4 && (
            <Automation
              code="ST01" // code của danh sách trạng thái kanban
              path="/crm/BusinessOpportunities" // path để lấy viewconfig (hiển thị danh sách các trường bắt trigger)
            />
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <SwipeableDrawer anchor="right" onClose={handleClose} open={open}>
          <AddProjects data={data} id='add' callback={callbackTask} />
        </SwipeableDrawer>
      </Grid>
    </Paper>
  );
}

const mapStateToProps = createStructuredSelector({
  stockGuaranteePage: makeSelectStockGuaranteePage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  memo,
  withConnect,
  withStyles(styles),
)(StockGuaranteeTabPage);
