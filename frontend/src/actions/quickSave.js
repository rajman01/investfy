import axios from 'axios';
import { GET_QUICKSAVE, CASH_OUT, QUICK_SAVE_DEPOSIT, QUICK_SAVE_AUTOSAVE } from './types';
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
        dispatch({
            type: AUTH_ERROR
        });
    });
};

export const quickSaveCashOut = () => (dispatch, getState) => {
    axios.get('/savings/quicksave/cashout', tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: CASH_OUT,
            payload: res.data
        });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
}

export const depositQuickSave = ({amount, password}) => (dispatch, getState) => {
    const body = JSON.stringify({amount, password});
    axios.post('/savings/quicksave/save', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: QUICK_SAVE_DEPOSIT,
            payload: res.data.transaction
        });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
}

export const quickSaveAutoSave = ({autosave_amount, day_interval}) => (dispatch, getState) => {
    const body = JSON.stringify({autosave_amount, day_interval});
    axios.put('/savings/quicksave/autosave', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        const payload = {status: res.data.status, day_interval, autosave_amount}
        console.log(payload)

        dispatch({
            type: QUICK_SAVE_AUTOSAVE,
            payload: payload
        });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
}
