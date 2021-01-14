import { AUTH_ERROR, DELETE_JOINT_TARGETSAVE, GET_JOINT_TARGETSAVE, JOINT_TARGETSAVE_CASH_OUT, JOINT_TARGETSAVE_DEPOSIT, LEAVE_JOINT_TARGETSAVE, INVITE_JOINT_TARGETSAVE } from './types';
import axios from 'axios';
import { tokenConfig } from './auth';
import { returnErrors, createMessage } from './messages';

export const getJointTargetSave = (id) => (dispatch, getState) => {
    axios.get(`/savings/targetsave/joint/${id}`, tokenConfig(getState))
    .then(res => {
        dispatch({
            type: GET_JOINT_TARGETSAVE, 
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


export const jointTargetSaveCashOut = ({id}) => (dispatch, getState) => {
    axios.get(`/savings/targetsave/joint/cashout/${id}`, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: JOINT_TARGETSAVE_CASH_OUT,
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


export const jointTargetSaveDeposit = ({id, amount, password}) => (dispatch, getState) => {
    const body = JSON.stringify({amount, password});
    axios.post(`/savings/targetsave/joint/save/${id}`, body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: JOINT_TARGETSAVE_DEPOSIT,
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


export const deleteJointTargetSave = ({id}) => (dispatch, getState) => {
    axios.delete(`/savings/targetsave/joint/delete/${id}`, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: DELETE_JOINT_TARGETSAVE
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

export const inviteJointTargetSave = ({id, members}) => (dispatch, getState) => {
    const body = JSON.stringify({members});
    axios.put(`/savings/targetsave/joint/invite/${id}`, body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: INVITE_JOINT_TARGETSAVE,
            payload: res.data.new_users
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


export const leaveJointTargetSave = ({id}) => (dispatch, getState) => {
    axios.get(`/savings/targetsave/joint/leave/${id}`, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: LEAVE_JOINT_TARGETSAVE
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