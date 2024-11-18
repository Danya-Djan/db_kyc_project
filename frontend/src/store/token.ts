import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./reducer";

export const SET_TOKEN = 'SET_TOKEN';

export type SetTokenAction = {
    type: typeof SET_TOKEN,
    token: string
};

export const setToken: ActionCreator<SetTokenAction > = (token: string) => ({
    type: SET_TOKEN,
    token
});

export const saveToken = (token: string): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const savedToken = getState().token;
    if(savedToken.length === 0) {
        dispatch(setToken(token));
    }
}