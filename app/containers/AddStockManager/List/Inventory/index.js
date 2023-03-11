import React, { memo, useState, useCallback, useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
// import ListPage from '../../../../components/List';
import ListPage from '../../../../components/List/ReTable';
import { API_REPORT_STOCK_EXPORT_BY_PRODUCT } from '../../../../config/urlConfig';
import moment from 'moment';
import CustomAppBar from 'components/CustomAppBar';
import { tableToPDF, exportTableToExcel, serialize } from '../../../../helper';
import ExportTable from './ExportTable';
import { DatePicker } from 'material-ui-pickers';
import { TextField } from '@material-ui/core';
import { setState } from '../../../ListPage/actions';

const COLUMNS_BAND = [
  {
    title: 'Tồn đầu kỳ',
    children: [{ columnName: 'firstInventory' }, { columnName: 'firstInventoryPrice' }],
  },
  {
    title: 'Nhập trong kỳ',
    children: [{ columnName: 'inImport' }, { columnName: 'totalPriceImport' }],
  },
  {
    title: 'Xuất trong kỳ',
    children: [{ columnName: 'inExport' }, { columnName: 'totalPriceExport' }],
  },
  {
    title: 'Tồn cuối kỳ',
    children: [{ columnName: 'lastInventory' }, { columnName: 'lastInventoryPrice' }],
  },
];
const FIX_COLUMNS = [
  { name: 'code', title: 'Mã vật tư', checked: true, width: 300 },
  { name: 'name', title: 'Tên vật tư', checked: true, width: 300 },
  { name: 'firstInventory', title: 'Tồn đầu kỳ', checked: true, width: 300 },
  { name: 'lastInventory', title: 'Tồn cuối kỳ', checked: true, width: 300 },
  { name: 'inImport', title: 'Nhập cuối kỳ', checked: true, width: 300 },
  { name: 'inExport', title: 'Xuất cuối kỳ', checked: true, width: 300 },
];
// const customColumns = FIX_COLUMNS.map(item => item.title);
// const customRows = FIX_COLUMNS.map(item => item.name);

function Inventory(props) {
  const stringDefault = '';
  const { onClose } = props;
  const [type, setType] = useState('');
  const [openExcel, setOpenExcel] = useState(false);
  const [filter, setFilter] = useState({
    startDate: moment()
      .clone()
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: moment()
      .clone()
      .endOf('month')
      .format('YYYY-MM-DD'),
  });
  const [styleTextField, setStyleTextField] = useState({
    position: 'absolute',
    top: 85,
    left: 20,
    height: 19,
    width: 263,
  });
  const [acceptSearch, setAcceptSearch] = useState('code');

  const [filterExport, setFilterExport] = useState({});
  const CODE = 'reportStockGeneral';
  const view = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === CODE);
  let originColumns = [];
  if (view) {
    const columns = view.listDisplay.type.fields.type.columns;
    const others = view.listDisplay.type.fields.type.others;
    const newCls = [...columns, ...others];
    originColumns = newCls.sort(function (a, b) {
      return a.order - b.order;
    });
  }
  const customColumns = originColumns.map(item => item.title);
  const customRows = originColumns.map(item => item.name);

  const handleChangeFilter = useCallback(
    e => {
      const {
        target: { value, name },
      } = e;
      setFilter({ ...filter, [name]: value });
    },
    [filter],
  );

  const customChildRows = (row, rootRows) => {
    let childRows = [];

    if (!row) {
      let remainRow = [];
      rootRows.map(e => {
        if (!e.parent) childRows.push(e);
        else remainRow.push(e);
      });

      remainRow = remainRow.filter(e => !rootRows.find(remain => remain._id === e.parent));

      childRows = [...remainRow, ...childRows];
    } else childRows = rootRows.filter(r => r.parent === row._id);

    return childRows.length ? childRows : null;
  };

  // const customFunction = data => {
  //   return data.map(item => ({
  //     ...item,
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
      let pdf = tableToPDF(
        'excel-table-inventory',
        'report',
        'Báo cáo xuất nhập tồn kho theo sản phẩm',
        'report-stock',
      );
      let win = window.open('', '', 'height=700,width=700');
      win.document.write(pdf);
      win.document.close(); // CLOSE THE CURRENT WINDOW.
      win.print();
    } else {
      exportTableToExcel('excel-table-inventory', 'Báo cáo xuất nhập tồn kho theo sản phẩm');
    }
  };
  const mapFunction = item => {
    return {
      ...item,
      costPrice: Number(item.costPrice).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      importPrice: Number(item.importPrice).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
      firstInventoryPrice: Number(item.firstInventoryPrice).toLocaleString('es-AR', {
        maximumFractionDigits: 0,
      }),
      lastInventoryPrice: Number(item.lastInventoryPrice).toLocaleString('es-AR', {
        maximumFractionDigits: 0,
      }),
      totalPriceImport: Number(item.totalPriceImport).toLocaleString('es-AR', {
        maximumFractionDigits: 0,
      }),
      totalPriceExport: Number(item.totalPriceExport).toLocaleString('es-AR', {
        maximumFractionDigits: 0,
      }),
    };
  };
  return (
    <div>
      <CustomAppBar
        title={'Báo cáo xuất nhập tồn kho theo sản phẩm'}
        onGoBack={onClose}
        disableAdd
      />
      <React.Fragment>
        <Grid
          container
          spacing={16}
          direction="row"
          justify="flex-start"
          style={{ marginTop: 70, marginBottom: 10, paddingLeft: 16 }}
        >
          {/* <TextField
            id="outlined-basic"
            label="Tìm kiếm"
            variant="outlined"
            onChange={handleSearch}
            value={value}
            style={{
              marginTop: 70,
            }}
          /> */}
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
        <ListPage
          code="reportStockGeneral"
          apiUrl={API_REPORT_STOCK_EXPORT_BY_PRODUCT}
          // customFunction={customFunction}
          mapFunction={mapFunction}
          columns={originColumns}
          setFilterExport={setFilterExport}
          columnsBand={COLUMNS_BAND}
          filter={filter}
          // customChildRows={customChildRows}
          disableAdd
          styleTextField={styleTextField}
          acceptSearch={acceptSearch}
          resultData={true}
          // tree
          //disableSearch
          disableSelect
          disableViewConfig
          disableImport
          disableEdit
          style={{
            marginTop: 10,
          }}
        />
        <ExportTable
          customColumns={customColumns}
          customRows={customRows}
          filter={filterExport}
          url={API_REPORT_STOCK_EXPORT_BY_PRODUCT}
          open={openExcel}
          onClose={handleCloseExcel}
        />
        <Grid container row spacing={16} justify="flex-end" style={{ marginTop: '20px' }}>
          <Grid container item style={{ width: '358px', padding: '0', gap: '0 30px' }}>
            <Grid item spacing={4} style={{ flex: 1 }}>
              <Button
                variant="outlined"
                style={{ width: '100%' }}
                color="primary"
                onClick={handleExportExcel}
              >
                XUẤT FILE EXCEL
              </Button>
            </Grid>
            <Grid item spacing={4} style={{ flex: 1 }}>
              <Button
                variant="outlined"
                style={{ width: '100%' }}
                color="primary"
                onClick={handleExportPDF}
              >
                XUẤT FILE PDF
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    </div>
  );
}

export default memo(Inventory);
