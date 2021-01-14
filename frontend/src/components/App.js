import React, { Component, Fragment } from 'react';
import ReactDom from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from './common/PrivateRoute'
import BasicPrivateRoute from './common/BasicPrivateRoute'
import { Provider } from 'react-redux';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic'
import store from '../store';
import Login from './auth/Login';
import Register from './auth/register';
import SetWallet from './auth/SetWallet'
import Dashboard from './wallet/Dashboard'
import QuickSave from './savings/QuickSave'
import TargetSave from './savings/TargetSave'
import TargetSaveSingle from './savings/TargetSaveSingle'
import JointTargetSave from './savings/JointTargetSave'
import JointTargetSaveSingle from './savings/JointTargetSaveSingle'
import Wallet from './wallet/Wallet'
import Alerts from './layouts/Alerts'
import { loadUser } from '../actions/auth'



const alertOptions = {
    timeout: 4000,
    position: 'top center'
}

class App extends Component{

    componentDidMount(){
        store.dispatch(loadUser())
    }

    render(){
        return(
        <Provider store={store}>
            <AlertProvider template={AlertTemplate} {...alertOptions}>
                <Router>
                    <Fragment>
                        <Alerts />
                        <Switch>
                            <PrivateRoute exact path="/" component={Dashboard} />
                            <PrivateRoute exact path='/wallet' component={Wallet} />
                            <PrivateRoute exact path='/savings/targetsave/joint/:id' component={JointTargetSaveSingle} />
                            <PrivateRoute exact path='/savings/targetsavings/joint' component={JointTargetSave} />
                            <PrivateRoute exact path='/savings/targetsave/:id' component={TargetSaveSingle} />
                            <PrivateRoute exact path="/savings/targetsavings" component={TargetSave}/>
                            <PrivateRoute exact path="/savings/quicksave" component={QuickSave} />
                            <BasicPrivateRoute exact path="/wallet/set" component={SetWallet} />
                            <Route exact path="/login" component={Login} />
                            <Route exact Path="/register" component={Register} />
                        </Switch>
                    </Fragment>
                </Router>
            </AlertProvider>
        </Provider>
        )
    }
}


ReactDom.render(<App />, document.getElementById('app'));