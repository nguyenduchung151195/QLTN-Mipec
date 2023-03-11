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
import { API_REPORT_INVENTORY_STOCK } from '../../../config/urlConfig';
import { compose } from 'redux';
import moment from 'moment';
import FilterReport from '../../FilterReport';
import ListPage from 'containers/ListPage';
import { serialize, exportTableToExcel, tableToPDF } from '../../../helper';
import ExportTable from './ExportTable';
import CustomAppBar from 'components/CustomAppBar';
import styles from './styles';
import axios from 'axios';

const inventoryColumns = ['Tồn đầu kỳ', 'Tồn cuối kỳ', 'Tăng /giảm', 'Tỷ lệ'];
const importColumns = ['Tồn cuối kỳ', 'Nhập', 'Chuyển về'];
const exportColumns = ['Xuất', 'Trả', 'Chuyển đi'];

function ReportInventoryStock(props) {
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

  useEffect(
    () => {
      let query = serialize(queryFilter);
      axios
        .get(`${API_REPORT_INVENTORY_STOCK}?${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          console.log('1111', response);
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

  const handleCloseExcel = useCallback(
    () => {
      setExportExcel(false);
      if (type === 'PDF') {
        let pdf = tableToPDF(
          'excel-table-inventory-stock',
          'reportInventoryStock',
          'Báo cáo tổng hợp nhập, xuất, tồn',
        );
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel('excel-table-inventory-stock', 'Báo cáo tổng hợp nhập, xuất, tồn');
      }
    },
    [type],
  );
  const handleExportPDF = () => {
    setExportExcel(true);
    setType('PDF');
  };
  const handleChangeDate = (e, fieldName) => {
    let name = fieldName;
    let value = moment(e).format('YYYY/MM/DD');
    setQueryFilter({
      ...queryFilter,
      [name]: value,
    });
  };

  return (
    <>
      <CustomAppBar title={'Báo cáo tổng hợp nhập, xuất, tồn'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: '80px 20px 0 0px' }}>
        <Grid item xs={8}>
          <FilterReport
            queryFilter={queryFilter}
            isReport={true}
            onGetFilter={handleGetFilter}
            code="reportInventoryStock"
            disableCustomer={true}
            handleChangeDate={handleChangeDate}
            valueDate={queryFilter}
            label
          />
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
                  Tồn kho
                </TableCell>
                <TableCell className={classes.customTableCell} colSpan={3}>
                  Nhập
                </TableCell>
                <TableCell className={classes.customTableCell} colSpan={3}>
                  Chi tiết
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.customTableCell}>Tên nhóm sản phẩm</TableCell>
                {inventoryColumns.map(column => (
                  <TableCell className={classes.customTableCell}>{column}</TableCell>
                ))}
                {importColumns.map(column => (
                  <TableCell className={classes.customTableCell}>{column}</TableCell>
                ))}
                {exportColumns.map(column => (
                  <TableCell className={classes.customTableCell}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
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
                              <TableCell className={classes.customTableCell}>
                                {item.tags && item.tags.toString()}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {(item.amountLast + item.amountExport - item.amountImport) *
                                  item.price}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.amountLastPrice}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.amountLastPrice -
                                  (item.amountLast + item.amountExport - item.amountImport) *
                                  item.price}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {isNaN((item.amountLastPrice -
                                  (item.amountLast + item.amountExport - item.amountImport) *
                                  item.price) /
                                  ((item.amountLast + item.amountExport - item.amountImport) *
                                    item.price)) ? 0 : (item.amountLastPrice -
                                      (item.amountLast + item.amountExport - item.amountImport) *
                                      item.price) /
                                ((item.amountLast + item.amountExport - item.amountImport) *
                                  item.price)}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.amountLastPrice}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.importPrice}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.TakePrice}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.exportPrice}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.paidGoodsPrice}
                              </TableCell>
                              <TableCell className={classes.customTableCell}>
                                {item.TransferPrice}
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
          url={API_REPORT_INVENTORY_STOCK}
          open={exportExcel}
          onClose={handleCloseExcel}
        />
        <Grid
          container
          spacing={16}
          direction="row"
          justify="flex-start"
          alignItems="center"
          style={{ marginTop: '20px', padding: '0 15px 30px 0' }}
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
                <Button variant="outlined" style={{ width: '100%' }} color="primary" onClick={handleExportExcel}>
                  XUẤT FILE EXCEL
                </Button>
              </Grid>
              <Grid item spacing={4} style={{ flex: 1 }}>
                <Button variant="outlined" style={{ width: '100%' }} color="primary" onClick={handleExportPDF}>
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

export default compose(withStyles(styles))(ReportInventoryStock);
