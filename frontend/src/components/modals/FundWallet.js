import React, { Component } from 'react';
import {fundWallet} from '../../actions/wallet'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

class FundWallet extends Component {
    state = {
        amount: ''
    }

    static propTypes = {
      fundWallet: PropTypes.func.isRequired,
    }

    onChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
    });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.fundWallet(this.state);
        this.setState({
          amount: ''
        })

    }

    render() {
        return (
            <div className="modal fade" id="fundWallet" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Fund Your Wallet</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={this.onSubmit}>
                    <div className="mb-3">
                      <label for="amount" className="col-form-label">Amount</label>
                      <input type="number" name="amount" required step=".01" class="form-control" id="amount" onChange={this.onChange} value={this.state.amount} />
                    </div>
                      <button type="submit" className="btn btn-primary">Fund</button>
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

export default connect(null, { fundWallet })(FundWallet);
