import { QUICK_SAVE_CASH_OUT, GET_QUICKSAVE, DEPOSIT_QUICK_SAVE, AUTOSAVE_QUICK_SAVE } from '../actions/types'

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

        case DEPOSIT_QUICK_SAVE:
            return {
                ...state,
                balance: `${parseFloat(state.balance) + parseFloat(action.payload.amount)}`,
                transactions: [action.payload, ...state.transactions]
            };

        case QUICK_SAVE_CASH_OUT:
            return {
                ...state,
                balance: '0.00',
                transactions: [action.payload, ...state.transactions]
            };
            
        case AUTOSAVE_QUICK_SAVE:
            if(action.payload.status){
                return {
                    ...state,
                    autosave: action.payload.status,
                    day_interval: action.payload.day_interval,
                    autosave_amount: action.payload.autosave_amount,
                };
            }else{
                return {
                    ...state,
                    autosave: action.payload.status,
                    day_interval: null,
                    autosave_amount: '0.00',
                };
            }
        default:
            return state;
    }
}