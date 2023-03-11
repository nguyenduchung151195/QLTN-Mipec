/**
 *
 * AddCashManager
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Buttons from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import ListPage from 'containers/ListPage';
import makeSelectAddCashManager from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Grid } from '../../components/LifetekUi';
import { mergeData } from './../CashManager/actions';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import './style.css';
import { API_REPORT_MONEY_MANAGEMENT } from '../../config/urlConfig';
import request from '../../utils/request';
import { serialize } from '../../utils/common';
import { makeSelectProfile } from '../Dashboard/selectors';

/* eslint-disable react/prefer-stateless-function */
export class AddCashManager extends React.Component {
  state = {
    queryFilter: {
      year: 2021,
      skip: 0,
      limit: 20,
      organizationUnitId: '',
    },
    data: [],
  };
  handleTab = tab => {
    console.log('goi chua', tab)
    this.props.mergeData({ tab });
  };
  customDataChart = () => {
    const { data = [] } = this.state;

    let result = [];
    if (data && Array.isArray(data)) {
      data.map(item => {
        let obj = {};
        obj['groupName'] = item.name;
        obj.total = item.total;
        result.push(obj);
      });
    }
    return result;
  };
  customField = () => {
    let viewConfig = [];
    viewConfig[0] = { name: 'groupName', title: 'Nội dung', checked: true, width: 120 };
    viewConfig[1] = { name: 'total', title: 'Tổng doanh thu', checked: true, width: 120 };
    return viewConfig;
  };
  handleSearch = obj => {
    const { tab } = this.props;
    let url;
    switch (Number(tab)) {
      case 0:
        url = API_REPORT_MONEY_MANAGEMENT;
        break;
      case 1:
        break;
    }

    request(`${url}?${serialize(obj)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      console.log(res);
      res && this.setState({ data: res.data });
    });
  };
  componentDidMount = () => {
    const { tab } = this.props;
    let url;
    switch (Number(tab)) {
      case 0:
        url = API_REPORT_MONEY_MANAGEMENT;
        break;
      case 1:
        break;
    }
    const obj = {
      year: 2021,
    };

    request(`${url}?${serialize(obj)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      console.log(res);
      res && this.setState({ data: res.data });
    });
  };

  handleClear = () => {
    const { tab } = this.props;
    //  ===== Report stock =====
    let url;
    switch (tab) {
      case 0:
        url = API_REPORT_MONEY_MANAGEMENT;
        break;
      case 1:
        break;
    }

    const obj = {
      year: moment().format('YYYY'),
    };
    request(`${url}?${serialize(obj)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      res && this.setState({ data: res.data });
    });
  };

  render() {
    const { tab, profile } = this.props;
    const { queryFilter, data } = this.state;

    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'}>
        {props.children}
      </Buttons>
    );
    return (
      <div>
        <Grid container>
          <Grid item sm={12}>
            <Bt tab={0} style={{ marginLeft: 30 }}>
              Tổng hợp tiền thu trong năm
            </Bt>
            <Bt tab={1}>Top khách hàng thu tiền nhiều nhất trong tháng</Bt>
          </Grid>
          {tab === 0 ? (
            <>
              <Grid item md={12}>
                <CustomChartWrapper
                  isReport={true}
                  id="statisticReport1"
                  onRefresh={this.handleClear}
                  profile={profile}
                  code="reportStatisticalReceipt"
                  onGetData={this.handleSearch}
                />
              </Grid>
              <Grid item md={12}>
                <ListPage
                  apiUrl={`${API_REPORT_MONEY_MANAGEMENT}?${serialize(queryFilter)}`}
                  columns={data && this.customField()}
                  customRows={this.customDataChart}
                  client
                  disableEdit
                  disableAdd
                  disableConfig
                  disableSearch
                  disableSelect
                />
              </Grid>
            </>
          ) : null}
          {tab === 1 ? (
            <>
              Chưa có báo cáo
            </>
          ):null}
        </Grid>
      </div>
    );
  }
}

AddCashManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addCashManager: makeSelectAddCashManager(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addCashManager', reducer });
const withSaga = injectSaga({ key: 'addCashManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddCashManager);
