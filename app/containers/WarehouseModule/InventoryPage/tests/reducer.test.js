import { fromJS } from 'immutable';
import inventoryPageReducer from '../reducer';

describe('inventoryPageReducer', () => {
  it('returns the initial state', () => {
    expect(inventoryPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
