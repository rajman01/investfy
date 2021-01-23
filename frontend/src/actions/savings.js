import { GET_ALL_JOINT_SAVE, GET_ALL_JOINT_TARGETSAVE, GET_ALL_TARGETSAVE, CREATE_JOINT_TARGETSAVE, CREATE_TARGETSAVE, CREATE_JOINT_SAVE } from './types';
import axios from 'axios';
import { tokenConfig } from './auth';
import { returnErrors, createMessage } from './messages';

export const getAllJointSave = () => (dispatch, getState) => {
    axios.get('/savings/jointsavings', tokenConfig(getState))
    .then(res => {
        dispatch({
            type: GET_ALL_JOINT_SAVE, 
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

export const getAllJointTargetSave = () => (dispatch, getState) => {
    axios.get('/savings/targetsavings/joint', tokenConfig(getState))
    .then(res => {
        dispatch({
            type: GET_ALL_JOINT_TARGETSAVE, 
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

export const getAllTargetSave = () => (dispatch, getState) => {
    axios.get('/savings/targetsavings', tokenConfig(getState))
    .then(res => {
        dispatch({
            type: GET_ALL_TARGETSAVE, 
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

export const createJointSave = ({ name, amount, members }) => (dispatch, getState) => {
    const body = JSON.stringify({ name, amount, members });
    axios.post('/savings/jointsave/create', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: 'Joint Save Created Successfully'}));
        dispatch({
            type: CREATE_JOINT_SAVE, 
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

export const createTargetSave = ({ name, description, targeted_amount }) => (dispatch, getState) => {
    const body = JSON.stringify({ name, description, targeted_amount });
    axios.post('/savings/targetsave/create', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: 'Target Save Created Successfully'}));
        dispatch({
            type: CREATE_TARGETSAVE,
            payload: res.data
        })
    })
    .catch(err => {
        if (err.response.status === 401){
            dispatch(createMessage({response: 'Joint Target Save Created Successfully'}));
            dispatch({
                type: AUTH_ERROR
            });
        }else {
            dispatch(returnErrors(err.response.data, err.response.status));
        }
    })
}



export const createJointTargerSave = ({ name, description, targeted_amount, members }) => (dispatch, getState) => {
    const body = JSON.stringify({ name, description, targeted_amount, members });
    axios.post('/savings/targetsave/joint/create', body, tokenConfig(getState))
    .then(res => {
        dispatch({
            type: CREATE_JOINT_TARGETSAVE,
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
