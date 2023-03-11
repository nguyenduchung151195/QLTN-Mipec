/**
 *
 * PersonnelPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import messages from './messages';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectPersonnelPage from './selectors';
import AddPersonnelPage from '../AddPersonnelPage/Loadable';
// eslint-disable-next-line import/no-unresolved
import FluctuationsPage from '../FluctuationsPage/Loadable';
import HumanResourcesPage from '../HRM/HrmEmployee/HumanResourcesPage/Loadable';
import TakeLeaveManagePage from '../HRM/HrmEmployee/TakeLeaveManagerPage/Loadable'
import reducer from './reducer';
import saga from './saga';
import { Tabs, Tab } from '../../components/LifetekUi';
import  {mergeData}  from './actions'

/* eslint-disable react/prefer-stateless-function */
export class PersonnelPage extends React.Component {
  // state = {
  //   tab: 0,
  // };

  render() {
    // const { tab } = this.state;
    const { intl } = this.props;
    const { tab } = this.props.personnelPage;

    return (
      <div>
        <Helmet>
          <title>PersonnelPage</title>
          <meta name="description" content="Description of PersonnelPage" />
        </Helmet>
        <div>
          <Tabs value={tab} onChange={(e, tab) => {this.props.mergeData({ tab }) ;}}>
            <Tab value={0} label={intl.formatMessage(messages.hrrecords)} />
            <Tab value={1} label={intl.formatMessage(messages.humanresources)} />
            <Tab value={2} label={intl.formatMessage(messages.yearlicensemanagement)} />
            <Tab value={3} label={intl.formatMessage(messages.hrreports)} disabled />
            <Tab value={4} label={intl.formatMessage(messages.increasesordecreases)} />
          </Tabs>
          {tab === 0 ? <AddPersonnelPage propsAll={this.props} /> : null}
          {tab === 4 ? <FluctuationsPage /> : null}
          {tab === 1 ? <HumanResourcesPage /> : null}
          {tab === 2 ? <TakeLeaveManagePage /> : null}
          {tab === 3 && <div>{alert('Bạn không có quyền truy cập chức năng này')}</div>}
        </div>
      </div>
    );
  }
}

PersonnelPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  personnelPage: makeSelectPersonnelPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'personnelPage', reducer });
const withSaga = injectSaga({ key: 'personnelPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(PersonnelPage);
