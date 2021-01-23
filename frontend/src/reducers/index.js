import { combineReducers } from 'redux'
import auth from './auth'
import errors from './errors'
import messages from './messages'
import wallet from './wallet'
import quickSave from './quickSave'
import targetSave from './targetSave'
import jointTargetSave from './jointTargetSave'
import jointSave from './jointSave'
import payments from './payments'
import investments from './investments'
import savings from './savings'
 
export default combineReducers({
    auth,
    errors,
    messages,
    wallet,
    quickSave,
    targetSave,
    jointTargetSave,
    jointSave,
    payments,
    investments,
    savings
});