import { combineReducers } from 'redux'
import auth from './auth'
import errors from './errors'
import messages from './messages'
import wallet from './wallet'

export default combineReducers({
    auth,
    errors,
    messages,
    wallet,
});