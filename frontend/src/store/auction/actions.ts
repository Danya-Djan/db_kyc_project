import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../reducer";
import axios from "axios";
import { updateMyAuctions } from "../me/actions";

export interface IAuction {
    id?: string,
    commission?: number,
    time?: number,
    initialCost?: string,
    productId?: string,
    productCover?: string,
    productName?: string,
    winnersNumber?: number,
    isLead?: boolean,
    myBet?: string,
}

export const AUCTION_REQUEST = 'AUCTION_REQUEST';

export type AuctionRequestAction = {
    type: typeof AUCTION_REQUEST
};

export const auctionRequest: ActionCreator<AuctionRequestAction> = () => ({
    type: AUCTION_REQUEST,
});

export const AUCTION_REQUEST_SUCCESS = 'AUCTION_REQUEST_SUCCESS';

export type AuctionRequestSuccessAction = {
    type: typeof AUCTION_REQUEST_SUCCESS;
    data: Array<IAuction>;
};

export const auctionRequestSuccess: ActionCreator<AuctionRequestSuccessAction> = (data: Array<IAuction>) => ({
    type: AUCTION_REQUEST_SUCCESS,
    data
});

export const AUCTION_REQUEST_ERROR = 'AUCTION_REQUEST_ERROR';

export type AuctionRequestErrorAction = {
    type: typeof AUCTION_REQUEST_ERROR;
    error: String;
};

export const auctionRequestError: ActionCreator<AuctionRequestErrorAction> = (error: String) => ({
    type: AUCTION_REQUEST_ERROR,
    error
});

export const auctionRequestAsync = (): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const URL = getState().url;
    const token = getState().token;
    const userTg = getState().userTg.id;

    if (token) {
        axios.get(`${URL}/api/v1/auction/auction?is_active=true`,
            {
                headers: {
                    "Authorization": `TelegramToken ${token}`
                }
            }
        ).then(resp => {
            const data = resp.data.results;

            axios.get(`${URL}/api/v1/auction/bet?order_by=-value&is_winning=true`,
                {
                    headers: {
                        "Authorization": `TelegramToken ${token}`
                    }
                }
            ).then(resp2 => {
                const dataBet = resp2.data.results;
                const auctionResults: Array<IAuction> = [];

                axios.get(`${URL}/api/v1/auction/bet?user=${userTg}&order_by=-value`,
                    {
                        headers: {
                            "Authorization": `TelegramToken ${token}`
                        }
                    }
                ).then(resp3 => {
                    const userData = resp3.data.results;
                    const topAuctions = [];
                    const loseAuctions = [];

                    for (let i = 0; i < data.length; i++) {
                        const active = Boolean(data[i].is_active);
                        const nowDate = new Date();
                        const endDate = new Date(data[i].end_time);
                        const time = Math.ceil(Math.abs(endDate.getTime() - nowDate.getTime()) / 1000);
                        let maxBet = Number(data[i].initial_cost);
                        let isLead = false;
                        let myBet = 0;

                        if (dataBet.length != 0) {
                            for (let k = 0; k < dataBet.length; k++) {
                                if (dataBet[k].auction === data[i].id) {
                                    if (Number(dataBet[k].value) > maxBet) {
                                        maxBet = Number(dataBet[k].value);
                                    }

                                    if (Number(dataBet[k].user.tg_id) === Number(userTg)) {

                                        isLead = true;

                                        const topItem = {
                                            name: data[i].product.name,
                                            img: data[i].product.cover,
                                            bet: dataBet[k].value
                                        }

                                        if(active) {
                                            topAuctions.push(topItem);
                                        }
                                    }
                                }
                            }
                        }

                        if (userData.length != 0) {
                            for (let z = 0; z < userData.length; z++) {
                                if (userData[z].auction === data[i].id) {
                                    if (Number(userData[z].value) > myBet) {
                                        myBet = Number(userData[z].value);

                                        if(!isLead) {
                                            const loseItem = {
                                                name: data[i].product.name,
                                                img: data[i].product.cover,
                                                bet: userData[z].value
                                            }

                                            if(active) {
                                                loseAuctions.push(loseItem)
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        const item = {
                            id: data[i].id,
                            initialCost: maxBet.toString(),
                            commission: Number(data[i].commission) * 100,
                            time: time,
                            winnersNumber: data[i].quantity,
                            productId: data[i].product.id,
                            productName: data[i].product.name,
                            productCover: data[i].product.cover,
                            isLead: isLead,
                            myBet: myBet.toString()
                        };

                        if(active) {
                            auctionResults.push(item);
                        }
                    }

                    dispatch(updateMyAuctions(topAuctions, 'top'));
                    dispatch(updateMyAuctions(loseAuctions, 'lose'));

                    dispatch(auctionRequestSuccess(auctionResults));
                })

            }).catch(err => {
                console.log(err);
                if (err.response.data.detail) {
                    dispatch(auctionRequestError(String(err.response.data.detail)));
                } else {
                    dispatch(auctionRequestError(String(err)));
                }
            })
        }).catch((err) => {
            console.log(err);
            if (err.response.data.detail) {
                dispatch(auctionRequestError(String(err.response.data.detail)));
            } else {
                dispatch(auctionRequestError(String(err)));
            }
        })
    }
}


export const updateAuction = (id: string): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
    const auctionData = getState().auction.data;
    const URL = getState().url;
    const token = getState().token;
    const userTg = getState().userTg.id;
    let newData = auctionData;

    axios.get(`${URL}/api/v1/auction/bet?order_by=-value&is_winning=true&auction=${id}`,
        {
            headers: {
                "Authorization": `TelegramToken ${token}`
            }
        }
    ).then(resp => {
        const dataBet = resp.data.results;
        let maxBet = 0;
        let isLead = false;

        if (dataBet.length != 0) {
            for (let i = 0; i < dataBet.length; i++) {
                if (Number(dataBet[i].value) > maxBet) {
                    maxBet = Number(dataBet[i].value);
                }

                if (Number(dataBet[i].user.tg_id) === Number(userTg)) {
                    isLead = true;
                    newData[i].isLead = isLead;
                }
            }
        }

        axios.get(`${URL}/api/v1/auction/bet?auction=${id}&user=${userTg}&order_by=-value`,
            {
                headers: {
                    "Authorization": `TelegramToken ${token}`
                }
            }
        ).then(resp2 => {
            const data = resp2.data.results;
            let myBet = 0;

            if (data.length != 0) {
                myBet = Number(dataBet[0].value);
            }

            //обновляем данные
            for (let i = 0; i < newData.length; i++) {
                if (newData[i].id === id) {
                    if (myBet != 0) {
                        newData[i].myBet = myBet.toString();
                    }

                    if (maxBet != 0) {
                        newData[i].initialCost = maxBet.toString();
                    }
                }
            }
            dispatch(auctionRequestSuccess(newData));
        }
        )
    })
}

