import { fromJS } from 'immutable';
import assetGuaranteePageReducer from '../reducer';

describe('assetGuaranteePageReducer', () => {
  it('returns the initial state', () => {
    expect(assetGuaranteePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
