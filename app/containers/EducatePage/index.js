/**
 *
 * EducatePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import messages from './messages';

import ListPage from 'components/List';
import { Add } from '@material-ui/icons';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectEducatePage from './selectors';
import { SwipeableDrawer } from 'components/LifetekUi';
import reducer from './reducer';
import saga from './saga';
import { API_SALE_POLICY , API_HRM_EDUCATE, API_HRM_educate } from '../../config/urlConfig';
import AddEducation from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/EducationsPage/components/AddEducation/index';
import { Tabs, Tab, Paper, TextField } from '../../components/LifetekUi';
import { makeSelectProfile } from '../Dashboard/selectors';
import { createEducate, updateEducate, deleteEducate } from './actions';
/* eslint-disable react/prefer-stateless-function */
export class EducatePage extends React.Component {
  state = {
    openDrawer: false,
    tab: 0,
    selectedEducate: null,
    openDialog: false,
  };

  addItem = () => (
    <Add style={{ color: 'white' }} onClick={() => {
      this.setState({ openDialog: true, selectedEducate: null });
    }}>
      Open Menu
    </Add>
  );
  handleDelete(ids) {

  }

  onSave = (data) => {
    console.log('aaaa')
    const { _id: educateId } = data;
    if (!educateId) {
      createEducate(data);
    } else {
      updateEducate(educateId, data);
    }
    console.log('data', data)
  }
  
  mapFunction = item => ({
    ...item,
    hrmEmployeeId: item['name'],
  });
  render() {
    const { tab, reload, openDialog, selectedEducate } = this.state;
     const { intl, educationPage, onCreateEducate, onUpdateEducate, onDeleteEducate, id: hrmEmployeeId} = this.props;
    // const {intl, educationPage, onCreateEducate, onUpdateEducate, onDeleteEducate, id: hrmEmployeeId } = this.props;
    // const { createEducateSuccess, updateEducateSuccess, deleteEducateSuccess } = educationPage;

    return (
      <div>
        <Tabs value={tab} onChange={(e, tab) => this.setState({ tab })}>
          <Tab value={0} label={intl.formatMessage(messages.manageeducate || { id: messages.manageeducate })} />
          <Tab value={1} label={intl.formatMessage(messages.training || { id: messages.training })} />
        </Tabs>
        {tab === 0 ? (
          <Paper>
            <ListPage
              code="EducateProcess"
              parentCode="hrm"
              onEdit={row => {
                this.setState({ openDialog: true, selectedEducate: row })
              }}
              onDelete={this.handleDelete}
              reload={reload}
              apiUrl={API_HRM_EDUCATE}
              settingBar={[this.addItem()]}
              mapFunction={this.mapFunction}
              disableAdd
              profile={this.props.profile}
            />
          </Paper>
        ) : null}
        {tab === 1 && <div>{alert('Bạn không có quyền truy cập chức năng này')}</div>}

        <Dialog maxWidth="md" scroll="body" open={this.state.openDrawer} onClose={() => this.setState({ openDrawer: false })}>
          <DialogTitle id="alert-dialog-title">Thông tin nhu cầu tuyển dụng</DialogTitle>

          <DialogContent>
            <TextField select InputLabelProps={{ shrink: true }} label="Chi nhánh" style={{ width: '49%' }} />
            <TextField select InputLabelProps={{ shrink: true }} label="Chờ duyệt" style={{ width: '49%', marginLeft: 5 }} />
            <TextField label="Bộ phận" style={{ width: '99%' }} />
            <TextField label="Vị trí cần tuyển" style={{ width: '99%' }} />
            <TextField select type="number" InputLabelProps={{ shrink: true }} label="Số lượng" style={{ width: '49%' }} />
            <div>
              <TextField type="date" label="Ngày Lập" InputLabelProps={{ shrink: true }} style={{ width: '49%' }} />
              <TextField type="date" label="Ngày Cần" InputLabelProps={{ shrink: true }} style={{ width: '49%', marginLeft: 5 }} />
              <TextField label="Độ tuổi" InputLabelProps={{ shrink: true }} style={{ width: '49%' }} />
              <TextField select label="Giới tính" InputLabelProps={{ shrink: true }} style={{ width: '49%', marginLeft: 5 }}>
                {' '}
                <MenuItem key="0" value={0}>
                  Nam
                </MenuItem>
                <MenuItem key="1" value={1}>
                  Nữ
                </MenuItem>
              </TextField>
              <TextField select type="number" label="Năm kinh nghiệm" InputLabelProps={{ shrink: true }} style={{ width: '49%' }} />
              <TextField label="Mức lương" InputLabelProps={{ shrink: true }} style={{ width: '49%', marginLeft: 5 }} />
              <TextField select label="Trình độ" style={{ width: '99%' }} />
              <TextField label="Ngành học" style={{ width: '99%' }} />
              <TextField label="Lý do tuyển dụng" style={{ width: '99%' }} />
              <TextField rows={4} label="Ghi chú" style={{ width: '99%' }} />
              <TextField
                label="File Upload"
                name="url"
                type="file"
                onChange={this.handleChangeInputFile}
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: '99%' }}
              />
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.onSaveFile} variant="outlined" color="primary" autoFocus style={{ marginRight: 5 }}>
              Lưu
            </Button>
            <Button onClick={this.onSaveFile} variant="outlined" color="secondary" autoFocus style={{ marginRight: 25 }}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
        <SwipeableDrawer anchor="right" onClose={() => this.setState({ openDialog: true, selectedEducate: null })} open={openDialog} width={window.innerWidth - 260}>
          <div>
            <AddEducation
              // hrmEmployeeId={hrmEmployeeId}
              code="EducateProcess"
              educate={selectedEducate}
              onSave={this.onSave}
              onClose={() => {
                this.setState({ openDialog: false, selectedEducate: null });
              }}
              profile={this.props.profile}
            />
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

EducatePage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  educatePage: makeSelectEducatePage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch, props) {
  return {
    dispatch,
    createEducate: data => dispatch(createEducate(data)),
    updateEducate: (hrmEmployeeId, data) => dispatch(updateEducate(hrmEmployeeId, data)),
    deleteEducate: (hrmEmployeeId, ids) => dispatch(deleteEducate(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'educatePage', reducer });
const withSaga = injectSaga({ key: 'educatePage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(EducatePage);
