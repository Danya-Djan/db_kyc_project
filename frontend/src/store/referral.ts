import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./reducer";

export const SET_REFERRAL = 'SET_REFERRAL';

export type SetReferralAction = {
    type: typeof SET_REFERRAL,
    referral: string
};

export const setReferral: ActionCreator<SetReferralAction > = (referral: string) => ({
    type: SET_REFERRAL,
    referral
});

export const saveReferral = (referral: string): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const savedReferral = getState().referral;
    if(savedReferral.length === 0) {
        dispatch(setReferral(referral));
    }
}