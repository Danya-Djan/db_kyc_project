import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useAppSelector } from './useAppSelector';
import { IUserRank, friendsRequestAsync } from '../../store/friends/actions';

export function useFriendsData() {
    const dataFriends = useAppSelector<Array<IUserRank>>(state => state.friends.data);
    const loadingFriends = useAppSelector<boolean>(state => state.friends.loading);
    const errorFriends = useAppSelector<String>(state => state.friends.error);
    const token = useAppSelector<string>(state => state.token);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch<any>(friendsRequestAsync());
    }, [token]);

    return { dataFriends, loadingFriends, errorFriends };
}