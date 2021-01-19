import axios from 'axios'
import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, REGISTER_FAIL, REGISTER_SUCCESS, LOGOUT_SUCCESSFUL, SET_WALLET, UPDATE_ACCOUNT, BVN_VERIFIED} from './types'
import { createMessage, returnErrors } from './messages'


export const loadUser = () => (dispatch, getState) => {
    dispatch({type: USER_LOADING});
    axios.get('/auth/user', tokenConfig(getState))
    .then((res) => {
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    })
    .catch(err => {
        // dispatch(returnErrors(err.response.data, err.response.status))
        dispatch({
            type: AUTH_ERROR
        });
    })
}

export const register = ({full_name, email, phone_number, password}) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        },
    }

    const body = JSON.stringify({full_name, email, phone_number, password});

    axios.post('auth/register', body, config)
    .then((res) => {
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(createMessage({registerSuccesful: "REGISTERED SUCCESSFULLY"}))
    })
    .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: REGISTER_FAIL
        });
    });
}


export const login = ({ email, password }) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        },
    }

    const body = JSON.stringify({ email, password});

    axios.post('/auth/login', body, config)
    .then((res) => {
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(createMessage({loginSuccesful: "LOGIN SUCCESSFUL"}));
    })
    .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: LOGIN_FAIL
        });
    });
}

export const setWallet = ({wallet_id, password}) => (dispatch, getState) => {
    const body = JSON.stringify({ wallet_id, password })
    axios.post('wallet/set', body, tokenConfig(getState))
    .then(res => {
        dispatch({
            type: SET_WALLET,
            payload: true
        })
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

export const logout = () => (dispatch, getState) => {
    axios.post('/auth/logout', null, tokenConfig(getState))
    .then((res) => {
        dispatch({
            type: LOGOUT_SUCCESSFUL
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
    })
}

export const sendEmailVerification = () => (dispatch, getState) => {
    axios.get('/auth/email/verification', tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
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


export const changeAccountPassword = ({current_password, new_password}) => (dispatch, getState) => {
    const body = JSON.stringify({current_password, new_password})
    axios.put('/auth/password/change', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
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

export const changeEmail = ({ new_email }) => (dispatch, getState) => {
    const body = JSON.stringify({ new_email });
    axios.put('/auth/email/change', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
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

export const verifyBVN = ({ bvn }) => (dispatch, getState) => {
    const body = JSON.stringify({ bvn });
    axios.post('/auth/bvn/verification', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: res.data.response}));
        dispatch({
            type: BVN_VERIFIED,
            payload: res.data.user
        })
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


export const updateAccount = ({ username, full_name, first_name, last_name, phone_number, dob }) => (dispatch, getState) => {
    const body = JSON.stringify({  username, full_name, first_name, last_name, phone_number, dob  });
    axios.put('/auth/user', body, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({response: 'Account Updated'}));
        dispatch({
            type: UPDATE_ACCOUNT,
            payload: res.data
        })
    })
    .catch((err) => {
        console.log(err.response)
        if (err.response.status === 401){
            dispatch({
                type: AUTH_ERROR
            });
        }else {
            dispatch(returnErrors(err.response.data, err.response.status));
        }
    });
}



export const tokenConfig = (getState) => {
    const token = getState().auth.token;

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    if(token){
        config.headers['Authorization'] = `Token ${token}`;
    }

    return config;
}