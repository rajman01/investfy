import { USER_LOADED, 
        USER_LOADING, 
        AUTH_ERROR, 
        REGISTER_FAIL,
        REGISTER_SUCCESS,
        LOGIN_FAIL,
        LOGIN_SUCCESS, 
        LOGOUT_SUCCESSFUL,
        SET_WALLET,
        DEPOSIT_QUICK_SAVE} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null,
    has_set_wallet: false,
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
                user: action.payload,
                has_set_wallet: action.payload.wallet.has_set_wallet
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case REGISTER_FAIL:
        case LOGOUT_SUCCESSFUL:
            localStorage.removeItem('token')
            return{
                ...state,
                token: null,
                isAuthenticated: null,
                isLoading: false,
                user: null,
                has_set_wallet: false

            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
                has_set_wallet: action.payload.user.wallet.has_set_wallet
            };
        case SET_WALLET:
            return{
                ...state,
                has_set_wallet: true,
            }

        case DEPOSIT_QUICK_SAVE:
            return{
                ...state,
                user: {
                    ...state.user,
                    total_savings: `${parseFloat(state.user.total_savings) + parseFloat(action.payload.amount)}`
                },
                wallet: {
                    ...state.wallet,
                    balance: `${parseFloat(state.wallet.balance) - parseFloat(action.payload.amount)}`
                }
            }

        default:
            return state;
    }
}