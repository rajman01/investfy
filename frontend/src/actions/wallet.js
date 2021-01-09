import axios from 'axios';
import { GET_WALLET, FUND_WALLET, SEND_CASH, AUTH_ERROR } from './types';
import { tokenConfig } from './auth';
import { returnErrors, createMessage } from './messages';

export const getWallet = () => (dispatch, getState) => {
    axios.get('/wallet', tokenConfig(getState))
    .then((res) => {
        dispatch({
            type: GET_WALLET,
            payload: res.data,
        });
    })
    .catch((err) => {
        if (err.response.status === 401){
            dispatch({
                type: AUTH_ERROR
            });
        }else {
            dispatch(returnErrors(err.response.data, err.response.status));
        }
    });
};

export const fundWallet = ({amount}) => (dispatch, getState) => {
    const body = JSON.stringify({amount});
    axios.post('/wallet/fund', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: FUND_WALLET,
            payload: res.data.transaction
        });
    })
    .catch(err => {
        if (err.response.status === 401){
            dispatch({
                type: AUTH_ERROR
            });
        }else {
            dispatch(returnErrors(err.response.data, err.response.status));
        }
    })
}

export const sendCash = ({wallet_id, amount, password}) => (dispatch, getState) => {
    const body = JSON.stringify({wallet_id, amount, password});
    axios.post('/wallet/transfer', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: SEND_CASH,
            payload: res.data.transaction
        });
    })
    .catch(err => {
        if (err.response.status === 401){
            dispatch({
                type: AUTH_ERROR
            });
        }else {
            dispatch(returnErrors(err.response.data, err.response.status));
        }
    })
}

export const timeStamp = (timeStamp) => {
    if(timeStamp){    
        const date = timeStamp.slice(0, 10);
        const time = timeStamp.slice(11, 16);
        return `${date} ${time}`
    }
}