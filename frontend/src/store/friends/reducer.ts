import { Reducer } from 'react';
import { IUserRank, FRIENDS_REQUEST, FRIENDS_REQUEST_ERROR, FRIENDS_REQUEST_SUCCESS, FriendsRequestAction, FriendsRequestErrorAction, FriendsRequestSuccessAction } from './actions';

export type RankState = {
    loading: boolean,
    error: String,
    data: Array<IUserRank>
}

type FriendsAction = FriendsRequestAction | FriendsRequestSuccessAction | FriendsRequestErrorAction;

export const friendsReducer: Reducer<RankState, FriendsAction> = (state, action) => {
    switch (action.type) {
        case FRIENDS_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FRIENDS_REQUEST_ERROR:
            return {
                ...state,
                error: action.error,
                loading: false,
            };
        case FRIENDS_REQUEST_SUCCESS:
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