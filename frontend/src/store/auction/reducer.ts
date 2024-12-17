import { Reducer } from 'react';
import { AUCTION_REQUEST, AUCTION_REQUEST_ERROR, AUCTION_REQUEST_SUCCESS, AuctionRequestAction, AuctionRequestErrorAction, AuctionRequestSuccessAction, IAuction } from './actions';

export type AuctionState = {
    loading: boolean,
    error: String,
    data: Array<IAuction>
}

type AuctionAction = AuctionRequestAction | AuctionRequestSuccessAction | AuctionRequestErrorAction;

export const auctionReducer: Reducer<AuctionState, AuctionAction> = (state, action) => {
    switch (action.type) {
        case AUCTION_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case AUCTION_REQUEST_ERROR:
            return {
                ...state,
                error: action.error,
                loading: false,
            };
        case AUCTION_REQUEST_SUCCESS:
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