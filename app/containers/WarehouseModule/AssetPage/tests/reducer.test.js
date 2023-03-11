import { fromJS } from 'immutable';
import assetPageReducer from '../reducer';

describe('assetPageReducer', () => {
  it('returns the initial state', () => {
    expect(assetPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
