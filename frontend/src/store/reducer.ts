import { Reducer } from 'redux';
import { SET_TOKEN } from './token';
import { IUserTg, SET_USER_TG } from './userTg';
import { MeState, meReducer } from './me/reducer';
import { ME_REQUEST, ME_REQUEST_ERROR, ME_REQUEST_SUCCESS } from './me/actions';
import { SET_REFERRAL } from './referral';
import { SET_MULT } from './mult';
import { RankState, friendsReducer } from './friends/reducer';
import { FRIENDS_REQUEST, FRIENDS_REQUEST_ERROR, FRIENDS_REQUEST_SUCCESS } from './friends/actions';
import { RANK_REQUEST, RANK_REQUEST_ERROR, RANK_REQUEST_SUCCESS } from './rank/actions';
import { rankReducer } from './rank/reducer';
import { AuctionState, auctionReducer } from './auction/reducer';
import { AUCTION_REQUEST, AUCTION_REQUEST_ERROR, AUCTION_REQUEST_SUCCESS } from './auction/actions';

export type RootState = {
  url: string,
  urlClick: string,
  urlFull: string,
  token: string,
  userTg: IUserTg,
  styleIndex: number,
  me: MeState,
  referral: string,
  mult: number,
  friends: RankState,
  rank: RankState,
  auction: AuctionState
};

//'http://127.0.0.1:8000'
//urlClick: 'http://127.0.0.1:8080',

const initialState: RootState = {
  url: '',
  urlClick: '',
  urlFull: '',
  token: '',
  userTg: {
    id: '',
    firstName: '',
    lastName: ''
  },
  styleIndex: 0,
  me: {
    loading: false,
    error: '',
    data: {
      maxStorage: 0
    }
  },
  friends: {
    loading: false,
    error: '',
    data: []
  },
  rank: {
    loading: false,
    error: '',
    data: []
  },
  auction: {
    loading: false,
    error: '',
    data: []
  },
  referral: '',
  mult: 1,
};

export const RESET_STATE = 'RESET_STATE';

export const resetState = () => ({
  type: RESET_STATE,
});

export const rootReducer: Reducer<RootState> = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.token
      };
    case SET_USER_TG:
      return {
        ...state,
        userTg: action.userTg
      };
    case SET_REFERRAL:
      return {
        ...state,
        referral: action.referral
      };
    case SET_MULT:
      return {
        ...state,
        mult: action.mult
      };
    case ME_REQUEST:
    case ME_REQUEST_SUCCESS:
    case ME_REQUEST_ERROR:
        return {
            ...state,
            me: meReducer(state.me, action)
        };
    case FRIENDS_REQUEST:
    case FRIENDS_REQUEST_SUCCESS:
    case FRIENDS_REQUEST_ERROR:
      return {
        ...state,
        friends: friendsReducer(state.friends, action)
      };
    case RANK_REQUEST:
    case RANK_REQUEST_SUCCESS:
    case RANK_REQUEST_ERROR:
      return {
        ...state,
        rank: rankReducer(state.rank, action)
      };
    case AUCTION_REQUEST:
    case AUCTION_REQUEST_SUCCESS:
    case AUCTION_REQUEST_ERROR:
      return {
        ...state,
        auction: auctionReducer(state.auction, action)
      };
    default:
      return state;
  }
};

