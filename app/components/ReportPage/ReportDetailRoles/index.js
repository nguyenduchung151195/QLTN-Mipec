import React, { useCallback, useEffect, useState } from 'react';
import { Paper, Grid, Button } from '@material-ui/core';
import ListPage from 'containers/ListPage';

import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { API_USERS, API_ROLE } from '../../../config/urlConfig';
import { serialize, exportTableToExcel, exportTableToExcelXSLX, tableToPDF, fetchData } from '../../../helper';
import ExportTable from './ExportTable';
import { TableBody, TableCell, Table, TableRow, TableHead, Checkbox, TablePagination } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import DepartmentAndEmployee from '../../Filter/DepartmentAndEmployee';
import makeSelectDashboardPage, { makeSelectProfile } from '../../../containers/Dashboard/selectors';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import CustomAppBar from 'components/CustomAppBar';
import { Loading } from 'components/LifetekUi';

import { upperCase } from 'lodash';
const FUNCTION_REORDER = [
  { code: 'Task', childCodes: ['TemplateTask', 'TaskConfig'] },
  // { code: 'tower', childCodes: ['Fee', 'Contract', 'Customer', 'Supplier', 'CrmSource']},
  { code: 'tower', childCodes: ['Fee', 'Customer', 'Supplier', 'CrmSource', 'Contract', 'ContractSupper'] },
  { code: 'Stock', childCodes: ['Asset', 'StockExport', 'StockImport', 'StockConfig', 'Allocate'] },
  { code: 'Documentary', childCodes: ['inComingDocument', 'outGoingDocument', 'DocumentConfig'] },
  // { code: 'RevenueExpenditure', childCodes: ['BankAccount'] },
  {
    code: 'reports',
    childCodes: [
      'reportFinanceGeneralDebt',
      'reportFinanceGetMoney',
      'reportFinanceDebtOver',
      'reportFinanceGeneralRevenue',
      'reportStockGeneral',
      'reportStockImport',
      'reportStockExport',
      'reportDocumentaryTo',
      'reportDocumentaryGo',
      'reportCustomerContract',
      'reportCustomerContractOver',
      'reportCustomerContractNew',
      'reportCustomerContractRemove',
      'reportStockByAsset',
      'reportStockImportByProduct',
      'reportStockImportByAsset',
      'reportStockExportByProduct',
      'reportStockExportByAsset',
    ],
  },
  { code: 'setting', childCodes: ['LtAccount', 'DynamicForm', 'NewsFeed', 'ApproveGroup', 'Employee'] },
  // {code : 'AllContract', childCodes: ['Contract', 'ContractSupper']},
  { code: 'AllRevenueExpenditure', childCodes: ['RevenueExpenditure', 'RevenueExpenditureImports', 'RevenueExpenditureInternal', 'BankAccount'] },
];
const newMap = new Map()
const enableReorder = true;
let ALL_MODULES = [];
FUNCTION_REORDER.forEach(c => {
  ALL_MODULES.push(c.code);
  ALL_MODULES = ALL_MODULES.concat(c.childCodes);
});
const convertDataByH = rsNewData => {
  let newAllFunctionForAdd = [];
  if (rsNewData && FUNCTION_REORDER.length && rsNewData.length && enableReorder) {
    FUNCTION_REORDER.forEach(reo => {
      const found = rsNewData.find(a => a.codeModleFunction === reo.code);
      if (found) {
        newAllFunctionForAdd.push(found);
        if (reo.childCodes && reo.childCodes.length) {
          reo.childCodes.forEach(k => {
            const foundChild = rsNewData.find(a => a.codeModleFunction === k);
            if (foundChild) {
              newAllFunctionForAdd.push(foundChild);
            }
          });
        }
      }
    });
  }
  return newAllFunctionForAdd;
};
function ReportDetailRoles(props) {
  const { onClose } = props;
  const INITIAL_QUERY = {
    limit: 10,
    skip: 0,
  };
  const [filterRoles, setFilterRoles] = useState({});
  const [userAcount, setUserAcount] = useState([]);
  const [reload, setReload] = useState(true);
  const [dataUser, setDataUser] = useState([]);
  const [allFunctionForAdd, setAllFunctionForAdd] = useState([]);
  const [rowAdd, setRowAdd] = useState({});
  const [type, setType] = useState('PDF');
  const [exportExcel, setExportExcel] = useState(false);
  const [perPage, setPerPage] = useState(1);
  const [count, setCount] = useState();
  const [activePage, setActivePage] = useState(0);
  const token = localStorage.getItem('token');
  useEffect(() => {
    // setAllFunctionForAdd(props.dashboardPage.role.roles);
    axios
      .get(`${API_USERS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        let data = response.data.data;
        setCount(response && response.data && response.data.count);
        setDataUser(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(
    () => {
      let newData = [];
      let numberData = activePage * perPage;

      if (count <= perPage) {
        for (let i = 0; i < count; i++) {
          newData.push(dataUser[numberData + i]);
        }
      } else {
        for (let i = 0; i < perPage; i++) {
          newData.push(dataUser[numberData + i]);
        }
      }

      setUserAcount(newData);
      if (newData) {
        let oldRowAdd = {}

        newData.map(async (dt, index) => {
          if (dt) {
            setReload(true)
            // newMap.clear();
            const getApi = async (id, idx) => {
              const res = await fetchData(`${API_ROLE}/${id}`);

              let rsNewData = res.roles;
              let convertData = convertDataByH(rsNewData);
              // newMap.set(index, convertData);
              console.log('res', convertData, "convertData", idx);
              // setRowAdd({ ...rowAdd, [idx]: convertData })
              oldRowAdd = { ...oldRowAdd, [idx]: convertData }
            };
            await getApi(dt.userId, index);
            setRowAdd(oldRowAdd)

            setReload(false)

          }
        });


      }

    },
    [perPage, activePage, filterRoles, dataUser],
  );
  useEffect(
    () => {
      console.log('vaooo');
      let queryFilter = serialize(filterRoles);
      axios
        .get(`${API_USERS}?${queryFilter}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          let data = response.data.data;
          setCount(response && response.data && response.data.count);
          setDataUser(data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    [filterRoles],
  );

  const handleChangeDepartment = useCallback(
    res => {
      const value = res.department;
      const employee = res.employee;
      let dataEmployee = [];
      employee &&
        employee.map(item => {
          dataEmployee.push(item._id);
        });

      let filter = {
        ['_id']: {
          $in: [],
        },
        name: '',
      };

      if (value) {
        if (res.employee) {
          filter = {
            ['organizationUnit.organizationUnitId']: value,
            ['_id']: {
              $in: dataEmployee,
            },
          };
          setFilterRoles({ filter });
        } else {
          // delete filter.name;
          filter = {
            ['organizationUnit.organizationUnitId']: value,
          };
          setFilterRoles({ filter });
        }
      } else if (value === 0) {
        filter = {};
        // delete filter['organizationUnit.organizationUnitId'];
        if (res.employee) {
          filter = {
            ['_id']: {
              $in: dataEmployee,
            },
          };
          setFilterRoles({ filter });
        } else {
          // delete filter.name;
          setFilterRoles(filter);
        }
      }
    },
    [filterRoles],
  );

  const handleExportExcel = () => {
    exportTableToExcel('excel-table-detail-roles', 'Báo cáo chi tiết phân quyền');
  };

  // const handleCloseExcel = useCallback(
  //   () => {
  //     setExportExcel(false);
  //     if (type === 'PDF') {
  //       let pdf = tableToPDF('excel-table-detail-roles', 'reportDetailRoles', 'Báo cáo phân quyền');
  //       let win = window.open('', '', 'height=700,width=700');
  //       win.document.write(pdf);
  //       win.document.close(); // CLOSE THE CURRENT WINDOW.
  //       win.print();
  //     } else {
  //     }
  //   },
  //   [type],
  // );
  const handleExportPDF = () => {
    let pdf = tableToPDF('excel-table-detail-roles', 'reportDetailRoles', 'Báo cáo chi tiết phân quyền');
    let win = window.open('', '', 'height=700,width=700');
    win.document.write(pdf);
    win.document.close(); // CLOSE THE CURRENT WINDOW.
    win.print();
  };
  // Xử lý phân trang
  const handleChangePage = (event, activePage) => {
    setActivePage(activePage);
  };
  const handleChangeRowsPerPage = event => {
    setActivePage(0);
    setPerPage(event.target.value);
  };
  const heightScreen = window.innerHeight - 234
  return (
    <>
      <CustomAppBar title={'Báo cáo chi tiết phân quyền'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: ' 80px 20px 0 20px' }}>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item xs={4}>
            <DepartmentAndEmployee
              // department={filter.organizationUnit}
              onChange={handleChangeDepartment}
              moduleCode="Employee"
              profile={props.profile}
              isMulti
              typeWidth
            />
          </Grid>

        </Grid>
        <Grid style={{ height: heightScreen, overflowY: 'auto' }}>
          {reload ? <Loading /> : null}
          {userAcount.map((user, index) => {
            return (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: '#2196F3', textTransform: 'upperCase' }}>{user && user.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Phân quyền chức năng</TableCell>
                    <TableCell>Xem</TableCell>
                    <TableCell>Thêm</TableCell>
                    <TableCell>Sửa</TableCell>
                    <TableCell>Xóa</TableCell>
                    <TableCell>Xuất file</TableCell>
                    <TableCell>Import file</TableCell>
                    <TableCell>View Config</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {console.log('AAAAAAAAAAAA', rowAdd)}
                  {rowAdd &&
                    Array.isArray(rowAdd[index]) &&
                    rowAdd[index].map((row, i) => (
                      <TableRow key={row.codeModleFunction}>
                        <TableCell>{row.titleFunction}</TableCell>
                        <TableCell>
                          <Checkbox checked={row.methods.find(item => item.name === 'GET').allow} />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={row.methods.find(item => item.name === 'POST').allow} />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={row.methods.find(item => item.name === 'PUT').allow} />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={row.methods.find(item => item.name === 'DELETE').allow} />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={row.methods.find(item => item.name === 'EXPORT').allow} />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={row.methods.find(item => item.name === 'IMPORT').allow} />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={row.methods.find(item => item.name === 'VIEWCONFIG').allow} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            );
          })}
        </Grid>
        <Grid style={{ justifyContent: 'flex-end', display: 'flex' }} md={12}>
          <TablePagination
            rowsPerPageOptions={[1, 5, 10]}
            colSpan={3}
            count={count}
            rowsPerPage={perPage}
            page={activePage}
            SelectProps={{
              native: true,
            }}
            spacing={8}
            justify="flex-end"
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng hiển thị"
          />
        </Grid>
        <ExportTable allFunctionForAdd={allFunctionForAdd} userAcount={userAcount} rowAdd={rowAdd} />
        <Grid container row spacing={8} alignItems="center" justify="flex-end" style={{ marginBottom: '10px' }}>
          <Grid container item style={{ width: 350 }}>
            <Grid item xs={6} spacing={4}>
              <Button variant="outlined" color="primary" onClick={handleExportExcel}>
                XUẤT FILE EXCEL
              </Button>
            </Grid>
            <Grid item xs={6} spacing={4}>
              <Button variant="outlined" color="primary" onClick={handleExportPDF}>
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
  dashboardPage: makeSelectDashboardPage(),
});
const withConnect = connect(mapStateToProps);
export default compose(
  injectIntl,
  withConnect,
)(ReportDetailRoles);
