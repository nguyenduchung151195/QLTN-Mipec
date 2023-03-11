import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the towerVenderPage state domain
 */

const selectTowerVenderPageDomain = state => state.get('towerVenderPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TowerVenderPage
 */

const makeSelectTowerVenderPage = () => createSelector(selectTowerVenderPageDomain, substate => substate.toJS());

export default makeSelectTowerVenderPage;
export { selectTowerVenderPageDomain };
