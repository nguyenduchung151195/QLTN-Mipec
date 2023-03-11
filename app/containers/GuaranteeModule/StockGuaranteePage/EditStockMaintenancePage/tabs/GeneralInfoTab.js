/**
 *
 * GeneralInfoTab
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';


import { Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import { DatePicker } from 'material-ui-pickers';

import { AsyncAutocomplete } from 'components/LifetekUi';

import { TextField } from 'components/LifetekUi';
import SimpleListPage from '../../../../../components/List/SimpleListPage';
import { API_PERSONNEL, API_STOCK, API_USERS, GET_CONTRACT } from '../../../../../config/urlConfig';

const columns = [
  {
    name: 'code',
    title: 'Mã sản phẩm',
  },
  {
    name: 'name',
    title: 'Tên sản phẩm',
  },
  {
    name: 'contractID',
    title: 'Mã hợp đồng',
  },
  {
    name: 'supplierName',
    title: 'Nhà cung cấp',
  },
  {
    name: 'dateAcceptance',
    title: 'Ngày bắt đầu sử dụng',
  },
  {
    name: 'specification',
    title: 'Thông số kĩ thuật',
  },
  {
    name: 'note',
    title: 'Mô tả',
  }
]
const kanbanStatus = [
  {
    label: 'Yêu cầu',
    type: 0
  },
  {
    label: 'Đang bảo trì',
    type: 1
  },
  {
    label: 'Hoàn thành',
    type: 2
  },
  {
    label: 'Không hoàn thành',
    type: 3
  },

]

function KanbanStep(props) {
  const { currentStatus, onChange } = props;

  // eslint-disable-next-line eqeqeq
  const idx = kanbanStatus.findIndex(i => i.type == currentStatus);

  return (
    <Stepper style={{ background: 'transparent' }} activeStep={idx}>
      {kanbanStatus.map(item => (
        <Step onClick={() => onChange(item.type)} key={item.type}>
          <StepLabel style={{ cursor: 'pointer' }}>{item.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
function GeneralInfoTab(props) {


  const { stockMaintenance, onChange, onSubmit } = props;

  const { stock } = stockMaintenance;

  const [stockMaintenances, setStockMaintenances] = useState([])

  useEffect(() => {
    if (stock) {
      const value = stock;
      value.supplierName = value.supplierId && value.supplierId.name;
      setStockMaintenances([value]);
    }
    else {
      setStockMaintenances([]);
    }
  }, [stock])

  const handleChange = (name, value) => {
    if (name === 'stock') {
      if (value) {
        value.supplierName = value.supplierId && value.supplierId.name;
        setStockMaintenances([value]);
      } else {
        setStockMaintenances([]);
      }
    }
    onChange({
      ...stockMaintenance,
      [name]: value,
    })
  };


  const handleGoback = () => {
    props.history.goBack();
  }


  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <KanbanStep currentStatus={stockMaintenance.maintenanceStockStatus} onChange={value => handleChange('maintenanceStockStatus', value)} />
      </Grid>
      <Grid item xs={6}>
        <AsyncAutocomplete
          name="stock"
          label="Tên sản phẩm"
          // getOptionLabel="code"
          // filters={['code']}
          onChange={value => handleChange('stock', value)}
          url={API_STOCK}
          value={stock}
          error={!stock}
          required
        />
      </Grid>
      <Grid item xs={6}>
        <AsyncAutocomplete
          label="Chọn hợp đồng..."
          name="contract"
          value={stockMaintenance.contract || ''}
          onChange={value => handleChange('contract', value)}
          helperText={(stock && !stock.contract) ? 'Không có hợp dồng' : ''}
          url={GET_CONTRACT}
        />
      </Grid>
      <Grid item xs={6}>
        <DatePicker
          inputVariant="outlined"
          format="DD/MM/YYYY"
          value={stockMaintenance.startDate || null}
          fullWidth
          variant="outlined"
          label="Ngày bắt đầu"
          margin="dense"
          onChange={date => handleChange('startDate', date)}
        />
      </Grid>
      <Grid item xs={6} >
        <DatePicker
          inputVariant="outlined"
          format="DD/MM/YYYY"
          value={stockMaintenance.expectedCompleteDate || null}
          fullWidth
          variant="outlined"
          label="Thời gian hoàn thành dự kiến"
          margin="dense"
          onChange={date => handleChange('expectedCompleteDate', date)}
        />
      </Grid>
      <Grid md={6} item>
        <AsyncAutocomplete
          name="Chọn người phụ trách..."
          label="Người phụ trách"
          onChange={value => handleChange('employee', value)}
          url={API_USERS}
          value={stockMaintenance.employee || ''}
        />
      </Grid>
      <Grid item xs={12}>
        <SimpleListPage columns={columns} rows={stockMaintenances} />
      </Grid>
    </Grid>
  );
}

GeneralInfoTab.propTypes = {
  dispatch: PropTypes.func.isRequired,
};



export default GeneralInfoTab;
