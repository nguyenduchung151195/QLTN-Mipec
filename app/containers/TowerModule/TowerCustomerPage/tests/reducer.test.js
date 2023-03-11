import { fromJS } from 'immutable';
import towerCustomerPageReducer from '../reducer';

describe('towerCustomerPageReducer', () => {
  it('returns the initial state', () => {
    expect(towerCustomerPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
