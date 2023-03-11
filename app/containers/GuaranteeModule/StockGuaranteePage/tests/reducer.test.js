import { fromJS } from 'immutable';
import stockGuaranteePageReducer from '../reducer';

describe('stockGuaranteePageReducer', () => {
  it('returns the initial state', () => {
    expect(stockGuaranteePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
