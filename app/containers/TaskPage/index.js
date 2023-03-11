import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
// import { Add } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import CalendarContainer from '../CalendarContainer';
import makeSelectTaskPage from './selectors';
import makeSelectDashboardPage, { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
// import { makeSelectMiniActive } from '../Dashboard/selectors';

import reducer from './reducer';
import saga from './saga';
import { mergeData, getProject } from './actions';
import Project from '../ProjectPage/Loadable';
import TotalTask from '../TotalTask/Loadable';
import TaskRelatePage from '../TaskRelatePage/Loadable';
import { API_TASK_PROJECT } from '../../config/urlConfig';
import { Tabs, Tab, SwipeableDrawer } from '../../components/LifetekUi';
import Planner from '../../components/LifetekUi/Planner/TaskKanban';
import messages from './messages';
import AddProjects from '../AddProjects';

/* eslint-disable react/prefer-stateless-function */

export class TaskPage extends React.Component {
  state = {
    open: false,
    data: {},
    reload: 0,
  };

  // componentDidMount() {
  //   this.props.getProject();
  // }

  addItem = (type, code) => {
    this.setState({ data: { kanbanStatus: type, taskStatus: code, isProject: false }, open: true, id: 'add' });
  };

  callbackTask = () => {
    const { reload } = this.state;
    this.setState({ reload: reload + 1, open: false });
  };

  handleAddClick = () => {
    this.props.mergeData({ openDrawer: true, id: 'add' });
  };

  handleClickEdit = data => {
    // const { projects } = this.props.taskPage;
    // if (projects.data)
    //   if (projects.data.find(it => it._id === data.Id)) this.props.mergeData({ openDrawerProject: true, id: data.Id });
    //   else this.props.mergeData({ openDrawer: true, id: data.Id });
  };

  closeDrawer = () => {
    this.setState({ open: false });
  };

  render() {
    const taskPage = this.props.taskPage;
    const { tab } = taskPage;
    const { open, data, id, reload } = this.state;
    const { intl, dashboardPage, miniActive } = this.props;

    const nature = this.props.dashboardPage.roleTask.roles ? this.props.dashboardPage.roleTask.roles.find(item => item.code === 'NATURE').data : [];
    const topNavList = [
      {
        name: 'all',
        id: 'tatca',
      },
      {
        name: 'taskReated',
        id: 'congvieclienquan',
      },
      {
        name: 'task',
        id: 'duan',
      },
      {
        name: 'kaban',
        id: 'kanban',
      },
      {
        name: 'kaban',
        id: 'lich',
      },
    ];

    return (
      <div>
        <Helmet>
          <title>TaskPage</title>
          <meta name="description" content="Description of TaskPage" />
        </Helmet>
        <div>
          <Tabs value={tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
            {topNavList.map(
              (item, key) =>
                dashboardPage.roleTask.roles && nature.find(elm => elm.name === item.name).data.access === true ? (
                  <Tab value={key} label={intl.formatMessage(messages[item.id] || { id: item.id })} />
                ) : null,
            )}
            {/* {this.props.dashboardPage.roleTask.roles && nature.find(elm => elm.name === 'all').data.access === true ? (
              <Tab value={0} label={intl.formatMessage(messages.tatca || { id: 'tatca', defaultMessage: 'tatca' })} />
            ) : null}
            {this.props.dashboardPage.roleTask.roles && nature.find(elm => elm.name === 'taskReated').data.access === true ? (
              <Tab
                value={1}
                label={intl.formatMessage(messages.congvieclienquan || { id: 'congvieclienquan', defaultMessage: 'congvieclienquan' })}
              />
            ) : null}
            {this.props.dashboardPage.roleTask.roles && nature.find(elm => elm.name === 'task').data.access === true ? (
              <Tab value={2} label={intl.formatMessage(messages.duan || { id: 'duan', defaultMessage: 'duan' })} />
            ) : null}
            {this.props.dashboardPage.roleTask.roles && nature.find(elm => elm.name === 'kaban').data.access === true ? (
              <Tab value={3} label={intl.formatMessage(messages.kanban || { id: 'kanban', defaultMessage: 'kanban' })} />
            ) : null}
            {this.props.dashboardPage.roleTask.roles && nature.find(elm => elm.name === 'kaban').data.access === true ? (
              <Tab value={4} label={intl.formatMessage(messages.lich || { id: 'lich', defaultMessage: 'lich' })} />
            ) : null} */}
          </Tabs>
          {/* {console.log('tab', tab)} */}
          {tab === 0 && this.props.dashboardPage.roleTask.roles && nature.find(elm => elm.name === 'all').data.access === true ? <TotalTask /> : null}
          {tab === 3 && this.props.dashboardPage.roleTask.roles && nature.find(elm => elm.name === 'kaban').data.access === true ? (
            <Planner reload={reload} showTemplate code="KANBAN" filterItem="kanbanStatus" apiUrl={API_TASK_PROJECT} addItem={this.addItem} />
          ) : null}
          {tab === 2 ? <Project /> : null}
          {tab === 4 ? (
            <CalendarContainer
              column={{
                Id: '_id',
                Subject: 'name',
                Location: '',
                StartTime: 'startDate',
                EndTime: 'endDate',
                CategoryColor: '',
              }}
              source="taskStatus"
              sourceCode="KANBAN"
              sourceKey="type"
              isCloneModule
              url={API_TASK_PROJECT}
              handleAdd={this.handleAddClick}
              handleEdit={this.handleClickEdit}
            />
          ) : null}
          {tab === 1 ? <TaskRelatePage /> : null}
        </div>
        <SwipeableDrawer anchor="right" onClose={this.closeDrawer} open={open} width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}>
          <AddProjects data={data} id={id} callback={this.callbackTask} />
        </SwipeableDrawer>
      </div>
    );
  }
}

TaskPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  taskPage: makeSelectTaskPage(),
  dashboardPage: makeSelectDashboardPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getProject: () => dispatch(getProject()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'taskPage', reducer });
const withSaga = injectSaga({ key: 'taskPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(TaskPage);
