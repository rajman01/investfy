import { AUTH_ERROR, GET_ALL_INVESTMENTS, GET_INVESTMENT, GET_MY_INVESTMENTS, INVEST, INVESTMENT_CASHOUT } from './types';
import axios from 'axios';
import { tokenConfig } from './auth';
import { returnErrors, createMessage } from './messages';


export const getMyInvestments = () => (dispatch, getState) => {
    axios.get('/investment', tokenConfig(getState))
    .then(res => {
        dispatch({
            type: GET_MY_INVESTMENTS, 
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

export const getAllInvestments = () => (dispatch, getState) => {
    axios.get('/investment/all', tokenConfig(getState))
    .then(res => {
        dispatch({
            type: GET_ALL_INVESTMENTS, 
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

export const investmentApply = ({name, description, payout_type, units, amount_per_unit, yearly_profit_percent, duration}) => (dispatch, getState) => {
    const body = JSON.stringify({name, description, payout_type, units, amount_per_unit, yearly_profit_percent, duration})
    axios.post('/investment/add', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
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

export const getInvestment = (id) => (dispatch, getState) => {
    axios.get(`/investment/${id}`, tokenConfig(getState))
    .then(res => {
        dispatch({
            type: GET_INVESTMENT, 
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

export const invest = ({units, password, id}) => (dispatch, getState) => {
    const body = JSON.stringify({units, password})
    axios.post(`/investment/invest/${id}`, body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: INVEST,
            payload: res.data.transaction
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

export const investmentCashout = ({password, id}) => (dispatch, getState) => {
    const body = JSON.stringify({password})
    axios.post(`investment/cashout/${id}`, body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: INVESTMENT_CASHOUT,
            payload: res.data.transaction
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