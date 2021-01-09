import { combineReducers } from 'redux'
import auth from './auth'
import errors from './errors'
import messages from './messages'
import wallet from './wallet'
import quickSave from './quickSave'
import targetSave from './targetSave'
 
export default combineReducers({
    auth,
    errors,
    messages,
    wallet,
    quickSave,
    targetSave,
});