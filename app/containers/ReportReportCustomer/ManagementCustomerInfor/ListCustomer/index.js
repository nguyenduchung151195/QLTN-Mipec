import { Button, Grid, Paper } from '@material-ui/core';
import { FilterBAndWRounded } from '@material-ui/icons';
import React, { memo, useCallback, useState } from 'react';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
import ListPage from '../../../../components/List/ReTable';
import { API_REPORT_LIST_CUSTOMER } from '../../../../config/urlConfig';
import moment from 'moment';
import ExportTable from './exportTable';
import { tableToExcel, exportTableToExcel } from '../../../../helper';
import FilterReport from '../../../../components/FilterReport';
import CustomAppBar from 'components/CustomAppBar';

const FIX_COLUMNS = [
  { name: 'code', title: 'Mã khách hàng', checked: true, width: 150 },
  { name: 'name', title: 'Tên khách hàng', checked: true, width: 150 },
  {
    name: 'contract.materialRequest.order.product.productId',
    title: 'Mã số thuế',
    checked: true,
    width: 150,
  },
  { name: 'email', title: 'Email', checked: true, width: 150 },
  { name: 'phoneNumber', title: 'Số điện thoại', checked: true, width: 150 },
  { name: 'size.size', title: 'Diện tích', checked: true, width: 150 },
  { name: 'size.code', title: 'Mã dịch vụ', checked: true, width: 150 },
  { name: 'size.name', title: 'Tên dịch vụ', checked: true, width: 150 },
  // { name: 'createdAt', title: 'Ngày bắt đầu', checked: true },
  { name: 'expirationDay', title: 'Ngày kết thúc', checked: true, width: 150 },
];

function ReportListCustomer(props) {
  const { onClose } = props;
  const INITIAL_QUERY = {
    filter: {
      // periodStr: {
      //   $gte: moment().format('YYYY-MM'),
      //   $lte: moment().format('YYYY-MM'),
      // },
      customerGroup: '',
      organizationUnitId: '',
    },
    startDate: '',
    endDate: '',
    skip: 0,
    limit: 10,
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [filterForExcel, setFilterForExcel] = useState({
    limit: 10,
    skip: 0,
  });
  // const [filter, setFilter] = useState({
  //   // group:'khch-hng-tttm',
  //   // building:'ta-nh-khu-b',
  //   sort: '-createdAt',
  //   size: '',
  //   contract: '',
  // })
  const [exportExcel, setExportExcel] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);

  // const handleChangeFilter = useCallback((e) => {
  //   const { target: { value, name } } = e;
  //   setFilter({ ...filter, [name]: value })
  // }, [filter])
  const handleGetFilter = useCallback(
    obj => {
      console.log('obj', obj);
      let newFilter = {
        filter: {
          // periodStr: {
          //   $gte: obj.periodStr ? moment(obj.periodStr.gte, 'YYYYMM').format('YYYY-MM') : null,
          //   $lte: obj.periodStr ? moment(obj.periodStr.lte, 'YYYYMM').format('YYYY-MM') : null,
          // },
        },
        startDate: obj.startDate
          ? moment(obj.startDate, 'YYYYMMDD').format('YYYY-MM-DD')
          : moment()
            .startOf('month')
            .format('YYYY-MM-DD'),
        endDate: obj.endDate
          ? moment(obj.endDate, 'YYYYMMDD').format('YYYY-MM-DD')
          : moment()
            .endOf('month')
            .format('YYYY-MM-DD'),
        // "detailInfo.typeCustomer.typeOfCustomer": obj.group && obj.group.value
      };
      if (obj.group) {
        newFilter.filter['detailInfo.typeCustomer.group'] = obj.group && obj.group.value;
      }
      if (obj.organizationUnitId) {
        newFilter.organizationUnitId = obj.organizationUnitId;
      }
      // if (obj.group !== '') {
      //   newFilter.filter.customerGroup = obj.group && obj.group.value;
      // }
      // if (obj.organizationUnitId !== '') {
      //   newFilter.filter.organizationUnitId = obj.organizationUnitId;
      // }
      console.log('newFilter', newFilter);
      setQueryFilter(newFilter);
    },
    [queryFilter.filter],
  );
  const customFunction = data => {
    return data.map(item => ({
      ...item,
      createdAt: moment(item.createdAt).format('DD/MM/YYYY'),
      expirationDay: item.expirationDay && moment(item.expirationDay).format('DD/MM/YYYY'),
    }));
  };
  const handleExportExcel = () => {
    setExportExcel(true);
  };

  const handleCloseExcel = () => {
    setExportExcel(false);
    exportTableToExcel('excel-table-list-customer', 'Danh sách khách hàng');
  };
  // const onExportExcel = () => setOpenExcel(true);
  // const handleCloseExcel = () => {
  //   setOpenExcel(false);
  //   tableToExcel('excel-table-bos', 'W3C Example Table');
  // }

  return (
    <React.Fragment>
      <CustomAppBar title={'Báo cáo danh sách khách hàng'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: ' 80px 20px 0 20px' }}>
        <Grid container spacing={16} justify="flex-end">
          {/* <Grid item xs={3}>
          <CustomInputBase select label="Tòa" onChange={handleChangeFilter} name="building" value={filter.building} />
        </Grid>
        <Grid item xs={3}>
          <CustomInputBase select label="Nhóm khách hàng" onChange={handleChangeFilter} name="groupCustomer" value={filter.groupCustomer} />
        </Grid> */}
          <FilterReport
            queryFilter={queryFilter}
            isReport={true}
            onGetFilter={handleGetFilter}
            code="reportCustomerFrequencySell"
            listCustomer={true}
          />
          {/* <Grid item xs={3}>
          <CustomInputBase label="Từ ngày" onChange={handleChangeFilter} name="startDate" value={filter.startDate} type="date" />
        </Grid>
        <Grid item xs={3}>
          <CustomInputBase label="Đến ngày" onChange={handleChangeFilter} name="endDate" value={filter.endDate} type="date" />
        </Grid> */}
        </Grid>
        <ListPage
          apiUrl={API_REPORT_LIST_CUSTOMER}
          columns={FIX_COLUMNS}
          setFilterForExcel={setFilterForExcel}
          disableAdd
          disableEdit
          disableSelect
          disableSearch
          filter={queryFilter}
          customFunction={customFunction}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
        <ExportTable
          filter={filterForExcel}
          url={API_REPORT_LIST_CUSTOMER}
          open={exportExcel}
          onClose={handleCloseExcel}
        />
        <Grid
          container
          row
          spacing={16}
          justify="flex-end"
          style={{ marginTop: '20px', padding: '10px 0 20px 0' }}
        >
          <Grid item style={{ width: '358px', padding: '0', marinBottom: '20px' }}>
            <Button
              variant="outlined"
              color="primary"
              style={{ width: '100%' }}
              onClick={() => handleExportExcel()}
            >
              XUẤT FILE EXCEL
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

export default memo(ReportListCustomer);
