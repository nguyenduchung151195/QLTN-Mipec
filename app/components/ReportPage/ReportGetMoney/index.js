import React, { useState, useCallback } from 'react';

import { API_REPORT_INCOMMING_MONEY } from '../../../config/urlConfig';
import ListPage from 'containers/ListPage';
import FilterReport from '../../FilterReport';
import { Grid, Paper, Button } from '@material-ui/core';
import { serialize, tableToPDF, exportTableToExcel, exportTableToExcelXSLX } from '../../../helper';
import ExportTable from './ExportTable';
import moment from 'moment';

export default function ReportGetMoney(props) {
  const INITIAL_QUERY = {
    filter: {
      periodStr: {
        $gte: moment().format('YYYY-MM'),
        $lte: moment().format('YYYY-MM'),
      },
    },
    skip: 0,
    limit: 10,
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [exportExcel, setExportExcel] = useState(false);
  const [count, setCount] = useState(0);
  const [type, setType] = useState('PDF');

  const handleGetFilter = useCallback(
    obj => {
      let newFilter = {
        ...queryFilter,
        filter: {
          periodStr: {
            $gte: obj.periodStr ? moment(obj.periodStr.gte, 'YYYYMM').format('YYYY-MM') : null,
            $lte: obj.periodStr ? moment(obj.periodStr.lte, 'YYYYMM').format('YYYY-MM') : null,
          },
        },
      };
      if (!obj.group) {
        delete newFilter.filter.customerGroup;
      } else {
        newFilter.filter.customerGroup = obj.group && obj.group.value;
      }
      if (!obj.organizationUnitId) {
        delete newFilter.filter.organizationUnitId;
      } else {
        newFilter.filter.organizationUnitId = obj.organizationUnitId;
      }
      setQueryFilter(newFilter);
    },
    [queryFilter.filter],
  );
  const getColumns = () => {
    const viewConfig = [];
    viewConfig[0] = { name: 'order', title: 'STT', checked: true, width: 50 };
    viewConfig[1] = { name: 'apartmentCode', title: 'Mã khách hàng', checked: true, width: 150 };
    viewConfig[2] = { name: 'code', title: 'Phiếu thông báo kỳ', checked: true, width: 150 };
    viewConfig[3] = { name: 'totalMoney', title: 'Tổng cộng', checked: true, width: 150 };
    viewConfig[4] = {
      name: 'totalPaid',
      title: 'Số tiền đã thanh toán',
      checked: true,
      width: 150,
    };
    viewConfig[5] = { name: 'totalDebt', title: 'Số tiền còn lại', checked: true, width: 150 };

    return viewConfig;
  };

  const getRows = ({ data = [], count }) => {
    let result = [];
    setCount(count);
    if (Array.isArray(data) && data.length > 0) {
      data.map((item, index) => {
        if (item.items) {
          let { items = [], ...rest } = item;
          let obj = {
            ...rest,
            order: queryFilter.skip ? Number(queryFilter.skip) + index + 1 : index + 1,
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
            order: queryFilter.skip ? Number(queryFilter.skip) + index + 1 : index + 1,
          };
          result.push(obj);
        }
      });
    }
    return result || [];
  };
  const handleLoadData = (page = 0, skip = 0, limit = 10) => {
    const newQuery = {
      filter: {
        ...queryFilter.filter,
      },
      skip,
      limit,
    };
    setQueryFilter(newQuery);
  };
  const handleExportExcel = () => {
    setExportExcel(true);
    setType('EXCEL');
  };

  const handleCloseExcel = () => {
    setExportExcel(false);
    if (type === 'PDF') {
      let pdf = tableToPDF(
        'excel-table-report-get-money',
        'reportFinanceGetMoney',
        'Báo cáo công văn đi',
      );
      let win = window.open('', '', 'height=700,width=700');
      win.document.write(pdf);
      win.document.close(); // CLOSE THE CURRENT WINDOW.
      win.print();
    } else {
      // exportTableToExcel('excel-table-report-get-money', 'Báo cáo thu tiền');
      exportTableToExcel('excel-table-report-get-money', 'Báo cáo thu tiền', '');
    }
  };
  const handleExportPDF = () => {
    setExportExcel(true);
    setType('PDF');
  };
  const mapFunction = item => {
    return {
      ...item,
      totalDebt:
        (!isNaN(item.totalDebt) &&
          Number(item.totalDebt).toLocaleString('es-AR', { maximumFractionDigits: 0 })) ||
        0,
      totalPaid:
        (!isNaN(item.totalPaid) &&
          Number(item.totalPaid).toLocaleString('es-AR', { maximumFractionDigits: 0 })) ||
        0,
      totalMoney:
        (!isNaN(item.totalMoney) &&
          Number(item.totalMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 })) ||
        0,
    };
  };
  return (
    <Paper style={{ position: 'relative' }}>
      <div>
        <FilterReport
          queryFilter={queryFilter}
          isReport={true}
          onGetFilter={handleGetFilter}
          code="reportFinanceGetMoney"
        />
      </div>
      <ListPage
        apiUrl={`${API_REPORT_INCOMMING_MONEY}?${serialize(queryFilter)}`}
        customColumns={getColumns}
        columns={getColumns()}
        customRows={getRows}
        perPage={queryFilter.limit}
        isReport={true}
        onLoad={handleLoadData}
        count={count}
        mapFunction={mapFunction}
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
        url={API_REPORT_INCOMMING_MONEY}
        open={exportExcel}
        onClose={handleCloseExcel}
      />
      <Grid
        container
        row
        spacing={8}
        alignItems="center"
        justify="flex-end"
        style={{ marginTop: '20px', padding: "0 20px 20px 0" }}
      >
        <Grid container item style={{ width: '357px', padding: '0', gap: '0 30px' }}>
          <Grid item spacing={4} style={{ flex: 1 }}>
            <Button variant="outlined" color="primary" style={{ width: '100%' }} onClick={handleExportExcel}>
              XUẤT FILE EXCEL
            </Button>
          </Grid>
          <Grid item spacing={4} style={{ flex: 1 }}>
            <Button variant="outlined" color="primary" style={{ width: '100%' }} onClick={handleExportPDF}>
              XUẤT FILE PDF
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
