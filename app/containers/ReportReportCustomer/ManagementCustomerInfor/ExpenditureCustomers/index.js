import { Button, Grid, Paper } from '@material-ui/core';
import React, { memo, useCallback, useEffect, useState } from 'react';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
import ListPage from '../../../../components/List/ReTable';
import { API_EXP_CUSTOMERS, API_CUSTOMERS } from '../../../../config/urlConfig';
import { AsyncAutocomplete } from '../../../../components/LifetekUi';
import moment from 'moment';
import ExportTable from './exportTable';
import { tableToExcel, exportTableToExcel } from '../../../../helper';
import CustomAppBar from 'components/CustomAppBar';

const FIX_COLUMNS = [
  { name: 'fee.customerId.code', title: 'Mã KH', checked: true, width: 150 },
  { name: 'fee.customerId.name', title: 'Tên KH', checked: true, width: 150 },
  { name: 'type', title: 'Loại', checked: true, width: 150 },
  { name: 'code', title: 'Mã Thu Chi', checked: true, width: 150 },
  { name: 'costType', title: 'Kiểu', checked: true, width: 150 },
  { name: 'payMethod', title: 'Phương thức thanh toán', checked: true, width: 150 },
  { name: 'amount', title: 'Tổng tiền', checked: true, width: 150 },
  { name: 'totalPaid', title: 'Đã thanh toán', checked: true, width: 150 },
  { name: 'totalAmount', title: 'Còn thiếu', checked: true, width: 150 },
];

function ExpenditureCustomers(props) {
  const { customerInfo, onClose } = props;
  const [filter, setFilter] = useState({});
  // const [openExcel, setOpenExcel] = useState(false);
  const [exportExcel, setExportExcel] = useState(false);
  const [filterForExcel, setFilterForExcel] = useState({
    limit: 10,
    skip: 0,
  });
  // const handleChangeFilter = useCallback((e) => {
  //   const { target: { value, name } } = e;
  //   setFilter({ ...filter, [name]: value })
  // }, [filter])

  // console.log(filter);

  // const handleChangeFilter = useCallback(
  //   value => {
  //     setFilter({ ...filter, customerId: value._id });
  //   },
  //   [filter],
  // );
  useEffect(
    () => {
      const customerId = customerInfo && customerInfo._id ? customerInfo._id : null;
      if (customerId) {
        setFilter({ ...filter, customerId: customerId });
      }
    },
    [customerInfo],
  );
  const customFunction = data => {
    return data.map(item => ({
      ...item,
      // amount: new Intl.NumberFormat('de-DE').format(item.amount),
      // total: new Intl.NumberFormat('de-DE').format(item.total),
      // totalAmount: new Intl.NumberFormat('de-DE').format(item.totalAmount),
      amount: (!isNaN(item.amount) && Number(item.amount).toLocaleString('es-AR', { maximumFractionDigits: 0 })) || 0,
      total: (!isNaN(item.total) && Number(item.total).toLocaleString('es-AR', { maximumFractionDigits: 0 })) || 0,
      totalAmount: (!isNaN(item.totalAmount) && Number(item.totalAmount).toLocaleString('es-AR', { maximumFractionDigits: 0 })) || 0,
      type: item.type === 0 ? 'Thu' : item.type === 1 ? 'Chi' : 'Khác',

      costType:
        item.costType === 0 ? 'Chi phí nội bộ' : item.costType === 1 ? 'Chi phí nhập hàng' : item.costType === 2 ? 'Chi phí bán hàng' : 'Khác',

      payMethod: item.payMethod == 0 ? 'Tiền mặt' : item.payMethod == 1 ? 'Chuyển khoản' : item.payMethod == 2 ? 'Thẻ quà tặng' : 'Khác',
    }));
  };

  const handleChangeFilter = useCallback(
    value => {
      const newFilter = { ...filter };
      if (value && value._id) {
        setFilter({ ...filter, customerId: value && value._id });
      } else {
        delete newFilter.customerId;
        setFilter({ ...newFilter });
      }
    },
    [filter.customerId],
  );
  const handleExportExcel = () => {
    setExportExcel(true);
  };
  const handleCloseExcel = () => {
    setExportExcel(false);
    exportTableToExcel('excel-table-revenue-expenditure', 'Báo cáo thu chi');
  };
  // const onExportExcel = () => setOpenExcel(true);
  // const handleCloseExcel = () => {
  //   setOpenExcel(false);
  //   tableToExcel('excel-table-bos', 'W3C Example Table');
  // };
  return (
    <React.Fragment>
      <CustomAppBar title={'Báo cáo thu chi'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: ' 80px 20px 0 20px' }}>
        {!customerInfo ? (
          <Grid container spacing={16} justify="flex-start">
            <Grid item xs={4}>
              <AsyncAutocomplete
                label="Khách hàng"
                url={API_CUSTOMERS}
                onChange={handleChangeFilter}
                optionLabel="name"
                optionValue="_id"
                value={filter.name}
              />
            </Grid>
          </Grid>
        ) : null}
        <ListPage
          apiUrl={API_EXP_CUSTOMERS}
          columns={FIX_COLUMNS}
          setFilterForExcel={setFilterForExcel}
          disableAdd
          disableEdit
          disableSelect
          filter={filter}
          customFunction={customFunction}
          rowsPerPageOptions={[10, 20, 50, 100]}
          disableSearch
        />
        <ExportTable filter={filterForExcel} url={API_EXP_CUSTOMERS} open={exportExcel} onClose={handleCloseExcel} />
        <Grid container row spacing={16} justify="flex-end" style={{ marginTop: '20px', paddingBottom: '10px' }}>
          <Grid item style={{ width: '388px', paddingRight: 0 }}>
            <Button variant="outlined" style={{ width: '100%' }} color="primary" onClick={() => handleExportExcel()}>
              XUẤT FILE EXCEL
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

export default memo(ExpenditureCustomers);
