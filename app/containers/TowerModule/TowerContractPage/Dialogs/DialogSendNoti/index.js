import React, { memo, useState, useEffect } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
} from '@material-ui/core';

function DialogSendNoti(props) {
  const { open, onClose, onSend, selected, code } = props;
  const [sendAll, setSendAll] = useState('0');

  useEffect(() => {
    return () => {
      setSendAll('0');
    };
  }, []);

  const handleRadioChange = event => {
    setSendAll(event.target.value);
  };

  const handleSend = () => {
    console.log(selected);
    if (sendAll == '0') {
      const body = { feeIds: selected && selected.map(item => item._id) };
      console.log('body', body);
      onSend(body);
    } else {
      const body = { sendAll };
      onSend(body);
    }
    onClose();
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Gửi thông báo</DialogTitle>
      <DialogContent>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup aria-label="noti" name="noti" value={sendAll} onChange={handleRadioChange}>
                <FormControlLabel value="0" control={<Radio />} label={`Áp dụng cho ${selected ? selected.length : 0} phí được chọn`} />
                {/* <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label={`Áp dụng cho tất phí được chọn`}
                /> */}
              </RadioGroup>
            </FormControl>
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

export default memo(DialogSendNoti);
