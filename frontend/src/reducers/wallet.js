import { FUND_WALLET, GET_WALLET, SEND_CASH, MAKE_PAYMENT, UPDATE_WALLET_ID } from '../actions/types'

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
                balance: `${parseFloat(state.balance) + parseFloat(action.payload.amount)}`,
                recieved_transactions: [action.payload, ...state.recieved_transactions]
            }
        case SEND_CASH:
            return{
                ...state, 
                balance: `${parseFloat(state.balance) - parseFloat(action.payload.amount)}`,
                sent_transactions: [action.payload, ...state.sent_transactions]
            }
        case MAKE_PAYMENT:
            return {
                ...state,
                account_transactions: [action.payload, ...state.account_transactions],
                balance: `${parseFloat(state.balance) - parseFloat(action.payload.amount)}`,
            }

        case UPDATE_WALLET_ID:
            return {
                ...state,
                owner: {
                    ...state.owner,
                    wallet_id: action.payload
                },
                wallet_id: action.payload
            }
        default:
            return state;
    }
}