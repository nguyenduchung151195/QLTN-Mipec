import React, { memo, useState, useEffect } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, MenuItem } from '@material-ui/core';

function DialogSendMail(props) {
  const { open, onClose, templates, onSend, selected, data, code } = props;
  const [localState, setLocalState] = useState({ title: '', template: {}, fees: [] });
  const [viewConfig, setViewConfig] = useState([]);

  useEffect(() => {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const viewConfigCode = viewConfig.find(item => item.code === code);
    setViewConfig(viewConfigCode);
  }, [])

  const handleChange = e => {
    const {
      target: { value, name },
    } = e;
    if (e.target.checked) {
      if (e.target.name === 'isChooseFee') {
        setLocalState({ ...localState, isChooseFee: true, isFilterFee: false });
      } else if (e.target.name === 'isFilterFee') {
        setLocalState({ ...localState, isChooseFee: false, isFilterFee: true });
      }
    } else {
      setLocalState({ ...localState, [name]: value });
    }
  };

  const handleSend = () => {
    if (localState.isChooseFee) {
      const body = { ...localState, listContract: selected && selected.map(item => item.originItem), viewConfig };
      onSend(body);
    } else if (localState.isFilterFee) {
      const body = { ...localState, listContract: data, viewConfig };
      onSend(body);
    }
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Gửi mail</DialogTitle>
      <DialogContent>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <CustomInputBase type="text" label="Tiêu đề" name="title" value={localState.title} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <CustomInputBase select label="Biểu mẫu" name="template" onChange={handleChange} value={localState.template}>
              {Array.isArray(templates) && templates.length && templates.map(item => <MenuItem value={item}>{item.title}</MenuItem>)}
            </CustomInputBase>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox name="isChooseFee" checked={localState.isChooseFee} onChange={handleChange} />}
              label={`Áp dụng cho ${selected ? selected.length : 0} khách hàng được chọn`}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox name="isFilterFee" checked={localState.isFilterFee} onChange={handleChange} />}
              label="Áp dụng cho tất cả khách hàng"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSend}>Gửi</Button>
        <Button onClick={onClose}>Hủy</Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(DialogSendMail);
