import { GET_BANKS, GET_ACCOUNTS, AUTH_ERROR, ADD_ACCOUNT, DELETE_ACCOUNT, MAKE_PAYMENT } from './types';
import axios from 'axios';
import { tokenConfig } from './auth';
import { returnErrors, createMessage } from './messages';

export const getBanks = () => (dispatch, getState) => {
    axios.get('/payment/banks', tokenConfig(getState))
    .then(res => {
        dispatch({
            type: GET_BANKS,
            payload: res.data,
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
    });
}

export const getAccounts = () => (dispatch, getState) => {
    axios.get('/payment/accounts', tokenConfig(getState))
    .then(res => {
        dispatch({
            type: GET_ACCOUNTS,
            payload: res.data
        })
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

export const addAccount = ({name, bank_code, number}) => (dispatch, getState) => {
    const body = JSON.stringify({name, bank_code, number});
    axios.post('/payment/account/add', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: 'Account Added'}));
        dispatch({
            type: ADD_ACCOUNT,
            payload: res.data
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

export const deleteAccount = ({id}) => (dispatch, getState) => {
    axios.delete(`/payment/accounts/${id}`, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: 'Account deleted'}));
        dispatch({
            type: DELETE_ACCOUNT,
            payload: id
        })
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

export const makePayment = ({acct_no, amount, password, bank_code, name}) => (dispatch, getState) => {
    const body = JSON.stringify({acct_no, amount, password, bank_code, name});
    axios.post('/payment/make-payment', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: MAKE_PAYMENT,
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