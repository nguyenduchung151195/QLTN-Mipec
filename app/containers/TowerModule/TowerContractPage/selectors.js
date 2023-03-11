import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the towerContractPage state domain
 */

const selectTowerContractPageDomain = state => state.get('towerContractPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TowerContractPage
 */

const makeSelectTowerContractPage = () => createSelector(selectTowerContractPageDomain, substate => substate.toJS());
const makeSelectCrmConfigPage = () => createSelector(selectTowerContractPageDomain, substate => substate.toJS());
export default makeSelectTowerContractPage;
export { selectTowerContractPageDomain, makeSelectCrmConfigPage };
