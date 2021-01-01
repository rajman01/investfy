import { FUND_WALLET, GET_WALLET } from '../actions/types'

const initialState = {
    'id': null,
    'owner': {
        'id': null,
        'username': '',
        'full_name': '',
        'first_name': '',
        'last_name': '',
        'wallet_id': ''
    },
    'wallet_id': '',
    'balance': '',
    'sent_transactions': [],
    'recieved_transactions': [],
    'savings_transactions': [],
    'account_transactions': [],
};

export default function (state = initialState, action){
    switch(action.type){
        case GET_WALLET:
            return (state = action.payload);
        case FUND_WALLET:
            return{
                ...state,
                balance: `${parseFloat(action.payload.amount) + parseFloat(state.balance)}`,
                recieved_transactions: [...state.recieved_transactions, payload.transaction]
            }
        default:
            return state;
    }
}