import React, { Component } from 'react';
import {sendCash} from '../../actions/wallet'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

class SendCash extends Component {
    state = {
        amount: '',
        wallet_id: '',
        password: '',
    }

    static propTypes = {
      sendCash: PropTypes.func.isRequired,
    }

    onChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
    });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.sendCash(this.state);
        this.setState({
          amount: '',
          wallet_id: '',
          password: '',
        })
    }

    render() {
        return (
            <div className="modal fade" id="sendCash" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Send Cash To Another Wallet</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={this.onSubmit}>
                    <div className="mb-3">
                      <label for="amount" className="col-form-label">wallet_id</label>
                      <input type="text" name="wallet_id" required className="form-control" id="wallet_id" onChange={this.onChange} value={this.state.wallet_id} placeholder="Beneficiary's wallet_id"/>
                    </div>
                    <div className="mb-3">
                      <label for="amount" className="col-form-label">Amount</label>
                      <input type="number" name="amount" required step=".01" className="form-control" id="sendAmount" onChange={this.onChange} value={this.state.amount} placeholder="Amount To Send"/>
                    </div>
                    <div className="mb-3">
                      <label for="amount" className="col-form-label">Password</label>
                      <input type="password" name="password" required className="form-control" id="password" onChange={this.onChange} value={this.state.password} placeholder="Your Wallet Password"/>
                    </div>
                      <button type="submit" className="btn btn-primary">Send</button>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
        )
    }
}

export default connect(null, { sendCash })(SendCash);
