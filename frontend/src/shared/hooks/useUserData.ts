import { useDispatch, useSelector, useStore } from 'react-redux';
import { IUserData, meRequestAsync } from "../../store/me/actions";
import { useEffect } from 'react';
import { useAppSelector } from './useAppSelector';
import { useNavigate } from 'react-router-dom';

export function useUserData() {
  const dataUser = useAppSelector<IUserData>(state => state.me.data);
  const loadingUser = useAppSelector<boolean>(state => state.me.loading);
  const errorUser = useAppSelector<String>(state => state.me.error);
  const token = useAppSelector<string>(state => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    //if (!token) navigate('/auth/welcome');
    //@ts-ignore
    dispatch(meRequestAsync());

  }, [token]);

  return { dataUser, loadingUser, errorUser };
}