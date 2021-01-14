import { DELETE_JOINT_TARGETSAVE, GET_JOINT_TARGETSAVE, JOINT_TARGETSAVE_CASH_OUT, JOINT_TARGETSAVE_DEPOSIT, LEAVE_JOINT_TARGETSAVE, INVITE_JOINT_TARGETSAVE } from '../actions/types';


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
    'members': []
};


export default function (state=initialState, action){
    switch(action.type){
        case GET_JOINT_TARGETSAVE:
            return (state = action.payload);
        
        case JOINT_TARGETSAVE_CASH_OUT:
            return {
                ...state,
                progress: '0.00',
                members: state.members.map(member => member.username === action.payload.username ? {...member, transactions: [action.payload, ...member.transactions]} : member)
            }

        case JOINT_TARGETSAVE_DEPOSIT:
            return {
                ...state,
                progress: `${parseFloat(state.progress) + parseFloat(action.payload.amount)}`,
                members: state.members.map(member => member.username === action.payload.username ? {...member, transactions: [action.payload, ...member.transactions]} : member)
            }

        case DELETE_JOINT_TARGETSAVE:
        case LEAVE_JOINT_TARGETSAVE:
            return (state=initialState)

        case INVITE_JOINT_TARGETSAVE:
            return {
                ...state,
                members: [...state.members, ...action.payload.map(username => ({username, transactions: []}))]
            }

        default:
            return state;

    }
}