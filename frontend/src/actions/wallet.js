import axios from 'axios';
import { GET_WALLET, FUND_WALLET } from './types';
import { tokenConfig } from './auth';
import { returnErrors, createMessage } from './messages';

export const getWallet = () => (dispatch, getState) => {
    axios.get('/wallet', tokenConfig(getState))
    .then((res) => {
        console.log(res.data)
        dispatch({
            type: GET_WALLET,
            payload: res.data,
        });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const fundWallet = ({amount}) => (dispatch, getState) => {
    const body = JSON.stringify({amount});
    axios.post('/wallet/fund', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        const payload = {amount: amount, transaction: res.data.transaction}
        dispatch({
            type: FUND_WALLET,
            payload: payload
        });
    })
    .catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
    })
}

export const sendCash = ({wallet_id, amount, password}) => (dispatch, getState) => {
    const body = JSON.stringify({wallet_id, amount, password});
    axios.post('/wallet/transfer', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        getWallet();
    })
    .catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
    })
}