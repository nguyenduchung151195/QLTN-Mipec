/**
 *
 * AddTtPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, Typography, TextField, withStyles, Checkbox, Button } from '@material-ui/core';
import { Breadcrumbs } from '@material-ui/lab';
import { NavLink } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddTtPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getTemplateType, handleChange, postTemplateType, putTemplateType, mergeData } from './actions';
import { Autocomplete } from '../../components/LifetekUi';

/* eslint-disable react/prefer-stateless-function */
const styles = {
  textField: {
    marginBottom: '25px',
    color: 'black',
  },
};

// const options = JSON.parse(localStorage.getItem('viewConfig')).map(item => ({ name: item.code, code: item.code }));
const options = [];
export class AddTtPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
   
      listModules: [],
      dataTest: []
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getTemplateType(id);
    let options = JSON.parse(localStorage.getItem('viewConfig'))
    let allModules = JSON.parse(localStorage.getItem('allModules'))
    let arr = [];
    options.map(item => {
      arr.push({
        title:
          allModules && allModules[item.code] ? allModules[item.code].title : item.code,
        code: item.code,
      });
    });
    console.log('arr',arr)

    this.setState({ listModules: arr || [] })
  }

  saveTemplateType = () => {
    const id = this.props.match.params.id;
    const addTtPage = this.props.addTtPage;
    if (id === 'add') this.props.postTemplateType(addTtPage);
    else this.props.putTemplateType(id, addTtPage);
  };

  render() {
    const { classes, addTtPage } = this.props;
    return (
      <div>
        <Helmet>
          <title>AddTtPage</title>
          <meta name="description" content="Description of AddTtPage" />
        </Helmet>
        <Grid container>
          <Grid item md={12}>
            <Breadcrumbs aria-label="Breadcrumb">
              <NavLink color="inherit" to="/">
                Dashboard
              </NavLink>
              <NavLink color="inherit" to="/setting/template_type">
                Loại văn bản
              </NavLink>
              <Typography color="textPrimary">Thêm mới</Typography>
            </Breadcrumbs>
            <Typography style={{ marginBottom: '10px' }} variant="h5">
              Thông tin mẫu văn bản
            </Typography>
            <TextField
              className={classes.textField}
              onChange={this.props.handleChange('title')}
              value={addTtPage.title}
              required
              label="Tiêu đề"
              fullWidth
            />
            <TextField
              className={classes.textField}
              value={addTtPage.code}
              onChange={this.props.handleChange('code')}
              required
              label="Mã"
              fullWidth
            />
            {/* <Autocomplete optionValue="code" select={this.props.select} value={addTtPage.modules} suggestions={this.state.listModules || []} isMulti label="Module" /> */}
            <Autocomplete
              isMulti
              name="Chọn Module ... "
              label="Module"
              onChange={this.props.handleChangeAutoComplete('modules')}
              suggestions={this.state.listModules || []}
              value={addTtPage.modules}
              optionValue="code"
              optionLabel="title"
            />
            Luôn sử dụng
            <Checkbox onChange={this.props.handleCheck('alwaysUsed')} checked={addTtPage.alwaysUsed} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px 10px' }}>
              <Button onClick={this.saveTemplateType} color="primary" variant="outlined">
                Lưu
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

// AddTtPage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  addTtPage: makeSelectAddTtPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleChange: name => e => dispatch(handleChange({ name, value: e.target.value })),
    handleCheck: name => e => dispatch(handleChange({ name, value: e.target.checked })),
    handleChangeAutoComplete: name => e => dispatch(handleChange({ name, value: e })),
    getTemplateType: id => dispatch(getTemplateType(id)),
    postTemplateType: data => dispatch(postTemplateType(data)),
    putTemplateType: (id, data) => dispatch(putTemplateType(id, data)),
    select: data => dispatch(mergeData({ modules: data })),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addTtPage', reducer });
const withSaga = injectSaga({ key: 'addTtPage', saga });

export default compose(
  withReducer,
  withSaga,
  withStyles(styles),
  withConnect,
)(AddTtPage);
