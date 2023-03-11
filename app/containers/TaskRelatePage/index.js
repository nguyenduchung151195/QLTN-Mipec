/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * TaskRelatePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import injectSaga from 'utils/injectSaga';
import Button from '@material-ui/core/Button';
import injectReducer from 'utils/injectReducer';
import Buttons from 'components/CustomButtons/Button';
import { MenuItem, Modal, Avatar } from '@material-ui/core';
import {
  Add,
  Work,
  PersonPin,
  LocalLibrary,
  IndeterminateCheckBox,
  Cancel,
  Theaters,
  SlowMotionVideo,
  AssignmentTurnedIn,
  PauseCircleFilled,
  // EventNote,
  ViewList,
} from '@material-ui/icons';
import ListPage from 'components/List/ListTask';
import { injectIntl } from 'react-intl';
import AddTask from 'containers/AddProjects';
import { taskStatusArr } from 'variable';
import CalendarContainer from '../CalendarContainer';
import { Paper, Grid, SwipeableDrawer, TextField, Autocomplete } from '../../components/LifetekUi';
import Planner from '../../components/LifetekUi/Planner/TaskKanban';
import { serialize } from '../../utils/common';
import { API_TASK_PROJECT } from '../../config/urlConfig';
import { mergeData, handleChange, getTaskRelatePage, postTask } from './actions';
import makeSelectTaskRelatePage from './selectors';
import makeSelectDashboardPage from '../Dashboard/selectors';
import reducer from './reducer';
import saga from './saga';
import Gantt from '../Gantt';
import messages from './messages';

const Process = props => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'no-wrap',
      height: 22,
      width: '100%',
      position: 'relative',
    }}
  >
    <div
      style={{
        width: `${props.value}%`,
        background: `${props.color2}`,
        height: '100%',
        animation: '2s alternate slidein',
      }}
    />
    <div
      style={{
        width: `${100 - props.value}%`,
        background: `${props.color}`,
        height: '100%',
        animation: '2s alternate slidein',
      }}
    />
    <span style={{ fontSize: 13, marginLeft: 3, color: '#e0e0e0', position: 'absolute' }}>
      {props.progress}
      %- {props.time}
    </span>
  </div>
);
export class TaskRelatePage extends React.Component {
  state = {
    tab: 0,
    openDialogProgress: false,
    openDialogFile: false,
    tabAll: 0,
  };

  componentDidMount() {
    this.props.getTaskRelatePage();
    const bussines = this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES')
      .data;
    const extra = this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'EXTRA').data;
    const hideTask = extra.find(elm => elm.name === 'hide').data;
    const protectedTask = extra.find(elm => elm.name === 'protected').data;
    const publicTask = extra.find(elm => elm.name === 'public').data;
    const openTask = extra.find(elm => elm.name === 'open').data;

    const taskManager = bussines.find(elm => elm.name === 'taskManager').data;
    const taskInCharge = bussines.find(elm => elm.name === 'inCharge').data;
    const taskSupport = bussines.find(elm => elm.name === 'support').data;
    const taskViewable = bussines.find(elm => elm.name === 'viewable').data;
    const taskJoin = bussines.find(elm => elm.name === 'join').data;

    const { profile } = this.props.dashboardPage;
    this.props.mergeData({ dashboard: 0 });

    if (this.props.taskRelatePage.dashboard === 0) {
      this.props.mergeData({
        filterAll: {
          isProject: false,
          $or: [
            { createdBy: profile._id },
            this.checkItem({ type: hideTask.view === true ? 2 : '' }),
            this.checkItem({ type: protectedTask.view === true ? 1 : '' }),
            this.checkItem({ type: publicTask.view === true ? 4 : '' }),
            this.checkItem({ type: openTask.view === true ? 3 : '' }),
            this.checkItem({
              taskManager: taskManager.view === true ? { $in: [profile._id] } : '',
            }),
            this.checkItem({ inCharge: taskInCharge.view === true ? { $in: [profile._id] } : '' }),
            this.checkItem({ join: taskJoin.view === true ? { $in: [profile._id] } : '' }),
            this.checkItem({ support: taskSupport.view === true ? { $in: [profile._id] } : '' }),
            this.checkItem({ viewable: taskViewable.view === true ? { $in: [profile._id] } : '' }),
          ],
        },
      });
    }
  }

  handleTab(tab) {
    this.setState({ tab });
  }

  handleTabIndex(tabIndex) {
    this.props.mergeData({ tabIndex });
  }

  handletabAll(tabAll) {
    this.setState({ tabAll });
  }

  addItem = () => (
    <Add
      style={{ color: 'white' }}
      onClick={() => this.props.mergeData({ openDrawer2: true, taskType: 1 })}
    >
      Open Menu
    </Add>
  );

  addItemkRevenue = () => (
    <Add
      style={{ color: 'white' }}
      onClick={() => this.props.mergeData({ openDrawer2: true, taskType: 2, hiden: 1 })}
    >
      Open Menu
    </Add>
  );

  addItemPersonal = () => (
    <Add
      style={{ color: 'white' }}
      onClick={() => this.props.mergeData({ openDrawer2: true, taskType: 3, hiden: 0 })}
    >
      Open Menu
    </Add>
  );

  // công việc k tạo doanh thu
  mapFunctionTaskRevenue = (item, index) => {
    const roleCode = this.props.dashboardPage.role.roles.find(
      item => item.codeModleFunction === 'Task',
    );
    const roleModule = roleCode ? roleCode.methods : [];
    console.log('item', item);
    return {
      ...item,
      name:
        (roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow === true ? (
          <button
            style={{ color: '#0b99e0', cursor: 'pointer' }}
            onClick={() => this.props.mergeData({ openDrawer2: true, id: item._id })}
          >
            {item.name}
          </button>
        ) : (
          <button
            style={{ color: '#0b99e0', cursor: 'pointer' }}
            onClick={() => alert('Bạn không có quyền cho chức năng này')}
          >
            {item.name}
          </button>
        ),
      index: index + 1,
      taskStatus: taskStatusArr[item.taskStatus - 1],
      customer: item['customer.name'],
      createdBy: item['createdBy.name'],
      progress: (
        <Process
          value={item.progress}
          progress={item.progress}
          color={this.colorProgress(item)}
          time={this.ProcessTask(item)}
          color2={this.color2Progress(item)}
        />
      ),
      // planApproval:
      //   item.planApproval === 1 ? (
      //     <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã duyệt kế hoạch</p>
      //   ) : child && child.planApproval === 1 ? (
      //     <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã duyệt kế hoạch</p>
      //   ) : (
      //     <p style={{ color: '#ed0000', fontWeight: 'bold' }}>Chưa duyệt kế hoạch</p>
      //   ),
      // acceptApproval:
      //   item.acceptApproval === 1 ? (
      //     <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã duyệt nghiệm thu </p>
      //   ) : child && child.acceptApproval === 1 ? (
      //     <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã duyệt nghiệm thu</p>
      //   ) : (
      //     <p style={{ color: '#ed0000', fontWeight: 'bold' }}>Chưa duyệt nghiệm thu</p>
      //   ),
      avatar: <Avatar src={item.avatar} />,
      priority:
        item.priority === 1
          ? 'Rất cao'
          : item.priority === 2
            ? 'Cao'
            : item.priority === 3
              ? 'Trung bình'
              : item.priority === 4
                ? 'Thấp'
                : 'Rất thấp',
      type:
        item.type === 1
          ? 'Nhóm bảo mật '
          : item.type === 4
            ? 'Nhóm công khai'
            : item.type === 2
              ? 'Nhóm ẩn'
              : 'Nhóm mở rộng',
      taskType:
        item.taskType === 1
          ? 'Công việc'
          : item.taskType === 2
            ? 'Công việc không doanh thu'
            : 'Công việc cá nhân',
    };
  };

  ProcessTask(item) {
    let date;
    let total;
    if (item.finishDate) {
      if (new Date(item.finishDate) > new Date(item.endDate)) {
        date = ((new Date(item.finishDate) - new Date(item.endDate)) / 3600000).toFixed(2);
        const date2 = Number(date) / 24;
        const date3 = Math.floor(date2);
        const date4 = Number(((date2 - date3) * 24).toFixed());
        total = `Trễ ${date3} ngày ${date4} giờ`;
      } else {
        date = ((new Date(item.endDate) - new Date(item.finishDate)) / 3600000).toFixed(2);
        const date2 = Number(date) / 24;
        const date3 = Math.floor(date2);
        const date4 = Number(((date2 - date3) * 24).toFixed());
        total = `Sớm ${date3} ngày ${date4} giờ`;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (new Date(item.endDate) > new Date()) {
        date = ((new Date(item.endDate) - new Date()) / 3600000).toFixed(2);
        const date2 = Number(date) / 24;
        const date3 = Math.floor(date2);
        const date4 = Number(((date2 - date3) * 24).toFixed());
        total = `Còn ${date3} ngày ${date4} giờ`;
      } else {
        date = ((new Date() - new Date(item.endDate)) / 3600000).toFixed(2);
        const date2 = Number(date) / 24;
        const date3 = Math.floor(date2);
        const date4 = Number(((date2 - date3) * 24).toFixed());
        total = `Quá ${date3} ngày ${date4} giờ`;
      }
    }

    return total;
  }

  colorProgress(item) {
    let color;
    if (item.finishDate) {
      color = new Date(item.finishDate) > new Date(item.endDate) ? '#fa0522' : '#009900';
    } else {
      color = new Date(item.endDate) >= new Date() ? '#056ffa' : '#f00707';
    }

    return color;
  }

  color2Progress(item) {
    let color2;
    if (item.finishDate) {
      color2 = new Date(item.finishDate) > new Date(item.endDate) ? '#f28100' : '#009900';
    } else {
      color2 = new Date(item.endDate) >= new Date() ? '#05c9fa' : '#6e1305';
    }

    return color2;
  }

  mapFunctionRelate = (item, index) => {
    const roleCode = this.props.dashboardPage.role.roles.find(
      item => item.codeModleFunction === 'Task',
    );
    const roleModule = roleCode ? roleCode.methods : [];
    return {
      ...item,
      name:
        (roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow === true ? (
          <button
            style={{ color: '#0b99e0', cursor: 'pointer' }}
            onClick={() => this.props.mergeData({ openDrawer2: true, id: item._id })}
          >
            {item.name}
          </button>
        ) : (
          <button
            style={{ color: '#0b99e0', cursor: 'pointer' }}
            onClick={() => alert('Bạn không có quyền cho chức năng này')}
          >
            {item.name}
          </button>
        ),
      updatedBy: item['updatedBy.name'],
      createdBy: item['createdBy.name'],
      index: index + 1,
      customer: item['customer.name'],
      taskStatus: taskStatusArr[item.taskStatus - 1],
      template: item.templateName,
      progress: (
        <Process
          value={item.progress}
          progress={item.progress}
          color={this.colorProgress(item)}
          time={this.ProcessTask(item)}
          color2={this.color2Progress(item)}
        />
      ),
      avatar: <Avatar src={item.avatar} />,
      priority:
        item.priority === 1
          ? 'Rất cao'
          : item.priority === 2
            ? 'Cao'
            : item.priority === 3
              ? 'Trung bình'
              : item.priority === 4
                ? 'Thấp'
                : 'Rất thấp',
      type:
        item.type === 1
          ? 'Nhóm bảo mật'
          : item.type === 4
            ? 'Nhóm công khai'
            : item.type === 2
              ? 'Nhóm ẩn'
              : 'Nhóm mở rộng',
      taskType:
        item.taskType === 1
          ? 'Công việc'
          : item.taskType === 2
            ? 'Công việc không doanh thu'
            : 'Công việc cá nhân',
    };
  };

  handleOpenDialogProgress = () => {
    const { openDialogProgress } = this.state;
    this.setState({ openDialogProgress: !openDialogProgress });
  };

  handleToday(type) {
    // const { taskRelatePage } = this.props;
    let time;
    const dt = new Date();
    // theo ngay
    const interval = 1000 * 60 * 60 * 24;
    const dayst = Math.floor(Date.now() / interval) * interval;
    const startOfDay = new Date(dayst);
    const dayen = new Date(dayst + interval - 1);
    const endOfDay = new Date(dayen);
    // theo tuan
    const currentWeekDay = dt.getDay();
    // eslint-disable-next-line eqeqeq
    const lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
    const wkStart = new Date(new Date(dt).setDate(dt.getDate() - lessDays));
    const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
    // theo thang
    const firstDay = new Date(dt.getFullYear(), dt.getMonth(), 1);
    const lastDay = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
    // theo nam
    const dateStart = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0);
    const dateEnd = new Date(new Date().getFullYear(), 11, 31, 0, 0, 0);
    switch (type) {
      case 1:
        time = this.props.mergeData({
          stDate: startOfDay.toISOString(),
          enDate: endOfDay.toISOString(),
        });
        break;
      case 2:
        time = this.props.mergeData({ stDate: wkStart.toISOString(), enDate: wkEnd.toISOString() });
        break;
      case 3:
        time = this.props.mergeData({
          stDate: firstDay.toISOString(),
          enDate: lastDay.toISOString(),
        });
        break;
      case 4:
        time = this.props.mergeData({
          stDate: dateStart.toISOString(),
          enDate: dateEnd.toISOString(),
        });
        break;
      default:
        break;
    }
    return time;
  }

  handleChangeTime = e => {
    this.props.mergeData({ searchDay: e });
    const data = this.handleToday(e);
    const filter = { startDate: { $gte: data.start, $lte: data.end } };
    this.props.mergeData({ filter });
  };

  handleStatistic = () => {
    const { taskRelatePage } = this.props;
    this.props.mergeData({ openDrawerSearch: true });
    const id = taskRelatePage.employee._id;
    const data = {
      startDate: taskRelatePage.stDate,
      endDate: taskRelatePage.enDate,
      employeeId: taskRelatePage.employee._id,
    };

    this.props.postTask(data, id);
  };

  mergeData = id => {
    this.props.mergeData({ openDrawer2: true, taskData: { plannerStatus: id } });
  };

  // open bảng k thực hiện
  handleCancel = () => {
    const { taskRelatePage } = this.props;
    const id = taskRelatePage.employee._id;
    this.props.mergeData({
      openDrawerSearch: false,
      tabIndex: 0,
      filterAll: {
        isProject: false,
        taskStatus: 6,
        startDate: { $gte: taskRelatePage.stDate },
        endDate: { $lte: taskRelatePage.enDate },
        $or: [
          { createdBy: id },
          { inCharge: { $in: [id] } },
          { viewable: { $in: [id] } },
          { join: { $in: [id] } },
          { support: { $in: [id] } },
        ],
      },
    });
  };

  // open bảng cong việc
  handleTask = () => {
    const { taskRelatePage } = this.props;
    const id = taskRelatePage.employee._id;
    this.props.mergeData({
      openDrawerSearch: false,
      tabIndex: 0,
      filterAll: {
        isProject: false,
        startDate: { $gte: taskRelatePage.stDate },
        endDate: { $lte: taskRelatePage.enDate },
        $or: [
          { createdBy: id },
          { inCharge: { $in: [id] } },
          { viewable: { $in: [id] } },
          { join: { $in: [id] } },
          { support: { $in: [id] } },
        ],
      },
    });
  };

  // open bảng phu trach
  handleInCharge = () => {
    const { taskRelatePage } = this.props;
    const id = taskRelatePage.employee._id;
    this.props.mergeData({
      openDrawerSearch: false,
      tabIndex: 0,
      filterAll: {
        isProject: false,
        inCharge: id,
        startDate: { $gte: taskRelatePage.stDate },
        endDate: { $lte: taskRelatePage.enDate },
      },
    });
  };

  // open bảng theo doi
  handleViewable = () => {
    const { taskRelatePage } = this.props;
    const id = taskRelatePage.employee._id;
    this.props.mergeData({
      openDrawerSearch: false,
      tabIndex: 0,
      filterAll: {
        isProject: false,
        viewable: id,
        startDate: { $gte: taskRelatePage.stDate },
        endDate: { $lte: taskRelatePage.enDate },
      },
    });
  };

  // open bang đóng dừng
  handleStop = () => {
    const { taskRelatePage } = this.props;
    const id = taskRelatePage.employee._id;
    this.props.mergeData({
      openDrawerSearch: false,
      tabIndex: 0,
      filterAll: {
        isProject: false,
        taskStatus: 4,
        startDate: { $gte: taskRelatePage.stDate },
        endDate: { $lte: taskRelatePage.enDate },
        $or: [
          { createdBy: id },
          { inCharge: { $in: [id] } },
          { viewable: { $in: [id] } },
          { join: { $in: [id] } },
          { support: { $in: [id] } },
        ],
      },
    });
  };
  handlePause = () => {
    const { taskRelatePage } = this.props;
    const id = taskRelatePage.employee._id;
    this.props.mergeData({
      openDrawerSearch: false,
      tabIndex: 0,
      filterAll: {
        isProject: false,
        taskStatus: 5,
        startDate: { $gte: taskRelatePage.stDate },
        endDate: { $lte: taskRelatePage.enDate },
        $or: [
          { createdBy: id },
          { inCharge: { $in: [id] } },
          { viewable: { $in: [id] } },
          { join: { $in: [id] } },
          { support: { $in: [id] } },
        ],
      },
    });
  };
  // open bảng đnag thuc hiện
  handleDoing = () => {
    const { taskRelatePage } = this.props;
    const id = taskRelatePage.employee._id;
    this.props.mergeData({
      openDrawerSearch: false,
      tabIndex: 0,
      filterAll: {
        isProject: false,
        taskStatus: 2,
        startDate: { $gte: taskRelatePage.stDate },
        endDate: { $lte: taskRelatePage.enDate },
        $or: [
          { createdBy: id },
          { inCharge: { $in: [id] } },
          { viewable: { $in: [id] } },
          { join: { $in: [id] } },
          { support: { $in: [id] } },
        ],
      },
    });
  };

  // open bảng chậm tiến độ
  handleProgress = () => {
    const { taskRelatePage } = this.props;
    const id = taskRelatePage.employee._id;
    this.props.mergeData({
      openDrawerSearch: false,
      tabIndex: 0,
      filterAll: {
        isProject: false,
        // taskStatus: { $not: { $eq: 2 } },
        taskStatus: 7,
        startDate: { $gte: taskRelatePage.stDate },
        endDate: { $lte: taskRelatePage.enDate },
        $or: [
          { createdBy: id },
          { inCharge: { $in: [id] } },
          { viewable: { $in: [id] } },
          { join: { $in: [id] } },
          { support: { $in: [id] } },
        ],
      },
    });
  };

  // open bảng đã hoàn thành
  handleComplete = () => {
    const { taskRelatePage } = this.props;
    const id = taskRelatePage.employee._id;
    this.props.mergeData({
      openDrawerSearch: false,
      tabIndex: 0,
      filterAll: {
        isProject: false,
        taskStatus: 3,
        startDate: { $gte: taskRelatePage.stDate },
        endDate: { $lte: taskRelatePage.enDate },
        $or: [
          { createdBy: id },
          { inCharge: { $in: [id] } },
          { viewable: { $in: [id] } },
          { join: { $in: [id] } },
          { support: { $in: [id] } },
        ],
      },
    });
  };

  // hoan thanh nhung cham tien do
  handleCompleteSlow = () => {
    const { taskRelatePage } = this.props;
    const id = taskRelatePage.employee._id;
    this.props.mergeData({
      openDrawerSearch: false,
      tabIndex: 0,
      filterAll: {
        isProject: false,
        taskStatus: 3,
        // startDate: { $gte: taskRelatePage.stDate },
        finishDate: { $gte: taskRelatePage.endDate },
        $or: [
          { createdBy: id },
          { inCharge: { $in: [id] } },
          { viewable: { $in: [id] } },
          { join: { $in: [id] } },
          { support: { $in: [id] } },
        ],
      },
    });
  };

  checkItem(ft) {
    if (!ft.taskManager) delete ft.taskManager;
    if (!ft.inCharge) delete ft.inCharge;
    if (!ft.join) delete ft.join;
    if (!ft.support) delete ft.support;
    if (!ft.viewable) delete ft.viewable;
    if (!ft.approved) delete ft.approved;
    if (!ft.type) delete ft.type;
    // if (!ft.taskManager && !ft.inCharge && !ft.join && !ft.support && !ft.viewable && !ft.approved && !ft.type) delete ft.isProject;
    return ft;
  }

  selectApproved = employee => {
    this.props.mergeData({ employee });
  };

  handleDialogProgress = () => {
    this.setState({
      openDialogProgress: false,
    });
  };

  callbackTask = () => {
    const { taskRelatePage } = this.props;
    this.props.mergeData({ openDrawer2: false, reload: taskRelatePage.reload + 1 });
  };

  handleDialogFile = () => {
    const { openDialogFile } = this.state;
    this.setState({ openDialogFile: !openDialogFile });
  };

  mapPeople(people) {
    let name = '';
    people.forEach((item, index) => {
      if (index !== name.length - 1) name = `${item.name} ${name}`;
      else name = `${name}, ${item.name}`;
    });
    return name;
  }

  handleItem = id => {
    this.props.mergeData({ openDrawer2: true, id });
  };

  render() {
    const { tab, tabAll } = this.state;
    const { taskRelatePage, intl } = this.props;
    const {
      id,
      hiden,
      taskType,
      profile,
      searchDay,
      users,
      taskSelect,
      inChargeSelect,
      viewableSelect,
      stopSelect,
      pauseSelect,
      cancelSelect,
      doingSelect,
      progressSelect,
      completeSelect,
      employee,
      stDate,
      enDate,
      openDrawer2,
      tabIndex,
      filterAll,
      // completeSlowSelect,
    } = taskRelatePage;
    const employees = users ? users.data : [];
    // console.log('AAAAA', completeSlowSelect);
    console.log(pauseSelect, stopSelect);
    const Bt = props => (
      <Buttons
        onClick={() => this.handleTab(props.tab)}
        {...props}
        color={props.tab === tab ? 'gradient' : 'simple'}
        right
        round
        size="sm"
      >
        {props.children}
      </Buttons>
    );
    const Tb = props => (
      <Buttons
        onClick={() => this.handleTabIndex(props.tabIndex)}
        {...props}
        color={props.tabIndex === tabIndex ? 'gradient' : 'simple'}
        round
        style={{ fontSize: 11 }}
      >
        {props.children}
      </Buttons>
    );

    const BtAll = props => (
      <Buttons
        onClick={() => this.handletabAll(props.tabAll)}
        {...props}
        color={props.tabAll === tabAll ? 'gradient' : 'simple'}
        round
        right
        size="sm"
      >
        {props.children}
      </Buttons>
    );

    const dtStart = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0).toISOString();
    const dtEnd = new Date(new Date().getFullYear(), 11, 31, 0, 0, 0).toISOString();

    const filterPerson = {
      filter: {
        taskType: 3,
        // startDate: { $gte: stDate || dtStart },
        // endDate: { $lte: enDate || dtEnd },
        $or: [
          { createdBy: employee ? employee._id : profile._id },
          { inCharge: { $in: employee ? [employee._id] : [profile._id] } },
          { viewable: { $in: employee ? [employee._id] : [profile._id] } },
          { join: { $in: employee ? [employee._id] : [profile._id] } },
          { support: { $in: employee ? [employee._id] : [profile._id] } },
        ],
      },
    };

    // const bussines = this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data;
    // const extra = this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'EXTRA').data;
    // const hideTask = extra.find(elm => elm.name === 'hide').data;
    // const protectedTask = extra.find(elm => elm.name === 'protected').data;
    // const publicTask = extra.find(elm => elm.name === 'public').data;
    // const openTask = extra.find(elm => elm.name === 'open').data;

    // const taskManager = bussines.find(elm => elm.name === 'taskManager').data;
    // const taskInCharge = bussines.find(elm => elm.name === 'inCharge').data;
    // const taskSupport = bussines.find(elm => elm.name === 'support').data;
    // const taskViewable = bussines.find(elm => elm.name === 'viewable').data;
    // const taskJoin = bussines.find(elm => elm.name === 'join').data;
    return (
      <div>
        <Helmet>
          <title>
            {intl.formatMessage(
              messages.congvieclienquan || {
                id: 'congvieclienquan',
                defaultMessage: 'congvieclienquan',
              },
            )}
          </title>
          <meta name="description" content="Description of taskRelatePage" />
        </Helmet>
        <Grid container>
          <TextField
            select
            label="Thời gian"
            name="searchDay"
            type="date"
            value={searchDay}
            onChange={e => this.handleChangeTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            style={{ width: '10%' }}
          >
            <MenuItem value={0}>--Thời gian--</MenuItem>
            <MenuItem value={1}>Hôm nay</MenuItem>
            <MenuItem value={2}>Trong tuần</MenuItem>
            <MenuItem value={3}>Trong tháng</MenuItem>
            <MenuItem value={4}>Trong năm</MenuItem>
          </TextField>
          <div style={{ width: '20%', marginLeft: 25 }}>
            <Autocomplete
              label="Nhân viên"
              suggestions={employees}
              onChange={this.selectApproved}
              value={taskRelatePage.employee}
            />
          </div>
          <Button
            variant="outlined"
            color="primary"
            style={{ height: '50px', marginLeft: 25, marginTop: 9 }}
            onClick={this.handleStatistic}
          >
            Thống kê
          </Button>
        </Grid>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={taskRelatePage.openDrawerSearch}
          onClose={() => this.props.mergeData({ openDrawerSearch: false })}
        >
          <div
            style={{
              width: 500,
              height: 550,
              backgroundColor: '#f4f5f2',
              border: '0.5px solid #000',
              // boxShadow: theme.shadows[5],
              // padding: theme.spacing(2, 4, 3),
              marginTop: 50,
              marginLeft: '50%',
            }}
          >
            <div
              style={{ display: 'flex', marginLeft: 10, marginTop: 25, justifyContent: 'center' }}
            >
              <ViewList style={{ fontSize: 30 }} />
              <p style={{ fontWeight: 'bold', marginLeft: 5, fontSize: 25, marginTop: 3 }}>
                Thống kê công việc
              </p>
            </div>
            <div style={{ display: 'flex', marginLeft: 10, marginTop: 25 }}>
              <Work />
              <p style={{ marginLeft: 5, fontWeight: 'bold' }}> Công việc:</p>
              <p
                style={{ marginLeft: 10, color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={this.handleTask}
              >
                {taskSelect.count}
              </p>
            </div>
            <div style={{ display: 'flex', marginLeft: 10, marginTop: 15 }}>
              <PersonPin />
              <p style={{ marginLeft: 5, fontWeight: 'bold' }}> Phụ trách:</p>
              <p
                style={{ marginLeft: 10, color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={this.handleInCharge}
              >
                {inChargeSelect.count}
              </p>
            </div>
            <div style={{ display: 'flex', marginLeft: 10, marginTop: 15 }}>
              <LocalLibrary />
              <p style={{ marginLeft: 5, fontWeight: 'bold' }}> Theo dõi:</p>
              <p
                style={{ marginLeft: 10, color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={this.handleViewable}
              >
                {viewableSelect.count}
              </p>
            </div>
            <div style={{ display: 'flex', marginLeft: 10, marginTop: 15 }}>
              <IndeterminateCheckBox />
              <p style={{ marginLeft: 5, fontWeight: 'bold' }}> Đóng dừng:</p>
              <p
                style={{ marginLeft: 10, color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={this.handleStop}
              >
                {stopSelect.count}
              </p>
            </div>
            <div style={{ display: 'flex', marginLeft: 10, marginTop: 15 }}>
              <PauseCircleFilled />
              <p style={{ marginLeft: 5, fontWeight: 'bold' }}> Tạm dừng:</p>
              <p
                style={{ marginLeft: 10, color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={this.handlePause}
              >
                {pauseSelect.count}
              </p>
            </div>
            <div style={{ display: 'flex', marginLeft: 10, marginTop: 15 }}>
              <Cancel />
              <p style={{ marginLeft: 5, fontWeight: 'bold' }}> Không thực hiện:</p>
              <p
                style={{ marginLeft: 10, color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={this.handleCancel}
              >
                {cancelSelect.count}
              </p>
            </div>

            <div style={{ display: 'flex', marginLeft: 10, marginTop: 15 }}>
              <Theaters />
              <p style={{ marginLeft: 5, fontWeight: 'bold' }}> Đang thực hiện:</p>
              <p
                style={{ marginLeft: 10, color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={this.handleDoing}
              >
                {doingSelect.count}
              </p>
            </div>
            <div style={{ display: 'flex', marginLeft: 10, marginTop: 15 }}>
              <SlowMotionVideo />
              <p style={{ marginLeft: 5, fontWeight: 'bold' }}> Chậm tiến độ:</p>
              <p
                style={{ marginLeft: 10, color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={this.handleProgress}
              >
                {progressSelect.count}
              </p>
            </div>
            <div style={{ display: 'flex', marginLeft: 10, marginTop: 15 }}>
              <AssignmentTurnedIn />
              <p style={{ marginLeft: 5, fontWeight: 'bold' }}> Đã hoàn thành:</p>
              <p
                style={{ marginLeft: 10, color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={this.handleComplete}
              >
                {completeSelect.count}
              </p>
            </div>
            {/* <div style={{ display: 'flex', marginLeft: 10, marginTop: 15 }}>
              <EventNote />
              <p style={{ marginLeft: 5, fontWeight: 'bold' }}> Đã hoàn thành nhưng chậm tiến độ:</p>
              <p style={{ marginLeft: 10, color: 'red', cursor: 'pointer', fontWeight: 'bold' }} onClick={this.handleCompleteSlow}>
                {completeSlowSelect.count}
              </p>
            </div> */}
          </div>
        </Modal>
        <Grid container>
          <Grid item sm={12}>
            <Tb tabIndex={0}>Tất cả</Tb>
            <Tb tabIndex={-1}>
              {intl.formatMessage(
                messages.dangthuchien || { id: 'dangthuchien', defaultMessage: 'dangthuchien' },
              )}
            </Tb>
            <Tb tabIndex={-2}>
              {intl.formatMessage(
                messages.danghotro || { id: 'danghotro', defaultMessage: 'danghotro' },
              )}
            </Tb>
            <Tb tabIndex={-3}>
              {intl.formatMessage(
                messages.thietlapboitoi || {
                  id: 'thietlapboitoi',
                  defaultMessage: 'thietlapboitoi',
                },
              )}
            </Tb>
            <Tb tabIndex={-4}>
              {/* {intl.formatMessage(
                messages.dangtheo || { id: 'dangtheo', defaultMessage: 'dangtheo' },
              )} */}
              Đang theo dõi
            </Tb>
            <Tb tabIndex={-5}>
              {intl.formatMessage(
                messages.dahoanthanh || { id: 'dahoanthanh', defaultMessage: 'dahoanthanh' },
              )}
            </Tb>
            <Tb tabIndex={-6}>
              {intl.formatMessage(
                messages.congvieckhongdoanhthu || {
                  id: 'congvieckhongdoanhthu',
                  defaultMessage: 'congvieckhongdoanhthu',
                },
              )}
            </Tb>
            <Tb tabIndex={-7}>
              {intl.formatMessage(
                messages.congvieccanhan || {
                  id: 'congvieccanhan',
                  defaultMessage: 'congvieccanhan',
                },
              )}
            </Tb>
          </Grid>
        </Grid>
        {(employee && employee._id) || (profile && profile._id) ? (
          <>
            {tabIndex === 0 ? (
              <Grid container sm={12}>
                <Grid item sm={12}>
                  <BtAll tabAll={0}>
                    {intl.formatMessage(
                      messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' },
                    )}
                  </BtAll>
                  <BtAll tabAll={1}>
                    {intl.formatMessage(
                      messages.kehoach || { id: 'kehoach', defaultMessage: 'kehoach' },
                    )}
                  </BtAll>
                  <BtAll tabAll={2}>
                    {intl.formatMessage(
                      messages.luocdo || { id: 'luocdo', defaultMessage: 'luocdo' },
                    )}
                  </BtAll>
                </Grid>

                {tabAll === 0 ? (
                  <ListPage
                    kanban="ST11"
                    exportExcel
                    reload={taskRelatePage.reload} // load render lai khi them moi
                    // disableEdit
                    disableAdd
                    settingBar={[this.addItem()]}
                    columnExtensions={[
                      { columnName: 'progress', width: 180 },
                      { columnName: 'name', width: 300 },
                      { columnName: 'edit', width: 150 },
                    ]}
                    disableConfig
                    code="Task"
                    apiUrl={API_TASK_PROJECT}
                    mapFunction={this.mapFunctionRelate}
                    filter={{
                      isProject: 'false',
                      startDate: { $gte: stDate || dtStart },
                      endDate: { $lte: enDate || dtEnd },
                      $or: [
                        { createdBy: employee ? employee._id : profile._id },
                        { inCharge: { $in: employee ? [employee._id] : [profile._id] } },
                        { viewable: { $in: employee ? [employee._id] : [profile._id] } },
                        { join: { $in: employee ? [employee._id] : [profile._id] } },
                        { support: { $in: employee ? [employee._id] : [profile._id] } },
                      ],

                      // $or: [
                      //   { createdBy: profile._id },
                      //   this.checkItem({ type: hideTask.view === true ? 2 : '' }),
                      //   this.checkItem({ type: protectedTask.view === true ? 1 : '' }),
                      //   this.checkItem({ type: publicTask.view === true ? 4 : '' }),
                      //   this.checkItem({ type: openTask.view === true ? 3 : '' }),
                      //   this.checkItem({ taskManager: taskManager.view === true ? { $in: [profile._id] } : '' }),
                      //   this.checkItem({ inCharge: taskInCharge.view === true ? { $in: [profile._id] } : '' }),
                      //   this.checkItem({ join: taskJoin.view === true ? { $in: [profile._id] } : '' }),
                      //   this.checkItem({ support: taskSupport.view === true ? { $in: [profile._id] } : '' }),
                      //   this.checkItem({ viewable: taskViewable.view === true ? { $in: [profile._id] } : '' }),
                      // ],
                    }}
                  />
                ) : null}

                {tabAll === 1 ? (
                  profile ? (
                    <Planner
                      handleItem={this.handleItem}
                      addItem={id => this.mergeData(id)}
                      code="PLANER"
                      filterItem="planerStatus"
                      apiUrl={API_TASK_PROJECT}
                      filter={filterAll}
                    />
                  ) : null
                ) : null}

                {tabAll === 2 ? (
                  <Grid style={{ paddingTop: 50 }} item md={12}>
                    <Gantt />
                  </Grid>
                ) : null}
              </Grid>
            ) : null}
            {tabIndex === -1 ? (
              <div>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={0}>
                      {intl.formatMessage(
                        messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' },
                      )}
                    </Bt>
                    <Bt tab={1}>
                      {intl.formatMessage(
                        messages.kehoach || { id: 'kehoach', defaultMessage: 'kehoach' },
                      )}
                    </Bt>
                  </Grid>
                </Grid>
                {tab === 0 ? (
                  <Paper>
                    <ListPage
                      disableImport
                      exportExcel
                      kanban="ST11"
                      reload={taskRelatePage.reload} // load render lai khi them moi
                      disableEdit
                      disableAdd
                      // settingBar={[this.addItem()]}
                      columnExtensions={[
                        { columnName: 'progress', width: 180 },
                        { columnName: 'name', width: 300 },
                      ]}
                      disableConfig
                      code="Task"
                      apiUrl={API_TASK_PROJECT}
                      mapFunction={this.mapFunctionRelate}
                      filter={{
                        isProject: 'false',
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                        taskStatus: 2,
                        $or: [
                          { createdBy: employee ? employee._id : profile._id },
                          { inCharge: { $in: employee ? [employee._id] : [profile._id] } },
                          { viewable: { $in: employee ? [employee._id] : [profile._id] } },
                          { join: { $in: employee ? [employee._id] : [profile._id] } },
                          { support: { $in: employee ? [employee._id] : [profile._id] } },
                        ],
                      }}
                    />
                  </Paper>
                ) : null}
                {tab === 1 ? (
                  profile ? (
                    <Planner
                      handleItem={this.handleItem}
                      addItem={id => this.mergeData(id)}
                      code="PLANER"
                      filterItem="planerStatus"
                      apiUrl={API_TASK_PROJECT}
                      filter={{
                        isProject: false,
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                        $or: [
                          { createdBy: employee ? employee._id : profile._id },
                          { inCharge: { $in: employee ? [employee._id] : [profile._id] } },
                          { viewable: { $in: employee ? [employee._id] : [profile._id] } },
                          { join: { $in: employee ? [employee._id] : [profile._id] } },
                          { support: { $in: employee ? [employee._id] : [profile._id] } },
                        ],
                      }}
                    />
                  ) : null
                ) : null}
              </div>
            ) : null}
            {tabIndex === -2 ? (
              <div>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={0}>
                      {intl.formatMessage(
                        messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' },
                      )}
                    </Bt>
                    <Bt tab={1}>
                      {intl.formatMessage(
                        messages.kehoach || { id: 'kehoach', defaultMessage: 'kehoach' },
                      )}
                    </Bt>
                  </Grid>
                </Grid>

                {tab === 1 ? (
                  profile ? (
                    <Planner
                      handleItem={this.handleItem}
                      addItem={id => this.mergeData(id)}
                      apiUrl={API_TASK_PROJECT}
                      code="PLANER"
                      filterItem="planerStatus"
                      filter={{
                        isProject: false,
                        support: employee ? [employee._id] : [profile._id],
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                      }}
                    />
                  ) : null
                ) : null}
                {tab === 0 ? (
                  <Paper>
                    <ListPage
                      disableImport
                      exportExcel
                      kanban="ST11"
                      reload={taskRelatePage.reload}
                      disableEdit
                      disableAdd
                      // settingBar={[this.addItem()]}
                      columnExtensions={[
                        { columnName: 'progress', width: 180 },
                        { columnName: 'name', width: 300 },
                      ]}
                      disableConfig
                      code="Task"
                      apiUrl={API_TASK_PROJECT}
                      mapFunction={this.mapFunctionRelate}
                      filter={{
                        isProject: 'false',
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                        $or: [{ support: { $in: employee ? [employee._id] : [profile._id] } }],
                      }}
                    />
                  </Paper>
                ) : null}
              </div>
            ) : null}
            {tabIndex === -3 && (
              <div>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={0}>
                      {intl.formatMessage(
                        messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' },
                      )}
                    </Bt>
                    <Bt tab={1}>
                      {intl.formatMessage(
                        messages.kehoach || { id: 'kehoach', defaultMessage: 'kehoach' },
                      )}
                    </Bt>
                  </Grid>
                </Grid>
                {tab === 0 ? (
                  <div>
                    <ListPage
                      disableImport
                      exportExcel
                      kanban="ST11"
                      reload={taskRelatePage.reload}
                      disableEdit
                      disableAdd
                      columnExtensions={[
                        { columnName: 'progress', width: 180 },
                        { columnName: 'name', width: 300 },
                      ]}
                      code="Task"
                      apiUrl={API_TASK_PROJECT}
                      mapFunction={this.mapFunctionRelate}
                      filter={{
                        isProject: 'false',
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                        $or: [{ createdBy: { $in: employee ? [employee._id] : [profile._id] } }],
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
                {tab === 1 ? (
                  profile ? (
                    <Planner
                      handleItem={this.handleItem}
                      addItem={id => this.mergeData(id)}
                      code="PLANER"
                      filterItem="planerStatus"
                      apiUrl={API_TASK_PROJECT}
                      configUrl={`${API_TASK_PROJECT}/config`}
                      filter={{
                        isProject: false,
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                        createdBy: employee ? employee._id : profile._id,
                      }}
                    />
                  ) : null
                ) : (
                  ''
                )}
              </div>
            )}
            {tabIndex === -4 && (
              <div>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={0}>
                      {intl.formatMessage(
                        messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' },
                      )}
                    </Bt>
                    <Bt tab={1}>
                      {intl.formatMessage(
                        messages.kehoach || { id: 'kehoach', defaultMessage: 'kehoach' },
                      )}
                    </Bt>
                  </Grid>
                </Grid>
                {tab === 0 ? (
                  <div>
                    <ListPage
                      disableImport
                      exportExcel
                      kanban="ST11"
                      columnExtensions={[
                        { columnName: 'progress', width: 180 },
                        { columnName: 'name', width: 300 },
                      ]}
                      reload={taskRelatePage.reload}
                      disableEdit
                      disableAdd
                      disableConfig
                      code="Task"
                      apiUrl={API_TASK_PROJECT}
                      mapFunction={this.mapFunctionRelate}
                      filter={{
                        isProject: 'false',
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                        $or: [{ viewable: { $in: employee ? [employee._id] : [profile._id] } }],
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
                {tab === 1 ? (
                  profile ? (
                    <Planner
                      handleItem={this.handleItem}
                      addItem={id => this.mergeData(id)}
                      code="PLANER"
                      filterItem="planerStatus"
                      apiUrl={API_TASK_PROJECT}
                      configUrl={`${API_TASK_PROJECT}/config`}
                      filter={{
                        isProject: false,
                        viewable: { $in: employee ? [employee._id] : [profile._id] },
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                      }}
                    />
                  ) : null
                ) : (
                  ''
                )}
              </div>
            )}
            {tabIndex === -5 && (
              <div>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={0}>
                      {intl.formatMessage(
                        messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' },
                      )}
                    </Bt>
                    <Bt tab={1}>
                      {intl.formatMessage(
                        messages.kehoach || { id: 'kehoach', defaultMessage: 'kehoach' },
                      )}
                    </Bt>
                  </Grid>
                </Grid>
                {tab === 0 ? (
                  <div>
                    <ListPage
                      disableImport
                      exportExcel
                      kanban="ST11"
                      columnExtensions={[
                        { columnName: 'progress', width: 180 },
                        { columnName: 'name', width: 300 },
                      ]}
                      reload={taskRelatePage.reload}
                      disableEdit
                      disableAdd
                      disableConfig
                      code="Task"
                      apiUrl={API_TASK_PROJECT}
                      mapFunction={this.mapFunctionRelate}
                      filter={{
                        isProject: 'false',
                        taskStatus: 3,
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                        $or: [
                          { createdBy: employee ? employee._id : profile._id },
                          { inCharge: { $in: employee ? [employee._id] : [profile._id] } },
                          { viewable: { $in: employee ? [employee._id] : [profile._id] } },
                          { join: { $in: employee ? [employee._id] : [profile._id] } },
                          { support: { $in: employee ? [employee._id] : [profile._id] } },
                        ],
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
                {tab === 1 ? (
                  profile ? (
                    <Planner
                      handleItem={this.handleItem}
                      addItem={id => this.mergeData(id)}
                      code="PLANER"
                      filterItem="planerStatus"
                      apiUrl={API_TASK_PROJECT}
                      filter={{
                        isProject: false,
                        taskStatus: 3,
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                        $or: [
                          { createdBy: employee ? employee._id : profile._id },
                          { inCharge: { $in: employee ? [employee._id] : [profile._id] } },
                          { viewable: { $in: employee ? [employee._id] : [profile._id] } },
                          { join: { $in: employee ? [employee._id] : [profile._id] } },
                          { support: { $in: employee ? [employee._id] : [profile._id] } },
                        ],
                      }}
                    />
                  ) : null
                ) : (
                  ''
                )}
              </div>
            )}
            {tabIndex === -6 && (
              <div>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={0}>
                      {intl.formatMessage(
                        messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' },
                      )}
                    </Bt>
                    <Bt tab={1}>
                      {intl.formatMessage(
                        messages.kehoach || { id: 'kehoach', defaultMessage: 'kehoach' },
                      )}
                    </Bt>
                  </Grid>
                </Grid>
                {tab === 0 ? (
                  <div>
                    <ListPage
                      exportExcel
                      kanban="ST11"
                      columnExtensions={[
                        { columnName: 'progress', width: 180 },
                        { columnName: 'name', width: 300 },
                      ]}
                      reload={taskRelatePage.reload}
                      disableEdit
                      disableAdd
                      settingBar={[this.addItemkRevenue()]}
                      disableConfig
                      code="Task"
                      apiUrl={API_TASK_PROJECT}
                      // mapFunction={this.mapFunctionTaskRevenue}
                      filter={{
                        isProject: 'false',
                        taskType: 2,
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                        $or: [
                          { createdBy: employee ? employee._id : profile._id },
                          { inCharge: { $in: employee ? [employee._id] : [profile._id] } },
                          { viewable: { $in: employee ? [employee._id] : [profile._id] } },
                          { join: { $in: employee ? [employee._id] : [profile._id] } },
                          { support: { $in: employee ? [employee._id] : [profile._id] } },
                        ],
                      }}
                    />
                  </div>
                ) : null}
                {tab === 1 ? (
                  profile ? (
                    <Planner
                      handleItem={this.handleItem}
                      addItem={id => this.mergeData(id)}
                      apiUrl={API_TASK_PROJECT}
                      code="PLANER"
                      filterItem="planerStatus"
                      filter={{
                        isProject: false,
                        taskType: 2,
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                        $or: [
                          { createdBy: employee ? employee._id : profile._id },
                          { inCharge: { $in: employee ? [employee._id] : [profile._id] } },
                          { viewable: { $in: employee ? [employee._id] : [profile._id] } },
                          { join: { $in: employee ? [employee._id] : [profile._id] } },
                          { support: { $in: employee ? [employee._id] : [profile._id] } },
                        ],
                      }}
                    />
                  ) : null
                ) : null}
              </div>
            )}
            {tabIndex === -7 && (
              <div>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={0}>
                      {intl.formatMessage(
                        messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' },
                      )}
                    </Bt>
                    <Bt tab={1}>
                      {intl.formatMessage(messages.lich || { id: 'lich', defaultMessage: 'lich' })}
                    </Bt>
                    <Bt tab={2}>
                      {intl.formatMessage(
                        messages.kehoach || { id: 'kehoach', defaultMessage: 'kehoach' },
                      )}
                    </Bt>
                  </Grid>
                </Grid>
                {tab === 0 ? (
                  <Paper>
                    <ListPage
                      exportExcel
                      kanban="ST11"
                      reload={taskRelatePage.reload}
                      disableEdit
                      disableAdd
                      settingBar={[this.addItemPersonal()]}
                      columnExtensions={[
                        { columnName: 'progress', width: 180 },
                        { columnName: 'name', width: 300 },
                      ]}
                      disableConfig
                      code="Task"
                      apiUrl={API_TASK_PROJECT}
                      mapFunction={this.mapFunctionTaskRevenue}
                      filter={{
                        isProject: false,
                        taskType: 3,
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                        $or: [
                          { createdBy: employee ? employee._id : profile._id },
                          { inCharge: { $in: employee ? [employee._id] : [profile._id] } },
                          { viewable: { $in: employee ? [employee._id] : [profile._id] } },
                          { join: { $in: employee ? [employee._id] : [profile._id] } },
                          { support: { $in: employee ? [employee._id] : [profile._id] } },
                        ],
                      }}
                    />
                  </Paper>
                ) : null}
                {tab === 1 ? (
                  <CalendarContainer
                    column={{
                      Id: '_id',
                      Subject: 'name',
                      Location: '',
                      StartTime: 'startDate',
                      EndTime: 'endDate',
                      CategoryColor: '',
                    }}
                    isCloneModule
                    source="taskStatus"
                    sourceCode="KANBAN"
                    sourceKey="type"
                    url={`${API_TASK_PROJECT}`}
                    querySort={filterPerson}
                    handleAdd={this.handleAddClick}
                    handleEdit={this.handleClickEdit}
                  />
                ) : null}
                {tab === 2 ? (
                  profile ? (
                    <Planner
                      handleItem={this.handleItem}
                      addItem={id => this.mergeData(id)}
                      apiUrl={API_TASK_PROJECT}
                      code="PLANER"
                      filterItem="planerStatus"
                      filter={{
                        isProject: false,
                        taskType: 3,
                        startDate: { $gte: stDate || dtStart },
                        endDate: { $lte: enDate || dtEnd },
                        $or: [
                          { createdBy: employee ? employee._id : profile._id },
                          { inCharge: { $in: employee ? [employee._id] : [profile._id] } },
                          { viewable: { $in: employee ? [employee._id] : [profile._id] } },
                          { join: { $in: employee ? [employee._id] : [profile._id] } },
                          { support: { $in: employee ? [employee._id] : [profile._id] } },
                        ],
                      }}
                    />
                  ) : null
                ) : (
                  ''
                )}
              </div>
            )}
          </>
        ) : null}
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.props.mergeData({ openDrawer2: false, id: 'add' })}
          open={openDrawer2}
          width={window.innerWidth - 260}
        >
          <div style={{ width: window.innerWidth - 260 }}>
            <AddTask
              data={{ taskType, isProject: false }}
              id={id}
              callback={this.callbackTask}
              hiden={hiden}
            />
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

// TaskRelatePage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  taskRelatePage: makeSelectTaskRelatePage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getTaskRelatePage: () => dispatch(getTaskRelatePage()),
    handleChange: (name, value) => {
      dispatch(handleChange(name, value));
    },
    postTask: (data, id) => dispatch(postTask(data, id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'taskRelatePage', reducer });
const withSaga = injectSaga({ key: 'taskRelatePage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(TaskRelatePage);
