import React, { useCallback, useState } from 'react';
import { Paper, Grid, Button } from '@material-ui/core';
import ListPage from 'containers/ListPage';

import moment from 'moment';

import FilterReport from '../../FilterReport';
import { API_REPORT_FEE_DEBT } from '../../../config/urlConfig';
import { serialize, exportTableToExcel, exportTableToExcelXSLX, tableToPDF } from '../../../helper';
import ExportTable from './ExportTable';
import CustomAppBar from 'components/CustomAppBar';

export default function ReportDebtGeneral(props) {
  const { onClose } = props;
  const INITIAL_QUERY = {
    filter: {
      periodStr: {
        $gte: moment().format('YYYY-MM'),
        $lte: moment().format('YYYY-MM'),
      },
      customerGroup: '',
      //   organizationUnitId: '',
    },
    limit: 10,
    skip: 0,
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [count, setCount] = useState(0);
  const [exportExcel, setExportExcel] = useState(false);
  const [type, setType] = useState('PDF');
 

  
  const getColumns = () => {
    const viewConfig = [];
    viewConfig[0] = { name: 'order', title: 'STT', checked: true, width: 80 };
    viewConfig[1] = { name: 'apartmentCode', title: 'Mã căn hộ ', checked: true, width: 150 };
    viewConfig[2] = { name: 'code', title: 'Mã khách hàng', checked: true, width: 150 };
    viewConfig[3] = { name: 'periodStr', title: 'Phiếu thông báo kỳ', checked: true, width: 150 };
    viewConfig[4] = { name: 'totalAmount', title: 'Số tiền', checked: true, width: 150 };
    viewConfig[5] = { name: 'totalPaid', title: 'Số đã thanh toán', checked: true, width: 150 };
    viewConfig[6] = { name: 'debt', title: 'Số tiền còn lại', checked: true, width: 150 };
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

  const handleGetFilter = useCallback(
    obj => {
      let newFilter = {
        filter: {
          periodStr: {
            $gte: obj.periodStr ? moment(obj.periodStr.gte, 'YYYYMM').format('YYYY-MM') : null,
            $lte: obj.periodStr ? moment(obj.periodStr.lte, 'YYYYMM').format('YYYY-MM') : null,
          },
        },
      };
      if (obj.group !== '') {
        delete newFilter.filter.customerGroup;
        newFilter.filter.customerGroup = obj.group && obj.group.value;
      }
      if (obj.organizationUnitId !== '') {
        delete newFilter.filter.organizationUnitId;
        newFilter.filter.organizationUnitId = obj.organizationUnitId;
      }
      setQueryFilter(newFilter);
    },
    [queryFilter.filter],
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
          'excel-table-general',
          'reportFinanceGeneralRevenue',
          'Báo cáo tổng hợp công nợ',
        );
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel('excel-table-general', 'Báo cáo tổng hợp công nợ');
      }
    },
    [type],
  );
  const handleExportPDF = () => {
    setExportExcel(true);
    setType('PDF');
  };

  const mapFunction = item => {
    return {
      ...item,
    };
  };
  return (
    <>
      <CustomAppBar title={'Báo cáo tổng hợp công nợ'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: ' 80px 20px 0 20px' }}>
        <div>
          <FilterReport
            isReport={true}
            onGetFilter={handleGetFilter}
            code="reportFinanceGeneralDebt"
          />
        </div>
        <ListPage
          apiUrl={`${API_REPORT_FEE_DEBT}?${serialize(queryFilter)}`}
          customColumns={getColumns}
          customRows={getRows || []}
          perPage={queryFilter.limit}
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
          filter={queryFilter}
          getRows={getRows}
          viewConfigs={getColumns()}
          url={API_REPORT_FEE_DEBT}
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
          <Grid container item  style={{ width: '360px', padding: '0', gap: '0 30px' }}>
            <Grid item xs={6} spacing={4} style={{ flex: 1 }}>
              <Button variant="outlined" style={{ width: '100%' }} color="primary" onClick={handleExportExcel}>
                XUẤT FILE EXCEL
              </Button>
            </Grid>
            <Grid item xs={6} spacing={4} style={{ flex: 1 }}>
              <Button variant="outlined" style={{ width: '100%' }} color="primary" onClick={handleExportPDF}>
                XUẤT FILE PDF
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
