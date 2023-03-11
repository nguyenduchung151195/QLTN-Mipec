import { Grid, Typography, Button,AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Info, Close } from '@material-ui/icons';
import React, { memo, useCallback, useEffect, useState } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import './style.css';
import CustomAppBar from 'components/CustomAppBar';

function EditHumanResources(props) {
  const { selectHumanResources, humanResource, roles, onClose, onSave } = props;
  const [localState, setLocalState] = useState({});

  useEffect(() => {
    if (selectHumanResources) {
      const newState = foundHumanResource(selectHumanResources);
      setLocalState({ ...newState })
    }
  }, [selectHumanResources])

  const foundHumanResource = (selectHumanResources) => {
    const { organizationUnit } = selectHumanResources;
    if (organizationUnit) {
      const foundHumanResource = humanResource.find(item => item.organizationUnit === organizationUnit);
      return foundHumanResource;
    }
    return {};
  }

  const handleChange = useCallback((e, index) => {
    const { roles } = localState;
    const newRoles = [...roles];
    newRoles[index] = {
      ...newRoles[index],
      value: e.target.value
    }
    setLocalState({ ...localState, roles: newRoles });
  }, [localState])

  const handleSave = () => {
    if (onSave) {
      onSave(localState);
    }
  }

  return (
    <React.Fragment>
      <Grid container spacing={16} style={{marginTop: '70px'}}>
        <Grid item xs={12}>
        {/* <AppBar className='HearderappBarDBNS'>
        <Toolbar>
          <IconButton
            // className={id !== 'add' ? '' : ''}
            className='BTNDBNSP'
            color="inherit"
            variant="contained"
            onClick={onClose}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
              Cập nhật Định biên nhân sự
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleSave}
          >
              LƯU

          </Button>
        </Toolbar>
      </AppBar> */}
      <CustomAppBar
          title={'Cập nhật Định biên nhân sự'}
          onGoBack={onClose}
          onSubmit={handleSave}
        />
        </Grid>
        <Grid item xs={6}>
          <CustomInputBase type="text" label="Tên phòng ban" value={localState.organizationUnitName} disabled />
        </Grid>
        {Array.isArray(localState.roles) && localState.roles.length > 0 ?
          (
            localState.roles.map((role, index) => {
              return (
                <Grid item xs={6}>
                  <CustomInputBase type="number" label={role.name} value={role.value} onChange={(e) => handleChange(e, index)} />
                </Grid>
              )
            })
          )
          : null
        }
        {/* <Grid item xs={12}>
          <Grid container spacing={16} justify="flex-end">
            <Grid item>
              <Button onClick={handleSave} variant="outlined" color="primary">Cập nhật</Button>
            </Grid>
            <Grid item>
              <Button onClick={onClose} variant="outlined" color="secondary">Hủy</Button>
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
    </React.Fragment>
  )
}

export default memo(EditHumanResources)