import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Tab, Tabs } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectDocumentary from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData } from './actions';
import { SwipeableDrawer } from '../../components/LifetekUi';
import AddDocymentary from 'containers/AddDocumentary';
import { mergeData as mergeDataDocumentary } from '../AddDocumentary/actions';

const VerticalTabs = withStyles(() => ({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

const VerticalTab = withStyles(() => ({
  selected: {
    color: 'white',
    backgroundColor: `#2196F3`,
    borderRadius: '5px',
    boxShadow: '3px 5.5px 7px rgba(0, 0, 0, 0.15)',
  },
  root: {},
}))(Tab);
/* eslint-disable react/prefer-stateless-function */
export class Documentary extends React.Component {
  mergeData = data => {
    this.props.mergeData(data);
  };

  onDispatchGo = openDispatchGo => {
    this.props.mergeData({ openDispatchGo });
    this.props.mergeDataDocumentary({
      tab: 0,
    });
  };

  onDispatchArrived = openDispatchArrived => {
    this.props.mergeData({ openDispatchArrived });
    this.props.mergeDataDocumentary({
      tab: 1,
    });
  };
  render() {
    const { documentary } =this.props;
    const { openDispatchGo, id, openDispatchArrived } = documentary;
    return (
      <div>
        <VerticalTabs>
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Báo cáo thống kê công văn đi" onClick={this.onDispatchGo} />
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Báo cáo thống kê công văn đến" onClick={this.onDispatchArrived} />
        </VerticalTabs>
        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openDispatchGo: false })} open={openDispatchGo}>
          <div style={{ width: window.innerWidth - 300 }}>
            <AddDocymentary>
              id=
              {id}
            </AddDocymentary>
          </div>
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openDispatchArrived: false })} open={openDispatchArrived}>
          <div style={{ width: window.innerWidth - 300 }}>
            <AddDocymentary>
              id=
              {id}
            </AddDocymentary>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}
Documentary.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  documentary: makeSelectDocumentary(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    mergeDataDocumentary: data => dispatch(mergeDataDocumentary(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'documentary', reducer });
const withSaga = injectSaga({ key: 'documentary', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Documentary);
