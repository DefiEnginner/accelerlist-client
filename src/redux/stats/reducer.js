import {
    Map
} from 'immutable/dist/immutable'
import actions from './actions'

const initState = new Map({
  aggregateData: null,
  isFetchingAggregateData: false
})

export default function statsReducer(state = initState, action) {
    switch (action.type) {
      case actions.FETCH_AGGREGATE_DATA:
        return state
          .set('isFetchingAggregateData', true);

      case actions.FETCH_AGGREGATE_DATA_SUCCESS:
        return state
          .set('isFetchingAggregateData', false)
          .set('aggregateData', action.data);

      case actions.FETCH_AGGREGATE_DATA_FAILURE:
        return state
          .set('isFetchingAggregateData', false);

      default:
        return state
    }
}