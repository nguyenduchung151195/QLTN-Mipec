import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addDocumentary state domain
 */

const selectAddDocumentaryDomain = state => state.get('addDocumentary', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddDocumentary
 */

const makeSelectAddDocumentary = () => createSelector(selectAddDocumentaryDomain, substate => substate.toJS());

export default makeSelectAddDocumentary;
export { selectAddDocumentaryDomain };
