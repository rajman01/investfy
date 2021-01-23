import { GET_ALL_JOINT_SAVE, GET_ALL_JOINT_TARGETSAVE, GET_ALL_TARGETSAVE, CREATE_JOINT_SAVE, CREATE_JOINT_TARGETSAVE, CREATE_TARGETSAVE } from '../actions/types'

const initialState = {
  all_target_save: [],
  all_joint_save: [],
  all_joint_target_save: []
}


export default function (state=initialState, action){
    switch(action.type){
        case GET_ALL_JOINT_SAVE:
            return{
                ...state,
                all_joint_save: action.payload
            }
        case GET_ALL_JOINT_TARGETSAVE:
            return{
                ...state,
                all_joint_target_save: action.payload
            }
        case GET_ALL_TARGETSAVE:
            return{
                ...state,
                all_target_save: action.payload
            }
        case CREATE_JOINT_SAVE:
            return{
                ...state,
                all_joint_save: [action.payload, ...state.all_joint_save]
            }
        case CREATE_TARGETSAVE:
            return{
                ...state,
                all_target_save: [action.payload, ...state.all_target_save]
            }
        case CREATE_JOINT_TARGETSAVE:
            return{
                ...state,
                all_joint_target_save: [action.payload, ...state.all_joint_target_save]
            }
        default:
            return state
    }
}