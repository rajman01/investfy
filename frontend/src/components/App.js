import React, { Component, Fragment } from 'react';
import ReactDom from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from './common/PrivateRoute'
import { Provider } from 'react-redux';
import store from '../store';
import Login from './auth/Login';
import Register from './auth/register';
import Dashboard from './wallet/Dashboard'
import { loadUser } from '../actions/auth'

class App extends Component{

    componentDidMount(){
        store.dispatch(loadUser())
    }

    render(){
        return(
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Switch>
                        <PrivateRoute exact path="/" component={Dashboard} />
                        <Route exact path="/login" component={Login} />
                        <Route exact Path="/register" component={Register} />
                    </Switch>
                </Fragment>
            </Router>
        </Provider>
        )
    }
}


ReactDom.render(<App />, document.getElementById('app'));