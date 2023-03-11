/**
 *
 * GeneralInfoTab
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';


import { Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import { DatePicker } from 'material-ui-pickers';


import { API_ASSET } from 'config/urlConfig';
import { AsyncAutocomplete } from 'components/LifetekUi';

import { TextField } from 'components/LifetekUi';
import SimpleListPage from '../../../../../components/List/SimpleListPage';
import { API_PERSONNEL, API_USERS } from '../../../../../config/urlConfig';

const columns = [
  {
    name: 'code',
    title: 'Mã tài sản',
  },
  {
    name: 'name',
    title: 'Tên tài sản',
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


  const { assetGuarantee, onChange, onSubmit } = props;

  const { asset } = assetGuarantee;

  const [status, setStatus] = useState(0);

  const [filter] = useState({ level: 0 });

  const [contract, setContract] = useState(null);

  const [serial, setSerial] = useState('');

  const [startDate, setStartDate] = useState(null);

  const [expectedCompleteDate, setExpectedCompleteDate] = useState(null)

  const [employee, setEmployee] = useState(null)

  const [note, setNote] = useState('');

  const [assetGuarantees, setAssetGuarantees] = useState([])

  useEffect(() => {
    if (asset) {
      const value = asset;
      value.supplierName = value.supplierId && value.supplierId.name;
      setAssetGuarantees([value]);
    }
    else {
      setAssetGuarantees([]);
    }
  }, [asset])

  const handleChange = (name, value) => {
    if (name === 'asset') {
      if (value) {
        value.supplierName = value.supplierId && value.supplierId.name;
        if (value.contractID) {
          setContract(value.contractID);
        } else {
          setContract(null)
        }
        setAssetGuarantees([value]);
      } else {
        setAssetGuarantees([]);
      }
    }
    onChange({
      ...assetGuarantee,
      [name]: value,
    })
  };


  const handleGoback = () => {
    props.history.goBack();
  }


  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <KanbanStep currentStatus={assetGuarantee.guaranteeAssetStatus} onChange={value => handleChange('guaranteeAssetStatus', value)} />
      </Grid>
      <Grid item xs={6}>
        <AsyncAutocomplete
          name="asset"
          label="Tên tài sản"
          // getOptionLabel="code"
          filter={{ status: [1, 2] }}
          // filters={['code']}
          onChange={value => handleChange('asset', value)}
          url={API_ASSET}
          value={asset}
          error={!asset}
          required
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          name="Chọn hợp đồng..."
          fullWidth
          label="Hợp đồng"
          value={contract || ''}
          helperText={(asset && !asset.contractID) ? 'Không có hợp dồng' : ''}
          disabled
        />
      </Grid>
      <Grid item xs={6}>
        <DatePicker
          inputVariant="outlined"
          format="DD/MM/YYYY"
          value={assetGuarantee.startDate || null}
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
          value={assetGuarantee.expectedCompleteDate || null}
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
          value={assetGuarantee.employee || ''}
        />
      </Grid>
      <Grid item xs={12}>
        <SimpleListPage columns={columns} rows={assetGuarantees} />
      </Grid>
    </Grid>
  );
}

GeneralInfoTab.propTypes = {
  dispatch: PropTypes.func.isRequired,
};



export default GeneralInfoTab;
