import axios from 'axios'
import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, REGISTER_FAIL, REGISTER_SUCCESS } from './types'

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
        console.log(err);
        dispatch({
            type: AUTH_ERROR
        })
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
            patload: res.data
        });
    })
    .catch((err) => {
        console.log(err)
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
        })
    })
    .catch((err) => {
        dispatch({
            type: LOGIN_FAIL
        });
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
    console.log(config)

    return config;
}