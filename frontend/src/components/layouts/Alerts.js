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
            if(error.msg.username) alert.error(`Username: ${error.msg.username.join()}`);
            if(error.msg.first_name) alert.error(`First name: ${error.msg.first_name.join()}`);
            if(error.msg.last_name) alert.error(`Last name: ${error.msg.last_name.join()}`);
            if(error.msg.dob) alert.error(`Date of Birth: ${error.msg.dob.join()}`);
            if(error.msg.phone_number) alert.error(`Phone number: ${error.msg.phone_number.join()}`);
            if(error.msg.wallet_id) alert.error(`Wallet ID: ${error.msg.wallet_id.join()}`);
            if(error.msg.name) alert.error(`Name: ${error.msg.name.join()}`);
            if(error.msg.description) alert.error(`Description: ${error.msg.description.join()}`);
            if(error.msg.number) alert.error(`Account Number: ${error.msg.number.join()}`);
            if(error.msg.acct_no) alert.error(`Account Number: ${error.msg.acct_no.join()}`);
            if(error.msg.targeted_amount) alert.error(`Targeted Amount: ${error.msg.targeted_amount.join()}`);
            if(error.msg.new_email) alert.error(`New Email: ${error.msg.new_email.join()}`);
            if(error.msg.current_password) alert.error(`Current Password: ${error.msg.current_password.join()}`);
            if(error.msg.new_password) alert.error(`New password: ${error.msg.new_password.join()}`);
            if(error.msg.bvn) alert.error(`BVN: ${error.msg.bvn.join()}`);
            if(error.msg.bank_code) alert.error(`Bank Code: ${error.msg.bank_code.join()}`);
            if(error.msg.name) alert.error(`Name: ${error.msg.name.join()}`);
            if(error.msg.members) alert.error(`Members: ${error.msg.members.join()}`);
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
