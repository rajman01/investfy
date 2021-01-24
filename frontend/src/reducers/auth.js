import { USER_LOADED, 
        USER_LOADING, 
        AUTH_ERROR, 
        REGISTER_FAIL,
        REGISTER_SUCCESS,
        LOGIN_FAIL,
        LOGIN_SUCCESS, 
        LOGOUT_SUCCESSFUL,
        SET_WALLET,
        DEPOSIT_QUICK_SAVE,
        TARGETSAVE_DEPOSIT,
        JOINT_TARGETSAVE_DEPOSIT,
        DEPOSIT_JOINT_SAVE,
        BVN_VERIFIED,
        UPDATE_ACCOUNT,
        UPDATE_WALLET_ID, 
        INVEST, 
        FUND_WALLET,
        SEND_CASH,
        EMAIL_CHANGE, 
        INVESTMENT_CASHOUT, 
        MAKE_PAYMENT} from '../actions/types';

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
        case TARGETSAVE_DEPOSIT:
        case DEPOSIT_JOINT_SAVE:
            return{
                ...state,
                user: {
                    ...state.user,
                    total_savings: `${parseFloat(state.user.total_savings) + parseFloat(action.payload.amount)}`,
                    wallet: {
                        ...state.user.wallet,
                        balance: `${parseFloat(state.user.wallet.balance) - parseFloat(action.payload.amount)}`
                    }
                },
            }

        case JOINT_TARGETSAVE_DEPOSIT:
            if (action.payload.own){
                return{
                    ...state,
                    user: {
                        ...state.user,
                        total_savings: `${parseFloat(state.user.total_savings) + parseFloat(action.payload.amount)}`,
                        wallet: {
                            ...state.user.wallet,
                            balance: `${parseFloat(state.user.wallet.balance) - parseFloat(action.payload.amount)}`
                        }
                    },
                }
            }else{
                return {
                    ...state,
                    user: {
                        ...state.user,
                        wallet: {
                            ...state.user.wallet,
                            balance: `${parseFloat(state.user.wallet.balance) - parseFloat(action.payload.amount)}`
                        }
                    }
                }
            }
        case UPDATE_ACCOUNT:
        case BVN_VERIFIED:
            return {
                ...state,
                user: action.payload
            }

        case UPDATE_WALLET_ID:
            return {
                ...state,
                user:{
                    ...state.user,
                    wallet: {
                        ...state.user.wallet,
                        wallet_id: action.payload
                    }
                }
            }
        case INVEST:
            return {
                ...state,
                user: {
                    ...state.user,
                    total_investments: `${parseFloat(state.user.total_investments) + parseFloat(action.payload.amount)}`,
                    wallet: {
                        ...state.user.wallet,
                        balance: `${parseFloat(state.user.wallet.balance) - parseFloat(action.payload.amount)}`
                    }
                }
            }

        case FUND_WALLET:
            return {
                ...state,
                user: {
                    ...state.user,
                    wallet: {
                        ...state.user.wallet,
                        balance: `${parseFloat(state.user.wallet.balance) + parseFloat(action.payload.amount)}`
                    }
                }
            }
        
        case SEND_CASH:
            return {
                ...state,
                user: {
                    ...state.user,
                    wallet: {
                        ...state.user.wallet,
                        balance: `${parseFloat(state.user.wallet.balance) - parseFloat(action.payload.amount)}`
                    }
                }
            }
        case EMAIL_CHANGE:
            return {
                ...state,
                user: {
                    ...state.user,
                    email_verified: false
                }
            }

        case INVESTMENT_CASHOUT:
            return {
                ...state,
                user: {
                    ...state.user,
                    wallet: {
                        ...state.user.wallet,
                        balance: `${parseFloat(state.user.wallet.balance) + parseFloat(action.payload.amount)}`
                    }
                }
            }
        case MAKE_PAYMENT:
            return {
                ...state,
                user: {
                    ...state.user,
                    wallet: {
                        ...state.user.wallet,
                        balance: `${parseFloat(state.user.wallet.balance) - parseFloat(action.payload.amount)}`
                    }
                }
            }
        default:
            return state;
    }
}