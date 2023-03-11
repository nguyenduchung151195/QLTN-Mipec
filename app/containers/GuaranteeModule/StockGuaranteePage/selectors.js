import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the stockGuaranteePage state domain
 */

const selectStockGuaranteePageDomain = state => state.get('stockGuaranteePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by StockGuaranteePage
 */

const makeSelectStockGuaranteePage = () => createSelector(selectStockGuaranteePageDomain, substate => substate.toJS());

export default makeSelectStockGuaranteePage;
export { selectStockGuaranteePageDomain };
