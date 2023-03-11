/**
 *
 * EditstockGuaranteePage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Button, Grid, MenuItem, Paper, Step, StepLabel, Stepper, SwipeableDrawer, Tab, Tabs, Typography, withStyles } from '@material-ui/core';
import { DatePicker } from 'material-ui-pickers';
import { Breadcrumbs } from '@material-ui/lab';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectStockGuaranteePage from '../selectors';
import reducer from '../reducer';
import saga from '../saga';
import * as actions from '../actions';

import { Grid as GridLT } from 'components/LifetekUi';
import { API_STOCK } from 'config/urlConfig';
import { AsyncAutocomplete } from 'components/LifetekUi';

import { TextField } from 'components/LifetekUi';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import styles from '../styles';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import TaskInfoTab from './tabs/TaskInfoTab';
import HistoryTab from './tabs/HistoryTab';
import SwipeableViews from 'react-swipeable-views';
const listStatus = [
  {
    code: 0,
    name: 'Chưa bảo hành',
  },
  {
    code: 1,
    name: 'Đang bảo hành',
  },
  {
    code: 2,
    name: 'Hoàn thành',
  },
  {
    code: 3,
    name: 'Tạm đóng',
  },
];

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 2 * 3, overflow: 'hidden' }}>
      {children}
    </Typography>
  );
}
function EditStockMaintenancePage(props) {

  const { stockGuaranteePage, classes, match, onGetStockMaintenance, onCreateStockMaintenance, onUpdateStockMaintenance, history, onCleanup } = props;

  const { createSuccess, updateSuccess } = stockGuaranteePage;

  const [status, setStatus] = useState(0);

  const [tabIndex, setTabIndex] = useState(0);

  const [filter] = useState({ level: 0 });

  const [stockMaintenance, setStockMaintenance] = useState(null);

  const [taskList, setTaskList] = useState([]);

  const [serial, setSerial] = useState('');

  const [dateReceive, setDateReceive] = useState(null);

  const [note, setNote] = useState('');

  useEffect(() => {
    if (match.params && match.params.id !== 'add') {
      onGetStockMaintenance(match.params.id);
    }
    return () => {
      onCleanup();
    } 
  }, [])

  useEffect(() => {
    if (stockGuaranteePage.stockMaintenance) {
      const data = stockGuaranteePage.stockMaintenance;
      data.stock = data.stockId || '';
      data.contract = data.contractId || '';
      data.employee = data.employeeId || '';
      setStockMaintenance(stockGuaranteePage.stockMaintenance);
      //setTaskList(stockGuaranteePage.taskList);
    }
  }, [stockGuaranteePage.stockMaintenance])

  useEffect(() => {
    if (createSuccess === true) {
      handleGoback();
    }
  }, [createSuccess])

  useEffect(() => {
    if (updateSuccess === true) {
      handleGoback();
    }
  }, [updateSuccess])


  const handleChangeIndex = (value, index) => {
    setTabIndex(index);
  };

  const handleSubmit = () => {
    if(!stockMaintenance.stock) {
      return;
    }
    const data = {
      ...stockMaintenance,
      stockId: stockMaintenance.stock && stockMaintenance.stock._id,
      contractId: stockMaintenance.contract && stockMaintenance.contract._id,
      startDate: stockMaintenance.startDate,
      expectedCompleteDate: stockMaintenance.expectedCompleteDate,
      employeeId: stockMaintenance.employee && stockMaintenance.employee._id
      
    }
    if (match.params && match.params.id === 'add') {
      onCreateStockMaintenance(data);
    } else {
      onUpdateStockMaintenance(data);
    }
  }

  const handleGoback = () => {
    props.history.goBack();
  }

  return (
    <div>
      <Paper className={classes.breadcrumbs}>
        <Grid container spacing={24}>
          <Grid item xs={12} style={{ margin: 2 }}>
            <Breadcrumbs aria-label="Breadcrumb">
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                Dashboard
              </Link>
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/Guarantee">
                Bảo hành/Bảo trì
              </Link>
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/Stock">
                Sản phẩm
              </Link>
              <Typography color="textPrimary">{match.params.id !== 'add' ? 'Chi tiết' : 'Thêm mới'}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={24}>
        <Grid item xs={12} sm={12} md={12} lg={12}>


          <Paper>
            <GridLT container spacing={16}>
              <Grid md={12} item>
                <Tabs
                  value={tabIndex}
                  variant="scrollable"
                  scrollButtons="on"
                  onChange={handleChangeIndex}
                  classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                >
                  <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Thông tin chung" />
                  {match.params.id !== 'add' && <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Công việc" />}
                  <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Lịch sử" />
                </Tabs>
              </Grid>
              <Grid item xs>
                <SwipeableViews index={tabIndex}>
                  <TabContainer dir={1}>
                    <GeneralInfoTab onChange={setStockMaintenance} stockMaintenance={stockMaintenance || {}} />
                  </TabContainer>
                  {match.params.id !== 'add' && (
                    <TabContainer dir={2}>
                      <TaskInfoTab history={history} />
                    </TabContainer>
                  )}
                  <TabContainer dir={3}>
                    <HistoryTab />
                  </TabContainer>
                </SwipeableViews>
              </Grid>
            </GridLT>
          </Paper>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Button variant="contained" className={classes.button} color="primary" onClick={handleSubmit}>
                Lưu
              </Button>
              <Button variant="contained" className={classes.button} onClick={handleGoback}>
                Hủy
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {stockGuaranteePage.loading ? <LoadingIndicator /> : ''}
    </div>
  );
}

EditStockMaintenancePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  stockGuaranteePage: makeSelectStockGuaranteePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetStockMaintenance: (data) => dispatch(actions.getStockMaintenance(data)),
    onCreateStockMaintenance: (data) => dispatch(actions.createStockMaintenance(data)),
    onUpdateStockMaintenance: (data) => dispatch(actions.updateStockMaintenance(data)),
    onCleanup: (data) => dispatch(actions.cleanup()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'stockGuaranteePage', reducer });
const withSaga = injectSaga({ key: 'stockGuaranteePage', saga });

export default compose(
  withReducer,
  withSaga,
  withStyles(styles),
  withConnect,
)(EditStockMaintenancePage);