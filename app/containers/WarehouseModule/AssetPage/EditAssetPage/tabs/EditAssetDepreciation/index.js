/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * EditAssetDepreciation
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { TextField } from 'components/LifetekUi';
import NumberFormat from 'react-number-format';
import { Grid } from '@material-ui/core';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function NumberFormatCustom(props) {
  const { inputRef, onChange, name, ...other } = props;
  return <NumberFormat
    {...other} getInputRef={inputRef}
    onValueChange={(values) =>
      onChange({
        target: {
          name: name,
          value: values.floatValue
        }
      })
    }
    thousandSeparator
    isNumericString
  />;
}

/* eslint-disable react/prefer-stateless-function */
class EditAssetDepreciation extends React.Component {
  state = {
    depreciationValue: '',
    assetValue: '',
    residualValue: '',
    KHDK: '',
    KHLK: '',
    isSubmit: false,
  };

  componentDidMount() {
    this.props.onRef ? this.props.onRef(this) : null;
  }

  componentDidUpdate(preProps) {
    const { asset } = this.props;
    if (asset && !this.state.isSubmit && preProps.asset !== asset) {
      this.setState({
        depreciationValue: asset.depreciationValue,
        assetValue: asset.assetValue,
        residualValue: asset.residualValue,
        KHDK: asset.KHDK,
        KHLK: asset.KHLK,
      })
    }
  }

  handleChangeInput = e => {
    console.log('====================================');
    console.log("name: ", e.target.name, " value: ", e.target.value);
    console.log(typeof e.target.value);
    this.setState({ [e.target.name]: parseFloat(e.target.value) });
  };

  getData = () => {
    this.setState({ isSubmit: true })

    return {
      depreciationValue: parseFloat(this.state.depreciationValue),
      assetValue: parseFloat(this.state.assetValue),
      residualValue: parseFloat(this.state.residualValue),
      KHDK: parseFloat(this.state.KHDK),
      KHLK: parseFloat(this.state.KHLK),
    }
  };

  render() {
    return (
      <div>
        <Grid item md={12} container spacing={24}>
          <Grid item md={6}>
            <TextField
              label="Giá trị tài sản"
              name="assetValue"
              fullWidth
              value={this.state.assetValue}
              onChange={this.handleChangeInput}
              type="text"

              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label="Giá trị khấu hao"
              name="depreciationValue"
              fullWidth
              value={this.state.depreciationValue}
              onChange={this.handleChangeInput}
              type="text"
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label="Khấu hao đầu kì"
              name="KHDK"
              fullWidth
              value={this.state.KHDK}
              onChange={this.handleChangeInput}
              type="text"

              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label="Giá trị còn lại của tài sản"
              name="residualValue"
              fullWidth
              value={this.state.residualValue}
              onChange={this.handleChangeInput}
              type="text"
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label="Khấu hao lũy kế"
              name="KHLK"
              fullWidth
              value={this.state.KHLK}
              onChange={this.handleChangeInput}
              type="text"
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Grid>
        </Grid>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }
}

EditAssetDepreciation.propTypes = {};

export default EditAssetDepreciation;
