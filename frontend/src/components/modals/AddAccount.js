import React, { Component } from 'react';
import { getBanks, addAccount } from '../../actions/payments';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios'
import { returnErrors, createMessage } from "../../actions/messages";

class AddAccount extends Component {
    state = {
      acct_no: '',   
      bank_code: '', 
      name: ''
    }

  static propTypes = {
      payments: PropTypes.object.isRequired,
      getBanks: PropTypes.func.isRequired,
      token: PropTypes.string.isRequired,
      returnErrors: PropTypes.func.isRequired,
      createMessage: PropTypes.func.isRequired,
      addAccount: PropTypes.func.isRequired,
  }

    onChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
    });
  }

    onSubmit = (e) => {
      e.preventDefault()
      const { acct_no, bank_code, name } = this.state;
      this.props.addAccount({number: acct_no, bank_code, name})
      this.setState({
        acct_no: '',   
        bank_code: '', 
        name: ''
      })
    }

    componentDidMount(){
      this.props.getBanks();
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
          bank_code: this.props.payments.banks.length > 0 ? (this.props.payments.banks[0].code) : ('')
        })
      }
    }

    render() {
          return (
            <div className="modal fade" id={this.props.modalId} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Add Account</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={this.onSubmit}>
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
                      <button type="submit" className="btn btn-primary">ADD</button>
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

export default connect( mapStateToProps, { getBanks, returnErrors, createMessage, addAccount } )(AddAccount);