import { useDispatch, useSelector, useStore } from 'react-redux';
import { IUserData, meRequestAsync } from "../../store/me/actions";
import { useEffect } from 'react';
import { useAppSelector } from './useAppSelector';
import { useNavigate } from 'react-router-dom';
import { saveReferral } from '../../store/referral';

export function useUserData() {
  const dataUser = useAppSelector<IUserData>(state => state.me.data);
  const loadingUser = useAppSelector<boolean>(state => state.me.loading);
  const errorUser = useAppSelector<String>(state => state.me.error);
  const token = useAppSelector<string>(state => state.token);
  const savedReferral = useAppSelector<string>(state => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (savedReferral.length === 0) {
      const currentUrl = new URL(window.location.href);
      const referredBy = currentUrl.searchParams.get("referred_by");
      if (referredBy) {
        dispatch<any>(saveReferral(referredBy))
      }
    } 
    if (dataUser.username?.length != 0) {
      //@ts-ignore
      dispatch(meRequestAsync());
    }
  }, [token]);

  return { dataUser, loadingUser, errorUser };
}