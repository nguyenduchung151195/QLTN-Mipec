import React, { useCallback, useState } from 'react';
import { Paper, Grid, Button } from '@material-ui/core';
import ListPage from 'containers/ListPage';
import CustomAppBar from 'components/CustomAppBar';

import moment from 'moment';

import FilterReport from '../../FilterReport';
import { API_STOCK_IMPORT_VALUE } from '../../../config/urlConfig';
import { serialize, exportTableToExcel, exportTableToExcelXSLX, tableToPDF } from '../../../helper';
import ExportTable from './ExportTable';

export default function ReportImportReportDetail(props) {
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
  const [count, setCount] = useState(0);
  const [exportExcel, setExportExcel] = useState(false);
  const [type, setType] = useState('PDF');
  const getColumns = () => {
    const viewConfig = [];
    viewConfig[0] = { name: 'supplierCode', title: 'Mã NCC', checked: true, width: 150 };
    viewConfig[1] = { name: 'supplier', title: 'Tên NCC', checked: true, width: 150 };
    viewConfig[2] = { name: 'address', title: 'Địa chỉ', checked: true, width: 150 };
    viewConfig[3] = { name: 'taxCode', title: 'Mã số thuế', checked: true, width: 150 };
    viewConfig[4] = { name: 'productId', title: 'Mã sản phẩm', checked: true, width: 150 };
    viewConfig[5] = { name: 'name', title: 'Tên sản phẩm', checked: true, width: 150 };
    viewConfig[6] = { name: 'amount', title: 'Số lượng', checked: true, width: 150 };
    viewConfig[7] = { name: 'price', title: 'Thành tiền', checked: true, width: 150 };
    //     viewConfig[8] = { name: 'createdByName', title: 'Tên người chỉnh sửa', checked: true, width: 150 };
    return viewConfig;
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

      if (obj.organizationUnitId !== '') {
        delete newFilter.organizationUnitId;
        newFilter.organizationUnitId = obj.organizationUnitId;
      }
      setQueryFilter(newFilter);
    },
    [queryFilter],
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

  const handleExportExcel = () => {
    setExportExcel(true);
    setType('EXCEL');
  };

  const handleCloseExcel = useCallback(
    () => {
      setExportExcel(false);
      if (type === 'PDF') {
        let pdf = tableToPDF(
          'excel-table-import-report',
          'reportImportReport',
          'Báo cáo tổng hợp nhập hàng',
        );
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel('excel-table-import-report', 'Báo cáo tổng hợp nhập hàng');
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
      <CustomAppBar title={'Báo cáo tổng hợp nhập hàng'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: ' 80px 20px 0 20px' }}>
        <div>
          <FilterReport
            onGetFilter={handleGetFilter}
            valueDate={queryFilter}
            isReport={true}
            code="reportImportReport"
            disableCustomer
          />
        </div>
        <ListPage
          apiUrl={`${API_STOCK_IMPORT_VALUE}?${serialize(queryFilter)}`}
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
          url={API_STOCK_IMPORT_VALUE}
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
    </>
  );
}
