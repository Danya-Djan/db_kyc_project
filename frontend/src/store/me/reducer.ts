import { Reducer } from 'react';
import { IUserData, ME_REQUEST, ME_REQUEST_ERROR, ME_REQUEST_SUCCESS, MeRequestAction, MeRequestErrorAction, MeRequestSuccessAction } from './actions';

export type MeState = {
    loading: boolean,
    error: String,
    data: IUserData
}

type MeAction = MeRequestAction | MeRequestSuccessAction | MeRequestErrorAction;

export const meReducer: Reducer<MeState, MeAction> = (state, action) => {
    switch (action.type) {
        case ME_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case ME_REQUEST_ERROR: 
            return {
                ...state,
                error: action.error,
                loading: false,
            };
        case ME_REQUEST_SUCCESS: 
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