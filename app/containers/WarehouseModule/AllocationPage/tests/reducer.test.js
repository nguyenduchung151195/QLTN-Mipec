import { fromJS } from 'immutable';
import allocationPageReducer from '../reducer';

describe('allocationPageReducer', () => {
  it('returns the initial state', () => {
    expect(allocationPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
