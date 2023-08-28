import { AUTH_ERROR, GET_JOINT_SAVE, DEPOSIT_JOINT_SAVE, DISBAND_JOINT_SAVE, LEAVE_JOINT_SAVE } from './types';
import axios from 'axios';
import { tokenConfig } from './auth';
import { returnErrors, createMessage } from './messages';


export const getJointSave = (id) => (dispatch, getState) => {
    axios.get(`/savings/jointsave/${id}`, tokenConfig(getState))
    .then(res => {
        dispatch({
            type: GET_JOINT_SAVE, 
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


export const jointSaveDeposit = ({id, password}) => (dispatch, getState) => {
    const body = JSON.stringify({password});
    axios.put(`/savings/jointsave/contribute/${id}`, body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: DEPOSIT_JOINT_SAVE,
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

export const disbandJointSave = ({id}) => (dispatch, getState) => {
    axios.delete(`/savings/jointsave/disband/${id}`, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: DISBAND_JOINT_SAVE
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


export const inviteJointSave = ({id, members}) => (dispatch, getState) => {
    const body = JSON.stringify({members});
    axios.post(`/savings/jointsave/invite/${id}`, body, tokenConfig(getState))
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
    });
}


export const leaveJointSave = ({id}) => (dispatch, getState) => {
    axios.get(`/savings/jointsave/leave/${id}`, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: LEAVE_JOINT_SAVE
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