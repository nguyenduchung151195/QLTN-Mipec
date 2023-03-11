import { Paper, TablePagination, Grid as GridUI, InputAdornment, TextField } from '@material-ui/core';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Grid, Table, TableHeaderRow, TableColumnResizing, TableBandHeader } from '@devexpress/dx-react-grid-material-ui';
import { convertDot, convertDotOther, fetchData, serialize } from '../../helper';
import { Loading } from '../../components/LifetekUi';
import _ from 'lodash';

function ReTable(props) {
  const {
    columns,
    apiUrl,
    mapFunction,
    customFunction,
    filter,
    totalRecord,
    disableSearch,
    columnsBand,
    getAllData,
    rowsPerPageOptions,
    styleTextField = {},
    acceptSearch = '',
    resultData = false
  } = props;
  const [localState, setLocalState] = useState({
    data: [], // data
    columns: [], // columns
    count: 0,
    perPage: 10,
    activePage: 0,
    search: '',
    sorting: [{ columnName: 'createdAt', direction: 'desc' }],
    filters: acceptSearch ? ['name', acceptSearch] : ['name'],
    loading: false,
  });
  const [defaultColumns, setDefaultColumnWidths] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(
    () => {
      if (columns) {
        const newCls = columns.map(item => ({ columnName: item.name, width: item.width || 'auto' }));
        setDefaultColumnWidths(newCls);
      }
    },
    [columns],
  );

  const queryString = () => {
    const { sorting, perPage, activePage, search, filters } = localState;
    const filter = { ...props.filter };
    const rex = `${search}`;
    // if (search && acceptSearch) {
    //   filter.$or = filters.map(i => ({ [i]: { $regex: rex, $options: 'gi' } }));
    //   query = { ...query, filter: { $or: filters.map(i => ({ [i]: { $regex: rex, $options: 'gi' } })) } };
    // } else
    // if (search) {
    //   filter.$or = filters.map(i => ({ [i]: { $regex: rex, $options: 'gi' } }));
    //   // filter.filter = filters.map(i => ({ [i]: { $regex: rex, $options: 'gi' } })) }
    // }
    // if (search && acceptSearch) {
    //   query = { ...query, filter: { $or: filters.map(i => ({ [i]: { $regex: rex, $options: 'gi' } })) } };
    // }
    const skip = perPage * activePage;
    const columnSorting = sorting[0].direction === 'asc' ? sorting[0].columnName : `-${sorting[0].columnName}`;
    let query = { limit: perPage, skip, sort: columnSorting };

    if (filter) query = { ...query, ...filter };
    if (search && acceptSearch) {
      query = { ...query, filter: { $or: filters.map(i => ({ [i]: { $regex: rex, $options: 'gi' } })) } };
      //query = { ...query, filter: { productId: search } };
    }
    if (props.setFilterForExcel) props.setFilterForExcel(query);
    const queryString = serialize(query);

    return queryString;
  };

  useEffect(
    () => {
      getData();
    },
    [filter],
  );

  useEffect(
    () => {
      if (localState.loading) {
        setLocalState({ ...localState, loading: false });
        getData();
      }
    },
    [localState.loading],
  );

  const getData = () => {
    if (apiUrl) {
      const query = queryString();
      const URL = `${apiUrl}?${query}`;
      //console.log('url.....', URL);
      fetchData(URL).then(res => {
        let data;
        // if (res.status === 1) data = res.data || res.employees;
        // else data = res;
        if (resultData) {
          data = res.result
        } else {
          data = res.data || res.employees;
        }
        if (columns) {
          let newData = data.map(item => {
            const { others, ...restItem } = item;
            const newItem = {
              ...restItem,
              others: {
                ...convertDotOther(others),
              },
            };
            return convertDot({ ob: newItem, newOb: { originItem: item }, convertArr: true });
          });
          // newData = newData.filter(item => {
          //   if (item.hasOwnProperty('code')) {
          //     return item.code.includes(filtercode);
          //   } else {
          //     return true;
          //   }
          // });

          if (getAllData) getAllData({ ...newLocalState, response: res });
          if (mapFunction) newData = newData.map(mapFunction);
          if (customFunction) newData = customFunction(newData);
          if (totalRecord) totalRecord(res && res.count);
          const newLocalState = { ...localState, data: newData, columns, count: res && res.count, loading: false };
          setLocalState({ ...localState, data: newData, columns, count: res && res.count, loading: false });
        } else {
          // loi
        }
      });
      // setLocalState({ ...localState, columns })
    }
  };
  const handleChangePage = useCallback(
    (e, activePage) => {
      setLocalState({ ...localState, activePage, loading: true });
    },
    [localState],
  );
  const handleChangeRowsPerPage = useCallback(
    e => {
      setLocalState({ ...localState, activePage: 0, perPage: e.target.value, loading: true });
    },
    [localState],
  );

  const handleSearch = e => {
    const search = e.target.value;
    //setLocalState({ ...localState, search, loading: true });
    setSearch(search);
    // if (timeout) clearTimeout(timeout);
    // const timeout = setTimeout(() => {
    //   setLocalState({ ...localState, search, loading: true });
    // }, 1000);
  };

  useEffect(
    () => {
      const timeout1 = setTimeout(() => {
        setLocalState({ ...localState, search, loading: true });
      }, 500);
      return () => clearTimeout(timeout1);
    },
    [search],
  );
  const handleResizeWidth = _.debounce(newColumnsData => {
    if (typeof onSaveConfig === 'function') {
      const newColumns = columns.map(c => {
        const foundColumnData = newColumnsData.find(cData => cData.columnName === c.name);
        if (foundColumnData) {
          c.width = foundColumnData.width;
        }
        return c;
      });
      setLocalState({ ...localState, columns: newColumns });
      // onSaveConfig(newColumns);
    }
  }, 300);
  const heightScreen = window.innerHeight - 450
  const heightScreenHaveData = window.innerHeight - 800
  return (
    <React.Fragment>
      {!disableSearch ? (
        <GridUI md={6} sm={6}>
          <TextField
            variant="outlined"
            // InputProps={{
            //     endAdornment: (
            //         <InputAdornment style={{ cursor: 'pointer' }} position="end">
            //             <FilterList onClick={e => this.setState({ anchorEl: e.currentTarget })} />
            //         </InputAdornment>
            //     ),
            // }}
            style={{ marginLeft: 15 }}
            placeholder="Tìm kiếm ..."
            onChange={handleSearch}
          />
        </GridUI>
      ) : null}
      <Grid rows={localState.data || []} columns={localState.columns}>
        {/* <GroupingState
                    grouping={[{ columnName: 'name' }]}
                />
                <IntegratedGrouping /> */}
        <Table />
        <TableColumnResizing
          columnWidths={defaultColumns || []}
          onColumnWidthsChange={value => {
            setDefaultColumnWidths(value);
            handleResizeWidth(value);
          }}
        />
        <TableHeaderRow />
        {columnsBand ? <TableBandHeader columnBands={columnsBand} /> : null}
        {/* {localState.data.length === 0 && <Grid height={500} />} */}
      </Grid>
      {console.log('checkspace', localState.data)}

      <GridUI container spacing={16} justify="flex-end">

        <TablePagination
          style={localState.data.length === 0 ? { marginTop: heightScreen } : { marginTop: heightScreenHaveData }}
          rowsPerPageOptions={rowsPerPageOptions ? rowsPerPageOptions : [10, 20, 50, 100]}
          colSpan={3}
          count={localState.count}
          rowsPerPage={localState.perPage}
          page={localState.activePage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng hiển thị"
        />
      </GridUI>
      {localState.loading && <Loading />}
    </React.Fragment>
  );
}

ReTable.defaultProps = {
  // filter: { status: 1 },
  treeName: 'name',
  reload: false,
};

export default memo(ReTable);
