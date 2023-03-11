import React, { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  Grid,
  Button,
  TableHead,
  TableBody,
  TableCell,
  Table,
  TableRow,
  Checkbox,
  TablePagination,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import DepartmentAndEmployee from '../../Filter/DepartmentAndEmployee';
import { API_REVENNUE_SUMMARY } from '../../../config/urlConfig';
import { compose } from 'redux';
import moment from 'moment';
import FilterReport from '../../FilterReport';
import ListPage from 'containers/ListPage';
import { serialize, exportTableToExcel, tableToPDF } from '../../../helper';
import ExportTable from './ExportTable';
import CustomAppBar from 'components/CustomAppBar';
import styles from './styles';
import axios from 'axios';
import { dataReady } from '@syncfusion/ej2-react-schedule';

const services = ['Nước', 'Điện', 'Xe', 'Dịch vụ', 'Mặt bằng', 'Bảo trì'];
const codeService = ['ZD', 'ZN', 'ZX', 'ZP', 'ZBT', '2003'];
const columns = ['Tên NH', 'Lũy kế', 'Tháng trước', 'Tháng này', 'Tăng trưởng'];
const typeMoneys = ['Cư dân', 'Hợp đồng', 'Tổng'];
const statusMoneys = ['Doanh số', 'Thanh toán	', 'Dư nợ', 'Tỷ lệ nợ (%)'];
function ReportRevenueSummary(props) {
  const { onClose, classes } = props;
  const INITIAL_QUERY = {
    period: moment().format('YYYY-MM'),
    prePeriod: moment()
      .subtract(1, 'months')
      .format('YYYY-MM'),
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [exportExcel, setExportExcel] = useState(false);
  const [data, setData] = useState();
  const [type, setType] = useState('PDF');
  const token = localStorage.getItem('token');

  const convertData = (obj = {}) => {
    try {
      if (Object.values(obj).length > 0) {
        const keyArray = Object.keys(obj);
        const valueArray = Object.values(obj);
        valueArray &&
          valueArray.map((value, index) => {
            switch (keyArray[index]) {
              case 'water':
                value.pre = value.preTotalWater;
                value.current = value.currentTotalWater;
                value.acrual = value.accrualWater;
                break;
              case 'electricity':
                value.pre = value.preTotalElectric;
                value.current = value.currentTotalElectric;
                value.acrual = value.accrualElectric;
                break;
              case 'car':
                value.pre = value.preTotalCar;
                value.current = value.currentTotalCar;
                value.acrual = value.accrualCar;
                break;
              case 'service':
                value.pre = value.preTotalService;
                value.current = value.currentTotalService;
                value.acrual = value.accrualService;

                break;
              case 'ground':
                value.pre = value.preTotalGround;
                value.current = value.currentTotalGround;
                value.acrual = value.accrualGround;
                break;
              case 'maintenance':
                value.pre = value.preTotalMaintenance;
                value.current = value.currentTotalMaintenance;
                value.acrual = value.accrualMaintenance;
                break;
              default:
                break;
            }
          });
        return valueArray;
      }
    } catch (error) {
      console.log('errorConvert', error);
    }
  };
  const sumSales = (data = {}) => {
    try {
      if (Object.values(data).length > 0) {
        let newData = convertData(data);
        let total = [];
        let newArray = newData.splice(1);
        const initialValue = 0;
        const sumPre = newArray.reduce((previousValue, currentValue) => previousValue + currentValue.pre, initialValue);
        const sumCur = newArray.reduce((previousValue, currentValue) => previousValue + currentValue.current, initialValue);
        const sumGrowth = newArray.reduce((previousValue, currentValue) => previousValue + currentValue.growth, initialValue);

        let sumPercenGrowth
        if(sumPre){
          sumPercenGrowth = sumGrowth/sumPre
        }else{
          sumPercenGrowth = 0
        }
        const sumAcrual = newArray.reduce((previousValue, currentValue) => previousValue + currentValue.acrual, initialValue);
        total.push(sumAcrual);
        total.push(sumPre);
        total.push(sumCur);
        total.push(sumGrowth);
        total.push(sumPercenGrowth.toFixed(2));
        return total;
      }
    } catch (error) {
      console.log('errorSumSales', error);
    }
  };
  const sumStatusMoneys = (data = {}, field) => {
    try {
      if (Object.values(data).length > 0) {
        let newData = convertData(data);
        let newArray = newData.splice(1);
        let sumArray = [];
        console.log('newArray', newArray);
        console.log('field', field);
        let sumTotal = 0;
        let sumDebt = 0;
        let sumPaid = 0;
        let sumPercent = 0;
        newArray &&
          newArray.map((item, i) => {
            let fieldA = item[field];
            console.log('fieldA', fieldA);
            let newField = Object.values(fieldA);
            console.log('newField', newField);

            sumTotal += newField[0];
            sumDebt += newField[1];
            sumPaid += newField[2];
            sumPercent = (sumDebt/sumTotal).toFixed(2);
          });
          if(sumTotal){
            sumPercent = (sumDebt/sumTotal);
          }else{
            sumPercent = 0
          } 
        sumArray.push(sumTotal);
        sumArray.push(sumPaid);
        sumArray.push(sumDebt);
        sumArray.push(sumPercent.toFixed(2));
        console.log('sumArray', sumArray);
        return sumArray;
      }
    } catch (error) {
      console.log('errorSumStatus', error);
    }
  };
  useEffect(
    () => {
      let query = serialize(queryFilter);
      axios
        .get(`${API_REVENNUE_SUMMARY}?${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          let data = response.data.data;
          console.log('data', data);
          setData(data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    [queryFilter],
  );
  const handleGetFilter = useCallback(
    obj => {
      let newFilter = {
        period: moment().format('YYYY-MM'),
        prePeriod: moment()
          .subtract(1, 'months')
          .format('YYYY-MM'),
      };
      if (obj.periodStr !== '') {
        delete newFilter.period;
        delete newFilter.prePeriod;
        let date1 = moment(obj.periodStr.gte).format('YYYY-MM');
        let date2 = moment(obj.periodStr.gte)
          .subtract(1, 'months')
          .format('YYYY-MM');
        newFilter.period = date1;
        newFilter.prePeriod = date2;
      }
      if (obj.organizationUnitId !== '') {
        delete newFilter.organizationUnitId;
        newFilter.organizationUnitId = obj.organizationUnitId;
      }
      setQueryFilter(newFilter);
    },
    [queryFilter.filter],
  );

  const handleExportExcel = () => {
    setExportExcel(true);
    setType('EXCEL');
  };

  const handleCloseExcel = useCallback(
    () => {
      setExportExcel(false);
      if (type === 'PDF') {
        let pdf = tableToPDF('excel-table-revenue-summary', 'reportRevenueSummary', 'Báo cáo tổng hợp doanh thu');
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel('excel-table-revenue-summary', 'Báo cáo tổng hợp doanh thu');
      }
    },
    [type],
  );
  const handleExportPDF = () => {
    setExportExcel(true);
    setType('PDF');
  };

  return (
    <>
      <CustomAppBar title={'Báo cáo tổng hợp doanh thu'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: '80px 20px 0 0px' }}>
        <Grid item xs={8}>
          <FilterReport queryFilter={queryFilter} isReport={true} onGetFilter={handleGetFilter} code="reportRevenueSummary" disableCustomer={true} />
        </Grid>
        <Grid style={{ height: 500, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.customTableCell} rowSpan={2} colSpan={2}>
                  Tên phòng ban
                </TableCell>
                <TableCell className={classes.customTableCell} />
                <TableCell className={classes.customTableCell} colSpan={4}>
                  Doanh số
                </TableCell>
                <TableCell className={classes.customTableCell} rowSpan={2}>
                  Tăng trưởng (%)
                </TableCell>
                {typeMoneys.map((typeMoney, index) => (
                  <TableCell className={classes.customTableCell} colSpan={4}>
                    {typeMoney}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {columns.map(column => (
                  <TableCell className={classes.customTableCell}>{column}</TableCell>
                ))}
                {typeMoneys.map((typeMoney, index) =>
                  statusMoneys.map(statusMoney => <TableCell className={classes.customTableCell}>{statusMoney}</TableCell>),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(data) &&
                data.map((dt, i) => {
                  let newData;
                  let total;
                  let totalContract;
                  let totalResident;
                  let totalSum = [];
                  if (Object.values(dt).length > 0) {
                    newData = convertData(dt);
                    total = sumSales(dt);
                    totalContract = sumStatusMoneys(dt, 'contract');
                    totalResident = sumStatusMoneys(dt, 'resident');
                    totalSum = [];
                    if (totalContract) {
                      totalContract.map((item, i) => {
                        totalSum[i] = totalContract[i] + totalResident[i];
                      });
                    }
                  }

                  return (
                    <>
                      <TableRow>
                        <TableCell className={classes.customTableCell} colSpan={2} />
                        <TableCell className={classes.customTableCell}>Doanh số các dịch vụ</TableCell>
                        {total && total.map((tt, index) => <TableCell className={classes.customTableCell}>{tt}</TableCell>)}

                        {totalResident && totalResident.map((tt, index) => <TableCell className={classes.customTableCell}>{tt}</TableCell>)}
                        {totalContract && totalContract.map((tt, index) => <TableCell className={classes.customTableCell}>{tt}</TableCell>)}
                        {totalSum && totalSum.map((tt, index) => <TableCell className={classes.customTableCell}>{tt}</TableCell>)}
                      </TableRow>
                      <TableCell className={classes.customTableCell} rowSpan={7} colSpan={2}>
                        {newData[0]}
                      </TableCell>
                      {newData &&
                        services.map((service, index) => (
                          <>
                            <TableRow key={index}>
                              <TableCell className={classes.customTableCell}>{service}</TableCell>
                              <TableCell className={classes.customTableCell}>{newData[index + 1].acrual}</TableCell>
                              <TableCell className={classes.customTableCell}>{newData[index + 1].pre}</TableCell>
                              <TableCell className={classes.customTableCell}>{newData[index + 1].current}</TableCell>
                              <TableCell className={classes.customTableCell}>{newData[index + 1].growth}</TableCell>
                              <TableCell className={classes.customTableCell}>{newData[index + 1].percentGrowth}</TableCell>
                              {statusMoneys.map((statusMoney, i) => (
                                <TableCell className={classes.customTableCell}>{Object.values(newData[index + 1].resident)[i]}</TableCell>
                              ))}
                              {statusMoneys.map((statusMoney, i) => (
                                <TableCell className={classes.customTableCell}>{Object.values(newData[index + 1].contract)[i]}</TableCell>
                              ))}
                              {statusMoneys.map((statusMoney, i) => (
                                <TableCell className={classes.customTableCell}>
                                  {Object.values(newData[index + 1].resident)[i] + Object.values(newData[index + 1].contract)[i]}
                                </TableCell>
                              ))}
                            </TableRow>
                          </>
                        ))}
                    </>
                  );
                })}
            </TableBody>
          </Table>
        </Grid>
        <ExportTable
          filter={queryFilter}
          url={API_REVENNUE_SUMMARY}
          open={exportExcel}
          onClose={handleCloseExcel}
          convertData={convertData}
          sumSales={sumSales}
          sumStatusMoneys={sumStatusMoneys}
        />
        <Grid container spacing={16} direction="row" justify="flex-start" alignItems="center" style={{ marginTop: '20px' }}>
          <Grid container row spacing={8} alignItems="center" justify="flex-end" style={{ marginBottom: '10px' }}>
            <Grid container item style={{ width: 350 }}>
              <Grid item xs={6} spacing={4}>
                <Button variant="outlined" color="primary" onClick={handleExportExcel}>
                  XUẤT FILE EXCEL
                </Button>
              </Grid>
              <Grid item xs={6} spacing={4}>
                <Button variant="outlined" color="primary" onClick={handleExportPDF}>
                  XUẤT FILE PDF
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default compose(withStyles(styles))(ReportRevenueSummary);
