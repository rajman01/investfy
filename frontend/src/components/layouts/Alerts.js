import React, { Component, Fragment } from 'react'
import { withAlert } from 'react-alert'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class Alerts extends Component {
    static propTypes = {
        error: PropTypes.object.isRequired
    }
    componentDidUpdate(prevProps){
        const { error, alert, message } = this.props;
        if(error !== prevProps.error) {
            if(error.msg.email) alert.error(`Email: ${error.msg.email.join()}`);
            if(error.msg.password) alert.error(`Password: ${error.msg.password.join()}`);
            if(error.msg.full_name) alert.error(`Full name: ${error.msg.full_name.join()}`);
            if(error.msg.phone_number) alert.error(`Phone number: ${error.msg.phone_number.join()}`);
            if(error.msg.wallet_id) alert.error(`Wallet ID: ${error.msg.wallet_id.join()}`);
            if(error.msg.error) alert.error(`Error: ${error.msg.error}`);
            if(error.msg.detail) alert.error(`Error: ${error.msg.detail}`);
            if(error.msg.amount) alert.error(`Amount: ${error.msg.amount.join()}`);
        }

        if(message !== prevProps.message) {
            if(message.registerSuccesful) alert.success(message.registerSuccesful);
            if(message.loginSuccesful) alert.success(message.loginSuccesful);
            if(message.response) alert.success(message.response);
        }
    }
    render() {
        return <Fragment />
    }
}

const mapStateToProps = state => ({
    error: state.errors,
    message: state.messages
});

export default connect(mapStateToProps)(withAlert()(Alerts));
