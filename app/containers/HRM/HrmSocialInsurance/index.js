/**
 *
 * SocialInsurancePage
 *
 */

 import React, { useState, useCallback, useEffect, useMemo } from 'react';
 import PropTypes from 'prop-types';
 import { connect } from 'react-redux';
 import { Edit, Add, Archive } from '@material-ui/icons';
 import { createStructuredSelector } from 'reselect';
 import { compose } from 'redux';
 import ListPage from 'components/List';
 import injectSaga from 'utils/injectSaga';
 import injectReducer from 'utils/injectReducer';
 import { Paper, Typography, SwipeableDrawer } from '../../../components/LifetekUi';
 import makeSelectSocialInsurancePage from './selectors';
 import { API_HRM_SOCIAL } from '../../../config/urlConfig';
 import reducer from './reducer';
 import saga from './saga';
 import AddSocialInsurance from './components/AddSocialInsurance';
 import { createSocialInsurance, updateSocialInsurance, deleteSocialInsurance, mergeData } from './actions';
 import { Grid, Tooltip } from '@material-ui/core';
 import Buttons from 'components/CustomButtons/Button';
 import AddSocial from '../HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/SocialPage/components/AddSocial';
 //import { Kanban } from '../../KanbanPlugin';
 import Kanban from 'components/LifetekUi/Planner/PlanDemo';
 import { changeSnackbar } from '../../Dashboard/actions';
 import { tableToExcel } from '../../../helper';
 /* eslint-disable react/prefer-stateless-function */
 function Bt(props) {
   return (
     <Buttons
       // color={props.tab === tab ? 'gradient' : 'simple'}
       color={props.color}
       right
       round
       size="sm"
       onClick={props.onClick}
     >
       {props.children}
     </Buttons>
   );
 }
 
 function SocialInsurancePage(props) {
   const {
     mergeData,
     socialInsurancePage,
     onChangeSnackbar,
     onCreateSocialInsurance,
     onUpdateSocialInsurance,
     onDeleteSocialInsurance,
     id: hrmEmployeeId,
   } = props;
  
   const { createSocialInsuranceSuccess, updateSocialInsuranceSuccess, tab, reload } = socialInsurancePage;
   const [openDialog, setOpenDialog] = useState(false);
   const [dataExport, setDataExport] = useState();
   const [openExport, setOpenExport] = useState('PDF');
   const [html, setHtml] = useState([]);
   const [listKanbanStatus, setListKanbanStatus] = useState();
   const [selectedSocialInsurance, setSelectedSocialInsurance] = useState(null);
 
   useEffect(
     () => {
       if (createSocialInsuranceSuccess === true) {
         handleCloseSocialInsuranceDialog();
       }
       if (!createSocialInsuranceSuccess) {
       }
     },
     [createSocialInsuranceSuccess],
   );
 
   useEffect(
     () => {
       if (updateSocialInsuranceSuccess === true) {
         handleCloseSocialInsuranceDialog();
       }
       if (!updateSocialInsuranceSuccess) {
       }
     },
     [updateSocialInsuranceSuccess],
   );
 
   const handleSave = useCallback(data => {
     const { _id: socialInsuranceId } = data;
     if (!socialInsuranceId) {
       onCreateSocialInsurance(data);
     } else {
       onUpdateSocialInsurance(socialInsuranceId, data);
     }
   }, []);
 
   const handleOpenSocialInsuranceDialog = () => {
     setSelectedSocialInsurance(null);
     setOpenDialog(true);
   };
 
   const handleCloseSocialInsuranceDialog = useCallback(() => {
     setOpenDialog(false);
   }, []);
 
   const addItem = () => (
     <Add style={{ color: 'white' }} onClick={handleOpenSocialInsuranceDialog}>
       Open Menu
     </Add>
   );
 
   const addItemKanban = () => {
     setOpenDialog(true);
   };
 
   const ItemComponent = data => (
     <div
       style={{
         padding: '20px 5px',
         margin: '20px 5px',
         display: 'flex',
         justifyContent: 'flex-start',
         flexDirection: 'column',
       }}
     >
       <p className="kanban-planner">
         Tên công văn: <b> {data.name}</b>
       </p>
       <p className="kanban-planner">
         Người gửi: <b> {data.fromUsers ? data.fromUsers.map(item => item.name).join(', ') : ''}</b>
       </p>
       <p className="kanban-planner">
         Người ký: <b> {data.receiverSign ? data.receiverSign.name : ''}</b>
       </p>
 
       <div className="footer-kanban-item">
         <button type="button" className="footer-kanban-item-time">
           <Notifications style={{ fontSize: '1rem' }} /> {new Date(data.receiveTime).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}
         </button>
         <InsertCommentOutlined style={{ cursor: 'pointer' }} />
       </div>
     </div>
   );
 
   const handleDelete = data => onDeleteSocialInsurance(hrmEmployeeId, data);

   const mapFunction = item => ({
     ...item,
     hrmEmployeeId: item['name'],
   });
 
   const handleCloseExportTable = payload => {
     if (payload && payload.lastPage) setOpenExport(null);
 
     if (payload && payload.error) {
       if (payload.res && payload.res.message) {
         const { message } = payload.res;
         onChangeSnackbar({ status: true, message, variant: 'error' });
       } else onChangeSnackbar({ status: true, message: 'Có lỗi xảy ra', variant: 'error' });
       return;
     }
 
     switch (openExport) {
       case 'PDF':
         const { totalPage = 1, pageNumber = 1 } = payload || {};
         const content = tableToPDF('excel-table-task');
         setHtml({ html: [...html, { content, pageNumber }], htmlTotal: totalPage });
         break;
       default:
         tableToExcel('excel-table-task', 'W3C Example Table');
     }
   };
 
   return (
     <div>
       <Paper>
         <Grid container>
           <Grid item md={12}>
             <Bt onClick={() => mergeData({ tab: 1 })} color={tab === 1 ? 'gradient' : 'simple'}>
               Kanban
             </Bt>
             <Bt onClick={() => mergeData({ tab: 0 })} color={tab === 0 ? 'gradient' : 'simple'}>
               Danh sách
             </Bt>
           </Grid>
         </Grid>
 
         {tab === 0 && (
           <React.Fragment>
             <ListPage
               code="InsuranceInformation"
               parentCode="hrm"
               onEdit={row => {
                 setSelectedSocialInsurance(row);
                 setOpenDialog(true);
               }}
               exportExcel
               kanbanKey="_id"
               perPage={10}
               
               // filter={filter}
               onDelete={handleDelete}
               reload={reload}
               apiUrl={API_HRM_SOCIAL}
               settingBar={[addItem()]}
               disableAdd
               mapFunction={mapFunction}
             />
             {/* <ExportTable
               exportType={openExport}
               filter={{}}
               url={`${API_HRM_SOCIAL}/export`}
               onClose={handleCloseExportTable}
               open={Boolean(openExport)}
               listKanbanStatus={listKanbanStatus}
               customData={() => {
                 const { filter } = props.totalTask;
                 let { category, startDate, endDate } = filter;
                 category = taskType && taskType.find(e => e.type === category);
                 const { department, employee } = props.totalTask;
                 return { department, employee, category, startDate, endDate };
               }}
             /> */}
           </React.Fragment>
         )}
         {tab === 1 ? (
           <Kanban
             module="hrmStatus"
             code="ST06"
             apiUrl={API_HRM_SOCIAL}
             addItem={addItemKanban}
             itemComponent={ItemComponent}
             // statusType="hrmStatus"
             // enableTotal
             // titleField="name" // tên trường sẽ lấy làm title trong kanban
             // //callBack={callBack} // sự kiện trả về kanban
             // // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
             // // data={bos} // list dữ liệu
             // path={API_HRM_SOCIAL}
             // code="ST06" // code của danh sách trạng thái kanban
             // customContent={[
             //   {
             //     title: 'Giám sát',
             //     fieldName: 'supervisor.name',
             //     type: 'string',
             //   },
             //   {
             //     title: 'Khách hàng',
             //     fieldName: 'customer.name',
             //     type: 'string',
             //   },
             //   {
             //     title: 'Giá trị',
             //     fieldName: 'value.amount',
             //     type: 'number',
             //   },
             //   {
             //     title: 'Tạo ngày',
             //     fieldName: 'createdAt',
             //     type: 'date',
             //   },
             // ]}
             // customActions={[
             //   {
             //     action: 'email',
             //     params: 'typeLine=4',
             //   },
             //   {
             //     action: 'sms',
             //     params: 'typeLine=3',
             //   },
             //   {
             //     action: 'call',
             //     params: 'typeLine=2',
             //   },
             // ]}
             // history={props.history}
           />
         ) : null}
       </Paper>
       <SwipeableDrawer anchor="right" onClose={handleCloseSocialInsuranceDialog} open={openDialog} width={window.innerWidth - 260}>
         <div
         // style={{ width: window.innerWidth - 260 }}
         >
           {/* <AddSocialInsurance
             hrmEmployeeId={hrmEmployeeId}
             code="HrmRecruitment"
             socialInsurance={selectedSocialInsurance}
             onSave={handleSave}
             onClose={handleCloseSocialInsuranceDialog}
           /> */}
           <AddSocial
             code="InsuranceInformation"
             hrmEmployeeId={hrmEmployeeId}
             social={selectedSocialInsurance}
             onSave={handleSave}
             onClose={handleCloseSocialInsuranceDialog}
           />
         </div>
       </SwipeableDrawer>
     </div>
   );
 }
 
 SocialInsurancePage.propTypes = {
   // eslint-disable-next-line react/no-unused-prop-types
   dispatch: PropTypes.func.isRequired,
 };
 
 const mapStateToProps = createStructuredSelector({
   socialInsurancePage: makeSelectSocialInsurancePage(),
 });
 
 function mapDispatchToProps(dispatch) {
   return {
     mergeData: data => dispatch(mergeData(data)),
     onCreateSocialInsurance: data => dispatch(createSocialInsurance(data)),
     onChangeSnackbar: obj => {
       dispatch(changeSnackbar(obj));
     },
 
     onUpdateSocialInsurance: (hrmEmployeeId, data) => dispatch(updateSocialInsurance(hrmEmployeeId, data)),
     onDeleteSocialInsurance: (hrmEmployeeId, ids) => dispatch(deleteSocialInsurance(hrmEmployeeId, ids)),
   };
 }
 
 const withConnect = connect(
   mapStateToProps,
   mapDispatchToProps,
 );
 
 const withReducer = injectReducer({ key: 'socialInsurancePage', reducer });
 const withSaga = injectSaga({ key: 'socialInsurancePage', saga });
 
 export default compose(
   withReducer,
   withSaga,
   withConnect,
 )(SocialInsurancePage);
 