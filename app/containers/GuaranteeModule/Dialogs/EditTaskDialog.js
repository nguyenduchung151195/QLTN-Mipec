/**
 *
 * EditTaskDialog
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';


import { Button, Grid, MenuItem, Step, StepLabel, Stepper } from '@material-ui/core';
import { DateTimePicker } from 'material-ui-pickers';

import { AsyncAutocomplete } from 'components/LifetekUi';
import { provincialColumns } from 'variable';

import { TextField } from 'components/LifetekUi';
import { API_APPROVE_GROUPS, API_CUSTOMERS, API_USERS } from 'config/urlConfig';

export const taskPrioty = ['Rất cao', 'Cao', 'Trung bình', 'Thấp', 'Rất thấp'];

function KanbanStep(props) {
  const { kanbanStatus, currentStatus, onChange } = props;

  // eslint-disable-next-line eqeqeq
  const idx = currentStatus.findIndex(i => i.type == kanbanStatus);

  return (
    <Stepper style={{ background: 'transparent' }} activeStep={idx}>
      {currentStatus.map(item => (
        <Step onClick={() => onChange(item.type)} key={item.type}>
          <StepLabel style={{ cursor: 'pointer' }}>{item.name}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
function EditTaskDialog(props) {

  const { onSubmit, onClose, type } = props;

  const [currentStatus, setCurrentStatus] = useState([]);

  const [taskColumns, setTaskColumns] = useState([]);

  const [checkRequired, setCheckRequired] = useState({});

  const [checkShowForm, setCheckShowForm] = useState({});

  const [name, setName] = useState('');

  const [kanbanStatus, setKanbanStatus] = useState(0);

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const [priority, setPriority] = useState('0');

  const [customer, setCustomer] = useState(null);

  const [viewable, setViewable] = useState([]);

  const [inCharge, setInCharge] = useState([]);

  const [taskManager, setTaskManager] = useState([]);

  const [approved, setApproved] = useState([]);

  const [join, setJoin] = useState([]);

  const [support, setSupport] = useState([]);

  const [provincial, setProvincial] = useState('');

  const [description, setDescription] = useState('');

  useEffect(() => {

    const listCrmStatus = JSON.parse(localStorage.getItem('taskStatus'));
    const currentStatus = listCrmStatus.find(i => i.code === type).data.sort((a, b) => a.code - b.code);
    setCurrentStatus(currentStatus);
    const taskColumns = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'Task').listDisplay.type.fields.type.columns;
    setTaskColumns(taskColumns);
    const checkRequired = {};
    taskColumns.forEach(item => {
      checkRequired[item.name] = item.checkedRequireForm;
    });
    setCheckRequired(checkRequired);
    const checkShowForm = {};
    taskColumns.forEach(item => {
      checkShowForm[item.name] = item.checkedShowForm;
    });
    setCheckShowForm(checkShowForm);
  }, [])

  const handleSubmit = () => {
    onSubmit({
      kanbanStatus,
      name,
      startDate,
      endDate,
      provincial,
      priority,
      customer,
      viewable,
      inCharge,
      taskManager,
      approved,
      join,
      support,
      provincial,
      description,
    });
  }

  return (
    <div className="project-main">
      {/* <img alt="anh du an" className="bg-img" src={cover} /> */}
      <div className="bg-color" />
      <Grid container spacing={8} style={{ margin: 8 }}>
        <Grid md={12} item>
          <KanbanStep kanbanStatus={kanbanStatus} currentStatus={currentStatus} onChange={setKanbanStatus} />
        </Grid>
        <Grid item md={6}>
          <TextField
            fullWidth
            required
            label="Tên công việc"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            fullWidth
            name="provincial"
            label="Khu vực"
            InputLabelProps={{ shrink: true }}
            value={provincial}
            onChange={e => setProvincial(e.target.value)}
            select
          >
            {provincialColumns.map(item => (
              <MenuItem value={item}>{item}</MenuItem>
            ))}
          </TextField>

          <div style={{ marginTop: 10 }}>
            <DateTimePicker
              inputVariant="outlined"
              format="DD/MM/YYYY HH:mm"
              variant="outlined"
              label="Thời gian bắt đầu"
              margin="dense"
              required
              value={startDate}
              onChange={value => setStartDate(value)}
            />
            <DateTimePicker
              inputVariant="outlined"
              format="DD/MM/YYYY HH:mm"
              required
              label="Thời gian kết thúc"
              name="endDate"
              margin="dense"
              variant="outlined"
              value={endDate}
              onChange={value => setEndDate(value)}
            />
          </div>
          <AsyncAutocomplete
            name="customer"
            label="Chọn khách hàng..."
            // suggestions={customers.data}
            url={API_CUSTOMERS}
            value={customer}
            onChange={value => setCustomer(value)}
          />
          <TextField
            fullWidth
            label="Ưu tiên"
            name="priority"
            value={priority}
            InputLabelProps={{ shrink: true }}
            onChange={e => setPriority(e.target.value)}
            select
          >
            {taskPrioty.map((it, id) => (
              <MenuItem key={it} value={id + 1}>
                {it}
              </MenuItem>
            ))}
          </TextField>

          <Grid item md={12}>
            <TextField
              fullWidth
              label="Mô tả"
              // margin="dense"
              rows={2}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              name="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              />
          </Grid>
        </Grid>

        <Grid item md={6} style={{ padding: '4px 20px' }}>
          <AsyncAutocomplete
            isMulti
            name="Chọn người quản lý..."
            url={API_USERS}
            label="Người quản lý"
            value={taskManager}
            onChange={value => setTaskManager(value)}
          />
          <AsyncAutocomplete
            isMulti
            name="Chọn người được xem..."
            label="Người được xem"
            url={API_USERS}
            value={viewable}
            onChange={value => setViewable(value)}
          />

          <AsyncAutocomplete
            isMulti
            name="Chọn người tham gia"
            label="Người tham gia"
            url={API_USERS}
            value={join}
            onChange={value => setJoin(value)}
          />
          <AsyncAutocomplete
            isMulti
            name="Chọn người phụ trách... "
            label="Người phụ trách"
            url={API_USERS}
            value={inCharge}
            onChange={value => setInCharge(value)}
          />

          <AsyncAutocomplete
            isMulti
            name="Chọn người hỗ trợ... "
            label="Người hỗ trợ"
            url={API_USERS}
            onChange={value => setSupport(value)}
            value={support}
          />
          <AsyncAutocomplete
            isMulti
            name="Chọn nhóm phê duyệt..."
            label="Nhóm phê duyệt"
            url={API_APPROVE_GROUPS}
            onChange={value => setApproved(value)}
            value={approved}
          />
          <AsyncAutocomplete
            name="Chọn người phê duyệt tiến độ... "
            label="Người phê duyệt"
            url={API_USERS}
          />
        </Grid>
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 10, marginRight: 40 }}>
        <Button style={{ marginRight: 5 }} variant="outlined" color="primary" onClick={handleSubmit}>
          Lưu
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Hủy
        </Button>
      </div>
    </div>
  );
}

EditTaskDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
};



export default EditTaskDialog;
