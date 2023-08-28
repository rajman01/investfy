import { GET_TARGETSAVE, AUTH_ERROR, TARGETSAVE_CASH_OUT, TARGETSAVE_DEPOSIT, DELETE_TARGETSAVE, TARGETSAVE_AUTOSAVE } from './types';
import axios from 'axios';
import { tokenConfig } from './auth';
import { returnErrors, createMessage } from './messages';

export const getTargetSave = (id) => (dispatch, getState) => {
    axios.get(`/savings/targetsave/${id}`, tokenConfig(getState))
    .then(res => {
        dispatch({
            type: GET_TARGETSAVE,
            payload: res.data
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
}

export const targetSaveCashOut = ({id}) => (dispatch, getState) => {
    axios.get(`/savings/targetsave/cashout/${id}`, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: TARGETSAVE_CASH_OUT,
            payload: res.data.transaction
        });
    })
    .catch((err) => {
        if (err.response.status === 401){
            dispatch({
                type: AUTH_ERROR
            });
        }else {
            dispatch(returnErrors(err.response.data, err.response.status))
        }
    });
}

export const targetSaveDeposit = ({id, amount, password}) => (dispatch, getState) => {
    const body = JSON.stringify({amount, password});
    axios.post(`/savings/targetsave/save/${id}`, body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: TARGETSAVE_DEPOSIT,
            payload: res.data.transaction
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
}

export const deleteTargetSave = ({id}) => (dispatch, getState) => {
    axios.delete(`savings/targetsave/delete/${id}`, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: DELETE_TARGETSAVE
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
}

export const targetSaveAutoSave = ({id, day_interval, autosave_amount}) => (dispatch, getState) => {
    const body = JSON.stringify({day_interval, autosave_amount});
    axios.put(`savings/targetsave/autosave/${id}`, body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: TARGETSAVE_AUTOSAVE,
            payload: res.data.autosave
        });
    })
    .catch((err) =>{
        if (err.response.status === 401){
            dispatch({
                type: AUTH_ERROR
            });
        }else {
            dispatch(returnErrors(err.response.data, err.response.status));
        }
    });
}