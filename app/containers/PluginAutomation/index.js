/* eslint-disable no-alert */
/**
 *
 * PluginAutomation
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Grid, withStyles, IconButton, Card, CardContent, CardActions, Typography } from '@material-ui/core';
import { Add, Edit, Delete } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withSnackbar } from 'notistack';
import makeSelectPluginAutomation from './selectors';
import AutomationDialog from '../../components/AutomationDialog';
import { changeSnackbar } from '../Dashboard/actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectDashboardPage, { makeSelectProfile } from '../../containers/Dashboard/selectors';
import {
  getAllDynamicFormAction,
  getAllApproveGroupAction,
  resetNotis,
  addAutomationAction,
  getAllAutomationAction,
  updateAutomationAction,
  deleteAutomationAction,
} from './actions';
/* eslint-disable react/prefer-stateless-function */

const style = {
  button: {
    margin: '5px',
  },
  saveForm: {
    display: 'flex',
    justifyContent: 'center',
    padding: '5px',
  },
};

export class PluginAutomation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      automations: [],
      listKanbanStatus: [],
      openAutomationDialog: false,
      currentKanbanStatusIndex: 0,
      isEditting: false,
      viewConfig: [],
      listDynamicForms: [],
      listApproveGroup: [],
      listMappingConvert: [],
      editData: {},
    };
  }

  componentDidMount() {
    let listCrmStatus = [];
    let sortedKanbanStatus = [];
    listCrmStatus = JSON.parse(localStorage.getItem(this.props.status));
    if (this.props.code) {
      const listStatus = listCrmStatus[listCrmStatus.findIndex(d => d.code === this.props.code)].data;
      const laneStart = [];
      const laneAdd = [];
      const laneSucces = [];
      const laneFail = [];

      listStatus.forEach(item => {
        switch (item.code) {
          case 1:
            laneStart.push(item);
            break;

          case 2:
            laneAdd.push(item);
            break;

          case 3:
            laneSucces.push(item);
            break;

          case 4:
            laneFail.push(item);
            break;

          default:
            laneFail.push(item);
            break;
        }
      });

      sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    }
    const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfigLocalStorage.find(d => d.path === this.props.path);

    this.setState({ listKanbanStatus: sortedKanbanStatus, viewConfig: currentViewConfig });
    // console.log(sortedKanbanStatus, currentViewConfig);
    this.props.onGetDynamicForms();
    this.props.onGetApproveGroups();
    this.props.onGetAutomation(currentViewConfig.code);
  }

  componentWillReceiveProps(props) {
    const { pluginAutomation } = props;
    // let listDynamicForms = [];
    // let automations = [];
    if (pluginAutomation.dynamicForms !== undefined) {
      this.state.listDynamicForms = pluginAutomation.dynamicForms;
      this.state.listApproveGroup = pluginAutomation.approveGroup;
      this.state.listMappingConvert = pluginAutomation.mappingConvert;
      // this.setState({ listDynamicForms });
    }
    if (pluginAutomation.automations !== undefined) {
      this.state.automations = pluginAutomation.automations;
      // this.setState({ automations });
    }
    if (pluginAutomation.approveGroup !== undefined) {
      this.state.listApproveGroup = pluginAutomation.approveGroup;
      this.state.listMappingConvert = pluginAutomation.mappingConvert;
    }

    if (pluginAutomation.callAPIStatus === 1) {
      this.props.enqueueSnackbar(pluginAutomation.notiMessage, {
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'success',
      });
    }
    if (pluginAutomation.callAPIStatus === 0) {
      this.props.enqueueSnackbar(pluginAutomation.notiMessage, {
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
    }

    this.props.onResetNotis();
  }

  callBack = (cmd, data) => {
    switch (cmd) {
      case 'cancel-dialog':
        this.setState({ openAutomationDialog: false });
        break;

      case 'create-new': {
        const newAutomation = Object.assign({}, data);
        newAutomation.collectionCode = this.state.viewConfig.code;
        if (this.props.code === 'KANBAN') {
          newAutomation.conditions.push({
            field: 'kanbanStatus',
            operator: 'Equal',
            value: this.state.listKanbanStatus[this.state.currentKanbanStatusIndex].code,
            valueType: 'String',
          });
        } else if (this.props.kanbanStatus === 'String') {
          newAutomation.conditions.push({
            field: 'kanbanStatus',
            operator: 'Equal',
            value: this.state.listKanbanStatus[this.state.currentKanbanStatusIndex].type,
            valueType: 'String',
          });
        } else {
          newAutomation.conditions.push({
            field: 'kanbanStatus',
            operator: 'Equal',
            value: this.state.listKanbanStatus[this.state.currentKanbanStatusIndex]._id,
            valueType: 'String',
          });
        }

        this.props.onAddAutomation(newAutomation);

        this.setState({ openAutomationDialog: false });
        break;
      }
      case 'update': {
        const newAutomation = Object.assign({}, data);
        this.props.onUpdateAutomation(newAutomation._id, newAutomation);
        this.setState({ openAutomationDialog: false });
        break;
      }

      default:
        break;
    }
  };

  render() {
    const {
      listKanbanStatus,
      openAutomationDialog,
      currentKanbanStatus,
      isEditting,
      viewConfig,
      listDynamicForms,
      automations,
      editData,
    } = this.state;
    const moduldeCode =this.props.path ? this.props.path.split('/') : null
    const module = moduldeCode ?  moduldeCode[2] : null
    const roleCode = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === (module ? module :  this.props.codeModule));
    const roleModule = roleCode ? roleCode.methods : [];
    console.log('moduldeCode', moduldeCode, 'this.props.codeModule', this.props.codeModule, 'roleModule', roleModule)
    return (
      <div>
        <Grid style={{ marginTop: '20px' }} container>
          {listKanbanStatus.map((item, index) => (
            <Grid key={item._id} item sm={3}>
              <div className="m-2" style={{ border: `1px solid ${item.color}`, borderRadius: '4px' }}>
                <div style={{ backgroundColor: item.color, padding: '12px', textAlign: 'center', borderRadius: '4px', color: 'white' }}>
                  {item.name}
                </div>
                {/* {console.log(roleModule)} */}
                <div className="m-2">
                  <div className="float-right">
                  {(roleModule.find(elm => elm.name === 'POST') || { allow: false }).allow  ? (
                      <IconButton
                      onClick={() => {
                        this.setState({ openAutomationDialog: true, currentKanbanStatusIndex: index, isEditting: false });
                      }}
                    >
                      <Add color="primary" />
                    </IconButton>
                    ) : null
                  }
                  </div>
                  <div className="clearfix" />
                </div>
                <div className="p-3">
                  {automations
                    // eslint-disable-next-line eqeqeq
                    .filter(
                      d =>
                        d.conditions[d.conditions.length - 1].value ==
                        String(this.props.code === 'KANBAN' || this.props.kanbanStatus === 'String' ? item.type : item._id),
                    )
                    .map(item => (
                      <Card className="my-2">
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {item.name}
                          </Typography>
                          <Typography component="p">Hành động: {item.actions.map(action => action.actionType).join(',')}</Typography>
                        </CardContent>
                        <CardActions>
                        {(roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow  ? (
                           <IconButton
                           size="small"
                           color="primary"
                           onClick={() => {
                             this.setState({ editData: item, openAutomationDialog: true, isEditting: true });
                           }}
                            >
                              <Edit />
                            </IconButton>
                              ) : null
                           }
                           {(roleModule.find(elm => elm.name === 'DELETE') || { allow: false }).allow  ? (
                          <IconButton
                          onClick={() => {
                            // eslint-disable-next-line no-restricted-globals
                            const r = confirm('Bạn có muốn xóa automation này?');
                            if (r) {
                              this.props.onDeleteAutomation(item._id);
                            }
                          }}
                          size="small"
                          color="secondary"
                        >
                          <Delete />
                        </IconButton>
                              ) : null
                           }
                        </CardActions>
                      </Card>
                    ))}
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
        {openAutomationDialog ? (
          <AutomationDialog
            editData={editData}
            listDynamicForms={listDynamicForms}
            listMappingConvert={this.state.listMappingConvert}
            listApproveGroup={this.state.listApproveGroup}
            viewConfig={viewConfig}
            isEditting={isEditting}
            onChangeSnackbar={this.props.onChangeSnackbar}
            currentKanbanStatus={currentKanbanStatus}
            callBack={this.callBack}
            open={openAutomationDialog}
            code={this.props.code}
            path={this.props.path}
            nameViewConfig={this.props.nameViewConfig}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

// PluginAutomation.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  pluginAutomation: makeSelectPluginAutomation(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetDynamicForms: () => {
      dispatch(getAllDynamicFormAction());
    },
    onGetApproveGroups: () => {
      dispatch(getAllApproveGroupAction());
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    onAddAutomation: newAutomation => {
      dispatch(addAutomationAction(newAutomation));
    },
    onUpdateAutomation: (automationCode, newAutomation) => {
      dispatch(updateAutomationAction(automationCode, newAutomation));
    },
    onDeleteAutomation: automationCode => {
      dispatch(deleteAutomationAction(automationCode));
    },
    onGetAutomation: collectionCode => {
      dispatch(getAllAutomationAction(collectionCode));
    },
    onResetNotis: () => {
      dispatch(resetNotis());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'pluginAutomation', reducer });
const withSaga = injectSaga({ key: 'pluginAutomation', saga });

PluginAutomation.defaultProps = {
  status: 'crmStatus',
};

export default compose(
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(style),
)(PluginAutomation);
