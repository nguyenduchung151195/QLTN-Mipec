import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Checkbox,
  Button,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Menu,
  Select,
  AppBar, Tabs, Tab, Box, TablePagination, TextField as TextFieldUI, InputAdornment
} from '@material-ui/core';
import { ExpandMore, ExpandLess, FilterList } from '@material-ui/icons';
import { API_ORIGANIZATION, API_USERS } from '../../config/urlConfig';
import { fetchData, flatChild, serialize } from '../../helper';
import List from '../../components/List';
import lodash from 'lodash'
import { Autocomplete, AsyncAutocomplete } from 'components/LifetekUi';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { API_LT_ACCOUNT } from '../../config/urlConfig';
import GridItem from 'components/Grid/ItemGrid';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
// const useStyles = makeStyles((theme) => ({
//   root: {
//     backgroundColor: theme.palette.background.paper,
//     width: 500,
//   },
// }));
function DepartmentSelect(props) {
  const { onChange, title, allowedDepartmentIds, allowedUsers = [], onAllowedUsersChange, isMultiple, targetGroupCode, onChangetargetGroupCode, disabledEmployee, onChangeAddRoles } = props;
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [columns, setColumns] = useState([
    {
      name: 'view',
      title: 'Xem',
      _id: '5fb3ad613918a44b3053f080',
    },
  ]);
  const [employees, setEmployees] = useState();
  const [cloneEpl, setCloneEpl] = useState([]);
  const [filter, setFilter] = useState({ position: isMultiple ? [] : '' });
  const [positions, setPositions] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [customerData, setCustomerData] = useState([]);
  const [dsCustomer, setDsCustomer] = useState([]);
  const [checkedCustomer, setCheckedCustomer] = useState({});
  const [count, setCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [activePage, setActivePage] = useState(0);
  const [searchCustomer, setSearchCustomer] = useState("");
  const timeout = useRef();
  const [filterTable, setFilterTable] = useState({
    limit: perPage,
    skip: 0,
  });

  // const classes = useStyles();
  // const theme = useTheme();

  useEffect(() => {
    if (props.position) {
      const newColumns = [{ name: 'position', title: 'Chức vụ', _id: '5fb3ad613918a44b3053f081' }].concat(columns);
      setColumns(newColumns);
    }
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    const foundPosition = crmSource.find(it => it.code === 'S25');
    const { data } = foundPosition;
    if (Array.isArray(data)) {
      setPositions([...data]);
    }

    getData();
    fetchData(API_USERS)
      .then(response => {
        if (response && response.data) {
          setEmployees(response.data);
          setCloneEpl(response.data);
        }
      })
      .catch();
  }, []);

  useEffect(
    () => {
      if ((allowedDepartmentIds, departments, employees)) {
        let ids = [];
        if (Array.isArray(allowedDepartmentIds)) {
          ids = allowedDepartmentIds;
        }

        if (Array.isArray(data)) {
          ids = lodash.uniq(ids.concat(data.filter(i => i.data && i.data.view).map(i => i.name)));
        }
        setData(mergeDerpartment(ids, departments, employees, allowedUsers));
      }
    },
    [allowedDepartmentIds, departments, employees, allowedUsers],
  );

  useEffect(() => {
    if (targetGroupCode) {
      const position = positions.filter(e => targetGroupCode.includes(e.value))
      setFilter(state => ({ ...state, position }))
    }
  }, [targetGroupCode])

  useEffect(() => {
    let newEmployees = []
    const value = filter.position

    if (isMultiple) {
      if (value && value.length > 0) {
        const cloneEmployee = [...cloneEpl];
        // newEmployees = cloneEmployee.filter(it => it.positions && value.includes(it.positions.value));
        newEmployees = cloneEmployee.filter(it => it.positions && value.some(i => i.value === it.positions.value));
      } else {
        newEmployees = [...cloneEpl]
      }
    } else {
      if (value && value !== 0) {
        const cloneEmployee = [...cloneEpl];
        newEmployees = cloneEmployee.filter(it => it.positions && it.positions.value === value.value);
      } else {
        newEmployees = [...cloneEpl]
      }
    }

    setEmployees(newEmployees);
  }, [filter.position, cloneEpl])
  // const handleCheckCustomer = (id, status) => {
  //   setCheckedCustomer({ ...checkedCustomer, [id]: status });
  //   console.log(props)
  //   if (props.getAccountId) {
  //     props.getAccountId(id, status);
  //   }
  // }
  useEffect(() => {
    if (tabValue === 1) {
      fetch(`${API_LT_ACCOUNT}?${serialize(filterTable)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setCustomerData(data);
        })
        // eslint-disable-next-line no-alert
        .catch((error) => console.log(error));
    }


  }, [tabValue, filterTable]);
  useEffect(()=>{
    console.log(props)
    if(props.id==="add"){
      setDsCustomer([]);
      setCount(0)

    }
    else{
      setDsCustomer(props.accountId);
      setCount(props.accountId && props.accountId.length||0)

    }
  },[props.accountId])

  useEffect(()=>{
    if (props.getAccountId) {
      props.getAccountId(dsCustomer);
    }
  },[dsCustomer])

  const getData = async () => {
    try {
      const departmentsRes = await fetchData(API_ORIGANIZATION);
      const flattedDepartment = flatChild(departmentsRes);
      setDepartments(flattedDepartment);
    } catch (error) { }
  };

  function mergeDerpartment(data, z, users = [], allowedEmployees = []) {
    const x = z.map(i => {
      const departmentUsers = (users.filter(u => u.organizationUnit && u.organizationUnit.organizationUnitId === i.id) || []).map(u => {
        const dt = allowedEmployees.find(it => it === u._id);
        if (dt) {
          return {
            is_user: true,
            userName: u.name,
            open: u.open,
            name: u.id,
            id: u._id,
            expand: u.expand,
            slug: u.slug,
            position: u.positions && u.positions.title,
            data: { view: true, edit: false, delete: false },
          };
        }
        return {
          is_user: true,
          userName: u.name,
          open: u.open,
          name: u.id,
          id: u._id,
          expand: u.expand,
          slug: u.slug,
          position: u.positions && u.positions.title,
          data: { view: false, edit: false, delete: false },
        };
      });
      if (Array.isArray(data) && data.length) {
        const dt = data.find(it => it === i.id);
        if (dt)
          return {
            open: i.open,
            name: i.id,
            id: i.id,
            expand: i.expand,
            slug: i.slug,
            data: { view: true, edit: false, delete: false },
            users: departmentUsers,
          };
      }
      return {
        open: i.open,
        name: i.id,
        id: i.id,
        expand: i.expand,
        slug: i.slug,
        data: { view: false, edit: false, delete: false },
        users: departmentUsers,
      };
    });
    return x;
  }

  function handleCheckDerpartment(name, valueName, checked) {
    const slug = data.find(i => i.name === name).slug;
    const list = slug.split('/');
    const newAllowedUsers = [...allowedUsers];
    const newData = data.map(
      i =>
        i.slug.includes(slug) || (list.includes(i.name) && checked)
          ? {
            ...i,
            data: { ...i.data, [valueName]: !checked },
            // users: i.users.map(it => {
            //   const index = newAllowedUsers.findIndex(u => u === it.id);
            //   if (!checked) {
            //     if (index === -1) {
            //       newAllowedUsers.push(it.id);
            //     }
            //   } else {
            //     newAllowedUsers.splice(index, 1);
            //   }
            //   return {
            //     ...it,
            //     data: {
            //       ...it.data,
            //       view: !checked,
            //     },
            //   };
            // }),
          }
          : i,
    );
    setData(newData);
    const viewedDepartmentIds = newData.filter(item => item.data.view).map(item => item.name);
    if (onChangeAddRoles) onChangeAddRoles(newData, departments);
    if (onChange) onChange(viewedDepartmentIds, newAllowedUsers);
  }

  function handleCheckUser(userId) {
    if (!userId) return;
    const newAllowedUsers = [...allowedUsers];
    const index = newAllowedUsers.findIndex(u => u === userId);
    if (index === -1) {
      newAllowedUsers.push(userId);
    } else {
      newAllowedUsers.splice(index, 1);
    }
    if (onAllowedUsersChange) {
      onAllowedUsersChange(newAllowedUsers);
    }
  }

  function expandRow(slug, name, expand) {
    let tabDerpartment;

    if (expand) {
      tabDerpartment = departments.map(i => {
        if (i.name === name) return { ...i, expand: false };
        if (i.slug.includes(slug)) return { ...i, open: false, hide: true };
        return i;
      });
    } else {
      tabDerpartment = departments.map(i => {
        if (i.name === name) return { ...i, expand: true };
        if (i.parent === name) return { ...i, open: true, hide: false };
        return { ...i, expand: false };
      });
    }
    setDepartments(tabDerpartment);
  }

  const handleFilter = position => {
    setFilter({ ...filter, position });

    if (onChangetargetGroupCode) {
      const pos = positions.filter(e => position.includes(e))
      onChangetargetGroupCode({
        targetGroup: pos.map(e => e.title),
        targetGroupCode: pos.map(e => e.value),
      })
    }
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue)
  }
  const mapFunction = item => {
    return {
      ...item,
      accountStatus: item.accountStatus === "1" ? "Hoạt động" : item.accountStatus === "0" ? "Chưa kich hoạt" : item.accountStatus === "2" ? "Hết hạn" : null
    }
  }
  const handleChangePage = (event, activePage) => {
    setActivePage(activePage);
    setFilterTable({
      limit: perPage,
      skip: Number(activePage) * Number(perPage)
    })
  };

  const handleChangeRowsPerPage = event => {
    setActivePage(0);
    setPerPage(event.target.value)
  };
  const handleChangeData = (data) => {
    setDsCustomer(data)
    setCount(data.length)
  }
  function clearWidthSpace(str) {
    return str.replaceAll(/\s+/g, ' ');
  }
  // const handleSearch = e => {
  //   e.target.value = clearWidthSpace(e.target.value).trimStart();
  //   const search = e.target.value;
  //   setSearchCustomer(search.toLowerCase());
  //   if (timeout.current) clearTimeout(timeout.current);
  //   timeout.current = setTimeout(() => {
  //     setFilterTable({ ...filterTable, filter: { $or: [{ name: { $regex: search.toLowerCase(), $options: 'gi' }, accountStatus: { $ne: "4" } }] } })
  //   }, 500);
  // };
  const customerMapfunction = (x) => ({
    ...x,
    name: `${x.username}-${x.accountPhone}${x.accountEmail}`,
  })
  const customerColumns = ["HỌ VÀ TÊN", "TÊN ĐĂNG NHẬP", "SỐ ĐIỆN THOẠI", "EMAIL"];
  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <p>{title}</p>
      </div>
      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        // variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="Cài đặt phòng ban" {...a11yProps(0)} />
        <Tab label="Cài đặt người xem" {...a11yProps(1)} />
      </Tabs>
      {tabValue === 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Phòng ban</TableCell>
              {columns.map(i => (
                <TableCell>{i.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map(
              (i, rowIndex) =>
                i.open ? (
                  <>
                    <TableRow>
                      <TableCell style={styles.codeCol}>
                        <p
                          style={{ paddingLeft: i.level ? i.level * 10 : 0, fontWeight: i.child ? 'bold' : false }}
                          onClick={e => {
                            e.stopPropagation();
                            expandRow(i.slug, i.name, i.expand);
                          }}
                        >
                          {i.title}
                          {i.child || (data[rowIndex] && data[rowIndex].users && data[rowIndex].users.length) ? (
                            i.expand ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )
                          ) : null}
                        </p>
                      </TableCell>
                      {columns.map(it => (
                        <TableCell>
                          {props.position && it.name === 'position' ? (
                            ''
                          ) : (
                            <CheckDerpartment
                              isView={props.isView ? props.isView : null}
                              handleCheckDerpartment={handleCheckDerpartment}
                              checked={data[rowIndex] && data[rowIndex].data && data[rowIndex].data[it.name] ? true : false}
                              column={it.name}
                              row={i.name}
                            />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {
                      !disabledEmployee ?
                        i.expand && data[rowIndex] && data[rowIndex].users && data[rowIndex].users.length
                          ? data[rowIndex].users.map(user => (
                            <TableRow>
                              <TableCell style={styles.codeCol}>
                                <p style={{ paddingLeft: i.level ? (i.level + 1) * 10 : 0, color: '#2196F3' }}>{user.userName}</p>
                              </TableCell>
                              {columns.map(it => (
                                <TableCell>
                                  {props.position && it.name === 'position' ? (
                                    <Typography>{user && user.position ? user.position : ''}</Typography>
                                  ) : (
                                    <Checkbox
                                      onClick={() => {
                                        handleCheckUser(user.id);
                                      }}
                                      checked={user && user.data ? user.data.view : false}
                                    />
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                          : null : null}
                  </>
                ) : null,
            )}
          </TableBody>
        </Table>
      )}
      {tabValue === 1 && (
        <>
          {/* <TextFieldUI
            variant="outlined"
            placeholder="Tìm kiếm khách hàng"
            value={searchCustomer}
            onChange={handleSearch}
          /> */}
          <AsyncAutocomplete
            url={API_LT_ACCOUNT}
            value={dsCustomer}
            isMulti
            // fullWidth
            label="Tìm kiếm khách hàng"
            onChange={value => handleChangeData(value)}
            filters={["name", "username"]}
            ltAcount={"ltAcount"}
            mapFunction={customerMapfunction}
          // style={{ width: '490px' }}
          />
          <Table>
            <TableHead>
              <TableRow>
                {customerColumns.map((x, i) => (
                  <TableCell key={i}>{x}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dsCustomer && Array.isArray(dsCustomer) && dsCustomer.map((x, i) => (
                <TableRow key={i}>
                  <TableCell>{x.accountName}</TableCell>
                  <TableCell>{x.username}</TableCell>
                  <TableCell>{x.accountPhone}</TableCell>
                  <TableCell>{x.accountEmail}</TableCell>
                  {/* <TableCell><Checkbox
                    onClick={(e) => {
                      handleCheckCustomer(x._id, e.target.checked);
                    }}
                    checked={checkedCustomer[x._id] ? true : false}
                  /></TableCell> */}
                </TableRow>
              ))}

            </TableBody>
          </Table>
          <GridItem style={{ justifyContent: 'flex-end', display: 'flex' }} md={12}>
            <table>
              <tbody>
                <tr>
                  <TablePagination
                    rowsPerPageOptions={[10, 15, 20]}
                    colSpan={3}
                    count={count}
                    rowsPerPage={perPage}
                    labelDisplayedRows={({ }) =>
                      count === 0
                        ? `0 - 0 của 0`
                        : perPage * activePage + perPage < count
                          ? `${activePage * perPage + 1} - ${perPage * activePage + perPage} của ${count} `
                          : `${activePage * perPage + 1} - ${perPage * activePage + perPage - (perPage * activePage + perPage - count)} của ${count} `
                    }
                    page={activePage}
                    onChangePage={handleChangePage}
                    labelRowsPerPage={'Số dòng hiển thị:'}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  // ActionsComponent={TablePaginationActionsWrapped}
                  />
                </tr>
              </tbody>
            </table>
          </GridItem>
        </>
      )}

    </>
  );
}

function CheckDerpartment({ handleCheckDerpartment, row, column, checked, isView }) {
  function check() {
    handleCheckDerpartment(row, column, checked);
  }
  return <Checkbox disabled={isView} onClick={check} checked={checked} />;
}

DepartmentSelect.propTypes = {};

export default DepartmentSelect;

const styles = {
  codeCol: {
    minWidth: '34vw'
  }
}