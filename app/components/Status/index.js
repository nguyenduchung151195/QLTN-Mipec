/* eslint-disable no-alert */
/**
 *
 * Status
 *
 */

import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Fab, Dialog, DialogActions, DialogContent, TextField, DialogTitle, Button } from '@material-ui/core';
import { Edit, Delete, Add } from '@material-ui/icons';

import SortableTree, { changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';

import styles from './styles';
import './styles.css';
import CustomTheme from '../ThemeSortBar/index';
import DialogAcceptRemove from '../DialogAcceptRemove';

/* eslint-disable react/prefer-stateless-function */
function convertToSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

class Status extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDialogRemove: false,
      openDialog: false,
      dialogData: { title: '', value: '' },
      isEditting: false,
      rowInfo: undefined,
      treeData: [],
    };
  }

  componentDidMount() {
    this.setState({ treeData: this.props.data.data });
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      // this.setState({
      //   treeData: props.data.data,
      // });
    }

    // console.log(props);
  }

  handleDialogRemove = () => {
    const { openDialogRemove } = this.state;
    this.setState({
      openDialogRemove: !openDialogRemove,
    });
  };

  addChild = () => {
    const { dialogData, treeData } = this.state;
    if (dialogData.title !== '') {
      dialogData.value = convertToSlug(dialogData.title);
      const newTree = [...treeData, dialogData];
      this.setState({ treeData: newTree, openDialog: false, isEditting: false });
    } else {
      alert('Không được để trống tên loại!!!')
    }
  };

  updateChild = () => {
    const { rowInfo, dialogData, treeData } = this.state;
    if (dialogData.title !== '') {
      const getNodeKey = ({ treeIndex }) => treeIndex;
      const newTree = changeNodeAtPath({
        treeData,
        path: rowInfo.path,
        getNodeKey,
        newNode: { ...dialogData, ...{ value: convertToSlug(dialogData.title) } },
      });
  
      this.setState({ treeData: newTree });
    } else {
      alert('Không được để trống tên loại!!!')
    }
  };

  removeChild = rowInfo => {
    const { treeData } = this.state;
    const getNodeKey = ({ treeIndex }) => treeIndex;
    // eslint-disable-next-line no-restricted-globals
    const r = confirm('Bạn có muốn xóa phần tử này?');
    if (r) {
      const newTree = removeNodeAtPath({ treeData, path: rowInfo.path, getNodeKey });
      this.setState({ treeData: newTree });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root} style={{ height: '80%' }}>
        <h4>{this.props.title}</h4>

        <div className="text-right">
          {this.state.treeData !== this.props.data.data ? (
            <Button
              onClick={() => {
                this.props.callBack('update-source', this.state.treeData, this.props.data);
              }}
              size="small"
              variant="outlined"
              color="primary"
              autoFocus
              round
              className="mx-3"
            >
              Lưu
            </Button>
          ) : (
            ''
          )}
          <Button
            color="primary"
            size="small"
            variant="outlined"
            round
            onClick={() => {
              this.setState({ isEditting: false, dialogData: { title: '', value: '' }, openDialog: true });
            }}
          >
            <Add /> Thêm mới
          </Button>
        </div>
        <div style={{ width: '100%', height: '100%' }}>
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => {
              this.setState({ treeData });
            }}
            theme={CustomTheme}
            canDrag={({ node }) => !node.noDragging}
            isVirtualized
            // eslint-disable-next-line consistent-return
            generateNodeProps={rowInfo => {
              console.log('rowINfo', rowInfo);
              if (!rowInfo.node.noDragging) {
                return {
                  buttons: [
                    <Fab
                      color="primary"
                      size="small"
                      onClick={() => {
                        const dialogData = Object.assign({}, rowInfo.node);
                        this.setState({ isEditting: true, openDialog: true, dialogData, rowInfo });
                      }}
                      style={{ marginLeft: 10 }}
                      title="Chỉnh sửa"
                    >
                      <Edit />
                    </Fab>,
                    <Fab
                      color="secondary"
                      size="small"
                      style={{ marginLeft: 10 }}
                      title="Xóa"
                      onClick={() => {
                        this.removeChild(rowInfo);
                      }}
                    >
                      <Delete />
                    </Fab>,
                  ],
                };
              }
            }}
            style={{ fontFamily: 'Tahoma' }}
          />
        </div>

        <DialogAcceptRemove
          title="Bạn có muốn xóa trạng thái này không?"
          openDialogRemove={this.state.openDialogRemove}
          handleClose={this.handleDialogRemove}
        />
        <Dialog open={this.state.openDialog} onClose={this.handleDialogAdd}>
          <DialogTitle id="alert-dialog-title">{this.state.isEditting ? 'Cập nhật loại' : 'Thêm mới loại'}</DialogTitle>
          <DialogContent style={{ width: 600 }}>
            <TextField
              id="standard-name"
              label="Tên loại"
              className={classes.textField}
              value={this.state.dialogData.title}
              onChange={event => {
                const { dialogData } = this.state;
                dialogData.title = event.target.value;
                this.setState({ dialogData });
              }}
              error={this.state.dialogData.title === ''}
              margin="normal"
              name="name"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                if (this.state.isEditting) {
                  this.setState({ openDialog: false });
                  this.updateChild();
                } else {
                  this.addChild();
                }
              }}
              variant="outlined"
              color="primary"
            >
              {this.state.isEditting ? 'LƯU' : 'LƯU'}
            </Button>
            <Button
              onClick={() => {
                this.setState({ openDialog: false });
              }}
              variant="outlined"
              color="secondary"
              autoFocus
            >
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Status.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string.isRequired,
  // items: PropTypes.array,
};

export default withStyles(styles)(Status);
