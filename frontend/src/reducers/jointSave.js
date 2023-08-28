import { GET_JOINT_SAVE, DEPOSIT_JOINT_SAVE, DISBAND_JOINT_SAVE, LEAVE_JOINT_SAVE } from '../actions/types'

const initialState = {
    'id': null,
    'name': '', 
    'admin': null, 
    'amount': '',
    'total': '',
    'frequency': '',
    'date_created': '',
    'can_invite_member': null,
    'can_disband': null,
    'can_leave': null,
    'members': []
}


export default function (state=initialState, action){
    switch(action.type){

        case GET_JOINT_SAVE:
            return (state = action.payload);

        case DEPOSIT_JOINT_SAVE:
            return {
                ...state,
                total: `${parseFloat(state.total) + parseFloat(action.payload.amount)}`,
                members: state.members.map(member => member.username === action.payload.username ? {...member, transactions: [action.payload, ...member.transactions]} : member)
            }
        
        case DISBAND_JOINT_SAVE:
        case LEAVE_JOINT_SAVE:
            return (state=initialState)

        default:
            return state
    }
}