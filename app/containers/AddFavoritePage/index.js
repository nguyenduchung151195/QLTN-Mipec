/**
 *
 * AddFavoritePage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TableBody, TableCell, Table, TableRow, TableHead, MenuItem, Divider, CircularProgress } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
// import Am4themesKelly from '@amcharts/amcharts4/themes/kelly';
import makeSelectAddFavoritePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Grid, TextField, Paper } from '../../components/LifetekUi';
import ListPage from 'containers/ListPage';
import { getDataChartInFavorite, changeMenuItemInFavorite } from './actions';
import { MENU_REPORTS } from '../../contants';

import CircleChart from '../../components/Charts/CircleChart';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';

import { API_REPORT_FAVORITE_BANK_BLANCE } from '../../config/urlConfig';
import request from '../../utils/request';
import { makeSelectProfile } from '../Dashboard/selectors';
import { serialize } from '../../helper';
import './../AddSalesManager/style.css';
am4core.useTheme(Am4themesAnimated);
/* eslint-disable react/prefer-stateless-function */
export class AddFavoritePage extends React.Component {
  state = {
    data: [],
    count: 1,
    queryFilter: {
      year: 2021,
      organizationUnitId: '',
      employeeId: '',
      skip: 0,
      limit: 10,
    },
    isExport: false,
    zoom: false,
  };

  // getUrlByMenu = menu => {
  //   let url = {
  //     0: API_REPORT_FAVORITE_BANK_BLANCE,
  //   };
  //   if (menu) {
  //     return url[menu];
  //   }
  // };

  getData = obj => {
    const { menu } = this.props;
    let url = API_REPORT_FAVORITE_BANK_BLANCE;
    try{

      request(`${url}?${serialize(obj)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }).then(res => {
        if (res && res.data) {
          this.setState({ data: res.data });
        }
      });
    }catch(error){
      console.log(error)
    }
  };

  componentDidMount() {
    let obj = {
      year: 2021,
      organizationUnitId: '',
      employeeId: '',
      skip: 0,
      limit: 10,
    };
    this.getData(obj);
  }

  // componentWillReceiveProps(props) {
  //   if (this.props.menu !== props.menu) {
  //     const { menu } = props;
  //     const foundMenu = MENU_REPORTS.MENU_FAVORITE.find(item => item.menu === menu);
  //     const { path, name } = foundMenu;
  //     this.props.onGetDataChartInFavorite(path, name); // CALL-API: LẤY "DỮ LIỆU BIỂU ĐỒ"
  //   }
  // }

  // componentDidUpdate() {}

  handleMenu = e => {
    const { value = {} } = e.target;
    this.props.onChangeMenuItemInFavorite({ menu: value.menu || '' });
  };

  getMenu = value => {
    if (!value && value !== 0) return null;
    return MENU_REPORTS.MENU_FAVORITE.find(item => item.menu === value);
  };

  handleClear = () => {
    const obj = {
      year: 2021,
      organizationUnitId: '',
      employeeId: '',
      skip: 0,
      limit: 10,
    };
    this.setState({
      queryFilter: obj,
    });
    this.getData(obj);
  };

  customField = () => {
    let viewConfig = [];
    let { data = [] } = this.state;
    viewConfig[0] = { name: 'name', title: 'Nội dung', checked: true, width: 200 };
    if (data && data.length > 0) {
      data.map(item => {
        if (item && item.bank) {
          const { bank = {} } = item;
          if(bank.value){
            let obj = {
              name: bank.value,
              title: `Ngân hàng ${bank.value}`,
              checked: true,
              width: 120,
            };
            viewConfig.push(obj);
          }
        }
      });
    }
    return viewConfig;
  };

  customDataRow = ({ data = [] }) => {
    let result = [];
    let obj = {};
    obj.name = 'Số dư';
    if (data.length !== 0) {
      data.map(i => {
        if (i && i.bank) {
          let { bank = {} } = i;
          if (bank.value && i.currentBalance) {
            obj[bank.value] = i.currentBalance;
          }
        }
        return i;
      });
    }
    result.push(obj);
    return result;
  };

  handleExportSuccess = () => {
    this.setState({ isExport: false });
  };

  handleSearch = obj => {
    const { queryFilter = {} } = this.state;
    const objFilter = {
      organizationUnitId: obj.organizationUnitId,
      employeeId: obj.employeeId,
      year: obj.year,
      limit: queryFilter.limit,
      skip: queryFilter.skip,
      // endDate: moment().format('DD/MM/YYYY'),
    };
    this.getData(objFilter);
  };

  handleLoadData = (page = 0, skip = 0, limit = 10) => {
    const { queryFilter } = this.state;
    let { year, organizationUnitId, employeeId } = queryFilter || {};
    let obj = {
      year,
      organizationUnitId,
      employeeId,
      skip,
      limit,
    };
    this.getData(obj);
    this.setState({ queryFilter: obj });
  };

  render() {
    // KHAI BÁO MÀU - "PHẦN BẢNG NHỎ TÓM TẮT": "TỔNG SỐ" CỦA BIỂU ĐỒ

    const { addFavoritePage, menu, profile, onChangeTab } = this.props;
    const { data = [], isExport, zoom, queryFilter, count = 1 } = this.state;
    // RENDER:
    return (
      <div style={{ padding: '10px 8px' }}>
        <Grid container spacing={16}>
          <Grid item md={12}>
            {/* PHẦN 1: SELECT BOX - MENU ITEM */}
            {/* <TextField
              select
              label="Favorite"
              style={{ width: '30%' }}
              // style={{ width: '30%', marginLeft: 30 }}
              InputLabelProps={{ shrink: true }}
              value={this.getMenu(addFavoritePage.menu)}
              name="menu"
              variant="outlined"
              onChange={e => this.handleMenu(e)}
            >
              {MENU_REPORTS.MENU_FAVORITE.map(item => (
                <MenuItem value={item}>{item.text}</MenuItem>
              ))}
            </TextField>
      */}
            {menu === 0 ? (
              <div>
                <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      code="reportbankBalance"
                      id="favoriteChart1"
                      onExport={() => this.setState({ isExport: true })}
                    >
                      {/* <CircleChart
                        style={{ width: '100%', height: isExport || zoom ? '80vh' : '50vh', marginTop: 30 }}
                        id="chart0"
                        titleChart="Số dư tại quỹ và các ngân hàng"
                        data={data ?data : []}
                        onExportSuccess={this.handleExportSuccess}
                        isExport={isExport}
                        dataFieldsValue="value"
                        dataFieldsCategory="title"
                      /> */}
                    </CustomChartWrapper>
                  </Grid>
                  <Grid md={12}>
                    <ListPage
                      apiUrl={`${API_REPORT_FAVORITE_BANK_BLANCE}?${serialize(queryFilter)}`}
                      columns={data && this.customField()}
                      customRows={this.customDataRow}
                      perPage={queryFilter ? queryFilter.limit : 10}
                      isReport={true}
                      count={count}
                      onLoad={this.handleLoadData}
                      client
                      disableEdit
                      disableAdd
                      disableConfig
                      disableSearch
                      disableSelect
                    />
                  </Grid>
                </Grid>
              </div>
            ) : null}
          </Grid>
        </Grid>
      </div>
    );
  }
}

AddFavoritePage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addFavoritePage: makeSelectAddFavoritePage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeMenuItemInFavorite: data => dispatch(changeMenuItemInFavorite(data)),
    // TT:"CALL API BACKEND" - LẤY DỮ LIỆU - "ĐỔ VÀO BIỂU ĐỒ"- THEO "PATH + NAME" CỦA MENU
    onGetDataChartInFavorite: (path, name) => dispatch(getDataChartInFavorite(path, name)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addFavoritePage', reducer });
const withSaga = injectSaga({ key: 'addFavoritePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddFavoritePage);
