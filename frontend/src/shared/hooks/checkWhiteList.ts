import { useEffect } from 'react';
import { isWhiteList } from '../../utils/isWhiteList';
import { useNavigate } from 'react-router-dom';

export function checkWhiteList() {
    const check = isWhiteList();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(!check) {
            navigate('/');
        }
    }, []);
}