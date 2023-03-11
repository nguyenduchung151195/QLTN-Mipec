import { Grid, MenuItem, TextField, Typography, Button, Paper } from '@material-ui/core';
import React, { memo, useState, useCallback } from 'react';
import { FormatListBulletedSharp } from '@material-ui/icons';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
// import CustomInputBase from '../../../../../../components/Input/CustomInputBase';
import { API_DIARY_ACTION, API_REPORT_FEE_DEBT } from '../../../config/urlConfig';
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

function HistorySystem(props) {
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
  const [count, setCount] = useState(0);

  const handleLoadData = (page = 0, skip = 0, limit = 10) => {
    const newQuery = {
      ...filter,
      skip,
      limit,
    };
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
          'excel-table-diary-action',
          'reportHistorySystem',
          'Báo cáo nhật ký hệ thống',
        );
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel('excel-table-diary-action', 'Báo cáo nhật ký hệ thống');
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
    viewConfig[0] = { name: 'timeAction', title: 'NGÀY GIỜ THỰC HIỆN', checked: true, width: 150 };
    viewConfig[1] = { name: 'action', title: 'HÀNH ĐỘNG', checked: true, width: 150 };
    viewConfig[2] = { name: 'path', title: 'PHÂN LOẠI', checked: true, width: 150 }; // tạm thời hiển thị dữ liệu path
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
      const value = isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');

      const newFilter = { ...filter, [name]: value };

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
      // ...it,
      timeAction:
        it.originItem.timeAction && moment(it.originItem.timeAction).format('DD/MM/YYYY HH:mm:ss'),
      action: it.originItem.action,
      // type: it.originItem.type,
      path: it.originItem.path,
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
  const heightScreen = window.innerHeight - 280
  return (
    <React.Fragment>
      <CustomAppBar title={'Báo cáo nhật ký hệ thống'} onGoBack={onClose} disableAdd />
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
        <Grid item xs={12}>
          {(filter.startDate && filter.endDate) || (!filter.startDate && !filter.endDate) ? (
            <ListPage
              disableSearch
              apiUrl={`${API_DIARY_ACTION}`}
              filter={filter}
              customFunction={customFunction}
              columns={getColumns()}
              // customRows={getRows || []}
              height={heightScreen}
              disableAdd
              disableEdit
              disableSelect
              count={count}
              isHistorSystem
              perPage={queryFilter.limit}
              // disableFormatDate
              disableImport
              // disableExport
              onLoad={handleLoadData}
              inSwipeable
              noFilterStatus
            />
          ) : (
            // <ListPage code="LoginLog" noFilterStatus disableSearch noData />
            ''
          )}
          <ExportTable
            filter={newFilter}
            viewConfigs={getColumns()}
            getRows={getRows}
            url={API_DIARY_ACTION}
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
            <Grid container item style={{ width: '394px', padding: '0', gap: '0 30px' }}>
              <Grid item xs={6} spacing={4} style={{ flex: 1 }}>
                <Button variant="outlined" color="primary" style={{ width: '100%' }} onClick={handleExportExcel}>
                  XUẤT FILE EXCEL
                </Button>
              </Grid>
              <Grid item xs={6} spacing={4} style={{ flex: 1 }}>
                <Button variant="outlined" color="primary" style={{ width: '100%' }} onClick={handleExportPDF}>
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
)(HistorySystem);
