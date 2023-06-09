import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the educatePage state domain
 */

const selectEducatePageDomain = state => state.get('educatePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by EducatePage
 */

const makeSelectEducatePage = () => createSelector(selectEducatePageDomain, substate => substate.toJS());

export default makeSelectEducatePage;
export { selectEducatePageDomain };

