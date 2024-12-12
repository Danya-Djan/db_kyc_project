import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./reducer";

export const SET_USER_TG = 'SET_USER_TG';

export interface IUserTg {
    id: string,
    firstName: string,
    lastName: string
}

export type SetUserTgAction = {
    type: typeof SET_USER_TG,
    userTg: IUserTg
};

export const setUserTg: ActionCreator<SetUserTgAction> = (userTg: IUserTg) => ({
    type: SET_USER_TG,
    userTg
});

export const saveUserTg = (userTg: IUserTg): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const savedUserId = getState().userTg.id;
    if(savedUserId.length === 0) {
        dispatch(setUserTg(userTg));
    }
}