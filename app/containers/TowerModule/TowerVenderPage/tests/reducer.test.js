import { fromJS } from 'immutable';
import towerVenderPageReducer from '../reducer';

describe('towerVenderPageReducer', () => {
  it('returns the initial state', () => {
    expect(towerVenderPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
