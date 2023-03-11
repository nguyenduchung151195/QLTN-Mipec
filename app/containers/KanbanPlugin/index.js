/**
 *
 * KanbanPlugin
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Board from 'react-trello/dist';
import { withStyles } from '@material-ui/core/styles';
import { Button, Fab, TextField, Tooltip, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { Grid, Paper } from '@material-ui/core';
import { Add, Archive, Search, Close } from '@material-ui/icons';
import DatePicker from 'material-ui-pickers/DatePicker';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { injectIntl } from 'react-intl';
import makeSelectDashboardPage, { makeSelectProfile, makeSelectMiniActive } from '../../containers/Dashboard/selectors';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import dot from 'dot-object';
import CardKanban from '../../components/CardKanban';
// import NewCard from '../NewCard';
import CustomLaneHeader from './customLaneHeader';
import makeSelectKanbanPlugin from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import HOCCollectionDialog from '../../components/HocCollectionDialog';
import styles from './styles';
import { getItemsAct, getMoreItemsAct } from './actions';

import CustomInputBase from '../../components/Input/CustomInputBase';
import { clearWidthSpace, serialize } from '../../utils/common';
import request from '../../utils/request';
import { tableToExcel } from '../../helper';

const date = new Date();
/* eslint-disable react/prefer-stateless-function */
export class Kanban extends React.Component {
  state = {
    kanbanStatus: { lanes: [] },
    items: [],
    month: date,
    openCollectionDialog: false,
    viewConfig: {},
    editData: {},
    canReload: true,
    paging: {},
  };

  componentDidMount() {
    const { statusType = 'crmStatus' } = this.props;
    let listCrmStatus = [];
    listCrmStatus = JSON.parse(localStorage.getItem(statusType));
    //  if (this.props.path) {
    //    this.callApi(this.props);
    //  }
    // const { kanbanStatus } = this.state;
    let sortedKanbanStatus = [];
    if (this.props.code) {
      let listStatus = [];
      const currentStatusIndex = listCrmStatus.findIndex(d => d.code === this.props.code);
      if (currentStatusIndex !== -1) {
        listStatus = listCrmStatus[currentStatusIndex].data;
      } else {
        alert('Trạng thái kanban đã bị xóa');
      }
      const newPaging = {};
      listStatus.forEach(item => {
        newPaging[item._id] = {
          skip: 0,
          limit: 20,
        };
      });
      this.setState({ paging: newPaging }, () => {
        this.callApi(this.props);
      });

      const laneStart = [];
      const laneAdd = [];
      const laneSucces = [];
      const laneFail = [];
      listStatus.forEach(item => {
        switch (item.code) {
          case 1:
            laneStart.push({
              id: item._id,
              _id: item._id,
              title: item.name,
              name: item.name,
              color: item.color,
              style: {
                backgroundColor: 'transparent',
                color: '#fff',
                laneStyle: { color: item.color },
                borderLeft: '1px dashed #3f99bf',
                borderRadius: '0',
                margin: '0 10px !important',
                height: '75vh',
                padding: '0 10px 0 0  ',
                // boxShadow: '2px 2px 4px 0px rgba(0,0,0,0.3)',
              },
              cards: [],
              labelStyle: { color: item.color, enableTotal: this.props.enableTotal, enableAdd: this.props.enableAdd },
            });
            break;
          case 2:
            laneAdd.push({
              id: item._id,
              _id: item._id,
              title: item.name,
              name: item.name,
              color: item.color,
              style: {
                // width: 200,
                backgroundColor: 'transparent',
                color: '#fff',
                borderLeft: '1px dashed #3f99bf',
                borderRadius: '0',
                margin: '0 10px !important',
                height: '75vh',
                padding: '0 10px 0 0 ',
                // boxShadow: '2px 2px 4px 0px rgba(0,0,0,0.3)',
              },
              labelStyle: { color: item.color, enableTotal: this.props.enableTotal, enableAdd: this.props.enableAdd },
              cards: [],
              index: item.index,
            });
            break;

          case 3:
            laneSucces.push({
              id: item._id,
              _id: item._id,
              title: item.name,
              name: item.name,
              color: item.color,
              style: {
                // width: 200,
                backgroundColor: 'transparent',
                color: '#fff',
                borderLeft: '1px dashed #3f99bf',
                borderRadius: '0',
                margin: '0 10px !important',
                height: '75vh',
                padding: '0 10px 0 0 ',
                // boxShadow: '2px 2px 4px 0px rgba(0,0,0,0.3)',
              },
              labelStyle: {
                color: item.color,
                enableTotal: this.props.enableTotal,
                enableAdd: this.props.enableAdd,
              },
              cards: [],
            });
            break;

          case 4:
            laneFail.push({
              id: item._id,
              _id: item._id,
              title: item.name,
              name: item.name,
              color: item.color,
              style: {
                // width: 200,
                backgroundColor: 'transparent',
                color: '#fff',
                borderLeft: '1px dashed #3f99bf',
                borderRadius: '0',
                margin: '0 10px !important',
                height: '75vh',
                padding: '0 10px 0 0  ',
                // boxShadow: '2px 2px 4px 0px rgba(0,0,0,0.3)',
              },
              labelStyle: { color: item.color, enableTotal: this.props.enableTotal, enableAdd: this.props.enableAdd },
              cards: [],
            });
            break;

          default:
            break;
        }
      });
      sortedKanbanStatus = { lanes: [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail] };
    }

    this.setState({ kanbanStatus: JSON.parse(JSON.stringify(sortedKanbanStatus)) });
    if (this.props.isCloneModule) {
      const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
      const currentViewConfig = viewConfigLocalStorage.find(d => d.path === this.props.pathCrm);
      const { columns, others } = currentViewConfig.listDisplay.type.fields.type;
      let currentViewConfigColumns = [];
      if (others) {
        currentViewConfigColumns = [...columns, ...others];
      } else {
        currentViewConfigColumns = columns;
      }
      currentViewConfigColumns.sort((a, b) => a.order - b.order);
      this.setState({ viewConfig: currentViewConfigColumns });
    }
  }

  componentWillReceiveProps(props) {
    if (props.path && props.path !== this.props.path) {
      this.callApi(props);
    }
    if (props.successUpdate === true) {
      this.callApi(props);
    }
    if (props.typeContract && props.typeContract !== this.props.typeContract) {
      this.callApi(props);
    }
    if (props.reload === true && this.state.canReload) {
      this.callApi(props);
      this.setState({ canReload: false });
    }
    if (props.kanbanPlugin.allItems !== this.props.kanbanPlugin.allItems && props.kanbanPlugin.allItems !== undefined) {
      this.setState({ items: props.kanbanPlugin.allItems });
      const { kanbanStatus } = this.state;
      const newKanbanStatus = JSON.parse(JSON.stringify(kanbanStatus));
      newKanbanStatus.lanes.forEach((element, index) => {
        newKanbanStatus.lanes[index].cards = [];
      });
      const action = [];
      if (props.customActions && props.customActions.length > 0) {
        props.customActions.forEach(m => {
          action.push(m.action);
        });
      }
      props.kanbanPlugin.allItems.forEach(element => {
        const indexKanban = newKanbanStatus.lanes.findIndex(n => String(n.id) === String(element.kanbanStatus));
        if (indexKanban !== -1) {
          if (props.customContent && props.customContent.length > 0) {
            newKanbanStatus.lanes[indexKanban].cards.push({
              id: element._id,
              title: this.props.titleField ? element[this.props.titleField] : element.name ? element.name : element.performedBy.name,
              action,
              style: { color: newKanbanStatus.lanes[indexKanban].labelStyle.color },
              data: dot.dot(element),
              customContent: props.customContent,
              customActions: props.customActions || [],
            });
          } else {
            newKanbanStatus.lanes[indexKanban].cards.push({
              id: element._id,
              title: this.props.titleField ? element[this.props.titleField] : element.name ? element.name : element.performedBy.name,
              action,
              style: { color: newKanbanStatus.lanes[indexKanban].labelStyle.color },
              data: dot.dot(element),
              customActions: props.customActions || [],
            });
          }
        }
      });
      this.setState({ kanbanStatus: newKanbanStatus });
    }
  }
  componentDidUpdate(props, state) {
    if (this.props.filter !== props.filter || this.state.canReload) {
      this.callApi(props);
      this.state.canReload = false;
    }
  }

  onCardClick = cardId => {
    // this.props.callBack('kanban-click', { cardId });
    if (this.props.params) {
      this.props.history.push(`${this.props.params}/${cardId}`);
    }
    if (this.props.isCloneModule) {
      const current = this.state.items.find(n => String(n._id) === String(cardId));
      if (current) {
        this.setState({ openCollectionDialog: true, editData: current });
      }
    }
    if (this.props.isOpenSinglePage) {
      const current = this.state.items.find(n => String(n._id) === String(cardId));
      if (current) {
        this.props.callBack('openDialog', current);
      }
    }
  };

  handleSearch = e => {
    e.target.value = clearWidthSpace(e.target.value).trimStart();
    const search = e.target.value;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ search, canReload: true });
    }, 500);
  };

  handleLoadMore = (a, b) => {
    const currPaging = this.state.paging;
    const newColumnPaging = {
      ...currPaging[b],
      skip: currPaging[b].skip + currPaging[b].limit,
    };
    const newPaging = {
      ...currPaging,
      [b]: newColumnPaging,
    };
    this.setState({ paging: newPaging });
    let filter = { ...this.props.filter };
    if (this.state.search) filter.$or = this.props.filters.map(i => ({ [i]: { $regex: this.state.search, $options: 'gi' } }));
    let newFilter = { filter };
    // this.props.onLoadMore({
    //   filter: newFilter,
    //   path: this.props.path,
    //   paging: newColumnPaging,
    //   kanbanStatus: b,
    //   items: this.state.items
    // });
    return request(
      `${this.props.path}?${serialize({
        ...newFilter,
        filter: {
          ...newFilter.filter,
          kanbanStatus: b,
        },
        ...newColumnPaging,
      })}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    )
      .then(res => {
        const indexKanban = this.state.kanbanStatus.lanes.findIndex(n => String(n.id) === String(b));
        const style = { color: this.state.kanbanStatus.lanes[indexKanban].labelStyle.color };
        return res.data.map(element => {
          const action = [];

          if (this.props.customActions && this.props.customActions.length > 0) {
            this.props.customActions.forEach(m => {
              action.push(m.action);
            });
          }
          return {
            id: element._id,
            title: this.props.titleField ? element[this.props.titleField] : element.name ? element.name : element.performedBy.name,
            action,
            style,
            data: dot.dot(element),
            customContent: this.props.customContent,
            customActions: this.props.customActions || [],
          };
        });
      })
      .catch(e => console.log('load more error', e));
  };

  render() {
    const { kanbanStatus } = this.state;
    const { classes, intl } = this.props;
    const params = this.props.params.split('/');
    const code = params[0];
    //  const id = this.props.statusType
    const { nameCallBack } = this.props;
    return (
      <Paper>
        {/* <AppBar className={id !== 'add' ? classes.HearderappBarAddPersonel : classes.HearderappBarPersonelID}>
        <Toolbar>
          <IconButton
            // className={id !== 'add' ? '' : ''}
            className={id !== 'add' ? classes.BTNaddPersonel: classes.BTNPersonelID}
            color="inherit"
            variant="contained"
            onClick={() => this.props.history.goBack()}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            {id === 'add'
              ? `${intl && intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới' })}`
              : `${intl && intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={this.onSubmit}
          >
            {intl && intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
          </Button>
        </Toolbar>
      </AppBar> */}
        <div
          style={{
            width: '100%',
            // height: '650px',
            textAlign: 'center',
            padding: '30px',
            paddingTop: '10px',
            backgroundColor: 'transparent',
            whiteSpace: 'none !important',
          }}
        >
          <Grid container spacing={16}>
            {this.props.disableSearch ? null : (
              <Grid item xs={2} md={2}>
                <TextField
                  label="Tìm kiếm theo tên"
                  InputProps={{
                    startAdornment: <Search />,
                  }}
                  // value={this.state.search}
                  // name="search"
                  ref={input => (this.search = input)}
                  onChange={this.handleSearch}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </Grid>
            )}
            {!this.props.customFilter ? (
              <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale="vi-VN">
                <Grid item sm={4} md={2} style={{ textAlign: 'left' }}>
                  <DatePicker
                    // disablePast
                    views={['year', 'month']}
                    // keyboard
                    variant="outlined"
                    // disableOpenOnEnter
                    style={{ zIndex: 0 }}
                    keyboardIcon={<i className="far fa-clock fa-xs" />}
                    label="Chọn tháng"
                    maxDate={new Date()}
                    value={this.state.month}
                    onChange={this.handleChangeMonth}
                    okLabel="Xác nhận"
                    cancelLabel="Hủy"
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            ) : (
              <Grid item md={10} sm={10}>
                {this.props.customFilter}
              </Grid>
            )}
            {/* <Grid item style={{flex: '1 1 auto', textAlign: 'right'}}>
              <button onClick={() => {
                tableToExcel('excel-table-instance', 'W3C Example Table');
              }}><Tooltip title="Xuất dữ liệu">
                  <Fab color="primary" size="small">
                    <Archive  />
                  </Fab></Tooltip></button>
            </Grid> */}
          </Grid>
          {/* {console.log(this.props,'lll')} */}
          {kanbanStatus.lanes.length !== 0 ? (
            <Board
              style={{ backgroundColor: 'transparent', whiteSpace: 'pre-line' }}
              cardStyle={{ whiteSpace: 'pre-line' }}
              tagStyle={{ backgroundColor: 'red', whiteSpace: 'pre-line' }}
              data={kanbanStatus}
              laneDraggable={false}
              // draggable // cho phép kéo thả
              cardDraggable={this.state.putRole}
              editable // cho phép chỉnh sửa
              // cardDraggable
              onLaneScroll={this.handleLoadMore}
              onLaneAdd={this.onLaneAdd} // hàm thêm mới trạng thái
              onCardDelete={this.onCardDelete} //
              handleDragEnd={(cardId, targetLaneId, sourceLaneId) => {
                if (String(targetLaneId) !== String(sourceLaneId)) {
                  // const newKanbanStatus = kanbanStatus.lanes.findIndex(d => d.id === sourceLaneId);
                  const x = this.props.kanbanPlugin.allItems.find(n => String(n._id) === String(cardId));
                  // const y = Object.assign({}, x);
                  const codelanes = JSON.parse(localStorage.getItem('crmStatus')).find(x => x.code === this.props.code).data;
                  x.kanbanStatus = sourceLaneId;
                  //  this.props.callBack('kanban-dragndrop', x);
                  //  if (this.timeout) clearTimeout(this.timeout);
                  //    this.timeout = setTimeout(() => {
                  //      this.setState({ canReload: true });
                  //    }, 500);
                  console.log(this.props.code);
                  switch (this.props.code) {
                    case 'ST18':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        console.log('11111111111111');
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    case 'ST01':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    case 'ST02':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    case 'ST05':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        console.log('sssssss');
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    case 'ST07':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    case 'ST15':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    case 'ST19':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    case 'ST03':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    default:
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                  }
                }
              }}
              laneStyle={{ borderLeft: '1px dashed rgba(255,255,255,.55)', whiteSpace: 'none !important' }}
              hideCardDeleteIcon
              components={{
                // LaneHeader: () => (
                //   // <div />
                //   <Button
                //     onClick={() => {
                //       this.props.callBack('quick-add');
                //     }}
                //     style={{ color: 'white', width: '300px' }}
                //   >
                //     <Add />
                //   </Button>
                // ),
                Card: pro => (
                  <CardKanban
                    {...pro}
                    customClick={this.handleClickEvent}
                    role={this.props.dashboardPage.role.roles}
                    code={code}
                    callBack={(type, cardId) => {
                      if (this.props.isOpenSinglePage) {
                        if (type === 'openDialogBos' && !this.state.putRole) return;
                        const current = this.state.items.find(n => String(n._id) === String(cardId));
                        if (current) {
                          this.props.callBack(type, current);
                        }
                      }
                    }}
                  />
                ),
                LaneHeader: pro => {
                  return (
                    <CustomLaneHeader
                      {...pro}
                      onClick={() => this.props.callBack('quick-add')}
                      postRole={this.state.postRole}
                      count={this.props.kanbanPlugin.count}
                    />
                  );
                },
                AddCardLink: () => null,
              }}
              onCardClick={this.onCardClick}
            />
          ) : (
            ''
          )}
          {this.state.openCollectionDialog ? (
            <HOCCollectionDialog
              callBack={this.callBack}
              handleClose={() => {
                this.setState({ openCollectionDialog: false });
              }}
              dialogTitle=""
              editData={this.state.editData}
              isEditting
              viewConfig={this.state.viewConfig}
              open={this.state.openCollectionDialog}
              history={this.props.history}
              arrKanban={this.state.kanbanStatus.lanes ? this.state.kanbanStatus.lanes : []}
            />
          ) : (
            ''
          )}
        </div>
      </Paper>
    );
  }

  callApi = props => {
    if (props.path.indexOf('?') > -1) {
      const startDay = moment(this.state.month)
        .startOf('month')
        .format();
      const endDay = moment(this.state.month)
        .endOf('month')
        .format();
      const filterDay = {
        filter: {
          createdAt: {
            $gte: `${startDay}`,
            $lte: `${endDay}`,
          },
        },
      };

      let newFilter = filterDay;
      if (this.props.filter) newFilter = this.props.filter;
      this.props.onGetItems({
        filter: newFilter,
        path: props.path,
        paging: this.state.paging,
      });
    } else {
      const startDay = moment(this.state.month)
        .startOf('month')
        .format();
      const endDay = moment(this.state.month)
        .endOf('month')
        .format();
      const filterDay = {
        filter: {
          createdAt: {
            $gte: `${startDay}`,
            $lte: `${endDay}`,
          },
        },
      };
      let newFilter = filterDay;
      let filter = { ...this.props.filter };
      if (this.state.search) filter.$or = this.props.filters.map(i => ({ [i]: { $regex: this.state.search, $options: 'gi' } }));
      if (this.props.filter) newFilter = { filter };
      this.props.onGetItems({
        filter: newFilter,
        path: props.path,
        paging: this.state.paging,
      });
    }
  };

  handleClickEvent = (id, e) => {
    if (this.props.params) {
      this.props.history.push(`${this.props.params}/${id}?${e}`);
    }
  };

  handleChangeMonth = e => {
    this.setState({ month: e });
    if (this.props.path) {
      if (this.props.path.indexOf('?') > -1) {
        const startDay = moment(e)
          .startOf('month')
          .format();
        const endDay = moment(e)
          .endOf('month')
          .format();
        const filterDay = {
          filter: {
            createdAt: {
              $gte: `${startDay}`,
              $lte: `${endDay}`,
            },
          },
        };
        let newFilter = filterDay;
        if (this.props.filter) newFilter = this.props.filter;
        this.props.onGetItems({
          filter: newFilter,
          path: this.props.path,
          paging: this.state.paging,
        });
      } else {
        const startDay = moment(e)
          .startOf('month')
          .format();
        const endDay = moment(e)
          .endOf('month')
          .format();
        const filterDay = {
          filter: {
            createdAt: {
              $gte: `${startDay}`,
              $lte: `${endDay}`,
            },
          },
        };
        this.props.onGetItems({
          filter: filterDay,
          path: this.props.path,
          paging: this.state.paging,
        });
      }
    }
  };
}
Kanban.defaultProps = {
  filters: ['name'],
};

Kanban.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  kanbanPlugin: makeSelectKanbanPlugin(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetItems: body => {
      dispatch(getItemsAct(body));
    },
    onLoadMore: body => {
      dispatch(getMoreItemsAct(body));
    },
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'kanbanPlugin', reducer });
const withSaga = injectSaga({ key: 'kanbanPlugin', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(Kanban);
