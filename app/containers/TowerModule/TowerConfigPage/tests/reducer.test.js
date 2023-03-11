import { fromJS } from 'immutable';
import towerConfigPageReducer from '../reducer';

describe('towerConfigPageReducer', () => {
  it('returns the initial state', () => {
    expect(towerConfigPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
