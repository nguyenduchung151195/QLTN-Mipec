/**
 *
 * AddGeneralManager
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectAddGeneralManager from './selectors';
import reducer from './reducer';
import saga from './saga';
import ListPage from 'containers/ListPage';
import { Grid, TextField, Paper, Typography } from '../../components/LifetekUi';
import { getReportGeneral, mergeData } from './actions';
import { MENU_REPORTS } from '../../contants';
import { API_REPORT_COST_REVENUE, API_REPORT_DEPT_COST_PRICE, API_REPORT_REVENUE_INVENTORY_BY_TIME } from '../../config/urlConfig';
import request from '../../utils/request';
import { serialize } from '../../helper';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import { makeSelectProfile } from '../Dashboard/selectors';
import { inventoryReportByMonthColumns } from '../../variable';
import { changeSnackbar } from '../Dashboard/actions';
import './../AddSalesManager/style.css';
am4core.useTheme(Am4themesAnimated);
function ColumnChart(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex, isExport } = props;
  const [chartExport, setChartExport] = useState(null);
  let ColumnChart;

  const customDataChart = data => {
    let arrayMonth = [];
    let [item] = data || [];
    if (item) {
      arrayMonth = Object.keys(item).filter(f => f !== 'name' && f !== 'status' && f !== '_id');
    }
    let finalResult = [];
    if (arrayMonth.length !== 0) {
      arrayMonth.map((i, index) => {
        let item = {};
        data.map(j => {
          item.time = `Tháng ${index + 1}`;
          item[j.name] = j[i];
        });
        finalResult.push(item);
      });
    }
    return finalResult;
  };
  let finalResult = customDataChart(data);

  let series = [];
  if (data) {
    data.map(i => {
      series.push(i.name);
    });
  }

  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.XYChart);
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.data = finalResult;

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = 'time';
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.fontSize = 11;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.strictMinMax = true;
      valueAxis.renderer.minGridDistance = 30;

      if (series.length > 0) {
        series.map(i => {
          if (i !== 'Doanh thu' && i !== 'Chi phí nội bộ') {
            createSeries(i, i, true);
          } else {
            createSeries(i, i, false);
          }
        });
      }

      function createSeries(field, name, stacked) {
        console.log(name, stacked);
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = field;
        series.dataFields.categoryX = 'time';
        series.name = name;
        series.columns.template.tooltipText = '{name}: [bold]{valueY}[/]';
        series.stacked = stacked;
        series.columns.template.width = am4core.percent(50);
        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      }

      ColumnChart = chart;
      setChartExport(chart);
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
    [data, isExport, chartExport],
  );

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
function BarChart(props) {
  const { id, data } = props;
  let barChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    chart.data = data;
    const title = chart.titles.create();
    title.text = 'Tổng hợp doanh thu, tồn kho trong năm';
    title.fontSize = 25;
    title.marginBottom = 30;
    title.fontWeight = 'bold';
    // Create axes
    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'year';
    categoryAxis.numberFormatter.numberFormat = '#';
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 15000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    function createSeries(field, name) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = 'year';
      series.name = name;
      series.columns.template.tooltipText = '{name}: [bold]{valueX}[/]';
      series.columns.template.height = am4core.percent(130);
      series.sequencedInterpolation = true;

      const categoryLabel = series.bullets.push(new am4charts.LabelBullet());
      categoryLabel.label.text = '{name}';
      categoryLabel.label.horizontalCenter = 'right';
      categoryLabel.label.dx = -10;
      categoryLabel.label.fill = am4core.color('#fff');
      categoryLabel.label.hideOversized = false;
      categoryLabel.label.truncate = false;
    }
    createSeries('income');
    createSeries('expenses');
    createSeries('x1');
    barChart = chart;
  }, []);
  useEffect(
    () => () => {
      if (barChart) {
        barChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}
function customData(obj) {
  const { revenue = [], invetory = [] } = obj || {};

  let count = 0;
  let result = [];
  while (count < 12) {
    let object = {};
    object.month = count + 1;
    object.totalValue = invetory[count] && invetory[count].totalValue;
    object.totalRevenue = revenue[count] && revenue[count].totalRevenue;
    result.push(object);
    count += 1;
  }
  return result;
}
function ColumnChart1(props) {
  const { data = {}, titleTex, id, isExport } = props;
  const [chartExport, setChartExport] = useState();
  let result = customData(data);
  let ColumnChart;
  useEffect(
    () => {
      let chart = am4core.create(id, am4charts.XYChart);
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.data = result;
      var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'month';
      categoryAxis.numberFormatter.numberFormat = '#';
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 0.9;

      chart.legend = new am4charts.Legend();
      chart.legend.valign = 'bottom';

      var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.opposite = true;

      function createSeries(field, name) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.dataFields.categoryY = 'month';
        series.name = name;
        series.columns.template.tooltipText = '{name}: [bold]{valueX}[/]';
        series.columns.template.height = am4core.percent(100);
        series.sequencedInterpolation = true;

        var valueLabel = series.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = '{valueX}';
        valueLabel.label.horizontalCenter = 'left';
        valueLabel.label.dx = 10;
        valueLabel.label.hideOversized = false;
        valueLabel.label.truncate = false;

        var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
        categoryLabel.label.text = '{name}';
        categoryLabel.label.horizontalCenter = 'right';
        categoryLabel.label.dx = -10;
        categoryLabel.label.fill = am4core.color('#fff');
        categoryLabel.label.hideOversized = false;
        categoryLabel.label.truncate = false;
      }
      createSeries('totalRevenue', 'Doanh thu bán hàng');
      createSeries('totalValue', 'Giá trị tồn kho');
      setChartExport(chart);
      ColumnChart = chart;
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
    [data, isExport, chartExport],
  );
  useEffect(
    () => () => {
      if (ColumnChart) {
        ColumnChart.dispose();
      }
    },
    [data],
  );
  return <div {...props} id={id} />;
}

function ColumnChart2(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex, isExport } = props;
  const [chartExport, setChartExport] = useState();
  let ColumnChart;
  useEffect(
    () => {
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
      valueAxis.max = 150;
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
      createSeries('x5');

      ColumnChart = chart;
      setChartExport(chart);
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
    [data, isExport, chartExport],
  );

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
function ColumnChart3(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex, i } = props;
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
    categoryAxis.dataFields.category = 'year';
    categoryAxis.renderer.minGridDistance = 30;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 2500;

    function createSeries(field, name) {
      const columnSeries = chart.series.push(new am4charts.ColumnSeries());
      columnSeries.name = name;
      columnSeries.dataFields.valueY = field;
      columnSeries.dataFields.categoryX = 'year';
      columnSeries.columns.template.tooltipText =
        '[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]';
      columnSeries.columns.template.propertyFields.fillOpacity = 'fillOpacity';
      columnSeries.columns.template.propertyFields.stroke = 'stroke';
      columnSeries.columns.template.propertyFields.strokeWidth = 'strokeWidth';
      columnSeries.columns.template.propertyFields.strokeDasharray = 'columnDash';
      columnSeries.tooltip.label.textAlign = 'middle';
      const lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.name = 'Expenses';
      lineSeries.dataFields.valueY = 'expenses';
      lineSeries.dataFields.categoryX = 'year';

      lineSeries.stroke = am4core.color('#fdd400');
      lineSeries.strokeWidth = 3;
      lineSeries.propertyFields.strokeDasharray = 'lineDash';
      lineSeries.tooltip.label.textAlign = 'middle';

      const bullet = lineSeries.bullets.push(new am4charts.Bullet());
      bullet.fill = am4core.color('#fdd400'); // tooltips grab fill from parent by default
      bullet.tooltipText = '[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]';
      const circle = bullet.createChild(am4core.Circle);
      circle.radius = 4;
      circle.fill = am4core.color('#fff');
      circle.strokeWidth = 3;
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
/* eslint-disable react/prefer-stateless-function */
export class AddGeneralManager extends React.Component {
  state = {
    count: 0,
    data: [],
    isExport: false,
    zoom: false,
    queryFilter: {
      year: 2021,
      organizationUnitId: '',
      employeeId: '',
      skip: 0,
      limit: 10,
    },
  };
  getData = obj => {
    const { tab } = this.props;
    let url;
    switch (Number(tab)) {
      case 0:
        url = API_REPORT_COST_REVENUE;
        break;
      case 1:
        url = API_REPORT_DEPT_COST_PRICE;
        break;
      case 2:
        url = API_REPORT_REVENUE_INVENTORY_BY_TIME;
        break;
    }
    request(`${url}?${serialize(obj)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res.message) {
        this.props.onChangeSnackbar({
          content: res.message,
          variant: 'error',
        });
      } else {
        res && this.setState({ data: res.data, count: res.count ? res.count : 1 });
      }
    });
  };

  componentDidMount() {
    // const foundMenu = MENU_REPORTS.MENU_GENERAL_MANAGER.find(item => item.tab === tab);
    // const { path } = foundMenu;
    // this.props.getReportGeneral(path);
    let obj = {
      year: 2021,
      organizationUnitId: '',
      employeeId: '',
      skip: 0,
      limit: 10,
    };
    this.getData(obj);
  }

  componentWillReceiveProps(props) {
    if (this.props.tab !== props.tab) {
      const { tab } = props;
      // const foundGeneral = MENU_REPORTS.MENU_GENERAL_MANAGER.find(item => item.tab === tab);
      // const { path } = foundGeneral;
      // this.props.getReportGeneral(path);
    }
  }

  mergeData = data => {
    this.props.mergeData(data);
  };

  handleTab = e => {
    this.props.mergeData({ tab: e.target.value.tab });
  };

  customRowData = ({ data }) => {
    let result = [];
    if (data) {
      if (data) {
        data.map(i => {
          let { status, ...rest } = i || {};
          result.push(rest);
          return i;
        });
      }
    }
    return result;
  };
  customField = () => {
    const viewConfig = [];
    const { data } = this.state;
    viewConfig[0] = { name: 'name', title: 'Nội dung', checked: true, width: 200 };
    if (data) {
      let [item] = data || [];
      let arrayMonth = item && Object.keys(item).filter(f => f !== 'name' && f !== 'status' && f !== '_id');

      if (arrayMonth && arrayMonth.length > 0) {
        arrayMonth.map((i, index) => {
          let obj = {
            name: i,
            title: `Tháng ${index + 1}`,
            checked: true,
            width: 120,
          };
          viewConfig.push(obj);
        });
      }
    }

    return viewConfig;
  };
  customData = obj => {
    const { data = {} } = obj;
    const { revenue = [], invetory = [] } = data || {};

    let result = [];
    let objRenue = {};
    let objInventory = {};
    objRenue.groupName = 'Doanh thu bán hàng';
    if (revenue.length !== 0) {
      revenue &&
        revenue.map(i => {
          if (i) {
            objRenue[`month_${i.month}`] = i.totalRevenue;
          }
        });
      result.push(objRenue);
    }
    if (invetory.length !== 0) {
      objInventory.groupName = 'Giá trị tồn kho';
      invetory &&
        invetory.map((i, index) => {
          if (i) {
            objInventory[`month_${index + 1}`] = i.totalValue;
          }
        });
      result.push(objInventory);
    }
    return result;
  };
  customFieldChart2 = () => {};
  customDataChart2 = ({ data = [] }) => {
    console.log(data);
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

  handleSearch = obj => {
    const { queryFilter } = this.state;
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

  getMenu = value => {
    if (!value && value !== 0) return null;
    return MENU_REPORTS.MENU_GENERAL_MANAGER.find(item => item.tab === value);
  };

  render() {
    const { tab, profile } = this.props;
    const { data, isExport, zoom, queryFilter, count } = this.state;
    console.log(data);
    return (
      <div>
        <Grid container>
          <Grid item md={12}>
            {/* <TextField
              select
              label="Quản trị tổng hợp"
              style={{ width: '30%', marginLeft: 30 }}
              InputLabelProps={{ shrink: true }}
              value={this.getMenu(addGeneralManager.tab)}
              name="tab"
              variant="outlined"
              onChange={e => this.handleTab(e)}
            >
              {MENU_REPORTS.MENU_GENERAL_MANAGER.map(item => (
                <MenuItem value={item}>{item.text}</MenuItem>
              ))} 
            
            </TextField> */}
            {tab === 0 ? (
              <div>
                <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      code="reportCostRevenue"
                      id="generalChart1"
                      onExport={() => this.setState({ isExport: true })}
                    >
                      <ColumnChart style={{ width: '100%', height: zoom ? '70vh' : '50vh' }} data={data} isExport={isExport} id="chart1" />
                    </CustomChartWrapper>
                  </Grid>
                </Grid>
                <Paper>
                  {' '}
                  <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                    <ListPage
                      apiUrl={`${API_REPORT_COST_REVENUE}?${serialize(queryFilter)}`}
                      columns={data && this.customField()}
                      customRows={this.customRowData}
                      perPage={queryFilter.limit}
                      isReport={true}
                      count={(data && data.length) || count}
                      onLoad={this.handleLoadData}
                      client
                      disableEdit
                      disableAdd
                      disableConfig
                      disableSearch
                      disableSelect
                    />
                  </Grid>
                </Paper>
              </div>
            ) : null}
            {tab === 1 ? (
              <div>
                <Paper>
                  <Typography style={{ marginTop: 10, fontSize: 25 }}>Tổng hợp doanh thu, giá vốn trong năm</Typography> <Grid item xs={12} />
                  <Grid item xs={12}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      code="reportCostPrice"
                      id="generalChart2"
                      onExport={() => this.setState({ isExport: true })}
                    >
                      <ColumnChart2
                        style={{ width: '100%', maxHeight: '100vh', height: zoom ? '95vh' : '80vh' }}
                        data={data}
                        onExportSuccess={this.onExportSuccess}
                        isExport={isExport}
                        id="chart5"
                      />
                    </CustomChartWrapper>
                  </Grid>
                  {/* <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                    <ListPage
                      apiUrl={`${API_REPORT_DEPT_COST_PRICE}?${serialize(queryFilter)}`}
                      columns={data && this.customFieldChart2()}
                      customRows={this.customDataChart2}
                      client
                      disableEdit
                      disableAdd
                      disableConfig
                      disableSearch
                      disableSelect
                    />
                  </Grid> */}
                </Paper>
              </div>
            ) : null}
            {tab === 2 ? (
              <div>
                <Paper>
                  <Typography style={{ marginTop: 10, fontSize: 25 }}>Tổng hợp doanh thu, tồn kho trong năm</Typography> <Grid item xs={12} />
                  <Grid item xs={12}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      code="reportRevenueInventory"
                      id="generalChart3"
                      onExport={() => this.setState({ isExport: true })}
                    >
                      <ColumnChart1
                        style={{ width: '100%', maxHeight: '100vh', height: zoom ? '95vh' : '80vh' }}
                        data={data}
                        onExportSuccess={this.onExportSuccess}
                        isExport={isExport}
                        id="chart5"
                      />
                    </CustomChartWrapper>
                  </Grid>
                  <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                    <ListPage
                      apiUrl={`${API_REPORT_REVENUE_INVENTORY_BY_TIME}?${serialize(queryFilter)}`}
                      columns={inventoryReportByMonthColumns}
                      customRows={this.customData}
                      client
                      disableEdit
                      disableAdd
                      disableConfig
                      disableSearch
                      disableSelect
                    />
                  </Grid>
                </Paper>
              </div>
            ) : null}
          </Grid>
        </Grid>
      </div>
    );
  }
}

AddGeneralManager.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addGeneralManager: makeSelectAddGeneralManager(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    getReportGeneral: path => dispatch(getReportGeneral(path)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addGeneralManager', reducer });
const withSaga = injectSaga({ key: 'addGeneralManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddGeneralManager);
