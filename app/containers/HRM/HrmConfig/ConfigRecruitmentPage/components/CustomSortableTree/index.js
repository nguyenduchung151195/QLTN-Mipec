import SortableTree from 'react-sortable-tree';
import CustomTheme from 'components/ThemeSortBar/index';
import React, { useState, useEffect } from 'react';
import { Fab, Grid } from '@material-ui/core';
import { Edit, Person, Info, Add, Delete } from '@material-ui/icons';
import GridItem from 'components/Grid/ItemGrid';
import DialogAcceptRemove from 'components/DialogAcceptRemove';

const CustomSortAbleTree = props => {
  const { apiUrl, onEdit, onDelete, onChange, reload, settingBar, code, data, createQuestionSuccess, success } = props;

  const [localState, setLocalState] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDialogRemove, setOpenDialogRemove] = useState(false);

  useEffect(
    () => {
      if (apiUrl || reload)
        fetch(`${apiUrl}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setLocalState(data.data)
          });
    },
    [apiUrl, reload],
  );
  useEffect(() => {
    if (open === true) {
      setOpenDialogRemove(false);
    }
  }, [open])

  useEffect(() => {
    if (localState) {
      setTreeData(formatTreeData(localState))
    }
  }, [localState])
  const formatTreeData = (list) => {
    let newList = [];
    list.length > 0 &&
      list.map(item =>
        newList.push({
          ...item,
          ...{ title: item.name },
        }),
      );
    return newList;
  }
  useEffect(() => {
    if (createQuestionSuccess) {
      handleCloseDialog();
    }
  }, [createQuestionSuccess])

  const hanldeDelete = () => {
    if (localData && localData._id) {
      onDelete(localData);
      setOpen(true)
    } else {
      //loi
    }
  }

  return (
    <React.Fragment>
      <Grid style={{ height: '60vh' }}>
        <Grid style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end',paddingBottom: 10 }}>
          {settingBar && settingBar.map(item => item)}
        </Grid>
        <SortableTree
          treeData={treeData}
          theme={CustomTheme}
          canDrag={({ node }) => !node.noDragging}
          isVirtualized
          style={{ fontFamily: 'Tahoma' }}
          onChange={onChange}
          generateNodeProps={rowInfo => {
            return {
              buttons: [
                <Fab color="primary" size="small" onClick={() => onEdit(rowInfo.node)} style={{ marginLeft: 10 }}>
                  <Edit />
                </Fab>,
                <Fab color="secondary" size="small" style={{ marginLeft: 10 }} title="Xóa" onClick={(e) => {
                  setLocalData(rowInfo.node)
                  setOpenDialogRemove(true)
                }}>
                  <Delete />
                </Fab>,
              ],
            };
          }}
        />
      </Grid>
      <DialogAcceptRemove
        title="Bạn có muốn xóa ?"
        openDialogRemove={openDialogRemove}
        handleClose={() => setOpenDialogRemove(false)}
        handleDelete={hanldeDelete}
      />
    </React.Fragment>
  );
};

export default CustomSortAbleTree;
