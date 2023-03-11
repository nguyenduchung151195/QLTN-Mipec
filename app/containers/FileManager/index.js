/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-alert */
/* eslint-disable no-return-assign */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/**
 *
 * FileManager
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import axios from 'axios';
import { FileManagerComponent, Inject, NavigationPane, DetailsView, Toolbar, ContextMenu } from '@syncfusion/ej2-react-filemanager';
import swal from '@sweetalert/with-react';
import { Dialog } from '.';
import { TextField, Dialog as DialogUI, } from 'components/LifetekUi';
import { Tab, Tabs, Grid, Card, MenuItem, Fab as Fa, Tooltip, DialogTitle } from '@material-ui/core';
import GridItem from 'components/Grid/ItemGrid';
import { FilterList } from '@material-ui/icons';
import { UPLOAD_FILE_METADATA } from 'config/urlConfig';
// import * as numberingSystems from 'cldr-data/main/vi/numberingSystems.json';
import * as gregorian from 'cldr-data/main/vi/ca-gregorian.json';
import * as numbers from 'cldr-data/main/vi/numbers.json';
import * as timeZoneNames from 'cldr-data/main/vi/timeZoneNames.json';
import { setCulture, loadCldr, L10n } from '@syncfusion/ej2-base';
import { language } from './messages';
import makeSelectFileManager from './selectors';
import { makeSelectProfile } from '../Dashboard/selectors';
import reducer from './reducer';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import saga from './saga';
import ShareFileContentDialog from '../../components/ShareFileContentDialog';
import CreateProjectContentDialog from '../../components/CreateProjectContentDialog';
import { SampleBase } from '../../components/SampleBase/sample-base';

import './styles.scss';
// import './custom-boostrap.css';
import { UPLOAD_APP_URL, API_PROFILE } from '../../config/urlConfig';
/* eslint-disable react/prefer-stateless-function */
import Snackbar from 'components/Snackbar';

import { clientId } from '../../variable';
import { fetchData } from '../../helper';
const sharedFileModel = {
  path: '',
  permissions: [],
  type: '',
  users: [],
  id: '',
  fullPath: '',
};
const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right' },
};
L10n.load(language);
export class FileManager extends SampleBase {
  constructor(props) {
    super(props);
    this.fileManager = React.createRef();

    this.hostUrl = `${UPLOAD_APP_URL}/file-system`;
    this.urlApp = `https://g.lifetek.vn:220`
    this.state = {
      cabin: 'company',
      sharedFileInfor: sharedFileModel,
      reload: true,
      username: '',
      moduleCode: '',
      dialogAllFilter: false,
      snackbar: {
        open: false,
        variant: 'success',
        message: '',
      },
      localState: {
        others : {}
      }
    };
  }

  convertUrl = path => path.replace(/\s/gi, '@zz_zz@');

  componentWillMount() {
    setCulture('vi');
    loadCldr(null, gregorian, numbers, timeZoneNames);

    if (this.props.match.params.id) {
      this.hostUrl = `${UPLOAD_APP_URL}/file-system/${this.props.match.params.id}`;
    }
  }

  getData = async () => {
    const x = await fetchData(API_PROFILE);
    this.setState({ username: x.username });
  };

  componentDidMount() {
    this.getData();
  }

  toolbarClick = args => {
    if (args.item.id === `${this.fileObj.element.id}_tb_createproject`) {
      swal({
        closeOnClickOutside: false,
        title: 'Thêm mới folder dự án',
        content: (
          <CreateProjectContentDialog
            onChangeNewProject={data => {
              this.newProject = data;
            }}
            onSubmit={value => {
              if (value !== 'cancel') {
                if (this.newProject.users.lenght !== 0) {
                  this.newProject.users = this.newProject.users.map(item => item.userId);
                } else {
                  this.newProject.users = [];
                }
                const self = this;
                this.newProject.clientId = clientId;
                axios({
                  method: 'post',
                  url: `${UPLOAD_APP_URL}/projects`,
                  data: this.newProject,
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                  },
                })
                  .then(res => {
                    this.newSharedFileInfor = undefined;
                    swal('Tạo mới folder dự án thành công!', '', 'success');
                    this.setState({ reload: !this.state.reload });
                    setTimeout(() => {
                      swal.close();
                    }, 3000);
                  })
                  .catch(err => {
                    this.newSharedFileInfor = undefined;
                    swal('Tạo mới folder dự án thất bại!', err.response.data.message, 'error');
                  });
              } else {
                swal.close();
              }
            }}
          />
        ),
        button: false,
      });
    }
  };

  toolbarCreate = args => {
    for (let i = 0; i < args.items.length; i++) {
      if (args.items[i].id === `${this.fileObj.element.id}_tb_createproject`) {
        args.items[i].text = 'Thêm mới dự án';
        args.items[i].prefixIcon = 'e-sub-total';
      }
    }
  };

  // <div id="watermark">
  //   <img src="http://www.topchinatravel.com/pic/city/dalian/attraction/people-square-1.jpg">
  //   <p>This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark.</p>
  // </div>

  menuClick = args => {
    if (args.item.text === 'Open') {
      args.fileDetails.forEach(element => {
        if (['.xlsx', '.docx', '.csv', '.pdf', '.xls', '.doc'].includes(element.type)) {
          swal({
            content: (
              <div id="watermark" style={{ height: 'calc(80vh - 100px)' }}>
                <iframe
                  title="Excel"
                  src={`https://docs.google.com/viewer?url=${this.hostUrl}/GetImage/${clientId}?id=${args.fileDetails[0]._id}&embedded=true`}
                  width="100%"
                  style={{ height: '100%' }}
                  value="file"
                />
                <p>{this.state.username}</p>
              </div>
            ),
            className: 'swal-document',
            button: true,
          });
          // window.open(`/Document?path=${element.filterPath + this.fileObj.pathNames[0]}/${element.name}&cabin=${this.state.cabin}`);
        } else if (element.isFile && element.type !== '.jpg' && element.type !== '.png' && element.type !== '.jpeg') {
          swal('Không có bản xem trước', 'Vui lòng tải về để mở file!', 'warning');
        }
      });
    }
    // console.log('ddd', args.fileDetails);
    if (args.item.text === 'Paste') {
      this.fileObj.refreshLayout();
    }
    if (args.item.id === 'filemanager_cm_share') {
      const fullPath = args.fileDetails[0].fullPath;

      axios({
        method: 'get',
        url: `${UPLOAD_APP_URL}/share/${args.fileDetails[0]._id}`,
        headers: { Authorization: `Bearer ${localStorage.getItem('token_03')}` },
      })
        .then(res => {
          let sharedFileInfor;
          if (res.data) {
            sharedFileInfor = res.data;
            return sharedFileInfor;
          }

          return axios({
            method: 'post',
            url: `${UPLOAD_APP_URL}/share`,
            data: {
              public: 1,
              users: [],
              permissions: ['copy', 'download', 'edit', 'editContents', 'read', 'upload'],
              path: fullPath,
              fullPath,
            },
            headers: { Authorization: `Bearer ${localStorage.getItem('token_03')}` },
          }).then(res => {
            this.setState({
              sharedFileInfor: res.data,
            });
            return res.data;
          });
        })
        .then(fileInfor => {
          this.newSharedFileInfor = fileInfor;
          swal({
            closeOnClickOutside: false,
            content: (
              <ShareFileContentDialog
                updateSharedFileInfor={data => {
                  this.newSharedFileInfor = data;
                }}
                path={fullPath}
                sharedFileInfor={this.newSharedFileInfor}
              />
            ),
            buttons: {
              cancel: 'Hủy',
              ok: { value: true, text: 'Đồng ý' },
            },
            className: 'custom-swal',
          })
            .then(isOk => {
              if (isOk) {
                this.newSharedFileInfor.users = this.newSharedFileInfor.users.map(item => item.username);
                this.newSharedFileInfor.fullPath = fullPath;
                return axios({
                  method: 'put',
                  url: `${UPLOAD_APP_URL}/share/${this.newSharedFileInfor._id}`,
                  data: this.newSharedFileInfor,
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                  },
                });
              }
            })
            .then(res => {
              if (res) {
                this.newSharedFileInfor = undefined;
                swal({
                  title: 'Chia sẻ file thành công',
                  icon: 'success',
                });
              }
            })
            .catch(err => {
              this.newSharedFileInfor = undefined;
              swal('Đã xảy ra lỗi khi chia sẻ', JSON.stringify(err.response.data.message), 'error');
            });
        });
    }
  };

  dialogSave = (e) => {
    this.setState({ dialogAllFilter: false });

    const body = {
      // id: fileId,
      model: 'FileManager',
      metaData: {
        others: this.state.localState.others,
      },
    };
    this.onCreateApprove(body);
  }

  onCreateApprove = (body) => {
    fetch(UPLOAD_FILE_METADATA, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
        // 'urlApp': 'https://g.lifetek.vn:220',
        // 'tokenApp': "token"
      },
      body: JSON.stringify(body),
    })
      .then(() => {
        this.setState({ snackbar: { open: true, message: 'Thành công', variant: 'success' } });
      })
      .catch(() => {
        this.setState({ snackbar: { open: false, message: 'Thất bại', variant: 'error' } });
      });
  }

  menuOpen = args => {
    if (this.fileObj.getSelectedFiles().length > 1) {
      this.fileObj.disableMenuItems(['Share', 'Download', 'Open']);
    }

    let condition = false;
    const ele = args.fileDetails[0];
    if (ele) {
      condition = (ele.public === 2 && ele.users.includes(this.state.username)) || ele.public === 4 || ele.username === this.state.username;
    }

    if (this.state.cabin === 'share' && !condition) {
      this.fileObj.disableMenuItems(['Share', 'Delete', 'Rename']);
    }

    if (args.fileDetails[0].filterPath === '/' && this.state.cabin === 'projects') {
      args.cancel = true;
    }
    if (args.fileDetails[0].permission && !args.fileDetails[0].permission.editContents) {
      this.fileObj.disableMenuItems(['Copy', 'Delete', 'Rename']);
    }
    for (const i in args.items) {
      if (args.items[i].id === `${this.fileObj.element.id}_cm_download`) {
        args.items[i].text = 'Download';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_share`) {
        args.items[i].text = 'Chia sẻ';
        args.items[i].iconCss = 'e-icons e-create-link';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_rename`) {
        args.items[i].text = 'Đổi tên';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_copy`) {
        args.items[i].text = 'Bản sao';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_delete`) {
        args.items[i].text = 'Xóa';
      }
    }
  };

  handleChange = (event, value) => {
    this.setState({ cabin: value });
  };
  handleOtherDataChange =  (newOther) =>{
      this.setState(state => ({ ...state, others: newOther }));
    };

  render() {
    const { cabin } = this.state;
    const allModule = JSON.parse(localStorage.getItem('allModules'))
    const value = Object.entries(allModule);
    console.log(value)
    return (
      <div>
        {!this.props.match.params.id ? (
          <Tabs value={cabin} onChange={this.handleChange} aria-label="simple tabs example" indicatorColor="primary" textColor="primary">
            <Tab value="company" label="Drive công ty" />
            <Tab value="users" label="Drive của tôi" />
            <Tab value="share" label="Được chia sẻ với tôi " />
          </Tabs>
        ) : (
          ''
        )}
        {
          <GridItem container >
            <GridItem item xs={2}>
              <TextField
                value={this.state.moduleCode}
                fullWidth
                label="Chọn module lọc"
                select
                onChange={e => {
                  this.setState({ moduleCode: e.target.value });
                }}
              >
                {value.map(i => (
                  <MenuItem key={i} value={i[0]}>
                    {`${i[1].title}`}
                  </MenuItem>
                ))}
              </TextField>
            </GridItem>
            <GridItem item xs={2}>
              {this.state.moduleCode !== '' ?
                <Fab
                  onClick={() => this.setState({ dialogAllFilter: true })}
                  color="primary"
                  style={{ width: 40, height: 40, minWidth: 40, marginTop: 8 }}>
                  <Tooltip title="Xem thêm filter">
                    <FilterList />
                  </Tooltip>
                </Fab>
                : null
              }
            </GridItem>
            {/* <DialogUI
              title="Bộ lọc"
              onClose={() => this.setState({ dialogAllFilter: false })}
              onSave={() => {

              }}
              saveText="ĐỒNG Ý"
              open={this.state.dialogAllFilter}
            >
              <CustomGroupInputField code={this.state.moduleCode} columnPerRow={3} />
            </DialogUI> */}
            <DialogUI maxWidth="md" fullWidth open={this.state.dialogAllFilter} onSave={this.dialogSave} onClose={() => this.setState({ dialogAllFilter: false })}>
              <DialogTitle style={{ padding: '0 0 20px 0' }} id="form-dialog-title1">
                Thông tin file
              </DialogTitle>
              <CustomGroupInputField code={this.state.moduleCode} columnPerRow={2} source="fileColumns" value={this.state.localState.others} />
            </DialogUI>
            <Snackbar
              open={this.state.snackbar.open}
              variant={this.state.snackbar.variant}
              message={this.state.snackbar.message}
              onClose={() =>
                this.setState({snackbar :{
                  open: false,
                  message: '',
                  variant: '',
                }})
              }
            />
          </GridItem>
        }
        <Card>
          {this.state.cabin === 'shares' ? (
            'We have nothing to share'
          ) : (
            <FileManagerComponent
              locale="vn"
              navigationPaneSettings={{ visible: false }}
              height={700}
              ref={s => (this.fileObj = s)}
              id="filemanager"
              toolbarClick={this.toolbarClick}
              toolbarCreate={this.toolbarCreate}
              toolbarSettings={{
                items: cabin === 'shares' ? [] : ['NewFolder', 'Upload', 'View', 'Delete'],
                visible: true,
              }}
              view="Details"
              detailsViewSettings={{
                columns: [
                  {
                    field: 'name',
                    headerText: 'File Name',
                    minWidth: 250,
                    width: '250',
                    customAttributes: { class: 'e-fe-grid-name' },
                    template: '${name}',
                  },
                  {
                    field: 'approverName',
                    headerText: 'Người phê duyệt',
                    minWidth: 50,
                    width: '250',
                  },
                  {
                    field: 'approvedDate',
                    headerText: 'Ngày phê duyệt',
                    minWidth: 50,
                    width: '250',
                  },
                  {
                    field: 'isApprove',
                    headerText: 'Phê duyệt',
                    minWidth: 200,
                    width: '250',
                    template: '${isApprove == "true" && "Đã phê duyệt"}',
                  },
                  { field: 'size', headerText: 'File Size', minWidth: 50, width: '110', template: '${size}' },
                  { field: '_fm_modified', headerText: 'Date Modified', minWidth: 50, width: '190' },
                ],
              }}
              allowMultiSelection={true}
              success={args => {
                let ele = null;
                ele = args.result.cwd;
                if (this.state.cabin === 'share') {
                  let condition = false;
                  if (ele) {
                    condition =
                      (ele.public === 2 && ele.users.includes(this.state.username)) || ele.public === 4 || ele.username === this.state.username;
                  }
                  if (condition) this.fileObj.enableToolbarItems(['NewFolder', 'Upload']);
                  else this.fileObj.disableToolbarItems(['NewFolder', 'Upload']);
                }

                // this.fileObj.disableToolbarItems(['Create Project']);

                if (args.action === 'Upload' && args.name === 'success') {
                  setTimeout(() => {
                    document.getElementsByClassName('e-dlg-closeicon-btn')[0].click();
                  }, 3000);
                }
              }}
              failure={args => {
                // console.log(args);
              }}
              contextMenuSettings={{
                // file: ['Open', '|', 'Download', 'Share', '|', 'Rename', 'Copy', 'Delete'],
                // folder: ['Open', '|', 'Download', 'Share', '|', 'Rename', 'Copy', 'Delete'],
                // layout: ['Paste'],
                file: ['Open', '|', 'Share', 'Download', '|', 'Rename', 'Delete'],
                folder: ['Open', '|', 'Share', '|', 'Rename', 'Delete'],
                layout: [],
              }}
              menuClick={this.menuClick}
              menuOpen={this.menuOpen}
              fileOpen={args => {
                if (
                  args.fileDetails.isFile &&
                  ['.xlsx', '.csv', '.docx', '.doc', '.png', '.jpg', '.jpeg'].findIndex(d => d === args.fileDetails.type) === -1
                ) {
                  swal('Không có bản xem trước', 'Vui lòng tải về để mở file!', 'warning');
                }
              }}
              beforeImageLoad={args => {
                args.imageUrl = `${args.imageUrl}&id=${args.fileDetails[0]._id}`;
              }}
              ajaxSettings={{
                url: `${this.hostUrl}/${this.props.match.params.id ? '' : cabin}`,
                getImageUrl: `${this.hostUrl}/GetImage/${clientId}`,
                uploadUrl: `${this.hostUrl}/${cabin}/Upload?clientId=${clientId}`,
                downloadUrl: `${this.hostUrl}/download/file`,
              }}
              beforeSend={args => {
                args.ajaxSettings.url = `${args.ajaxSettings.url}?clientId=${clientId}`;
                args.ajaxSettings.beforeSend = args => {
                  args.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token_03')}`);
                  args.httpRequest.setRequestHeader('tokenApp', `${localStorage.getItem('token')}`);
                  args.httpRequest.setRequestHeader('urlApp', `${this.urlApp}`);
                };
              }}
            >
              <Inject services={[NavigationPane, DetailsView, Toolbar, ContextMenu]} />
            </FileManagerComponent>
          )}
        </Card>
      </div>
    );
  }
}

// FileManager.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  filemanager: makeSelectFileManager(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'filemanager', reducer });
const withSaga = injectSaga({ key: 'filemanager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(FileManager);
