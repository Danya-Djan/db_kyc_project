import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../reducer";
import axios from "axios";

export interface IUserData {
    tgId?: number;
    username?: string;
    name?: string;
    avatar?: string;
    points?: string
    energy?: string;
}

export const ME_REQUEST = 'ME_REQUEST';

export type MeRequestAction = {
    type: typeof ME_REQUEST
};

export const meRequest: ActionCreator<MeRequestAction> = () => ({
    type: ME_REQUEST,
});

export const ME_REQUEST_SUCCESS = 'ME_REQUEST_SUCCESS';

export type MeRequestSuccessAction = {
    type: typeof ME_REQUEST_SUCCESS;
    data: IUserData;
};

export const meRequestSuccess: ActionCreator<MeRequestSuccessAction> = (data: IUserData) => ({
    type: ME_REQUEST_SUCCESS,
    data
});

export const ME_REQUEST_ERROR = 'ME_REQUEST_ERROR';

export type MeRequestErrorAction = {
    type: typeof ME_REQUEST_ERROR;
    error: String;
};

export const meRequestError: ActionCreator<MeRequestErrorAction> = (error: String) => ({
    type: ME_REQUEST_ERROR,
    error
});

export const meRequestAsync = (): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const tgId = getState().userTg.id;
    const meData = getState().me.data;
    const firstName = getState().userTg.firstName;
    const secondName = getState().userTg.lastName;
    const token = getState().token;
    const URL = getState().url;
    const URLClick = getState().urlClick;
    //localStorage.setItem('eg', '500');
    /*if (tgId && URL && !meData.avatar && token.length != 0 && URLClick) {
        dispatch(meRequest());
        axios.get(`${URL}/api/v1/users/${tgId}/`, {
            headers: {
                "Content-type": "application/json",
                "Authorization": `TelegramToken ${token}`
            }
        },
        ).then((resp) => {
            const user = resp.data;
            const encodeToken = btoa(unescape(encodeURIComponent(token)));
            const savedToken = localStorage.getItem('sts');
            axios.get(`${URLClick}/api/v1/energy`, {
                        headers: {
                            //"Content-type": "application/json",
                            "Authorization": `TelegramToken ${token}`
                        }
                    },
                    ).then((resp) => {
                        const energy = resp.data.energy;
                        if (savedToken) {
                            if (savedToken != encodeToken) {
                                localStorage.setItem('eg', '200'); //enegry
                                localStorage.setItem('sts', encodeToken);
                            }
                        } else {
                            localStorage.setItem('eg', '200'); //energy
                            localStorage.setItem('sts', encodeToken);
                        }
                        const userData = {
                            tgId: user.tg_id,
                            username: user.username,
                            avatar: user.avatar,
                            energy: energy.toString(), //energy
                            points: user.points,
                            name: `${firstName} ${secondName}`
                        };
                        dispatch(meRequestSuccess(userData));
                    }).catch((err) => {
                        console.log(err);
                        if (err.response.data.detail) {
                            dispatch(meRequestError(String(err.response.data.detail)));
                        } else {
                            dispatch(meRequestError(String(err)));
                        }
                    })
        }).catch((err) => {
            console.log(err);
            if (err.response.data.detail) {
                dispatch(meRequestError(String(err.response.data.detail)));
            } else {
                dispatch(meRequestError(String(err)));
            }
        })
    }*/
    if (tgId && URL && !meData.avatar) {
        axios.get(`${URL}/api/v1/users/get-token/123456`, {
            headers: {
                "Content-type": "application/json"
            }
        },
        ).then((resp) => {
            const token = resp.data.token;
            getState().token = token;
            if (token && !meData.avatar) {
                dispatch(meRequest());
                axios.get(`${URL}/api/v1/users/${tgId}/`, {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `TelegramToken ${token}`
                    }
                },
                ).then((resp) => {
                    const user = resp.data;
                    const encodeToken = btoa(unescape(encodeURIComponent(token)));
                    const savedToken = localStorage.getItem('sts');
                    axios.get(`${URLClick}/api/v1/energy`, {
                        headers: {
                            //"Content-type": "application/json",
                            "Authorization": `TelegramToken ${token}`
                        }
                    },
                    ).then((resp) => {
                        const energy = resp.data.energy;
                        if (savedToken) {
                            if (savedToken != encodeToken) {
                                localStorage.setItem('eg', '200'); //enegry
                                localStorage.setItem('sts', encodeToken);
                            }
                        } else {
                            localStorage.setItem('eg', '200'); //energy
                            localStorage.setItem('sts', encodeToken);
                        }
                        const userData = {
                            tgId: user.tg_id,
                            username: user.username,
                            avatar: user.avatar,
                            energy: energy.toString(), //user.energy
                            points: user.points,
                            name: `${firstName} ${secondName}`
                        };
                        dispatch(meRequestSuccess(userData));
                    }).catch((err) => {
                        console.log(err);
                        if (err.response.data.detail) {
                            dispatch(meRequestError(String(err.response.data.detail)));
                        } else {
                            dispatch(meRequestError(String(err)));
                        }
                    })
                }).catch((err) => {
                    console.log(err);
                    if (err.response.data.detail) {
                        dispatch(meRequestError(String(err.response.data.detail)));
                    } else {
                        dispatch(meRequestError(String(err)));
                    }
                })
            }
        }).catch((err) => {
            console.log(err);
            dispatch(meRequestError(String(err)));
        })
    }
}


export const updateCoinsRequestAsync = (coins: number, energy: number): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const meData = getState().me.data;

    let newData = meData;
    newData.points = coins.toString();
    newData.energy = energy.toString();
    dispatch(meRequestSuccess(newData));
}