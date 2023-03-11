import React, { memo, useState, useCallback } from 'react';
import { Button, Grid } from '@material-ui/core';
import ListPage from '../../../components/List/ReTable';
import { API_DISPATCH_GO } from '../../../config/urlConfig';
//import CustomInputBase from '../../../components/Input/CustomInputBase';
import moment from 'moment';
import ExportTable from './exportTable';
import { tableToPDF, exportTableToExcelXSLX } from '../../../helper';
import CustomAppBar from 'components/CustomAppBar';
import { DatePicker } from 'material-ui-pickers';
import FilterReport from '../../../components/FilterReport';
const FIX_COLUMNS = [
  { name: 'organizationUnit', title: 'Phòng ban gửi', checked: true, width: 200 },
  { name: 'typeDocument', title: 'Loại Công văn', checked: true, width: 300 },
  { name: 'count', title: 'Tổng số ', checked: true, width: 300 },
  // { name: 'receiverSign', title: 'Nơi nhận', checked: true, width: 300 },
];

function DispatchGo(props) {
  const { onClose } = props;
  const [type, setType] = useState('');
  // const [filter, setFilter] = useState({
  //   typeDispatch: 1,
  //   startDate: null,
  //   endDate: null
  // });
  const [openExcel, setOpenExcel] = useState(false);
  const INITIAL_QUERY = {
    typeDispatch: 1,
    startDate: null,
    endDate: null,
    limit: 10,
    skip: 0,
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [year] = useState([
    {
      value: '2018',
      label: '2018',
    },
    {
      value: '2019',
      label: '2019',
    },
    {
      value: '2020',
      label: '2020',
    },
    {
      value: '2021',
      label: '2021',
    },
  ]);

  // const handleChangeFilter = useCallback(
  //   e => {
  //     const name = e.target.name;
  //     const value = e.target.value;
  //     setFilter({ ...filter, [name]: value });
  //   },
  //   [filter],
  // );
  const handleGetFilter = useCallback(
    obj => {
      let newFilter = {
        filter: {
          periodStr: {
            $gte: obj.periodStr ? moment(obj.periodStr.gte, 'YYYYMM').format('YYYY-MM') : null,
            $lte: obj.periodStr ? moment(obj.periodStr.lte, 'YYYYMM').format('YYYY-MM') : null,
          },
        },
      };
      if (obj.group !== '') {
        delete newFilter.filter.customerGroup;
        newFilter.filter.customerGroup = obj.group && obj.group.value;
      }
      if (obj.organizationUnitId !== '') {
        delete newFilter.filter.organizationUnitId;
        newFilter.filter.organizationUnitId = obj.organizationUnitId;
      }
      // setQueryFilter(newFilter);
    },
    [queryFilter.filter],
  );
  const handleChangeDate = (e, fieldName) => {
    let name = fieldName;
    let value = moment(e).format('YYYY-MM-DD');
    setQueryFilter({
      ...queryFilter,
      [name]: value,
    });
  };
  const customFunction = data => {
    return data.map(item => ({
      ...item,
      organizationUnit: item && item.originItem && item.originItem.organizationUnit[0],
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
      let pdf = tableToPDF('excel-table-bos', 'reportDocumentaryGo', 'Báo cáo công văn đi');
      let win = window.open('', '', 'height=700,width=700');
      win.document.write(pdf);
      win.document.close(); // CLOSE THE CURRENT WINDOW.
      win.print();
    } else {
      exportTableToExcelXSLX('excel-table-bos', 'Báo cáo công văn đi');
    }
  };
  return (
    <React.Fragment>
      {/* <div style={{ width: props.miniActive ? window.innerWidth - 97 : window.innerWidth - 267 }}> */}
      <CustomAppBar title={'Báo cáo công văn đi'} onGoBack={onClose} disableAdd />
      <div>
        <FilterReport
          onGetFilter={handleGetFilter}
          valueDate={queryFilter}
          isReport={true}
          handleChangeDate={handleChangeDate}
          code="reportDiaryAsset"
          disableCustomer
        />
      </div>
      <Grid container spacing={16} direction="row" justify="flex-end" style={{ marginTop: 70 }}>
        {/* <CustomInputBase fullWidth select label="Chọn năm" name="year" value={filter.year} onChange={handleChangeFilter} variant="outlined">
            {year.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInputBase> */}
        {/* <DatePicker
            label="Chọn năm"
            format="YYYY"
            value={filter.year}
            name="year"
            onChange={date => {
              setFilter({ ...filter, year: moment(date).format('YYYY') });
            }}
            views={['year']}
            variant="outlined"
            margin="dense"
            fullWidth
          /> */}
      </Grid>
      <ListPage
        apiUrl={API_DISPATCH_GO}
        columns={FIX_COLUMNS}
        filter={queryFilter}
        customFunction={customFunction}
        disableSearch
      />
      <ExportTable
        filter={queryFilter}
        url={API_DISPATCH_GO}
        open={openExcel}
        onClose={handleCloseExcel}
      />
      <Grid
        container
        row
        spacing={4}
        alignItems="center"
        justify="flex-end"
        style={{ marginTop: '20px', padding: '10px 0 20px 0' }}
      >
        <Grid container item style={{ width: '357px', padding: '0', gap: '0 30px' }}>
          <Grid item spacing={4} style={{ flex: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              style={{ width: '100%' }}
              onClick={handleExportExcel}
            >
              XUẤT FILE EXCEL
            </Button>
          </Grid>
          <Grid item spacing={4} style={{ flex: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              style={{ width: '100%' }}
              onClick={handleExportPDF}
            >
              XUẤT FILE PDF
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {/* </div> */}
    </React.Fragment>
  );
}

export default memo(DispatchGo);
