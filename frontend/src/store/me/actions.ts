import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../reducer";
import axios from "axios";
import { saveMult } from "../mult";
import { saveToken } from "../token";

export interface IAuctionItem {
    id: string,
    name: string,
    img: string,
    bet: string
}

export interface IUserData {
    tgId?: number;
    username?: string;
    name?: string;
    avatar?: string;
    points?: string;
    energy?: string;
    referralStorage?: string;
    maxStorage: number;
    rank ?: number,
    loseAuctions?: Array<IAuctionItem>,
    topAuctions?: Array<IAuctionItem>,
    winAuctions?: Array<IAuctionItem>,
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
    const Url = getState().url;
    const URLClick = getState().urlClick;
    //const referral = getState().referral;
    let referral = '';
    const currentUrl = new URL(window.location.href);
    const referredBy = currentUrl.searchParams.get("referred_by");
    if (referredBy) {
        referral = referredBy;
    }

    const firstClick = (token: string) => {
        axios.post(`${URLClick}/api/v1/batcher/batch-click/`,
            {
                count: 1
            },
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

            const energy = Number(resp.data.energy);
            dispatch<any>(updateEnergyRequestAsync(energy));
        });
    };

    if (tgId && !meData.username && token.length != 0) {
        dispatch(meRequest());
        let urlUser = '';
        if (referral.length != 0) {
            urlUser = `${Url}/api/v1/users/${tgId}?referred_by=${referral}`;
        } else {
            urlUser = `${Url}/api/v1/users/${tgId}/`;
        }
        axios.get(urlUser, {
            headers: {
                "Content-type": "application/json",
                "Authorization": `TelegramToken ${token}`
            }
        },
        ).then((resp) => {
            const user = resp.data;
            sessionStorage.setItem('shT', 't');
            sessionStorage.setItem('shL', 't');
            axios.get(`${URLClick}/api/v1/batcher/energy`, {
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
                    name: `${firstName} ${secondName}`,
                    referralStorage: user.referral_storage,
                    maxStorage: Number(user.max_storage)
                };
                dispatch(meRequestSuccess(userData));
                loadNewRank();
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
    /*if (tgId && Url && !meData.username) {
        axios.get(`${Url}/api/internal/users/get-token/${tgId}`, {
            headers: {
                "Content-type": "application/json"
            }
        },
        ).then((resp) => {
            const token = resp.data.token;
            dispatch<any>(saveToken(resp.data.token));
            if (token && !meData.username) {
                dispatch(meRequest());
                let urlUser = '';
                if (referral.length != 0) {
                    urlUser = `${Url}/api/v1/users/${tgId}?referred_by=${referral}`;
                } else {
                    urlUser = `${Url}/api/v1/users/${tgId}/`;
                }
                axios.get(urlUser, {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `TelegramToken ${token}`
                    }
                },
                ).then((resp) => {
                    sessionStorage.setItem('shT', 't');
                    sessionStorage.setItem('shL', 't');
                    const user = resp.data;
                    let avatar = user.avatar;
                    if (!avatar) {
                        avatar = '';
                    }
                    axios.get(`${URLClick}/api/v1/batcher/energy`, {
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
                            name: `${firstName} ${secondName}`,
                            referralStorage: '200', //user.referral_storage
                            maxStorage: Number(user.max_storage)
                        };
                        dispatch(meRequestSuccess(userData));
                        loadNewRank();
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


export const updateEnergyRequestAsync = (energy: number): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const meData = getState().me.data;

    let newData = meData;
    newData.energy = energy.toString();
    dispatch(meRequestSuccess(newData));
}

export const updatePointsRequestAsync = (): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const meData = getState().me.data;
    const tgId = getState().userTg.id;
    const URL = getState().url;
    const token = getState().token;

    if(token) {
        dispatch(meRequest());
        axios.get(`${URL}/api/v1/users/${tgId}/`, {
            headers: {
                "Content-type": "application/json",
                "Authorization": `TelegramToken ${token}`
            }
        },
        ).then(resp => {
            const user = resp.data;
            const points = user.points;
            const newData = meData;
            newData.points = points;
            dispatch(meRequestSuccess(newData));
            dispatch(loadNewRank());
        }).catch((err) => {
            console.log(err);
            dispatch(meRequestError(String(err)));
        })
    }
}


export const emptyReferralStorage = (): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const meData = getState().me.data;

    let newData = meData;
    const referralPoints = Number(newData.referralStorage);
    newData.referralStorage = '0';
    newData.points = (Number(newData.points) + referralPoints).toString();
    dispatch(meRequestSuccess(newData));
}

export const updateRank = (rank: number): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const meData = getState().me.data;

    let newData = meData;
    newData.rank = rank;
    dispatch(meRequestSuccess(newData));
}

export const loadNewRank = (): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const token = getState().token;
    const URL = getState().url;
    const userTg = getState().userTg.id;
    
    if(token) {
        axios.get(`${URL}/api/v1/users/rank/neighbours?limit=1`,
            {
                headers: {
                    "Authorization": `TelegramToken ${token}`
                }
            }
        ).then(resp => {
            const data = resp.data;
            if(data.length != 0) {
                
                for(let i = 0; i<data.length; i++) {
                    if (Number(data[i].tg_id) === Number(userTg)) {
                        dispatch<any>(updateRank(Number(data[i].rank)))
                    }
                }
            }
        })
    }
}


export const updateMyAuctions = (data: Array<IAuctionItem>, type: string): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const meData = getState().me.data;
    let newData = meData;

    if(type === 'top') {
        newData.topAuctions = data;
    } else if(type === 'win') {
        newData.winAuctions = data;
    } else {
        newData.loseAuctions = data;
    }

    dispatch(meRequestSuccess(newData));
}
