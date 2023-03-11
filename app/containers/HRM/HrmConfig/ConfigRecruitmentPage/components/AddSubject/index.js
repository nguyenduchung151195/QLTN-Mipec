import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import { Paper, Typography, Swipe, Grid, FileUpload, AsyncAutocomplete } from 'components/LifetekUi';
import { API_QUESTION } from 'config/urlConfig';

/* eslint-disable react/prefer-stateless-function */
function AddSubject(props) {
  const [localState, setLocalState] = useState({});

  const { onSave, onClose, subjectData } = props;

  useEffect(
    () => {
      setLocalState({ ...subjectData });
    },
    [subjectData],
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
        <CustomInputBase label="Mã môn thi" name="code" value={localState.code} onChange={handleInputChange} />
      </Grid>

      <Grid item md={6}>
        <CustomInputBase label="Tên môn thi" name="name" value={localState.name} onChange={handleInputChange} />
      </Grid>

      {/* <Grid item md={3}>
        <CustomInputBase label="Thang điểm" name="scoreScale" value={localState.scoreScale} onChange={handleInputChange} />
      </Grid> */}

      <Grid item md={3}>
        <CustomInputBase label="Điểm cần đạt" name="scored" value={localState.scored} onChange={handleInputChange} />
      </Grid>

      <Grid item md={3}>
        <CustomInputBase label="Thứ tự" name="num" value={localState.num} onChange={handleInputChange} />
      </Grid>

      <Grid item md={12}>
        <AsyncAutocomplete
          isMulti
          label={'Chọn câu hỏi'}
          name="question"
          value={localState.question}
          onChange={handleQuestionListChanged}
          url={API_QUESTION}
        />
      </Grid>

      <Grid item md={12}>
        <CustomInputBase label="Mô tả" name="note" value={localState.note} onChange={handleInputChange} mutiline rows={5} />
      </Grid>

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

export default memo(AddSubject);
