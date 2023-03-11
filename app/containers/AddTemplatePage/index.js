/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 *
 * AddTemplatePage
 *
 */

import React, { createRef } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
// import content from './content';
import CustomInputField from 'components/Input/CustomInputField';
import { Grid, List, ListItem, MenuItem, Button, withStyles, Typography, AppBar, Toolbar } from '@material-ui/core';
import { Dialog, TextField, Paper } from 'components/LifetekUi';
import { Edit, Close } from '@material-ui/icons';
// import CKEditor from '@ckeditor/ckeditor5-react';
// import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { injectIntl } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import './style.scss';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { extraFields, clientId } from '../../variable';
import makeSelectAddTemplatePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { handleChangeTitle, getTemplate, handleChange, postTemplate, putTemplate, mergeData, getAllTemplate, getAllModuleCode } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import messages from './messages';
import CustomAppBar from 'components/CustomAppBar';

const styles = {
  textField: {
    marginBottom: '25px',
    color: 'black',
  },
};

const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  Undo,
  Redo,
  FontSize,
  FontName,
  FormatBlock,
  Link,
  Unlink,
  InsertImage,
  ViewHtml,
  InsertTable,
  AddRowBefore,
  AddRowAfter,
  AddColumnBefore,
  AddColumnAfter,
  DeleteRow,
  DeleteColumn,
  DeleteTable,
  MergeCells,
  SplitCell,
} = EditorTools;

function PrintData({ data, column = 3 }) {
  if (!data.length) return <p>Không có viewConfig cho tham chiếu này</p>;
  const number = Math.ceil(data.length / column);
  const dataColumn = [];

  const count = column - 1;
  for (let index = 0; index <= count; index++) {
    switch (index) {
      case 0:
        dataColumn[index] = data.slice(0, number);
        break;
      case count:
        dataColumn[index] = data.slice(number * count, data.length);
        break;
      default:
        dataColumn[index] = data.slice(number * index, number * (index + 1));
        break;
    }
  }

  return (
    <React.Fragment>
      {dataColumn.map(item => (
        <List>
          {item.map(element => (
            <ListItem>{element}</ListItem>
          ))}
        </List>
      ))}
    </React.Fragment>
  );
}

/* eslint-disable react/prefer-stateless-function */
export class AddTemplatePage extends React.Component {
  state = { modules: JSON.parse(localStorage.getItem('viewConfig')), copyTemplate: {} };

  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.moduleCode = React.createRef();
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getTemplate(id, this.setHtml);
    this.props.getAllTemplate();
    this.props.getAllModuleCode();
  }

  saveTemplate = () => {
    const view = this.editor.view;
    const id = this.props.match.params.id;
    const templateData = this.props.addTemplatePage;
    const data = {
      title: templateData.title,
      categoryDynamicForm: templateData.categoryDynamicForm,
      content: EditorUtils.getHtml(view.state),
      code: templateData.code,
      moduleCode: templateData.moduleCode,
      clientId,
      filterField: this.state.filterField,
      filterFieldValue: this.state.filterFieldValue,
    };
    if (id === 'add') this.props.postTemplate(data);
    else {
      let result = this.props.putTemplate(id, data);
      if (result) {
        this.onGoBack();
      }
    }
  };

  setHtml = () => {
    const view = this.editor.view;
    EditorUtils.setHtml(view, this.props.addTemplatePage.content);
    this.setState({ filterField: this.props.addTemplatePage.filterField, filterFieldValue: this.props.addTemplatePage.filterFieldValue });
  };

  referenceDialog = (code = 'Customer', name) => {
    this.props.mergeData({ codeRef: code, dialogRef: true, name });
  };

  convertData = (code, ref = true, prefix = false) => {
    const result = [];
    if (code) {
      const data = this.state.modules.find(item => item.code === code);
      let dataExtra = extraFields.find(i => i.code === code);
      if (dataExtra) dataExtra = dataExtra.data;
      else dataExtra = [];
      if (!data) return [];
      const viewArr = data.listDisplay.type.fields.type;
      const { filterField, filterFieldValue } = this.state;
      const newData = [
        ...viewArr.columns.filter(item => {
          if (!item.checked) return false;
          if (
            filterField &&
            filterFieldValue &&
            item.filterConfig &&
            (!item.filterConfig[filterFieldValue.value] || !item.filterConfig[filterFieldValue.value].checkedShowForm)
          ) {
            return false;
          }
          return true;
        }),
        ...viewArr.others.filter(item => {
          if (!item.checked) return false;
          if (
            filterField &&
            filterFieldValue &&
            item.filterConfig &&
            (!item.filterConfig[filterFieldValue.value] || !item.filterConfig[filterFieldValue.value].checkedShowForm)
          ) {
            return false;
          }
          return true;
        }),
        ...dataExtra,
      ];
      newData.forEach((item, index) => {
        const dt = prefix ? `{${prefix}.${item.name}} : ${item.title}` : `{${item.name}} : ${item.title}`;
        if (!ref) result[index] = dt;
        else if (item.type.includes('ObjectId')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              onClick={() => this.referenceDialog(item.type.substring(9), item.name)}
              onKeyDown={this.handleKeyDown}
              style={{ color: '#2196f3', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {dt}
            </p>
          );
        } else if (item.type.includes('Array')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p>
              {`{${item.name}} :`}
              <span
                style={{ cursor: 'pointer', color: '#9c27b0', fontWeight: 'bold' }}
                onClick={() => this.referenceArray(item.type)}
                onKeyDown={this.handleKeyDown}
              >{`${item.title}`}</span>
            </p>
          );
        } else if (item.type.includes('Relation')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              onClick={() => this.referenceDialog(item.type.split("'")[3], item.name)}
              onKeyDown={this.handleKeyDown}
              style={{ color: '#2196f3', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {dt}
            </p>
          );
        } else if (item.type === 'extra')
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p style={{ color: '#f47536', fontWeight: 'bold' }}>{dt}</p>
          );
        else if (item.type === 'required')
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p style={{ color: '#e3165b', fontWeight: 'bold' }}>{dt}</p>
          );
        else result[index] = dt;
      });
    }
    return result;
  };

  referenceArray(data) {
    const list = data.split('|');
    const items = list[1];
    let listItem = [];
    if (items) {
      listItem = items.split(',').map(i => `{${i}}`);
    }
    this.props.mergeData({ listItem, arrayDialog: true });
  }

  handleChangeTemplate = e => {
    const {
      target: { value, name },
    } = e;
    this.setState(prevState => ({ ...prevState, [name]: value }));
    if (value) {
      const { content } = value;
      const view = this.editor.view;
      EditorUtils.setHtml(view, content);
    }
  };
  onGoBack = () => {
    this.props.history.goBack();
    // window.location.reload();
  };

  render() {
    const { modules, filterField } = this.state;
    const { classes, addTemplatePage, intl } = this.props;
    // console.log('thisaddTemplatePage',addTemplatePage)
    const { templates } = addTemplatePage;
    const id = this.props.match.params.id;
    // console.log('addTemplatePage',addTemplatePage)

    // const stock = nameAdd.match.path;
    // const addStock =  stock.slice(stock.length -3,nameAdd.length)
    // console.log("bbbbbbbb", this.props)
    let viewConfig = [];
    if (this.state.modules) {
      const data = this.state.modules.find(item => item.code === addTemplatePage.moduleCode);
      if (data) {
        viewConfig = data.listDisplay.type.fields.type.columns;
      }
    }

    let filterFieldConfig = {};
    if (filterField) {
      filterFieldConfig = viewConfig.find(i => i.name === filterField) || {};
    }
    // console.log('viewConfig', viewConfig)

    return (
      <Paper style={{ color: 'black' }}>
        <div>
          <Dialog
            maxWidth="xs"
            dialogAction={false}
            title="Tham chieu array"
            open={addTemplatePage.arrayDialog}
            onClose={() => this.props.mergeData({ arrayDialog: false })}
          >
            <PrintData column={1} data={addTemplatePage.listItem} />
          </Dialog>
          <Dialog
            dialogAction={false}
            title="Bang tham chieu"
            open={addTemplatePage.dialogRef}
            onClose={() => this.props.mergeData({ dialogRef: false })}
          >
            <Grid style={{ display: 'flex', justifyContent: 'space-between' }} item md={12}>
              <PrintData column={2} data={this.convertData(addTemplatePage.codeRef, false, addTemplatePage.name)} />
            </Grid>
          </Dialog>
          <Grid container>
            <Grid item md={12}>
              <CustomAppBar
                title={
                  id === 'add'
                    ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới biểu mẫu' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật biểu mẫu' })}`
                }
                onGoBack={this.onGoBack}
                onSubmit={this.saveTemplate}
              />
              <h4 style={{ fontWeight: 'bold', display: 'inline' }}>
                <Edit /> Danh sách mẫu báo giá, hợp đồng
              </h4>{' '}
              <span style={{ fontWeight: 'normal' }}>(Các trường màu đỏ là cần nhập)</span>
              <h4>Thông tin các từ thay thế</h4>
            </Grid>

            <Grid style={{ display: 'flex', justifyContent: 'space-around' }} item md={12}>
              <PrintData data={this.convertData(addTemplatePage.moduleCode)} />
            </Grid>
            <Grid style={{ padding: 5 }} container>
              <Grid item md={12}>
                <Typography style={{ fontWeight: 'bold' }}>Ghi chú</Typography>
                <Typography>
                  <span style={{ fontStyle: 'italic' }}>Loại thường</span>
                </Typography>
                <Typography>
                  <span style={{ color: '#2196f3', fontWeight: 'bold', fontStyle: 'italic' }}>Loại tham chiếu: </span> Click vào để chọn trường tham
                  chiếu
                </Typography>
                <Typography>
                  <span style={{ color: '#9c27b0', fontWeight: 'bold', fontStyle: 'italic' }}>Loại mảng: </span> Dùng trong bảng
                </Typography>
              </Grid>
            </Grid>

            <Grid item md={12}>
              <TextField
                select
                name="copyTemplate"
                label="Chọn biểu mẫu động mẫu"
                fullWidth
                value={this.state.copyTemplate}
                onChange={this.handleChangeTemplate}
              >
                {templates && templates.map(template => <MenuItem value={template}>{template.title}</MenuItem>)}
              </TextField>
              <TextField
                value={addTemplatePage.title}
                onChange={this.props.handleChange('title')}
                required
                className={classes.textField}
                label="Tiêu đề"
                fullWidth
              />
              <TextField
                value={addTemplatePage.code}
                onChange={this.props.handleChange('code')}
                required
                className={classes.textField}
                label="Mã"
                fullWidth
              />

              <TextField
                required
                className={classes.textField}
                label="Loại mẫu"
                value={addTemplatePage.categoryDynamicForm}
                select
                onChange={e => this.props.handleChangeTitle(e)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              >
                {addTemplatePage.templateTypes.map(option => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.title}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required
                className={classes.textField}
                label="Module"
                select
                value={addTemplatePage.moduleCode}
                fullWidth
                onChange={this.props.handleChange('moduleCode')}
                InputLabelProps={{ shrink: true }}
              >
                {addTemplatePage &&
                  addTemplatePage.modules &&
                  Object.values(addTemplatePage.modules).map((item, index) => {
                    return (
                      <MenuItem value={Object.keys(addTemplatePage.modules)[index]}>{item.title}</MenuItem>
                      // <MenuItem value={item.code}>{item.code}</MenuItem>
                    );
                  })}
              </TextField>
              <Grid container>
                <Grid item xs={6}>
                  <TextField
                    id="select-filter-field"
                    select
                    onChange={e => {
                      this.setState({ filterField: e.target.value });
                    }}
                    value={this.state.filterField}
                    label="Trường dữ liệu phân loại"
                    name="filterField"
                    style={{ width: '100%' }}
                    variant="outlined"
                    margin="normal"
                    SelectProps={{
                      MenuProps: {},
                    }}
                  >
                    {viewConfig.map((item, index) => (
                      <MenuItem value={item.name} key={`${item.name}_${index}`}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <CustomInputField
                    value={this.state.filterFieldValue}
                    type={filterFieldConfig.type}
                    label={filterFieldConfig.title}
                    configType="crmSource"
                    configCode={filterFieldConfig.code}
                    configId={filterFieldConfig.id}
                    onChange={e => this.setState({ filterFieldValue: e.target.value })}
                  />
                </Grid>
              </Grid>
              <Editor
                tools={[
                  [Bold, Italic, Underline, Strikethrough],
                  [Subscript, Superscript],
                  [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                  [Indent, Outdent],
                  [OrderedList, UnorderedList],
                  FontSize,
                  FontName,
                  FormatBlock,
                  [Undo, Redo],
                  [Link, Unlink, InsertImage, ViewHtml],
                  [InsertTable],
                  [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                  [DeleteRow, DeleteColumn, DeleteTable],
                  [MergeCells, SplitCell],
                ]}
                contentStyle={{ height: 300 }}
                contentElement={addTemplatePage.content}
                ref={editor => (this.editor = editor)}
              />
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  addTemplatePage: makeSelectAddTemplatePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleChangeTitle: e => dispatch(handleChangeTitle(e.target.value)),
    getTemplate: (id, getTem) => dispatch(getTemplate(id, getTem)),
    handleChange: name => e => dispatch(handleChange({ name, value: e.target.value })),
    postTemplate: data => dispatch(postTemplate(data)),
    putTemplate: (id, data) => dispatch(putTemplate(id, data)),
    mergeData: data => dispatch(mergeData(data)),
    getAllTemplate: () => dispatch(getAllTemplate()),
    onChangeSnackbar: () => dispatch(changeSnackbar()),

    getAllModuleCode: () => dispatch(getAllModuleCode()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addTemplatePage', reducer });
const withSaga = injectSaga({ key: 'addTemplatePage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddTemplatePage);
