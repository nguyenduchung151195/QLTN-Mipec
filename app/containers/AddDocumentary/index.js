/**
 *
 * AddDocumentary
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Buttons from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddDocumentary from './selectors';
import reducer from './reducer';
import {Paper} from '@material-ui/core';
import saga from './saga';
import { Grid } from '../../components/LifetekUi';
import { changeSnackbar } from '../Dashboard/actions';
import { mergeData, getData } from './actions';

import DispatchArrived from './DispatchArrived';
import DispatchGo from './Dispatchgo'

 class AddDocumentary extends React.Component {
  componentDidMount() {
    this.props.getData();
  }

  render() {
    const { tab , onClose } = this.props;
    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'}>
        {this.props.children}
      </Buttons>
    );
    return (
      <Paper style={{marginTop: 50, padding: 20} }>
        <Grid  >
        {tab === 0 ? (
          <DispatchGo onClose={onClose} />
          ) : null}
          {tab === 1 ? (
          <DispatchArrived onClose={onClose}/>
          ) : null}
        </Grid>
      </Paper>
    );
  }
}
AddDocumentary.propTypes = {
    dispatch: PropTypes.func.isRequired,
  };
  
  const mapStateToProps = createStructuredSelector({
    addDocumentary: makeSelectAddDocumentary(),
  });
  
  function mapDispatchToProps(dispatch) {
    return {
      dispatch,
      mergeData: data => dispatch(mergeData, getData(data)),
      onChangeSnackbar: obj => {
        dispatch(changeSnackbar(obj));
      },
      getData: () => dispatch(getData()),
    };
  }
  
  const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
  );
  
  const withReducer = injectReducer({ key: 'addDocumentary', reducer });
  const withSaga = injectSaga({ key: 'addDocumentary', saga });
  
  export default compose(
    withReducer,
    withSaga,
    withConnect,
  )(AddDocumentary);
  