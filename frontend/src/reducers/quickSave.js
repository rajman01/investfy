import { CASH_OUT, GET_QUICKSAVE, QUICK_SAVE_AUTOSAVE, QUICK_SAVE_DEPOSIT } from '../actions/types'

const initialState = {
    'id': null,
    'user': {
        'id': null,
        'username': '',
        'full_name': '',
        'first_name': '',
        'last_name': '',
        'wallet_id': ''
    },
    'balance': '',
    'autosave': null,
    'day_interval': null,
    'autosave_amount': '0.00',
    'transactions': [],
};

export default function (state = initialState, action){
    switch(action.type){
        case GET_QUICKSAVE:
            return(state=action.payload);
        
        case CASH_OUT:
            return{
                ...state,
                balance: '0.00',
                transactions: [action.payload.transaction, ...state.transactions]
            }
        case QUICK_SAVE_DEPOSIT:
            return{
                ...state,
                balance: `${parseFloat(state.balance) + parseFloat(action.payload.amount)}`,
                transactions: [action.payload, ...state.transactions]
            }

        case QUICK_SAVE_AUTOSAVE:
            if(payload.status){
                return{
                    ...state,
                    autosave: payload.status,
                    day_interval: payload.day_interval,
                    autosave_amount: payload.autosave_amount,
                }
            }else{
                return{
                    ...state,
                    autosave: payload.status,
                    day_interval: null,
                    autosave_amount: '0.00',
                }
            }
        default:
            return state;
    }
}