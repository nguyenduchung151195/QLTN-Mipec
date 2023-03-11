import React, { memo, useCallback, useState, useEffect } from 'react';
import { Button, Grid, MenuItem, TextField ,Paper} from '@material-ui/core';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
import ListPage from '../../../../components/List/ReTable';
import { API_LIST_NEW_CONTRACT } from '../../../../config/urlConfig';
import moment from 'moment';
import ExportTable from './exportTable';
import { tableToExcel, exportTableToExcel } from '../../../../helper';
import { DatePicker } from 'material-ui-pickers';
import CustomAppBar from 'components/CustomAppBar';

const FIX_COLUMNS = [
  { name: 'year', title: 'Năm', checked: true, width: 80 },
  { name: 'code', title: 'Mã HĐ', checked: true, width: 160 },
  { name: 'customerId.name', title: 'Đối tác', checked: true, width: 160 },
  { name: 'name', title: 'Tên HĐ', checked: true, width: 160 },
  { name: 'typeContract', title: 'Loại HĐ', checked: true, width: 160 },
  { name: 'contractSigningDate', title: 'Ngày kí', checked: true, width: 160 },
  // { name: 'startDay', title: 'Ngày bắt đầu', checked: true },
  { name: 'expirationDay', title: 'Ngày kết thúc', checked: true, width: 160 },
];

function NewContractReport(props) {
  const { customerInfo,onClose } = props;
  const [filter, setFilter] = useState({
    typeStartus: 1,
    typeContract: 1,
  });
  const [openExcel, setOpenExcel] = useState(false);

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

  const [exportExcel, setExportExcel] = useState(false);
  const [filterForExcel, setFilterForExcel] = useState({
    limit: 10,
    skip: 0,
  });

  const viewConfig = JSON.parse(localStorage.getItem('crmSource'));
  const viewConfigCode = viewConfig.find(item => item.code === 'S15');
  const listCatalogContract = viewConfigCode ? viewConfigCode.data : [];
  useEffect(
    () => {
      const customerId = customerInfo && customerInfo._id ? customerInfo._id : null;
      if (customerId) {
        setFilter({ ...filter, customerId: customerId, typeContract: 1 });
      }
    },
    [customerInfo],
  );

  const handleChangeFilter = useCallback(
    e => {
      const name = e.target.name;
      const value = e.target.value;
      setFilter({ ...filter, [name]: value });
    },
    [filter],
  );

  const customFunction = data => {
    const newData = Array.isArray(data)
      ? data.map(item => {
          const newCatalogContract = Array.isArray(listCatalogContract) && listCatalogContract.find(f => f.value === item.typeContract);
          return {
            ...item,
            customerId: item.customerId && item.customerId.name,
            startDay: moment(item.startDay).format('DD/MM/YYYY'),
            expirationDay: moment(item.expirationDay).format('DD/MM/YYYY'),
            contractSigningDate: moment(item.contractSigningDate).format('DD/MM/YYYY'),
            year: moment(item.contractSigningDate).format('YYYY'),
            typeContract: newCatalogContract ? newCatalogContract.title : null,
          };
        })
      : [];
    return newData;
  };

  const handleExportExcel = () => {
    setExportExcel(true);
  };

  const handleCloseExcel = () => {
    setExportExcel(false);
    exportTableToExcel('excel-table-list-new-contract', 'Báo cáo hợp đồng mới ký');
  };
  // const onExportExcel = () => setOpenExcel(true);
  // const handleCloseExcel = () => {
  //   setOpenExcel(false);
  //   tableToExcel('excel-table-bos', 'W3C Example Table');
  // }

  return (
    <React.Fragment>
      <CustomAppBar title={'Báo cáo hợp đồng mới ký'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: ' 80px 20px 0 20px' }}>
        <Grid container spacing={16} direction="row" justify="flex-start">
          <Grid item xs={4}>
            {/* <CustomInputBase type="number" name="year" /> */}
            {/* <CustomInputBase fullWidth select label="Chọn năm" name="year" value={filter.year} onChange={handleChangeFilter} variant="outlined">
            {year.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomInputBase> */}
            <DatePicker
              inputVariant="outlined"
              format="YYYY"
              // fullWidth
              value={filter ? filter.year : null}
              views={['year']}
              variant="outlined"
              label="Chọn năm"
              margin="dense"
              maxDate={filter && filter.endDate}
              onChange={date =>
                setFilter({
                  ...filter,
                  year: moment(date, 'DD/MM/YYYY').format('YYYY'),
                })
              }
            />
          </Grid>
        </Grid>
        <ListPage
          apiUrl={API_LIST_NEW_CONTRACT}
          columns={FIX_COLUMNS}
          customFunction={customFunction}
          setFilterForExcel={setFilterForExcel}
          filter={filter}
          disableSearch
        />
        <ExportTable filter={filterForExcel} url={API_LIST_NEW_CONTRACT} open={exportExcel} onClose={handleCloseExcel} />
        <Grid container row spacing={16} justify="flex-end" style={{ marginTop: '20px', paddingBottom:'10px' }}>
          <Grid item style={{width:'385px',paddingRight:'0'}}>
            <Button variant="outlined" color="primary"  style={{ width: '100%' }} onClick={() => handleExportExcel()}>
              XUẤT FILE EXCEL
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

export default memo(NewContractReport);
