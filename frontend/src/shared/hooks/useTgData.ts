import { useDispatch } from 'react-redux';
import { verificationTg } from '../../utils/verification';
import { useEffect, useState } from 'react';
import { IUserTg, setUserTg } from '../../store/userTg';
import { saveToken } from '../../store/token';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../store/reducer';
import { Action } from 'redux';
import { useAppSelector } from './useAppSelector';

export function useTgData() {
    const [verified, setVerified] = useState(false);
    const dispatch = useDispatch<ThunkDispatch<RootState, unknown, Action>>();
    const savedToken = useAppSelector<string>(state => state.token);

    useEffect(() => {
        if (savedToken.length === 0) {
            //@ts-ignore
            const [user, token]: [IUserTg, string] = verificationTg();
            if (token.length != 0 && user.id && user.id.length != 0) {
                setVerified(true);
                dispatch<any>(saveToken(token));
                //dispatch<any>(saveToken(savedToken));
                dispatch<any>(setUserTg(user));
            } else {
                setVerified(false);
            }
        } else {
            setVerified(true);
        }
    }, [savedToken]);

    return verified;
}