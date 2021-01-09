import { DELETE_TARGETSAVE, GET_TARGETSAVE, TARGETSAVE_AUTOSAVE, TARGETSAVE_CASH_OUT, TARGETSAVE_DEPOSIT } from '../actions/types';


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
    'name': '',
    'description': '',
    'targeted_amount': '',
    'progress': '',
    'date_created': '',
    'autosave': {
        'active': null,
        'day_interval': null,
        'autosave_amount': ''
    },
    'transactions': []
};


export default function (state=initialState, action){
    switch(action.type){
        case GET_TARGETSAVE:
            return (state = action.payload);
        
        case TARGETSAVE_CASH_OUT:
            return {
                ...state,
                progress: '0.00',
                transactions: [action.payload, ...state.transactions]
            }
        
        case TARGETSAVE_DEPOSIT:
            return {
                ...state,
                progress: `${parseFloat(state.progress) + parseFloat(action.payload.amount)}`,
                transactions: [action.payload, ...state.transactions]
            }
        
        case DELETE_TARGETSAVE:
            return (state=initialState)

        case TARGETSAVE_AUTOSAVE:
            return {
                ...state,
                autosave: action.payload
            }
        default:
            return state;

    }
}