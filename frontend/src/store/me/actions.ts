import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../reducer";
import axios from "axios";
import { saveMult } from "../mult";

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
    const referral = getState().referral;

    const firstClick = (token: string) => {
        axios.post(`${URLClick}/api/v1/click/`,
            {},
            {
                headers: {
                    "Authorization": `TelegramToken ${token}`
                }
            }
        ).then(resp => {
            const click = Number(resp.data.click.value);
            dispatch<any>(saveMult(click));
            const clickCode = btoa(click.toString());
            sessionStorage.setItem('mt', clickCode);
        });
    };

    if (tgId && !meData.username && token.length != 0) {
        dispatch(meRequest());
        let urlUser = '';
        if (referral.length != 0) {
            urlUser = `${URL}/api/v1/users/${tgId}?referred_by=${referral}`;
        } else {
            urlUser = `${URL}/api/v1/users/${tgId}/`;
        }
        axios.get(urlUser, {
            headers: {
                "Content-type": "application/json",
                "Authorization": `TelegramToken ${token}`
            }
        },
        ).then((resp) => {
            const user = resp.data;
            axios.get(`${URLClick}/api/v1/energy`, {
                headers: {
                    //"Content-type": "application/json",
                    "Authorization": `TelegramToken ${token}`
                }
            },
            ).then((resp) => {
                const energy = resp.data.energy;
                //
                const encodeToken = btoa(unescape(encodeURIComponent(token)));
                const savedToken = sessionStorage.getItem('tk');
                if (savedToken) {
                    if (savedToken != encodeToken) {
                        sessionStorage.setItem('tk', encodeToken);
                        firstClick(token);
                        const energyCode = btoa(energy.toString());
                        sessionStorage.setItem('eg', energyCode);
                    } else {
                        const mult = sessionStorage.getItem('mt');
                        if (mult) {
                            const encodeMult = atob(mult);
                            dispatch<any>(saveMult(Number(encodeMult)));
                        } else {
                            firstClick(token);
                        }
                    }
                } else {
                    sessionStorage.setItem('tk', encodeToken);
                    firstClick(token);
                    const energyCode = btoa(energy.toString());
                    sessionStorage.setItem('eg', energyCode);
                }
                //
                let avatar = user.avatar;
                if (!avatar) {
                    avatar = '';
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
    }
    /*if (tgId && URL && !meData.username) {
        axios.get(`${URL}/api/v1/users/get-token/123456`, {
            headers: {
                "Content-type": "application/json"
            }
        },
        ).then((resp) => {
            const token = resp.data.token;
            getState().token = token;
            if (token && !meData.username) {
                dispatch(meRequest());
                let urlUser = '';
                if (referral.length != 0) {
                    urlUser = `${URL}/api/v1/users/${tgId}?referred_by=${referral}`;
                } else {
                    urlUser = `${URL}/api/v1/users/${tgId}/`;
                }
                axios.get(urlUser, {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `TelegramToken ${token}`
                    }
                },
                ).then((resp) => {
                    const user = resp.data;
                    let avatar = user.avatar;
                    avatar = null;
                    if (!avatar) {
                        avatar = '';
                    }
                    axios.get(`${URLClick}/api/v1/energy`, {
                        headers: {
                            //"Content-type": "application/json",
                            "Authorization": `TelegramToken ${token}`
                        }
                    },
                    ).then((resp) => {
                        const energy = resp.data.energy;
                        //
                        const encodeToken = btoa(unescape(encodeURIComponent(token)));
                        const savedToken = sessionStorage.getItem('tk');
                        if (savedToken) {
                            if (savedToken != encodeToken) {
                                sessionStorage.setItem('tk', encodeToken);
                                firstClick(token);
                                const energyCode = btoa(energy.toString());
                                sessionStorage.setItem('eg', energyCode);
                            } else {
                                const mult = sessionStorage.getItem('mt');
                                if (mult) {
                                    const encodeMult = atob(mult);
                                    dispatch<any>(saveMult(Number(encodeMult)));
                                } else {
                                    firstClick(token);
                                }
                            }
                        } else {
                            sessionStorage.setItem('tk', encodeToken);
                            firstClick(token);
                            const energyCode = btoa(energy.toString());
                            sessionStorage.setItem('eg', energyCode);
                        }
                        //
                        const userData = {
                            tgId: user.tg_id,
                            username: user.username,
                            avatar: avatar,
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
    }*/
}


export const updateCoinsRequestAsync = (coins: number, energy: number): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const meData = getState().me.data;

    let newData = meData;
    newData.points = coins.toString();
    newData.energy = energy.toString();
    dispatch(meRequestSuccess(newData));
}