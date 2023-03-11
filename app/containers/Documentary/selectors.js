import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the documentary state domain
 */

const selectDocumentaryDomain = state => state.get('documentary', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by Documentary
 */

const makeSelectDocumentary = () => createSelector(selectDocumentaryDomain, substate => substate.toJS());

export default makeSelectDocumentary;
export { selectDocumentaryDomain };