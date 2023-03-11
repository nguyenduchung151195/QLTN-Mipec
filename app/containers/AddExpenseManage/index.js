/**
 *
 * AddExpenseManage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TableBody, TableCell, Table, TableRow, TableHead, MenuItem } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectAddExpenseManage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Grid, TextField, Paper } from '../../components/LifetekUi';
import { getReportExpense } from './actions';
import { mergeData } from '../ExpenseManager/actions';
import { MENU_REPORTS } from '../../contants';
import request from '../../utils/request';
import { serialize } from '../../helper';
import { API_REPORT_COST_MANAGEMENT, API_REPORT_RATIO_ITME } from '../../config/urlConfig';
import { makeSelectProfile } from '../Dashboard/selectors';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
am4core.useTheme(Am4themesAnimated);
function CircleChart(props) {
  const { id, data, isExport, titleTex, onExportSuccess } = props;
  const [chartExport, setChartExport] = useState(null);
  let circleChart;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart);
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';

      // Add data
      chart.data = data;

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'percent';
      pieSeries.dataFields.category = 'name';
      pieSeries.alignLabels = true;
      pieSeries.labels.template.propertyFields.disabled = 'disabled';
      pieSeries.ticks.template.propertyFields.disabled = 'disabled';

      pieSeries.ticks.template.locationX = 1;
      pieSeries.ticks.template.locationY = 0;

      pieSeries.labelsContainer.width = 100;

      chart.legend = new am4charts.Legend();

      chart.legend.paddingRight = 160;
      chart.legend.paddingBottom = 40;
      const marker = chart.legend.markers.template.children.getIndex(0);
      chart.legend.markers.template.width = 20;
      chart.legend.markers.template.height = 10;
      marker.cornerRadius(10, 10, 20, 20);
      setChartExport(chart);
      circleChart = chart;
    },
    [data],
  );
  useEffect(
    () => {
      if (chartExport && isExport === true) {
        chartExport.exporting.export('pdf');
        onExportSuccess();
      }
    },
    [isExport, chartExport, data],
  );

  useEffect(
    () => () => {
      if (circleChart) {
        circleChart.dispose();
      }
    },
    [data],
  );
  return <div {...props} id={id} />;
}
function ColumnChart(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex } = props;
  let ColumnChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 20;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'country';
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 8000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    function createSeries(field) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'country';
      series.dataFields.valueY = field;
      series.columns.template.tooltipText = '{valueY.value}';
      series.columns.template.tooltipY = 0;
      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    }
    createSeries('x1');
    createSeries('x2');
    createSeries('x3');
    createSeries('x4');

    ColumnChart = chart;
  }, []);
  useEffect(
    () => () => {
      if (ColumnChart) {
        ColumnChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}
function ColumnChart1(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex } = props;
  let ColumnChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 20;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'country';
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 6000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    function createSeries(field) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'country';
      series.dataFields.valueY = field;
      series.columns.template.tooltipText = '{valueY.value}';
      series.columns.template.tooltipY = 0;
      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    }
    createSeries('x1');
    createSeries('x2');
    createSeries('x3');

    ColumnChart = chart;
  }, []);
  useEffect(
    () => () => {
      if (ColumnChart) {
        ColumnChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}

/* eslint-disable react/prefer-stateless-function */
export class AddExpenseManage extends React.Component {
  state = {
    partColumn: [
      {
        country: 'Bộ phận kinh doanh 1',
        x2: 5672.4,
        x3: 6000,
      },
      {
        country: 'Bộ phận kinh doanh 2',

        x3: 1000,
      },
      {
        country: 'Bộ phận kinh doanh 3 ',
        x2: 3848.8,
        x3: 3500,
      },
      {
        country: 'Bộ phận kinh doanh 4',
        x2: 1398.8,
        x3: 2000,
      },
      {
        country: 'Bộ phận kinh doanh 5 ',
        x2: 208,
      },
      {
        country: 'Bộ phận kế toán',
        x2: 124.3,
      },
    ],
    partColumn1: [
      {
        country: 'Phụ cấp xăng xe',
        x2: 1739,
      },
      {
        country: 'Công tác phí',
        x2: 2252.9,
      },
      {
        country: 'CP khách hàng ',
        x2: 220,
      },
      {
        country: 'CP hỗ trợ vận chuyển',
        x2: 240.9,
      },
      {
        country: 'CP thanh toán đúng hạn',
        x2: 5397,
      },
      {
        country: 'CP khác',
        x2: 1456.7,
      },
    ],
    circleColumns1: [
      {
        country: 'Giá vốn bán hàng',
        litres: 718,
      },
      {
        country: 'Chi phí tài chính',
        litres: 0.3,
      },
      {
        country: 'Chi phí bán hàng',
        litres: 230.1,
      },
      {
        country: 'Chi phí quản lý doanh nghiệp',
        litres: 42.2,
      },
      {
        country: 'Chi phí khác',
        litres: 5,
      },
      {
        country: 'Chi phí thuế thu nhập doanh nghiệp',
        litres: 0.2,
      },
    ],
    queryFilter: {
      year: 2021,
      organizationUnitId: '',
    },
    data: [],
    zoom: false,
    isExport: false,
  };
  getUrlByValue = value => {
    let url = {
      0: API_REPORT_COST_MANAGEMENT,
      1: API_REPORT_RATIO_ITME,
    };
    return url[value];
  };

  getData = obj => {
    const { expense } = this.props;
    const url = this.getUrlByValue(expense);
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

  componentDidMount() {
    const { expense } = this.props;
    const foundMenu = MENU_REPORTS.MENU_EXPENSE_MANAGER.find(item => item.expense === expense);
    const { path } = foundMenu;
    this.props.getReportExpense(path);

    const obj = {
      year: 2021,
    };
    this.getData(obj);
  }

  componentWillReceiveProps(props) {
    if (this.props.expense !== props.expense) {
      const { expense } = props;
      const foundExpense = MENU_REPORTS.MENU_EXPENSE_MANAGER.find(item => item.expense === expense);
      const { path } = foundExpense;
      this.props.getReportExpense(path);
    }
  }

  mergeData = data => {
    this.props.mergeData(data);
  };

  handleExpense = e => {
    this.props.mergeData({ expense: e.target.value.expense });
  };

  getMenu = value => {
    if (!value && value !== 0) return null;
    return MENU_REPORTS.MENU_EXPENSE_MANAGER.find(item => item.expense === value);
  };

  onExportSuccess = () => {
    this.setState({ isExport: false });
  };

  handleClear = () => {
    const obj = {
      year: moment().format('YYYY'),
    };
    this.getData(obj);
  };
  handleSearch = obj => {
    this.getData(obj);
  };
  render() {
    const { addExpenseManage, expense, profile } = this.props;
    const { isExport, zoom, data, queryFilter } = this.state;
    const { costByDepartmentAndItem, costInMonthByDepartment, costInMonthByItem, totalAnnualBudget, proportionOfCosts } = addExpenseManage;
    return (
      <div>
        <Grid container>
          <Grid item md={12}>
            <TextField
              select
              label="Quản lý chi phí"
              style={{ width: '30%', marginLeft: 30 }}
              InputLabelProps={{ shrink: true }}
              value={this.getMenu(expense)}
              name="expense"
              variant="outlined"
              onChange={e => this.handleExpense(e)}
            >
              {MENU_REPORTS.MENU_EXPENSE_MANAGER.map(item => (
                <MenuItem value={item}>{item.text}</MenuItem>
              ))}
            </TextField>

            {expense === 0 ? (
              <div>
                <Grid style={{ width: '100%', height: '100vh', marginTop: 30 }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      code="reportCostRatio"
                      id="expenseChart1"
                      onExport={() => this.setState({ isExport: true })}
                    >
                      <CircleChart
                        style={{ width: '100%', maxHeight: '100vh', height: zoom ? '80vh' : '70vh' }}
                        data={data}
                        onExportSuccess={this.onExportSuccess}
                        isExport={isExport}
                        id="chart4"
                      />
                    </CustomChartWrapper>
                  </Grid>
                </Grid>
                <Paper>
                  {' '}
                  <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }} />
                </Paper>
              </div>
            ) : null}
            {expense === 1 ? (
              <div>
                <Grid style={{ width: '100%', height: '100vh', marginTop: 30 }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      code="reportCostRatio"
                      id="expenseChart2"
                      onExport={() => this.setState({ isExport: true })}
                    >
                      <CircleChart
                        style={{ width: '100%', maxHeight: '100vh', height: zoom ? '80vh' : '70vh' }}
                        data={data}
                        onExportSuccess={this.onExportSuccess}
                        isExport={isExport}
                        id="chart4"
                      />
                    </CustomChartWrapper>
                  </Grid>
                </Grid>
                <Paper>
                  {' '}
                  <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }} />
                </Paper>
              </div>
            ) : null}
          </Grid>
        </Grid>
      </div>
    );
  }
}

AddExpenseManage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addExpenseManage: makeSelectAddExpenseManage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getReportExpense: path => dispatch(getReportExpense(path)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addExpenseManage', reducer });
const withSaga = injectSaga({ key: 'addExpenseManage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddExpenseManage);
