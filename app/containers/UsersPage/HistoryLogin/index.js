import { Grid, MenuItem, TextField, Typography, Button, Paper } from '@material-ui/core';
import React, { memo, useState, useCallback } from 'react';
import { FormatListBulletedSharp } from '@material-ui/icons';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
// import CustomInputBase from '../../../../../../components/Input/CustomInputBase';
import { API_LOGOUT, API_REPORT_FEE_DEBT } from '../../../config/urlConfig';
import ListPage from '../../../components/List';
import DepartmentAndEmployee from '../../../components/Filter/DepartmentAndEmployee';
import { serialize, exportTableToExcel, exportTableToExcelXSLX, tableToPDF } from '../../../helper';
import ExportTable from './ExportTable';
import { makeSelectProfile } from '../../Dashboard/selectors';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import CustomAppBar from 'components/CustomAppBar';

function HistoryLoginUser(props) {
  const { onClose } = props;
  const INITIAL_QUERY = {
    filter: {
      periodStr: {
        $gte: moment().format('YYYY-MM'),
        $lte: moment().format('YYYY-MM'),
      },
      // organizationUnitId: '',
    },
    limit: 10,
    skip: 0,
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [exportExcel, setExportExcel] = useState(false);

  const [filter, setFilter] = useState({});
  const [newFilter, setNewFilter] = useState({});
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');
  const [show, setShow] = useState(true);
  const [type, setType] = useState('PDF');
  const [count, setCount] = useState();

  const handleLoadData = (page = 0, skip = 0, limit = 10) => {
    console.log('skip', skip);
    console.log('limit', limit);

    const newQuery = {
      ...filter,
      skip,
      limit,
    };
    console.log('newQuery', newQuery);
    setNewFilter(newQuery);
  };

  const handleExportExcel = () => {
    setExportExcel(true);
    setType('EXCEL');
  };

  const handleCloseExcel = useCallback(
    () => {
      setExportExcel(false);
      if (type === 'PDF') {
        let pdf = tableToPDF(
          'excel-table-history-login',
          'reportHistoryLogin',
          'Báo cáo lịch sử đăng nhập',
        );
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel('excel-table-history-login', 'Báo cáo lịch sử đăng nhập');
      }
    },
    [type],
  );
  const handleExportPDF = () => {
    setExportExcel(true);
    setType('PDF');
  };
  const mapFunction = item => {
    const keys = Object.keys(item).filter(f => f !== 'order' && f !== 'apartmentCode');
    let newItem = { ...item };
    keys.forEach((x, i) => {
      newItem[x] =
        (!isNaN(item[x]) &&
          Number(item[x]).toLocaleString('es-AR', { maximumFractionDigits: 0 })) ||
        0;
    });
    return {
      ...newItem,
    };
  };
  const getColumns = () => {
    const viewConfig = [];
    viewConfig[0] = { name: 'ip', title: 'IP', checked: true, width: 150 };
    viewConfig[1] = { name: 'loginTime', title: 'Thời gian đăng nhập', checked: true, width: 150 };
    viewConfig[2] = { name: 'logoutDate', title: 'Thời gian đăng xuất', checked: true, width: 150 };
    viewConfig[3] = { name: 'username', title: 'Tên đăng nhập', checked: true, width: 150 };
    viewConfig[4] = { name: 'organizationUnit', title: 'Phòng ban', checked: true, width: 150 };
    viewConfig[5] = { name: 'employeeId', title: 'Tên nhân viên', checked: true, width: 150 };
    // viewConfig[6] = { name: 'state', title: 'Trạng thái phê duyệt', checked: true, width: 150 };
    return viewConfig;
  };
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
  function customFunction(data) {
    const newData = data.map(it => ({
      ...it,
      // loginTime: it.loginTime && moment(it.loginTime).format('DD/MM/YYYY HH:mm:ss'),  // trong listPage đã xử lý dateType rồi
      // logoutDate: it.loginTime && moment(it.updatedAt).format('DD/MM/YYYY HH:mm:ss '),
      loginTime: it.originItem.loginTime,
      logoutDate: it.originItem.logoutDate || null,
      employeeId: it['employeeId.name'],
      username: it.username,
      organizationUnit: it['organizationUnitId.name'],
    }));
    return newData;
  }

  const handleChangeDepartment = useCallback(
    res => {
      const value = res.department;
      const newFilter = { ...filter };
      if (value) {
        if (res.employee) {
          setFilter({ ...newFilter, organizationUnitId: value, employeeId: res.employee._id });
        } else {
          delete newFilter.employeeId;
          setFilter({ ...newFilter, organizationUnitId: value });
        }
      } else if (value === 0) {
        delete newFilter.organizationUnitId;
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
  function handleOut() {
    const { history } = props;
    history.push('/setting/Employee');
  }
  // const heightScreen = screen.height - 298
  const heightScreen = window.innerHeight - 275
  return (
    <React.Fragment>
      <CustomAppBar title={'Báo cáo lịch sử đăng nhập'} onGoBack={onClose} disableAdd />
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
                onChange={e => handleChangeFilter(e, true)}
                style={{ marginBottom: '8px' }}
              />
            </MuiPickersUtilsProvider>
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

        <Grid item xs={12}>
          {/* {(filter.startDate && filter.endDate) || (!filter.startDate && !filter.endDate) ? ( */}
          <ListPage
            disableSearch
            apiUrl={API_LOGOUT}
            filter={filter}
            code="LoginLog"
            customFunction={customFunction}
            height={heightScreen}
            disableAdd
            disableEdit
            disableSelect
            // disableFormatDate
            disableImport
            // disableExport
            onLoad={handleLoadData}
            inSwipeable
            noFilterStatus
          />
          {/* ) : (
          <ListPage code="LoginLog" noFilterStatus disableSearch noData />
        )} */}

          {/* <ExportTable filter={filter} getRows={getRows} url={API_LOGOUT} open={exportExcel} onClose={handleCloseExcel}  /> */}
          <ExportTable
            filter={filter}
            viewConfigs={getColumns()}
            getRows={getRows}
            url={API_LOGOUT}
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
            <Grid
              container
              alignItems="center"
              justify="space-between"
              item
              style={{ width: '409px', padding: '0', gap: '0 30px' }}
            >
              <Grid item spacing={4} style={{ flex: 1 }}>
                <Button
                  style={{ width: '100%' }}
                  variant="outlined"
                  color="primary"
                  onClick={handleExportExcel}
                >
                  XUẤT FILE EXCEL
                </Button>
              </Grid>
              <Grid item spacing={4} style={{ flex: 1 }}>
                <Button
                  style={{ width: '100%' }}
                  variant="outlined"
                  color="primary"
                  onClick={handleExportPDF}
                >
                  XUẤT FILE PDF
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});
const withConnect = connect(mapStateToProps);

// export default memo(HistoryLoginUser);
export default compose(
  injectIntl,
  withConnect,
)(HistoryLoginUser);
