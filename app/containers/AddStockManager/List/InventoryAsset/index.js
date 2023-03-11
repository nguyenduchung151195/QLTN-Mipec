import React, { memo, useState, useCallback } from 'react';
import { Button, Grid } from '@material-ui/core';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
// import ListPage from '../../../../components/List';
import ListPage from '../../../../components/List/ReTable';
import { API_REPORT_STOCK_EXPORT_BY_ASSET } from '../../../../config/urlConfig';
import moment from 'moment';
import CustomAppBar from 'components/CustomAppBar';
import { tableToPDF, exportTableToExcel } from '../../../../helper';
import { DatePicker } from 'material-ui-pickers';
import ExportTable from './ExportTable';

const FIX_COLUMNS = [
  { name: 'code', title: 'Mã tài sản', checked: true, width: 300 },
  { name: 'name', title: 'Tên tài sản', checked: true, width: 300 },
  // { name: 'sellingPoint', title: 'Địa chỉ', checked: true , width: 300},
  { name: 'firstInventory', title: 'Tồn đầu kỳ', checked: true, width: 300 },
  { name: 'lastInventory', title: 'Tồn cuối kỳ', checked: true, width: 300 },
  { name: 'import', title: 'Nhập trong kỳ', checked: true, width: 300 },
  { name: 'export', title: 'Xuất trong kỳ', checked: true, width: 300 },
];

const customColumns = FIX_COLUMNS.map(item => item.title);
const customRows = FIX_COLUMNS.map(item => item.name);

function InventoryAsset(props) {
  const { onClose } = props;
  const [type, setType] = useState('');
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
  const [filterExport, setFilterExport] = useState({});
  const [openExcel, setOpenExcel] = useState(false);

  const CODE = 'reportStockGeneralAsset';
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
  const handleChangeFilter = useCallback(
    e => {
      const {
        target: { value, name },
      } = e;
      setFilter({ ...filter, [name]: value });
    },
    [filter],
  );
  const [styleTextField, setStyleTextField] = useState({
    position: 'absolute',
    top: 85,
    left: 20,
    height: 19,
    width: 263,
  });
  const [acceptSearch, setAcceptSearch] = useState('code');
  const customFunction = data => {
    return data.map(item => ({
      ...item,
      code: item.code,
      name: item.name,
      firstInventory: item.firstInventory,
      lastInventory: item.lastInventory,
      import: item.inImport,
      export: item.inExport,
    }));
  };
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
      let pdf = tableToPDF('excel-table-asset', 'report', 'Báo cáo xuất nhập tồn kho theo tài sản');
      let win = window.open('', '', 'height=700,width=700');
      win.document.write(pdf);
      win.document.close(); // CLOSE THE CURRENT WINDOW.
      win.print();
    } else {
      exportTableToExcel('excel-table-asset', 'Báo cáo xuất nhập tồn kho theo tài sản');
    }
  };

  return (
    <div>
      <CustomAppBar
        title={'Báo cáo xuất nhập tồn kho theo tài sản'}
        onGoBack={onClose}
        disableAdd
      />
      <React.Fragment>
        <Grid container spacing={16} direction="row" justify="flex-start" style={{ marginTop: 70, paddingLeft: 16, marginBottom: 8 }}>
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
          <Grid item xs={2}>
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
          code="reportStockGeneralAsset"
          apiUrl={API_REPORT_STOCK_EXPORT_BY_ASSET}
          customFunction={customFunction}
          // columns={FIX_COLUMNS}
          setFilterExport={setFilterExport}
          filter={filter}
          columns={originColumns}
          disableAdd
          //disableSearch
          styleTextField={styleTextField}
          acceptSearch={acceptSearch}
          disableSelect
          disableViewConfig
          disableImport
          disableEdit
        />
        <ExportTable
          customColumns={customColumns}
          customRows={customRows}
          filter={filterExport}
          url={API_REPORT_STOCK_EXPORT_BY_ASSET}
          open={openExcel}
          onClose={handleCloseExcel}
        />
        <Grid container row spacing={16} justify="flex-end" style={{ marginTop: '20px' }}>
          <Grid container item style={{ width: '386px', padding: '0', gap: '0 30px' }}>
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
    </div>
  );
}

export default memo(InventoryAsset);
