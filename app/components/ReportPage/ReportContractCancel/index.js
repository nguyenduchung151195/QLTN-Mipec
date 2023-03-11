import React, { useState, useCallback } from 'react';

import { API_CONTACT_CANCEL } from '../../../config/urlConfig';
import ListPage from 'containers/ListPage';
import FilterReport from '../../FilterReport';
import { Grid, Paper, Button } from '@material-ui/core';
import { serialize, tableToPDF, exportTableToExcel, exportTableToExcelXSLX } from '../../../helper';
import ExportTable from './ExportTable';
import moment from 'moment';
import CustomAppBar from 'components/CustomAppBar';

export default function ReportContractCancel(props) {
  const { onClose } = props;
  const INITIAL_QUERY = {
    year: moment().format('YYYY'),
    skip: 0,
    limit: 10,
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [exportExcel, setExportExcel] = useState(false);
  const [count, setCount] = useState(0);
  const [type, setType] = useState('PDF');

  const handleGetFilter = useCallback(
    obj => {
      console.log('obj', obj);
      let newFilter = {
        year: moment().format('YYYY'),
      };
      if (obj.year !== '') {
        delete newFilter.year;
        newFilter.year = obj.year;
      }

      setQueryFilter({
        ...queryFilter,
        year: obj.year,
      });
    },
    [queryFilter.filter],
  );
  const getColumns = () => {
    const viewConfig = [];
    viewConfig[0] = { name: 'name', title: 'Tên hợp đồng', checked: true, width: 150 };
    viewConfig[1] = { name: 'code', title: 'Mã hợp đồng', checked: true, width: 150 };
    viewConfig[2] = { name: 'supplierId', title: 'Đối tác', checked: true, width: 150 };
    viewConfig[3] = { name: 'typeContract', title: 'Loại hợp đồng', checked: true, width: 150 };
    viewConfig[4] = { name: 'contractSigningDate', title: 'Ngày ký', checked: true, width: 150 };
    viewConfig[5] = { name: 'expirationDay', title: 'Ngày kết thúc', checked: true, width: 150 };
    viewConfig[6] = { name: 'updatedAt', title: 'Ngày hủy hợp đồng', checked: true, width: 150 };

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
    console.log('queryFilter', queryFilter);
    const newQuery = {
      year: queryFilter.year,
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
      let pdf = tableToPDF('excel-table-contact-cancel', 'reportGetContractCancel', 'Báo cáo danh sách các hợp đồng hủy');
      let win = window.open('', '', 'height=700,width=700');
      win.document.write(pdf);
      win.document.close(); // CLOSE THE CURRENT WINDOW.
      win.print();
    } else {
      exportTableToExcel('excel-table-contact-cancel', 'Báo cáo danh sách các hợp đồng hủy', '');
    }
  };
  const handleExportPDF = () => {
    setExportExcel(true);
    setType('PDF');
  };
  const mapFunction = item => {
    return {
      ...item,
      typeContract: item.typeContract === '1' ? 'HỢP ĐỒNG KH' : 'HỢP ĐỒNG NCC',
      supplierId: item.typeContract === '2' ? item.supplierId && item.supplierId.name : item.customerId && item.customerId.name,
    };
  };
  return (
    <>
      <CustomAppBar title={'Báo cáo danh sách các hợp đồng hủy'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: ' 80px 20px 0 20px' }}>
        <div>
          <FilterReport
            queryFilter={queryFilter}
            isReport={true}
            onGetFilter={handleGetFilter}
            code="reportGetContractCancel"
            disableDepartmentAndEmployee={true}
            disableCustomer={true}
            isContract
          />
        </div>
        <ListPage
          // apiUrl={`${API_CONTACT_CANCEL}?${serialize(queryFilter)}`}
          apiUrl={`${API_CONTACT_CANCEL}?${serialize(queryFilter)}`}
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
          url={`${API_CONTACT_CANCEL}`}
          open={exportExcel}
          onClose={handleCloseExcel}
        />
        <Grid container row spacing={8} alignItems="center" justify="flex-end" style={{ marginTop: '20px', padding: '0 15px 30px 0' }}>
          <Grid container item  style={{ width: '360px', padding: '0', gap: '0 30px' }}>
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
      </Paper>
    </>
  );
}
