/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * ReportHrmPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Public, AccountCircle, ViewModule } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';

import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectReportHrmPage from './selectors';
import { Grid, Typography, Paper } from '../../components/LifetekUi';
import { mergeData as mergeDataCatagory } from '../ConfigHrmPage/actions';
import { mergeData as mergeDataPersonnel } from '../PersonnelPage/actions';
import reducer from './reducer';
import saga from './saga';
import { mergeData, getApi } from './actions';
am4core.useTheme(Am4themesAnimated);
const ReportBox = props => (
  <div
    item
    md={3}
    spacing={4}
    style={{
      background: props.color,
      borderRadius: '3px',
      padding: '25px 10px',
      width: props.size ? props.size : '30%',
      position: 'relative',
    }}
  >
    <div style={{ padding: 5, zIndex: 999 }}>
      <Typography style={{ color: 'white' }} variant="h4">
        {props.number}
      </Typography>
      <Typography variant="body1">{props.text}</Typography>
    </div>
    <div
      className="hover-dashboard"
      style={{
        position: 'absolute',
        background: props.backColor,
        textAlign: 'center',
        padding: 'auto',
        display: 'block',
        textDecoration: 'none',
        width: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        cursor: 'pointer',
        zIndex: 555,
      }}
      onClick={props.openDetail}
    >
      Xem chi tiết
    </div>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.2,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 88,
        fontSize: '70px',
        padding: 5,
      }}
    >
      {props.icon}
    </div>
  </div>
);
const Report = props => (
  <div
    item
    md={3}
    spacing={4}
    style={{
      background: props.color,
      borderRadius: '3px',
      padding: '25px 10px',
      width: props.size ? props.size : '20%',
      position: 'relative',
      marginTop: 20,
    }}
  >
    <div style={{ padding: 5, zIndex: 999 }}>
      <Typography style={{ color: 'white' }} variant="h4">
        {props.number}
      </Typography>
      <Typography variant="body1">{props.text}</Typography>
    </div>
    <div
      className="hover-dashboard"
      style={{
        position: 'absolute',
        background: props.backColor,
        textAlign: 'center',
        padding: 'auto',
        display: 'block',
        textDecoration: 'none',
        width: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        cursor: 'pointer',
        zIndex: 555,
      }}
      onClick={props.openDetail}
    >
      Xem chi tiết
    </div>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.2,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 88,
        fontSize: '70px',
        padding: 5,
      }}
    >
      {props.icon}
    </div>
  </div>
);

/* eslint-disable react/prefer-stateless-function */
export class ReportHrmPage extends React.Component {
  openPersonnel = () => {
    this.props.history.push('/hrm/personnel');
  };

  openCatagory = () => {
    this.props.history.push('/hrm/configHrm');
    this.props.mergeDataCatagory({ tab: 1 });
  };

  openIncrease =()=>{
    this.props.history.push('/hrm/personnel');
    this.props.mergeDataPersonnel({ tab : 4 })
  }

  componentDidMount() {
    this.props.getApi();
  }

  render() {
    const { reportHrmPage } = this.props;
    const { personnel, catagory } = reportHrmPage;
    // console.log('ds', catagory);
    return (
      <div>
        <Paper style={{ marginTop: 25 }}>
          <Grid container md={12}>
            <Typography variant="h6" style={{ marginLeft: 15 }}>
              Quản lý thông tin nhân sự
            </Typography>
            <Grid style={{ display: 'flex', justifyContent: 'space-between' }} container>
              <ReportBox
                icon={<AccountCircle style={{ fontSize: 80 }} />}
                number={personnel ? personnel.totalEmployees : 0}
                text="Nhân sự đang làm việc"
                backColor="rgb(0, 126, 255)"
                color="linear-gradient(to right, #03A9F4, #03a9f4ad)"
                openDetail={this.openPersonnel}
              />
              <ReportBox
                style={{ marginTop: 15 }}
                icon={<Public style={{ fontSize: 80 }} />}
                number={personnel ? personnel.employeesInMonth : 0}
                text="Tăng mới trong tháng"
                backColor="#237f1c"
                color="linear-gradient(to right, rgb(76, 175, 80), rgba(76, 175, 80, 0.68))"
                openDetail={this.openIncrease}
              />
              <ReportBox
                icon={<Public style={{ fontSize: 80 }} />}
                number={personnel ? personnel.totalEmployeesQuitInMonth : 0}
                text="Nghỉ việc trong tháng"
                backColor="rgb(255, 51, 51)"
                color="linear-gradient(to right, #ff6666, rgba(255, 102, 102,0.79))"
                openDetail={this.openIncrease}
              />
              <Report
                style={{ marginTop: 15 }}
                icon={<ViewModule style={{ fontSize: 50 }} />}
                number={catagory.length ? catagory.length : 0}
                text="Quản lý danh mục"
                backColor="rgb(0, 126, 255)"
                color="linear-gradient(to right, #03A9F4, #03a9f4ad)"
                openDetail={this.openCatagory}
              />
            </Grid>
            <Typography variant="h6" style={{ marginLeft: 15 }}>
              Quản lý chấm công và tính lương
            </Typography>
          </Grid>
        </Paper>
      </div>
    );
  }
}

ReportHrmPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reportHrmPage: makeSelectReportHrmPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getApi: () => dispatch(getApi()),
    mergeDataCatagory: data => dispatch(mergeDataCatagory(data)),
    mergeDataPersonnel: data => dispatch(mergeDataPersonnel(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'reportHrmPage', reducer });
const withSaga = injectSaga({ key: 'reportHrmPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ReportHrmPage);
