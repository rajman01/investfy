import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({component: Component, auth, ...rest}) => (
    <Route 
        {...rest}
        render={props => {
            if(auth.isLoading) {
                return <h2>Linoading...</h2>
            } else if(!auth.isAuthenticated){
                return <Redirect to="/login" />
            } else if(auth.isAuthenticated && !auth.has_set_wallet){
                return <Redirect to="/wallet/set" />
            }else{
                return <Component {...props} />;
            }
            
        }}
    />
)

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(PrivateRoute);