import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../reducer";
import axios from "axios";
import { IUserRank } from "../friends/actions";
import { updateRank } from "../me/actions";

export const RANK_REQUEST = 'RANK_REQUEST';

export type RankRequestAction = {
    type: typeof RANK_REQUEST
};

export const rankRequest: ActionCreator<RankRequestAction> = () => ({
    type: RANK_REQUEST,
});

export const RANK_REQUEST_SUCCESS = 'RANK_REQUEST_SUCCESS';

export type RankRequestSuccessAction = {
    type: typeof RANK_REQUEST_SUCCESS;
    data: Array<IUserRank>;
};

export const rankRequestSuccess: ActionCreator<RankRequestSuccessAction> = (data: Array<IUserRank>) => ({
    type: RANK_REQUEST_SUCCESS,
    data
});

export const RANK_REQUEST_ERROR = 'RANK_REQUEST_ERROR';

export type RankRequestErrorAction = {
    type: typeof RANK_REQUEST_ERROR;
    error: String;
};

export const rankRequestError: ActionCreator<RankRequestErrorAction> = (error: String) => ({
    type: RANK_REQUEST_ERROR,
    error
});

export const rankRequestAsync = (): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const URL = getState().url;
    const token = getState().token;
    const userTg = getState().userTg.id;
    const result: Array<IUserRank> = [];

    if(token) {
        axios.get(`${URL}/api/v1/users/rank/top?limit=3`,
            {
                headers: {
                    "Authorization": `TelegramToken ${token}`
                }
            }
        ).then(resp => {
            const dataTop = resp.data;
            if (dataTop.length != 0) {
                for (let i = 0; i < dataTop.length; i++) {
                    let avatar = '';
                    if (dataTop[i].avatar) {
                        avatar = `${URL}${dataTop[i].avatar}`;
                    }
                    let username = dataTop[i].username;
                    if (Number(dataTop[i].tg_id) === Number(userTg)) {
                        username = 'Ты';
                    }
                    const item = {
                        tgId: dataTop[i].tg_id,
                        username: username,
                        points: dataTop[i].points,
                        rank: dataTop[i].rank,
                        avatar: avatar
                    }
                    result.push(item);

                    if (Number(dataTop[i].tg_id) === Number(userTg)) {
                        dispatch<any>(updateRank(Number(dataTop[i].rank)))
                    }
                }
            }
            axios.get(`${URL}/api/v1/users/rank/neighbours?limit=20`,
                {
                    headers: {
                        "Authorization": `TelegramToken ${token}`
                    }
                }
            ).then(resp2 => {
                const data = resp2.data;
                if (data.length != 0) {
                    for (let i = 0; i < data.length; i++) {
                        let avatar = '';
                        if (data[i].avatar) {
                            avatar = `${URL}${data[i].avatar}`;
                        }
                        let username = data[i].username;
                        if (Number(data[i].tg_id) === Number(userTg)) {
                            username = 'Ты';
                        }
                        const item = {
                            tgId: data[i].tg_id,
                            username: username,
                            points: data[i].points,
                            rank: data[i].rank,
                            avatar: avatar
                        }
                        
                        if (Number(data[i].rank) > 3) {
                            result.push(item);
                        }

                        if (Number(data[i].tg_id) === Number(userTg)) {
                            dispatch<any>(updateRank(Number(data[i].rank)))
                        }
                    }
                }
                dispatch(rankRequestSuccess(result));
            }).catch((err) => {
                console.log(err);
                if (err.response.data.detail) {
                    dispatch(rankRequestError(String(err.response.data.detail)));
                } else {
                    dispatch(rankRequestError(String(err)));
                }
            })
        }).catch((err) => {
            console.log(err);
            if (err.response.data.detail) {
                dispatch(rankRequestError(String(err.response.data.detail)));
            } else {
                dispatch(rankRequestError(String(err)));
            }
        })
    }
    
}