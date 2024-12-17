import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useAppSelector } from './useAppSelector';
import { IAuction, auctionRequestAsync } from '../../store/auction/actions';

export function useAuctionData() {
    const dataAuction = useAppSelector<Array<IAuction>>(state => state.auction.data);
    const loadingAuction = useAppSelector<boolean>(state => state.auction.loading);
    const errorAuction = useAppSelector<String>(state => state.auction.error);
    const token = useAppSelector<string>(state => state.token);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch<any>(auctionRequestAsync());
    }, [token]);

    return { dataAuction, loadingAuction, errorAuction };
}