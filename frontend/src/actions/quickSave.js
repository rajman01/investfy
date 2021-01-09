import axios from 'axios';
import { GET_QUICKSAVE, QUICK_SAVE_CASH_OUT, DEPOSIT_QUICK_SAVE, AUTOSAVE_QUICK_SAVE } from './types';
import { tokenConfig } from './auth';
import { returnErrors, createMessage } from './messages';


export const getQuickSave = () => (dispatch, getState) => {
    axios.get('/savings/quicksave', tokenConfig(getState))
    .then((res) => {
        dispatch({
            type: GET_QUICKSAVE,
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

export const quickSaveCashOut = ({id}) => (dispatch, getState) => {
    axios.get('/savings/quicksave/cashout', tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: QUICK_SAVE_CASH_OUT,
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

export const depositQuickSave = ({amount, password}) => (dispatch, getState) => {
    const body = JSON.stringify({amount, password});
    axios.post('/savings/quicksave/save', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: DEPOSIT_QUICK_SAVE,
            payload: res.data.transaction,
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

export const quickSaveAutoSave = ({autosave_amount, day_interval}) => (dispatch, getState) => {
    const body = JSON.stringify({autosave_amount, day_interval});
    axios.put('/savings/quicksave/autosave', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        const payload = {status: res.data.status, day_interval, autosave_amount}
        dispatch({
            type: AUTOSAVE_QUICK_SAVE,
            payload: payload
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
