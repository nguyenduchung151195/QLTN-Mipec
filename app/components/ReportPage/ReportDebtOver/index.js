import React, { useState, useEffect, useCallback } from 'react';
import { Paper, Grid, Button } from '@material-ui/core';

import { API_REPORT_EXPIRED_FEE_DEBT } from '../../../config/urlConfig';

import moment from 'moment';
import FilterReport from '../../FilterReport';
import ListPage from 'containers/ListPage';
import { serialize, exportTableToExcel, tableToPDF } from '../../../helper';
import ExportTable from './ExportTable';
import CustomAppBar from 'components/CustomAppBar';

export default function ReportDebtOver(props) {
  const { onClose } = props;
  const INITIAL_QUERY = {
    filter: {
      periodStr: {
        $gte: moment().format('YYYY-MM'),
        $lte: moment().format('YYYY-MM'),
      },
    },
    limit: 10,
    skip: 0,
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [exportExcel, setExportExcel] = useState(false);
  const [count, setCount] = useState(0);
  const [type, setType] = useState('PDF');

  const getColumns = () => {
    const viewConfig = [];
    viewConfig[0] = { name: 'order', title: 'STT', checked: true, width: 50 };
    viewConfig[1] = { name: 'apartmentCode', title: 'Mã khách hàng', checked: true, width: 150 };
    viewConfig[2] = { name: 'code', title: 'Số chứng từ', checked: true, width: 150 };
    viewConfig[3] = { name: 'firstSendDate', title: 'Ngày chứng từ', checked: true, width: 150 };
    viewConfig[4] = { name: 'totalDebt', title: 'Tổng nợ', checked: true, width: 150 };
    viewConfig[5] = { name: 'firtDebt', title: '0-30 ngày', checked: true, width: 150 };
    viewConfig[6] = { name: 'secDebt', title: '31-60 ngày', checked: true, width: 150 };
    viewConfig[7] = { name: 'thirdDebt', title: '61-90 ngày', checked: true, width: 150 };
    viewConfig[8] = { name: 'forthDebt', title: '91-180 ngày', checked: true, width: 150 };
    viewConfig[9] = { name: 'fifthDebt', title: '> 180 ngày', checked: true, width: 150 };
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

  const handleCloseExcel = useCallback(
    () => {
      setExportExcel(false);
      if (type === 'PDF') {
        let pdf = tableToPDF(
          'excel-table-bos',
          'reportFinanceDebtOver',
          'Báo cáo công nợ quá hạn',
          '',
          'Công ty TNHH Dịch vụ và Quản lý Mipec ',
        );
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel(
          'excel-table-bos',
          'Báo cáo công nợ quá hạn',
          'Công ty TNHH Dịch vụ và Quản lý Mipec ',
        );
      }
    },
    [type],
  );
  const handleExportPDF = () => {
    setExportExcel(true);
    setType('PDF');
  };

  const handleGetFilter = useCallback(
    obj => {
      console.log('obj', obj);
      let newFilter = {
        ...queryFilter,
        filter: {
          periodStr: {
            $gte: obj.periodStr ? moment(obj.periodStr.gte, 'YYYYMM').format('YYYY-MM') : null,
            $lte: obj.periodStr ? moment(obj.periodStr.lte, 'YYYYMM').format('YYYY-MM') : null,
          },
        },
      };
      if (obj.group) {
        delete newFilter.filter.customerGroup;
        newFilter.filter.customerGroup = obj.group && obj.group.value;
      }
      if (!obj.organizationUnitId) {
        delete newFilter.filter.organizationUnitId;
      } else {
        newFilter.filter.organizationUnitId = obj.organizationUnitId;
      }
      console.log('newFilter',newFilter);
      setQueryFilter(newFilter);
    },
    [queryFilter.filter],
  );

  const mapFunction = item => {
    return {
      ...item,
      firtDebt:
        (!isNaN(item.firtDebt) &&
          Number(item.firtDebt).toLocaleString('es-AR', { maximumFractionDigits: 0 })) ||
        0,
      secDebt:
        (!isNaN(item.secDebt) &&
          Number(item.secDebt).toLocaleString('es-AR', { maximumFractionDigits: 0 })) ||
        0,
      thirdDebt:
        (!isNaN(item.thirdDebt) &&
          Number(item.thirdDebt).toLocaleString('es-AR', { maximumFractionDigits: 0 })) ||
        0,
      forthDebt:
        (!isNaN(item.forthDebt) &&
          Number(item.forthDebt).toLocaleString('es-AR', { maximumFractionDigits: 0 })) ||
        0,
      fifthDebt:
        (!isNaN(item.fifthDebt) &&
          Number(item.fifthDebt).toLocaleString('es-AR', { maximumFractionDigits: 0 })) ||
        0,
      totalDebt:
        (!isNaN(item.totalDebt) &&
          Number(item.totalDebt).toLocaleString('es-AR', { maximumFractionDigits: 0 })) ||
        0,
    };
  };
  return (
    <>
      <CustomAppBar title={'Báo cáo công nợ quá hạn'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: ' 80px 20px 0 20px' }}>
        <div>
          <FilterReport
            isReport={true}
            onGetFilter={handleGetFilter}
            code="reportFinanceDebtOver"
            isDebtOver
          />
        </div>

        <ListPage
          apiUrl={`${API_REPORT_EXPIRED_FEE_DEBT}?${serialize(queryFilter)}`}
          customColumns={getColumns}
          columns={getColumns()}
          customRows={getRows || []}
          mapFunction={mapFunction}
          perPage={10}
          isReport={true}
          onLoad={handleLoadData}
          count={count}
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
          url={API_REPORT_EXPIRED_FEE_DEBT}
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
          <Grid container item style={{ width: '360px', padding: '0', gap: '0 30px' }}>
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
