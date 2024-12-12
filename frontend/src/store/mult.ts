import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./reducer";

export const SET_MULT = 'SET_MULT';

export type SetMultAction = {
    type: typeof SET_MULT,
    mult: number
};

export const setMult: ActionCreator<SetMultAction > = (mult: number) => ({
    type: SET_MULT,
    mult
});

export const saveMult = (mult: number): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    dispatch(setMult(mult));
}