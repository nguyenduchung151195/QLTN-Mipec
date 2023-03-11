import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the assetGuaranteePage state domain
 */

const selectAssetGuaranteePageDomain = state => state.get('assetGuaranteePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AssetGuaranteePage
 */

const makeSelectAssetGuaranteePage = () => createSelector(selectAssetGuaranteePageDomain, substate => substate.toJS());

export default makeSelectAssetGuaranteePage;
export { selectAssetGuaranteePageDomain };
