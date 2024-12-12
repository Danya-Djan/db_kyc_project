import { Reducer } from 'react';
import { RANK_REQUEST, RANK_REQUEST_ERROR, RANK_REQUEST_SUCCESS, RankRequestAction, RankRequestErrorAction, RankRequestSuccessAction } from './actions';
import { RankState } from '../friends/reducer';


type RankAction = RankRequestAction | RankRequestSuccessAction | RankRequestErrorAction;

export const rankReducer: Reducer<RankState, RankAction> = (state, action) => {
    switch (action.type) {
        case RANK_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case RANK_REQUEST_ERROR:
            return {
                ...state,
                error: action.error,
                loading: false,
            };
        case RANK_REQUEST_SUCCESS:
            return {
                ...state,
                data: action.data,
                loading: false,
                error: ''
            };
        default:
            return state;
    }
}