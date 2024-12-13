import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../reducer";
import axios from "axios";
import { updateRank } from "../me/actions";

export interface IUserRank {
    tgId?: string,
    username?: string,
    points?: string,
    rank?: string,
    avatar?: string,
}

export const FRIENDS_REQUEST = 'FRIENDS_REQUEST';

export type FriendsRequestAction = {
    type: typeof FRIENDS_REQUEST
};

export const friendsRequest: ActionCreator<FriendsRequestAction> = () => ({
    type: FRIENDS_REQUEST,
});

export const FRIENDS_REQUEST_SUCCESS = 'FRIENDS_REQUEST_SUCCESS';

export type FriendsRequestSuccessAction = {
    type: typeof FRIENDS_REQUEST_SUCCESS;
    data: Array<IUserRank>;
};

export const friendsRequestSuccess: ActionCreator<FriendsRequestSuccessAction> = (data: Array<IUserRank>) => ({
    type: FRIENDS_REQUEST_SUCCESS,
    data
});

export const FRIENDS_REQUEST_ERROR = 'FRIENDS_REQUEST_ERROR';

export type FriendsRequestErrorAction = {
    type: typeof FRIENDS_REQUEST_ERROR;
    error: String;
};

export const friendsRequestError: ActionCreator<FriendsRequestErrorAction> = (error: String) => ({
    type: FRIENDS_REQUEST_ERROR,
    error
});

export const friendsRequestAsync = (): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const URL = getState().url;
    const token = getState().token;
    const userTg = getState().userTg.id;

    if(token) {
        dispatch(friendsRequest());
        axios.get(`${URL}/api/v1/users/rank/friends`,
            {
                headers: {
                    "Authorization": `TelegramToken ${token}`
                }
            }
        ).then(resp => {
            const data = resp.data;
            const result = [];
            if (data.length != 0) {
                for (let i = 0; i < data.length; i++) {
                    let avatar = '';
                    if (data[i].avatar) {
                        avatar = `${URL}${data[i].avatar}`;
                    }
                    const item = {
                        tgId: data[i].tg_id,
                        username: data[i].username,
                        points: data[i].points,
                        rank: data[i].rank,
                        avatar: avatar
                    }
                    if(Number(item.tgId) != Number(userTg)) {
                        result.push(item);
                    }
                    
                    if(Number(data[i].tg_id) === Number(userTg)) {
                        dispatch<any>(updateRank(Number(data[i].rank)))
                    }
                }
            }
            dispatch(friendsRequestSuccess(result));
        }).catch((err) => {
            console.log(err);
            if (err.response.data.detail) {
                dispatch(friendsRequestError(String(err.response.data.detail)));
            } else {
                dispatch(friendsRequestError(String(err)));
            }
        })
    }
    
}