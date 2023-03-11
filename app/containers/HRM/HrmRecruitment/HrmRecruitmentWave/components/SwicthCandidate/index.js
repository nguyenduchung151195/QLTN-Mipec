import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import { Paper, Typography, Swipe, Grid, FileUpload, AsyncAutocomplete } from 'components/LifetekUi';

/* eslint-disable react/prefer-stateless-function */
function SwicthCandidate(props) {
  const [localState, setLocalState] = useState({});

  const { onSave, onClose, switchData } = props;

  useEffect(
    () => {
      setLocalState({ ...switchData });
    },
    [switchData],
  );

  const handleInputChange = useCallback(
    e => {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    },
    [localState],
  );

  const handleQuestionListChanged = e => {
    setLocalState({ ...localState, question: e });
  };

  return (
    <Grid container spacing={16}>
      <Grid item md={6}>
        <CustomInputBase label="Số lượng" name="count" type='number' value={localState.count} onChange={handleInputChange} />
      </Grid>

      {/* <Grid item md={3}>
        <CustomInputBase label="Thang điểm" name="scoreScale" value={localState.scoreScale} onChange={handleInputChange} />
      </Grid> */}
      {props.disableScores ? null :
       <Grid item md={6}>
       <CustomInputBase label="Điểm cần đạt" name="scores" type='number'  value={localState.scores} onChange={handleInputChange} />
     </Grid>}
     


      <Grid container spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton color="primary" onClick={e => onSave(localState)}>
            Lưu
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={onClose}>
          hủy
          </CustomButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default memo(SwicthCandidate);
