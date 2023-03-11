import React, { memo, useState, useCallback, useEffect } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
import ListPage from '../../../../components/List/ReTable';
import { REPORT_STOCK_IMPORT } from '../../../../config/urlConfig';
import moment from 'moment';
import { tableToPDF, exportTableToExcel } from '../../../../helper';
import ExportTable from './exportTable';
import CustomAppBar from 'components/CustomAppBar';
import { DatePicker } from 'material-ui-pickers';

const FIX_COLUMNS = [
  { name: 'name', title: 'Số đơn hàng', checked: true, width: 150 },
  { name: 'createdDate', title: 'Ngày tháng', checked: true, width: 150 },
  { name: 'supplier.supplierId.code', title: 'Mã NCC', checked: true, width: 150 },
  { name: 'supplier.supplierId.name', title: 'Tên NCC', checked: true, width: 150 },
  { name: 'supplier.supplierId.adress', title: 'Địa chỉ', checked: true, width: 150 },
  // { name: '', title: 'Mã số thuế', checked: true },
  { name: 'code', title: 'Mã VT', checked: true, width: 150 },
  { name: 'products', title: 'Tên VT', checked: true, width: 150 },
  { name: 'unit', title: 'Đơn vị', checked: true, width: 150 },
  { name: 'amount', title: 'Số lượng', checked: true, width: 150 },
  // { name: '', title: 'Theo chứng từ', checked: true },
  { name: 'importPrice', title: 'Đơn giá nhập', checked: true, width: 150 },
  { name: 'totalPrice', title: 'Thành tiền', checked: true, width: 150 },
];
const customColumns = FIX_COLUMNS.map(item => item.title);

function ImportStatement(props) {
  const { onClose } = props;
  const CODE = 'reportStockImportByProduct';
  const view = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === CODE);
  let originColumns = [];
  if (view) {
    const columns = view.listDisplay.type.fields.type.columns;
    const others = view.listDisplay.type.fields.type.others;
    const newCls = [...columns, ...others];
    originColumns = newCls;
  }
  const customColumns = originColumns.map(item => item.title);
  const customRows = originColumns.map(item => item.name);
  const [filter, setFilter] = useState({
    startDate: moment()
      .clone()
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: moment()
      .clone()
      .endOf('month')
      .format('YYYY-MM-DD'),
    typeStock: 2,
  });
  const [type, setType] = useState('');
  const [openExcel, setOpenExcel] = useState(false);
  const [filterForExcel, setFilterForExcel] = useState({
    limit: 10,
    skip: 0,
    typeStock: 2,
  });
  const [styleTextField, setStyleTextField] = useState({
    position: 'absolute',
    top: 85,
    left: 20,
    height: 19,
    width: 263,
  });
  const [acceptSearch, setAcceptSearch] = useState('productCode');
  const handleChangeFilter = useCallback(
    e => {
      const {
        target: { value, name },
      } = e;
      setFilter({ ...filter, [name]: value });
    },
    [filter],
  );

  // const customFunction = data => {
  //   return data.map(item => ({
  //     ...item,
  //     // unit: item.originItem && item.originItem.products && item.originItem.products[0] && item.originItem.products[0].unit,
  //     // amount: item.originItem && item.originItem.products && item.originItem.products[0] && item.originItem.products[0].amount,
  //     // importPrice: item.originItem && item.originItem.products && item.originItem.products[0] && new Intl.NumberFormat('de-DE').format(item.originItem.products[0].importPrice),
  //     // totalPrice: item.originItem && item.originItem.products && item.originItem.products[0] && new Intl.NumberFormat('de-DE').format(item.originItem.products[0].totalPrice),
  //     // createdDate: moment(item.createdDate).format('DD/MM/YYYY'),
  //   }));
  // };

  const handleExportPDF = () => {
    setOpenExcel(true);
    setType('PDF');
  };
  const handleExportExcel = () => {
    setOpenExcel(true);
    setType('EXCEL');
  };
  const handleCloseExcel = () => {
    setOpenExcel(false);
    if (type === 'PDF') {
      let pdf = tableToPDF('excel-table-bos', 'report', 'Báo cáo xuất nhập tồn kho');
      let win = window.open('', '', 'height=700,width=700');
      win.document.write(pdf);
      win.document.close(); // CLOSE THE CURRENT WINDOW.
      win.print();
    } else {
      exportTableToExcel('excel-table-bos', 'Báo cáo xuất nhập tồn kho');
    }
  };
  const mapFunction = item => {
    console.log(item);
    return {
      ...item,
      importPrice: Number(item.importPrice).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      totalPrice: Number(item.totalPrice).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
    };
  };
  return (
    <React.Fragment>
      <CustomAppBar title={'Báo cáo nhập hàng theo sản phẩm'} onGoBack={onClose} disableAdd />
      <Grid
        container
        spacing={16}
        direction="row"
        justify="flex-start"
        style={{ marginTop: 70, marginBottom: 10, paddingLeft: 16 }}
      >
        <Grid item xs={2}>
          {/* <CustomInputBase label="Từ ngày" onChange={handleChangeFilter} name="startDate" value={filter.startDate} type="date" /> */}
          <DatePicker
            inputVariant="outlined"
            format="DD/MM/YYYY"
            fullWidth
            value={filter.startDate}
            variant="outlined"
            label="Từ ngày"
            margin="dense"
            maxDate={filter.endDate}
            // views={['day,month, year']}
            onChange={date =>
              setFilter({
                ...filter,
                startDate: moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
              })
            }
            required
            error={!filter.startDate}
          />
        </Grid>
        <Grid item xs={2} style={{ marginRight: 20 }}>
          {/* <CustomInputBase label="Đến ngày" onChange={handleChangeFilter} name="endDate" value={filter.endDate} type="date" /> */}
          <DatePicker
            inputVariant="outlined"
            format="DD/MM/YYYY"
            fullWidth
            value={filter.endDate}
            variant="outlined"
            label="Đến ngày"
            margin="dense"
            minDate={filter.startDate}
            // views={['day,month, year']}
            onChange={date =>
              setFilter({
                ...filter,
                endDate: moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
              })
            }
            required
            error={!filter.endDate}
          />
        </Grid>
      </Grid>
      {/* <ListPage
        apiUrl={REPORT_STOCK_IMPORT}
        columns={originColumns}
        customFunction={customFunction}
        setFilterForExcel={setFilterForExcel}
        filter={filter}
        disableSearch
      /> */}
      <ListPage
        apiUrl={REPORT_STOCK_IMPORT}
        columns={originColumns}
        // customFunction={customFunction}
        mapFunction={mapFunction}
        setFilterForExcel={setFilterForExcel}
        filter={filter}
        //disableSearch
        styleTextField={styleTextField}
        acceptSearch={acceptSearch}
      />

      <ExportTable
        customColumns={customColumns}
        customRows={customRows}
        filter={filterForExcel}
        url={REPORT_STOCK_IMPORT}
        open={openExcel}
        onClose={handleCloseExcel}
      />
      <Grid container row alignItems="center" justify="flex-end" style={{ marginTop: '20px' }}>
        <Grid container item style={{ width: '350px', padding: '0', gap: '0 30px' }}>
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
    </React.Fragment>
  );
}

export default memo(ImportStatement);
