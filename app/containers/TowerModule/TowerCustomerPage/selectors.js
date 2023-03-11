import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the towerCustomerPage state domain
 */

const selectTowerCustomerPageDomain = state => state.get('towerCustomerPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TowerCustomerPage
 */

const makeSelectTowerCustomerPage = () => createSelector(selectTowerCustomerPageDomain, substate => substate.toJS());

export default makeSelectTowerCustomerPage;
export { selectTowerCustomerPageDomain };
