import { Reducer } from 'redux';
import { SET_TOKEN } from './token';
import { IUserTg, SET_USER_TG } from './userTg';
import { MeState, meReducer } from './me/reducer';
import { ME_REQUEST, ME_REQUEST_ERROR, ME_REQUEST_SUCCESS } from './me/actions';
import { SET_REFERRAL } from './referral';
import { SET_MULT } from './mult';

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
    default:
      return state;
  }
};

