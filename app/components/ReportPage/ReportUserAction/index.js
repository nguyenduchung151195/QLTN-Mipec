import React, { useCallback, useState } from 'react';
import { Paper, Grid, Button } from '@material-ui/core';
import ListPage from 'containers/ListPage';

import moment from 'moment';
import MomentUtils from '@date-io/moment';
import FilterReport from '../../FilterReport';
import { API_REPORT_ACTION_EMPLOYEE } from '../../../config/urlConfig';
import { serialize, exportTableToExcel, exportTableToExcelXSLX, tableToPDF } from '../../../helper';
import ExportTable from './ExportTable';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import DepartmentAndEmployee from '../../../components/Filter/DepartmentAndEmployee';
import { makeSelectProfile } from '../../../containers/Dashboard/selectors';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import CustomAppBar from 'components/CustomAppBar';

function ReportUserAction(props) {
  const { onClose } = props;
  const INITIAL_QUERY = {
    startDate: moment().format('YYYY/MM/DD'),
    endDate: moment().format('YYYY/MM/DD'),
    limit: 10,
    skip: 0,
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [filter, setFilter] = useState(INITIAL_QUERY);
  const [newFilter, setNewFilter] = useState({});
  const [count, setCount] = useState(0);
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');
  const [exportExcel, setExportExcel] = useState(false);
  const [type, setType] = useState('PDF');
  const getColumns = () => {
    const viewConfig = [];
    viewConfig[0] = { name: 'ip', title: 'IP', checked: true, width: 150 };
    viewConfig[1] = { name: 'name', title: 'Tên nhân viên', checked: true, width: 150 };
    viewConfig[2] = { name: 'username', title: 'Tên đăng nhập', checked: true, width: 150 };
    viewConfig[3] = { name: 'organizationUnitName', title: 'Phòng ban', checked: true, width: 150 };
    viewConfig[4] = { name: 'timeAction', title: 'Thời gian', checked: true, width: 150 };
    viewConfig[5] = { name: 'module', title: 'Chức năng', checked: true, width: 150 };
    viewConfig[6] = { name: 'action', title: 'Hành động', checked: true, width: 150 };
    return viewConfig;
  };
  const handleChangeDepartment = useCallback(
    res => {
      const value = res.department;
      const newFilter = { ...filter };
      if (value) {
        if (res.employee) {
          setFilter({ ...newFilter, organizationUnit: value, employeeId: res.employee._id });
        } else {
          delete newFilter.employeeId;
          setFilter({ ...newFilter, organizationUnit: value });
        }
      } else if (value === 0) {
        delete newFilter.organizationUnit;
        if (res.employee) {
          setFilter({ ...newFilter, employeeId: res.employee._id });
        } else {
          delete newFilter.employeeId;
          setFilter(newFilter);
        }
      }
    },
    [filter],
  );

  const getRows = ({ data = [], count, skip }) => {
    let result = [];
    setCount(count);
    if (Array.isArray(data) && data.length > 0) {
      data.map((item, index) => {
        if (item.items) {
          let { items = [], ...rest } = item;
          let obj = {
            ...rest,
            order: index + Number(skip) + 1,
          };
          result.push(obj);
          if (Array.isArray(items) && items.length > 0) {
            items.map(i => {
              let obj = {
                ...i,
                order: '',
                apartmentCode: '',
              };
              result.push(obj);
            });
          }
        } else {
          let obj = {
            ...item,
            order: index + Number(skip) + 1,
          };
          result.push(obj);
        }
      });
    }
    return result || [];
  };

  const handleLoadData = (page = 0, skip = 0, limit = 10) => {
    const newQuery = {
      ...filter,
      skip,
      limit,
    };
    setFilter(newQuery);
    setQueryFilter(newQuery);
  };
  const mapFunction = item => {
    return {
      ...item,
      name: item.employee && item.employee.name,
      organizationUnitName: item.organizationUnit && item.organizationUnit.name,
      timeAction: moment(item.timeAction).format('DD/MM/YYYY HH:mm:ss'),
    };
  };
  const handleChangeFilter = useCallback(
    (e, isStartDate) => {
      const name = isStartDate ? 'startDate' : 'endDate';
      console.log('name', name);
      const value = isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
      console.log('value', value);

      const newFilter = { ...filter, [name]: value };
      console.log('newFilter', newFilter);

      // TT
      if (!newFilter.startDate && newFilter.endDate) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('nhập thiếu: "Từ ngày"');
        setErrorTextEndDate('');
      } else if (newFilter.startDate && !newFilter.endDate) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('');
        setErrorTextEndDate('nhập thiếu: "Đến ngày"');
      } else if (
        newFilter.startDate &&
        newFilter.endDate &&
        new Date(newFilter.endDate) < new Date(newFilter.startDate)
      ) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('"Từ ngày" phải nhỏ hơn "Đến ngày"');
        setErrorTextEndDate('"Đến ngày" phải lớn hơn "Từ ngày"');
      } else {
        setErrorStartDateEndDate(false);
        setErrorTextStartDate('');
        setErrorTextEndDate('');
      }
      // setReload((newFilter.startDate && newFilter.endDate) || (!newFilter.startDate && !newFilter.endDate))
      setFilter(newFilter);
    },
    [filter],
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
          'excel-table-user-action',
          'reportUserAction',
          'Báo cáo lịch sử hành động người dùng',
        );
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel('excel-table-user-action', 'Báo cáo lịch sử hành động người dùng');
      }
    },
    [type],
  );
  const handleExportPDF = () => {
    setExportExcel(true);
    setType('PDF');
  };
  const heightScreen = window.innerHeight - 265
  return (
    <>
      <CustomAppBar title={'Báo cáo lịch sử hành động người dùng'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: ' 80px 20px 0 20px' }}>
        <Grid container spacing={16} direction="row" justify="flex-start" alignItems="center">
          <Grid item xs={2}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                inputVariant="outlined"
                format="DD/MM/YYYY"
                value={filter.startDate || null}
                variant="outlined"
                label="Từ ngày"
                margin="dense"
                required
                name="startDate"
                style={{ marginBottom: '8px' }}
                onChange={e => handleChangeFilter(e, true)}
              />
            </MuiPickersUtilsProvider>
            {/* <CustomInputBase label="Từ ngày" type="date" name="startDate" value={filter.startDate} onChange={handleChangeFilter} /> */}
            {errorStartDateEndDate ? (
              <p style={{ color: 'red', margin: '0px' }}>{errorTextStartDate}</p>
            ) : null}
          </Grid>
          <Grid item xs={2}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                inputVariant="outlined"
                format="DD/MM/YYYY"
                value={filter.endDate || null}
                variant="outlined"
                label="Đến ngày"
                margin="dense"
                required
                name="endDate"
                onChange={e => handleChangeFilter(e, false)}
                style={{ marginBottom: '8px' }}
              />
            </MuiPickersUtilsProvider>
            {/* <CustomInputBase label="Đến ngày" type="date" name="endDate" value={filter.endDate} onChange={handleChangeFilter} /> */}
            {errorStartDateEndDate ? (
              <p style={{ color: 'red', margin: '0px' }}>{errorTextEndDate}</p>
            ) : null}
          </Grid>
          <Grid item xs={4}>
            {/* {show && */}
            <DepartmentAndEmployee
              // department={filter.organizationUnit}
              disableEmployee
              onChangeShow={s => setShow(s)}
              onChange={handleChangeDepartment}
              moduleCode="Employee"
              profile={props.profile}
            />
            {/* } */}
          </Grid>
        </Grid>
              {console.log('filter',filter)}
        <ListPage
          apiUrl={`${API_REPORT_ACTION_EMPLOYEE}?${serialize(filter)}`}
          // apiUrl={API_ASSET_ALLOCATE_LOG}
          customColumns={getColumns}
          columns={getColumns()}
          customRows={getRows || []}
          height={heightScreen}
          perPage={filter.limit}
          mapFunction={mapFunction}
          isReport={true}
          onLoad={handleLoadData}
          count={count}
          isSpecialList={true}
          disableEdit
          disableAdd
          disableSearch
          disableConfig
          disableSelect
        />
        <ExportTable
          filter={filter}
          viewConfigs={getColumns()}
          getRows={getRows}
          url={API_REPORT_ACTION_EMPLOYEE}
          open={exportExcel}
          onClose={handleCloseExcel}
        />
        <Grid
          container
          row
          spacing={8}
          alignItems="center"
          justify="flex-end"
          style={{ marginTop: '20px', padding: '0 15px 30px 0' }}
        >
          <Grid container item style={{ width: '389px', padding: '0', gap: '0 30px' }}>
            <Grid item xs={6} spacing={4} style={{ flex: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                style={{ width: '100%' }}
                onClick={handleExportExcel}
              >
                XUẤT FILE EXCEL
              </Button>
            </Grid>
            <Grid item xs={6} spacing={4} style={{ flex: 1 }}>
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

      </Paper>
    </>
  );
}
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});
const withConnect = connect(mapStateToProps);
export default compose(
  injectIntl,
  withConnect,
)(ReportUserAction);
