import { GET_ACCOUNTS, GET_BANKS, ADD_ACCOUNT, DELETE_ACCOUNT } from '../actions/types';


const initialState = {
    banks: [],
    accounts: []
};


export default function (state=initialState, action){
    switch(action.type){
        case GET_BANKS:
            return {
                ...state,
                banks: action.payload
            }
        
        case GET_ACCOUNTS:
            return {
                ...state,
                accounts: action.payload
            }

        case ADD_ACCOUNT:
            return {
                ...state,
                accounts: [...state.accounts, action.payload]
            }
        
        case DELETE_ACCOUNT:
            return {
                ...state,
                accounts: state.accounts.filter(account => account.id != action.payload)
            }

        default:
            return state;

    }
}