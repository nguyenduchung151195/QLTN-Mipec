/**
 *
 * TaskInfoTab
 *
 */

import React, { useEffect, useState } from 'react';


import { Avatar, Grid, withStyles, Tooltip } from '@material-ui/core';
import { SwipeableDrawer } from 'components/LifetekUi';
import { taskStatusArr } from 'variable';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAssetGuaranteePage from '../../selectors';
import reducer from '../../reducer';
import saga from '../../saga';
import * as actions from '../../actions';

import styles from '../../styles';
import { API_TASK_ASSET_MAINTENANCE } from '../../../../../config/urlConfig';

import EditTaskDialog from '../../../Dialogs/EditTaskDialog';
import ListTask from '../../../../../components/List/ListTask';

const Process = props => (
  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 22, width: '100%', position: 'relative' }}>
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
      {/* ngày */}
    </span>
  </div>
);

//

const GridList = React.memo(({ apiUrl, reload, addFunction, editFunction, deleteFunction }) => {
  const mapTask = item => {
    //const child = projects.find(elm => elm._id === item.projectId);
    return {
      ...item,
      // parentId: item.parentId ? item['parentId.name'] : null,
      name: (
        <button onClick={() => editFunction(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
          {item.name}
        </button>
      ),
      avatar: <Avatar src={item.avatar} />,
      progress: (
        <Process value={item.progress} progress={item.progress} color={colorProgress(item)} time={ProcessTask(item)} color2={color2Progress(item)} />
      ),
      note: (
        <Tooltip title={item.note || null}>
          <p>{item.note || null}</p>
        </Tooltip>
      ),
      planApproval:
        item.planApproval === 1 ? (
          <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã duyệt kế hoạch</p>
        ) : (
          <p style={{ color: '#ed0000', fontWeight: 'bold' }}>Chưa duyệt kế hoạch</p>
        ),
      customer: item['customer.name'],
      createdBy: item['createdBy.name'],
      taskStatus: taskStatusArr[item.taskStatus - 1],
      type: item.type === 1 ? 'Nhóm bảo mật' : item.type === 4 ? 'Nhóm công khai' : item.type === 2 ? 'Nhóm ẩn' : 'Nhóm mở rộng',
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
    };
  };

  return (
    <ListTask
      columnExtensions={[{ columnName: 'name', width: 300 }, { columnName: 'edit', width: 150 }, { columnName: 'progress', width: 180 }]}
      reload={reload}
      addFunction={addFunction}
      editFunction={editFunction}
      deleteFunction={deleteFunction}
      apiUrl={apiUrl}
      code="Task"
      kanban="KANBAN"
      status="taskStatus"
      mapFunction={mapTask}
      //addChildTask
      perPage={5}
    //filter={rest}
    //extraMenu={openBusiness}
    />
  );
});

function colorProgress(item) {
  let color;
  if (item.finishDate) {
    color = new Date(item.finishDate) > new Date(item.endDate) ? '#fa0522' : '#009900';
  } else {
    color = new Date(item.endDate) >= new Date() ? '#056ffa' : '#f00707';
  }

  return color;
}

function color2Progress(item) {
  let color2;
  if (item.finishDate) {
    color2 = new Date(item.finishDate) > new Date(item.endDate) ? '#f28100' : '#009900';
  } else {
    color2 = new Date(item.endDate) >= new Date() ? '#05c9fa' : '#6e1305';
  }

  return color2;
}

function ProcessTask(item) {
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



function TaskInfoTab(props) {

  const { assetGuaranteePage, onCreateAssetMaintenanceTask, onDeleteAssetMaintenanceTask, classes, history } = props;

  const { assetMaintenance, createTaskSuccess, deleteTaskSuccess } = assetGuaranteePage;

  const [open, setOpen] = useState(false);

  const [task, setTask] = useState({});

  const [reload, setReload] = useState(false)

  useEffect(() => {

  }, []);

  useEffect(() => {
    if (deleteTaskSuccess === true) {
      setReload(true);
    }
  }, [deleteTaskSuccess])

  useEffect(() => {
    if (createTaskSuccess === true) {
      setReload(true);
      setOpen(false);
    }
  }, [createTaskSuccess])

  const handleCreateTask = () => {
    setOpen(true);
  }

  const handleSubmit = (task) => {
    onCreateAssetMaintenanceTask({ assetMaintenance, task });
  }

  const handleEditTask = (id) => {
    history.push(`/Task/${id}`)
    // setTask(task);
    // setOpen(true);
  }

  const handleDeleteTask = (ids) => {
    onDeleteAssetMaintenanceTask({ assetMaintenance, ids })
  }

  const handleClose = () => {
    setOpen(false);
    setTask({});
  }

  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        {assetMaintenance && assetMaintenance._id && (
          <GridList
            apiUrl={`${API_TASK_ASSET_MAINTENANCE}/${assetMaintenance._id}`}
            editFunction={handleEditTask}
            addFunction={handleCreateTask}
            deleteFunction={handleDeleteTask}
            reload={reload}
          //filter={newFilter}
          //projects={this.props.totalTask.projects}
          />
        )}
        {/* <ListTask client columns={columns} rows={taskList || []} onAdd={handleCreateTask} onEdit={handleEditTask} onDelete={handleDete} /> */}
      </Grid>
      <Grid item xs={12}>
        <SwipeableDrawer anchor="right" onClose={handleClose} open={open}>
          <EditTaskDialog onSubmit={handleSubmit}  type="MAINTENANCE" onClose={handleClose} />
        </SwipeableDrawer>
      </Grid>
    </Grid>
  );
}

const mapStateToProps = createStructuredSelector({
  assetGuaranteePage: makeSelectAssetGuaranteePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateAssetMaintenanceTask: (data) => dispatch(actions.createAssetMaintenanceTask(data)),
    onDeleteAssetMaintenanceTask: (data) => dispatch(actions.deleteAssetMaintenanceTask(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
)(TaskInfoTab);
