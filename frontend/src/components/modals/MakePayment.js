import React, { Component } from 'react';
import { getBanks, getAccounts, makePayment } from '../../actions/payments'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios'
import { returnErrors, createMessage } from "../../actions/messages";

class MakePayment extends Component {
    state = {
      acct_no: '',
      amount: '', 
      password: '', 
      bank_code: '', 
      name: '',
      new_beneficiary: true,
      known_beneficiary: false,
      account_id: null,
      amount_k: '',
      password_k: ''
    }

  static propTypes = {
      payments: PropTypes.object.isRequired,
      getAccounts: PropTypes.func.isRequired,
      token: PropTypes.string.isRequired,
      returnErrors: PropTypes.func.isRequired,
      createMessage: PropTypes.func.isRequired,
      makePayment: PropTypes.func.isRequired,
  }

    onChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
    });
  }

    onSubmit = (e) => {
      e.preventDefault()
      this.props.makePayment(this.state)
      this.setState({
        acct_no: '', 
        amount: '', 
        password: '',  
        name: '',
      })
    }

    onSubmitKnown = (e) => {
        e.preventDefault();
        const { account_id, amount_k, password_k } = this.state;
        const account = this.props.payments.accounts.find(account => account.id == account_id);
        const { number, name, bank } = account;
        this.props.makePayment({acct_no: number, name, bank_code: bank.code, amount: amount_k, password: password_k })
        this.setState({
          amount_k: '',
          password_k: ''
        })
    }

    componentDidMount(){
      this.props.getAccounts();
    }

    changeBeneficiary = (type) => {
      if(type == 'new'){
        this.setState({
          new_beneficiary: true,
          known_beneficiary: false
        })
      }else{
        this.setState({
          new_beneficiary: false,
          known_beneficiary: true
        })
      }
    }

    resolveAccount = (e) => {
      if (this.state.acct_no.length !== 10){
        this.props.returnErrors({error: 'Invalid Account Number'}, 400)
      }else{
            const { acct_no, bank_code} = this.state;
            const body = JSON.stringify({acct_no, bank_code});
            const config = {
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Token ${this.props.token}`
              }
          };
          axios.post('/payment/account_no/resolve', body, config)
          .then(res => {
            this.setState({
              name: res.data.response.account_name,
              acct_no: res.data.response.account_number
            })
          })
          .catch(err => {
            this.props.returnErrors(err.response.data, err.response.status)
          })
      }
    }
    

    componentDidUpdate(prevProps){
      if (prevProps !== this.props){
        this.setState({
          bank_code: this.props.payments.banks.length > 0  ? (this.props.payments.banks[0].code) : (this.state.bank_code),
          account_id: this.props.payments.accounts.length > 0 ? (`${this.props.payments.accounts[0].id}`) : (this.state.account_id)
        })
      }
    }

    render() {
          return (
            <div className="modal fade" id="makePayments" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Make Payments</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div onClick={() => {this.changeBeneficiary('new')}} className={this.state.new_beneficiary ? ('col-6 beneficiary-active') : ('col-6 beneficiary')}>
                          New Benefiary
                      </div>
                      <div onClick={() => {this.changeBeneficiary('known')}} className={this.state.known_beneficiary ? ('col-6 beneficiary-active') : ('col-6 beneficiary')}>
                          Known Benefiary
                      </div>
                    </div>
                    <form onSubmit={this.onSubmit} className={this.state.new_beneficiary ? ('') : ('form-hide')}>
                    <div className="mb-3">
                      <label for="acct_no" className="col-form-label">Account Number</label>
                      <input type="text" name="acct_no" required className="form-control" onChange={this.onChange} value={this.state.acct_no}/>
                    </div>
                    <div className="mb-3">
                      <label for="bank" className="col-form-label">Bank</label><br />
                      <select className="form-select form-select-sm mb-3" aria-label=".form-select-lg example" onChange={this.onChange} name="bank_code" required value={this.state.bank_code}>
                        {this.props.payments.banks.map(bank => <option value={bank.code}>{bank.name}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label for="name" className="col-form-label">Name</label>
                      <input type="text" name="name" required className="form-control" onChange={this.onChange} value={this.state.name} placeholder="Click here to view name" onClick={this.resolveAccount}/>
                    </div>
                    <div className="mb-3">
                      <label for="amount" className="col-form-label">Amount</label>
                      <input type="number" name="amount" required step=".01" className="form-control" id="amount" onChange={this.onChange} value={this.state.amount} placeholder="Amount To Send"/>
                    </div>
                    <div className="mb-3">
                      <label for="amount" className="col-form-label">Password</label>
                      <input type="password" name="password" required className="form-control" id="password" onChange={this.onChange} value={this.state.password} placeholder="Your Wallet Password"/>
                    </div>
                      <button type="submit" className="btn btn-primary">PAY</button>
                    </form>
                    <form className={this.state.known_beneficiary ? ('') : ('form-hide')} onSubmit={this.onSubmitKnown}>
                    <div className="mb-3">
                        <label for="Account" className="col-form-label">Account</label><br />
                        <select className="form-select form-select-sm mb-3" aria-label=".form-select-lg example" onChange={this.onChange} name="account_id" required value={this.state.account_id}>
                          {this.props.payments.accounts.map(account => <option value={account.id}>{`${account.name} (${account.number})`}</option>)}
                        </select>
                    </div>
                    <div className="mb-3">
                      <label for="amount_k" className="col-form-label">Amount</label>
                      <input type="number" name="amount_k" required step=".01" className="form-control" id="amount_k" onChange={this.onChange} value={this.state.amount_k} placeholder="Amount To Send"/>
                    </div>
                    <div className="mb-3">
                      <label for="password_k" className="col-form-label">Password</label>
                      <input type="password" name="password_k" required className="form-control" id="password_k" onChange={this.onChange} value={this.state.password_k} placeholder="Your Wallet Password"/>
                    </div>
                    <button type="submit" className="btn btn-primary">PAY</button>
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

const mapStateToProps = (state) => ({
  payments: state.payments,
  token: state.auth.token,
})

export default connect( mapStateToProps, { getAccounts, getBanks, returnErrors, createMessage, makePayment } )(MakePayment);