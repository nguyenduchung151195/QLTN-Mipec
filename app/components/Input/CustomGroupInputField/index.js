import React, { useEffect, memo, useState, useCallback } from 'react';
import CustomInputField from '../CustomInputField';
import { Grid } from '../../LifetekUi';
import { removeVietnameseTones } from 'utils/common';

function CustomGroupInputField(props) {
  const { code, value, onChange, columnPerRow = 2, source } = props;
  const [listViewConfig, setListViewConfig] = useState([]);
  const [localState, setLocalState] = useState({});

  useEffect(
    () => {
      setLocalState({ ...(value || {}) });
    },
    [value],
  );

  useEffect(() => {
    if (code) {
      const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
      const currentViewConfig = listViewConfig.find(item => item.code === code) || {};
      const { listDisplay = {} } = currentViewConfig;
      const { type = {} } = listDisplay;
      const { fields = {} } = type;
      const { type: childType = {} } = fields;
      const others = childType[source || 'others'] || [];
      const filteredOthers = others.filter(item => item.checkedShowForm);
      setListViewConfig(filteredOthers);
    }
  }, [source]);

  const handleChange = useCallback(
    e => {
      const newLocalState = {
        ...localState,
        [e.target.name]: e.target.value,
      };

      if (source === 'fileColumns') {
        const found = listViewConfig.find(c => {
          const name = c.name.replace('others.', '');
          if (name === e.target.name) {
            return true;
          }
          return false;
        });
        if (found && found.type === 'text') {
          newLocalState[`${e.target.name}_en`] = removeVietnameseTones(e.target.value);
        }
      }
      setLocalState(newLocalState);
      if (onChange) {
        onChange(newLocalState);
      }
    },
    [localState],
  );

  return (
    <>
      <Grid spacing={8}>
        {listViewConfig.map(item => (
          <Grid item xs={12 / columnPerRow}>
            <CustomInputField
              value={localState[item.name.replace('others.', '')]}
              name={item.name.replace('others.', '')}
              type={item.type}
              label={item.title}
              configType="crmSource"
              configCode={item.code}
              configId={item.id}
              onChange={handleChange}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default memo(CustomGroupInputField);
