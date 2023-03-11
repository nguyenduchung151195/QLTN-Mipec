import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import { API_REPORT_REVENUE_INVENTORY_BY_TIME, API_REPORT_DEPT_COST_PRICE } from '../../config/urlConfig';
import { createStructuredSelector } from 'reselect';
import { makeSelectProfile } from '../Dashboard/selectors';
import ReportBusinessOp from '../ReportReportCustomer/components/ReportBusinessOp/ReportBusinessOp';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import request from '../../utils/request';
import { serialize } from '../../helper';
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

function AddGeneralReport(props) {
  const INTIAL_QUERY = {
    year: 2021,
    organizationUnitId: '',
    employeeId: '',
    skip: 0,
    limit: 10,
  };
  const { tab, profile } = props;
  const [data, setData] = useState([]);
  const [zoom, setZoom] = useState(false);
  const [isExport, setIsExport] = useState(false);
  const [data1, setData1] = useState([]);
  const [queryFilter, setQueryFilter] = useState(INTIAL_QUERY);
  function getUrlByValue(tab) {
    let url = {
      1: 'something',
      2: API_REPORT_REVENUE_INVENTORY_BY_TIME,
    };
    return url[tab];
  }
  const getData = obj => {
    if (tab !== 2) {
      let url = getUrlByValue(tab);
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
          if (res) {
            setData(res.data);
          }
        }
      });
    } else {
      let url = API_REPORT_REVENUE_INVENTORY_BY_TIME;
      let url_cost = API_REPORT_DEPT_COST_PRICE;
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
          if (res) {
            setData(res.data);
          }
        }
      });
      request(`${url_cost}?${serialize(obj)}`, {
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
          if (res) {
            setData1(res.data);
          }
        }
      });
    }
  };

  const handleExportSuccess = () => {
    setIsExport(false);
  };

  const handleSearch = obj => {
    getData(obj);
    setQueryFilter(obj);
  };

  const handleLoadData = (page = 0, skip = 0, limit = 10) => {
    const { year, organizationUnitId, employeeId } = queryFilter || {};
    const obj = {
      year,
      organizationUnitId,
      employeeId,
      skip,
      limit,
    };
    getData(obj);
    setQueryFilter(obj);
  };
  const handleClear = () => {
    getData(INTIAL_QUERY);
  };
  useEffect(() => {
    getData(INTIAL_QUERY);
  }, []);
  return (
    <>
      {tab === 0 ? (
        <Paper>
          <ReportBusinessOp profile={profile} />
        </Paper>
      ) : null}
      {tab === 1 ? <Grid>Báo cáo 2</Grid> : null}
      {tab === 2 ? (
        <div>
          <Paper>
            <Typography style={{ marginTop: 10, fontSize: 25 }}>Tổng hợp doanh thu, tồn kho trong năm</Typography> <Grid item xs={12} />
            <Grid item xs={12}>
              <CustomChartWrapper
                onGetData={handleSearch}
                profile={profile}
                onZoom={z => setZoom(z)}
                onRefresh={handleClear}
                isReport={true}
                code="reportRevenueInventory"
                id="generalChart3"
                onExport={() => setIsExport(true)}
              >
                <ColumnChart1
                  style={{ width: '100%', maxHeight: '100vh', height: zoom ? '95vh' : '50vh' }}
                  data={data}
                  onExportSuccess={handleExportSuccess}
                  isExport={isExport}
                  id="chart5"
                />
              </CustomChartWrapper>
            </Grid>
            <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
              {/* <ListPage
                      apiUrl={`${API_REPORT_REVENUE_INVENTORY_BY_TIME}?${serialize(queryFilter)}`}
                      columns={inventoryReportByMonthColumns}
                      customRows={this.customData}
                      client
                      disableEdit
                      disableAdd
                      disableConfig
                      disableSearch
                      disableSelect
                    /> */}
            </Grid>
          </Paper>
        </div>
      ) : null}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(AddGeneralReport);
