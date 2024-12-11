import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../store/reducer';
import { Action } from 'redux';
import { useAppSelector } from './useAppSelector';
import { saveReferral } from '../../store/referral';

export function useReferral() {
    const dispatch = useDispatch<ThunkDispatch<RootState, unknown, Action>>();
    const savedReferral = useAppSelector<string>(state => state.token);

    useEffect(() => {
        if (savedReferral.length === 0) {
            const currentUrl = new URL(window.location.href);
            const referredBy = currentUrl.searchParams.get("referred_by");
            if (referredBy) {
                dispatch<any>(saveReferral(referredBy))
            }
        }
        
    }, [savedReferral]);
}