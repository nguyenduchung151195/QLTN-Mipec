import { fromJS } from 'immutable';
import towerContractPageReducer from '../reducer';

describe('towerContractPageReducer', () => {
  it('returns the initial state', () => {
    expect(towerContractPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
