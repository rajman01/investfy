import { USER_LOADED, 
        USER_LOADING, 
        AUTH_ERROR, 
        REGISTER_FAIL,
        REGISTER_SUCCESS,
        LOGIN_FAIL,
        LOGIN_SUCCESS} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null
}

export default function(state = initialState, action){
    switch (action.type){
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case REGISTER_FAIL:
            localStorage.removeItem('token')
            return{
                ...state,
                token: null,
                isAuthenticated: null,
                isLoading: false,
                user: null

            };
            case LOGIN_SUCCESS:
            case REGISTER_SUCCESS:
                localStorage.setItem('token', action.payload.token)
                return {
                    ...state,
                    ...action.payload,
                    isAuthenticated: true,
                    isLoading: false
                };

        default:
            return state;
    }
}