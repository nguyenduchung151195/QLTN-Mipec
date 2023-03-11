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
import { API_REPORT_INVENTORY_ASSET } from '../../../config/urlConfig';
import { compose } from 'redux';
import moment from 'moment';
import FilterReport from '../../FilterReport';
import ListPage from 'containers/ListPage';
import { serialize, exportTableToExcel, tableToPDF } from '../../../helper';
import ExportTable from './ExportTable';
import CustomAppBar from 'components/CustomAppBar';
import styles from './styles';
import axios from 'axios';

const statusAsset = [
  'Tồn đầu kỳ',
  'Nhập trong kỳ',
  'Xuất trong kỳ',
  'Chuyển vào trong kỳ',
  'Chuyển đi`trong kỳ',
  'Tồn cuối kỳ',
];

function ReportInventoryAsset(props) {
  const { onClose, classes } = props;
  const INITIAL_QUERY = {
    startDate: moment().format('YYYY/MM/DD'),
    endDate: moment().format('YYYY/MM/DD'),
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [exportExcel, setExportExcel] = useState(false);
  const [data, setData] = useState();

  const [type, setType] = useState('PDF');
  const token = localStorage.getItem('token');

  const convertData = (obj = {}) => {
    try {
      if (Object.values(obj).length > 0) {
      }
      return valueArray;
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(
    () => {
      let query = serialize(queryFilter);
      axios
        .get(`${API_REPORT_INVENTORY_ASSET}?${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          let data = response.data.dataInventory;

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
      console.log('obj', obj);

      if (obj.organizationUnitId !== null) {
        setQueryFilter({ ...queryFilter, organizationUnitId: obj.organizationUnitId });
      } else {
        delete queryFilter.organizationUnitId;
        console.log('queryFilter', queryFilter);
        setQueryFilter({ ...queryFilter });
      }
    },
    [queryFilter],
  );
  const handleExportExcel = () => {
    setExportExcel(true);
    setType('EXCEL');
  };
  const handleChangeDate = (e, fieldName) => {
    let name = fieldName;
    let value = moment(e).format('YYYY/MM/DD');
    setQueryFilter({
      ...queryFilter,
      [name]: value,
    });
  };

  const handleCloseExcel = useCallback(
    () => {
      setExportExcel(false);
      if (type === 'PDF') {
        let pdf = tableToPDF(
          'excel-table-inventory-asset',
          'reportInventoryAsset',
          'Báo cáo tồn kho thiết bị',
        );
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel('excel-table-inventory-asset', 'Báo cáo tồn kho thiết bị');
      }
    },
    [type],
  );
  const handleExportPDF = () => {
    setExportExcel(true);
    setType('PDF');
  };
  const heightScreen = window.innerHeight - 240
  return (
    <>
      <CustomAppBar title={'Báo cáo tồn kho thiết bị'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: '80px 20px 0 0px' }}>
        <Grid item xs={8}>
          <FilterReport
            queryFilter={queryFilter}
            isReport={true}
            onGetFilter={handleGetFilter}
            code="reportInventoryAsset"
            disableCustomer={true}
            label
            valueDate={queryFilter}
            handleChangeDate={handleChangeDate}
          />
        </Grid>
        <Grid style={{ height: heightScreen, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.customTableCell} rowSpan={2} colSpan={2}>
                  Tên phòng ban
                </TableCell>
                <TableCell className={classes.customTableCell} rowSpan={2}>
                  Mã vật tư
                </TableCell>
                <TableCell className={classes.customTableCell} rowSpan={2}>
                  Tên vật tư
                </TableCell>
                <TableCell className={classes.customTableCell} rowSpan={2}>
                  Đơn vị
                </TableCell>
                <TableCell className={classes.customTableCell} rowSpan={2}>
                  Đơn giá
                </TableCell>
                {statusAsset.map(item => (
                  <TableCell className={classes.customTableCell} colSpan={2}>
                    {item}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {statusAsset.map(item => (
                  <>
                    <TableCell className={classes.customTableCell}>SL</TableCell>
                    <TableCell className={classes.customTableCell}>Thành tiền</TableCell>
                  </>
                ))}
              </TableRow>
            </TableHead>
            <TableBody >
              {Array.isArray(data) &&
                data.map((dt, i) => {
                  const { origin, dataStock } = dt;
                  const count = dataStock.length + 1;
                  return (
                    <>
                      {dataStock.length !== 0 && (
                        <TableCell className={classes.customTableCell} rowSpan={count} colSpan={2}>
                          {origin.name}
                        </TableCell>
                      )}

                      {dataStock.length !== 0 &&
                        dataStock.map((item, index) => (
                          <>
                            <TableRow>
                              <TableCell className={classes.customTableCell}>{item.code}</TableCell>
                              <TableCell className={classes.customTableCell}>{item.name}</TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.unit && item.unit.name}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.price || 0}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.amount + item.amountExport - item.amountImport}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.price
                                  ? (item.amount + item.amountExport - item.amountImport) *
                                  item.price
                                  : 0}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.amountImport}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.price ? item.amountImport * item.price : 0}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.amountExport}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.price ? item.amountExport * item.price : 0}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.amountTake}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.price ? item.amountTake * item.price : 0}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.amountTransfer}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.price ? item.amountTransfer * item.price : 0}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.amount}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.price ? item.amount * item.price : 0}
                              </TableCell>
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
          url={API_REPORT_INVENTORY_ASSET}
          open={exportExcel}
          onClose={handleCloseExcel}
          convertData={convertData}
        />
        <Grid
          container
          spacing={16}
          direction="row"
          justify="flex-start"
          alignItems="center"
          style={{ marginTop: '20px' }}
        >
          <Grid
            container
            row
            spacing={8}
            alignItems="center"
            justify="flex-end"
            style={{ marginBottom: '10px' }}
          >
            <Grid container item style={{ width: '375px', padding: '0', gap: '0 30px' }}>
              <Grid item spacing={4} style={{ flex: 1 }}>
                <Button variant="outlined" color="primary" style={{ width: '100%' }} onClick={handleExportExcel}>
                  XUẤT FILE EXCEL
                </Button>
              </Grid>
              <Grid item spacing={4} style={{ flex: 1 }}>
                <Button variant="outlined" color="primary" style={{ width: '100%' }} onClick={handleExportPDF}>
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

export default compose(withStyles(styles))(ReportInventoryAsset);
