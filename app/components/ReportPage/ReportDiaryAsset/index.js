import React, { useCallback, useState } from 'react';
import { Paper, Grid, Button } from '@material-ui/core';
import ListPage from 'containers/ListPage';
import CustomAppBar from 'components/CustomAppBar';

import moment from 'moment';

import FilterReport from '../../FilterReport';
import { API_ASSET_ALLOCATE_LOG } from '../../../config/urlConfig';
import { serialize, exportTableToExcel, exportTableToExcelXSLX, tableToPDF } from '../../../helper';
import ExportTable from './ExportTable';

export default function ReportDiaryAsset(props) {
  const { onClose } = props;
  const INITIAL_QUERY = {

    limit: 10,
    skip: 0,
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [count, setCount] = useState(0);
  const [exportExcel, setExportExcel] = useState(false);
  const [type, setType] = useState('PDF');
  const getColumns = () => {
    const viewConfig = [];
    viewConfig[0] = { name: 'assetCode', title: 'Mã tài sản', checked: true, width: 150 };
    viewConfig[1] = { name: 'assetName', title: 'Tên tài sản', checked: true, width: 150 };
    viewConfig[2] = { name: 'createdAt', title: 'Ngày chỉnh sửa', checked: true, width: 150 };
    viewConfig[3] = { name: 'actionType', title: 'Hành động', checked: true, width: 150 };
    viewConfig[4] = {
      name: 'kanbanStatus',
      title: 'Trạng thái tài sản',
      checked: true,
      width: 150,
    };
    viewConfig[5] = { name: 'userReceive', title: 'Mã người nhận', checked: true, width: 150 };
    viewConfig[6] = { name: 'userReceiveName', title: 'Tên người nhận', checked: true, width: 150 };
    viewConfig[7] = { name: 'createdBy', title: 'Mã người chỉnh sửa', checked: true, width: 150 };
    viewConfig[8] = {
      name: 'createdByName',
      title: 'Tên người chỉnh sửa',
      checked: true,
      width: 150,
    };
    return viewConfig;
  };
  const handleGetFilter = useCallback(
    obj => {
      console.log('obj', obj);
      // let newFilter = {
      //   filter: {
      //     periodStr: {
      //       $gte: obj.periodStr ? moment(obj.periodStr.gte, 'YYYYMM').format('YYYY-MM') : null,
      //       $lte: obj.periodStr ? moment(obj.periodStr.lte, 'YYYYMM').format('YYYY-MM') : null,
      //     },
      //   },
      // };
      let newFilter = {
        ...queryFilter,
        filter: {},
      };

      if (obj.organizationUnitId !== '') {
        delete newFilter.filter.organizationUnitId;
        newFilter.filter.organizationUnitId = obj.organizationUnitId;
      }
      setQueryFilter(newFilter);
    },
    [queryFilter.filter],
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
      ...queryFilter,
      skip,
      limit,
    };
    {
      console.log('newQuery', newQuery);
    }

    setQueryFilter(newQuery);
  };

  const handleChangeDate = (e, fieldName) => {
    let name = fieldName;
    let value = moment(e).format('YYYY/MM/DD');
    setQueryFilter({
      ...queryFilter,
      [name]: value,
    });
  };

  const handleExportExcel = () => {
    setExportExcel(true);
    setType('EXCEL');
  };

  const handleCloseExcel = useCallback(
    () => {
      setExportExcel(false);
      if (type === 'PDF') {
        let pdf = tableToPDF('excel-table-diary', 'reportDiaryAsset', 'Báo cáo nhật ký tài sản');
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel('excel-table-diary', 'Báo cáo nhật ký tài sản');
      }
    },
    [type],
  );
  const handleExportPDF = () => {
    setExportExcel(true);
    setType('PDF');
  };

  return (
    <>
      <CustomAppBar title={'Báo cáo nhật ký tài sản'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: ' 80px 20px 0 20px' }}>
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

        <ListPage
          apiUrl={`${API_ASSET_ALLOCATE_LOG}?${serialize(queryFilter)}`}
          // apiUrl={API_ASSET_ALLOCATE_LOG}
          customColumns={getColumns}
          columns={getColumns()}
          customRows={getRows || []}
          perPage={queryFilter.limit}
          // mapFunction={mapFunction}
          isReport={true}
          onLoad={handleLoadData}
          // filter={queryFilter}
          count={count}
          isSpecialList={true}
          disableEdit
          disableAdd
          disableSearch
          disableConfig
          disableSelect
        />
        <ExportTable
          filter={queryFilter}
          viewConfigs={getColumns()}
          getRows={getRows}
          url={API_ASSET_ALLOCATE_LOG}
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
          <Grid container item style={{ width: '375px', padding: '0', gap: '0 30px' }}>
            <Grid item style={{ flex: 1 }} spacing={4}>
              <Button variant="outlined" color="primary" style={{ width: '100%' }} onClick={handleExportExcel}>
                XUẤT FILE EXCEL
              </Button>
            </Grid>
            <Grid item style={{ flex: 1 }} spacing={4}>
              <Button variant="outlined" color="primary" style={{ width: '100%' }} onClick={handleExportPDF}>
                XUẤT FILE PDF
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
