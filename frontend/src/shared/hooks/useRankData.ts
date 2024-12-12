import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useAppSelector } from './useAppSelector';
import { IUserRank } from '../../store/friends/actions';
import { rankRequestAsync } from '../../store/rank/actions';
import { isWhiteList } from '../../utils/isWhiteList';

export function useRankData() {
    const dataRank = useAppSelector<Array<IUserRank>>(state => state.rank.data);
    const loadingRank = useAppSelector<boolean>(state => state.rank.loading);
    const errorRank = useAppSelector<String>(state => state.rank.error);
    const token = useAppSelector<string>(state => state.token);
    const dispatch = useDispatch();

    useEffect(() => {
        const whiteList = isWhiteList();
        if(whiteList) {
            dispatch<any>(rankRequestAsync());
        }
    }, [token]);

    return { dataRank, loadingRank, errorRank };
}