import React, { Component } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import ChangePassword from '../modals/ChangePassword'
import AddAccount from '../modals/AddAccount'
import { connect } from 'react-redux';
import { verifyBVN, updateAccount, changeAccountPassword, changeEmail, sendEmailVerification } from '../../actions/auth';
import { changeWalletId, changeWalletPassword } from '../../actions/wallet'
import { getAccounts, deleteAccount } from '../../actions/payments'
import PropTypes from 'prop-types'

class MyAccount extends Component {
    state = {
        username: '',
        full_name: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        dob: '',
        bvn: '',
        wallet_id: '',
        account_edit: false,
        email_edit: false,
        wallet_id_edit: false,
        bank_account: false
    }

    static propTypes = {
        user: PropTypes.object.isRequired,
        verifyBVN: PropTypes.func.isRequired, 
        updateAccount: PropTypes.func.isRequired, 
        changeAccountPassword: PropTypes.func.isRequired, 
        changeEmail: PropTypes.func.isRequired, 
        sendEmailVerification: PropTypes.func.isRequired,
        changeWalletPassword: PropTypes.func.isRequired,
        changeWalletId: PropTypes.func.isRequired,
        getAccounts: PropTypes.func.isRequired,
        deleteAccount: PropTypes.func.isRequired
    }

    componentDidMount(){
        const { username, full_name, first_name, last_name, phone_number, dob, email} = this.props.user;
        const { wallet_id } = this.props.user.wallet
        this.setState({
            username,
            full_name,
            first_name,
            last_name,
            phone_number,
            dob,
            email,
            wallet_id
        });
        this.props.getAccounts()
    }

    onChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
      });
    }

    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            const { username, full_name, first_name, last_name, phone_number, dob, email} = this.props.user;
            const { wallet_id } = this.props.user.wallet
            this.setState({
                username,
                full_name,
                first_name,
                last_name,
                phone_number,
                dob,
                email,
                wallet_id
            });
        }
    }

    edit = (e) => {
        this.setState({
            [e.target.name]: !this.state[e.target.name]
        })
    }

    updateAccount = (e) => {
        e.preventDefault();
        if(this.state.account_edit){
            this.props.updateAccount(this.state);
        }
    }

    verifyBvn = (e) => {
        e.preventDefault();
        this.props.verifyBVN(this.state)
    }

    sendEmailVerification = (e) => {
        this.props.sendEmailVerification()
    }

    changeEmail = (e) => {
        e.preventDefault();
        if(this.state.email_edit){
            this.props.changeEmail({new_email: this.state.email})
        }
    }

    changeWalletId = (e) => {
        e.preventDefault();
        if(this.state.wallet_id_edit){
            this.props.changeWalletId(this.state)
        }
    }

    render() {
        const active = { 'overview': false, 'savings': false, 'investments': false, 'payments': false, 'account': true, 'wallet': false }
        const { bvn_verified, email_verified } = this.props.user;
        return (
            <div>
                <Sidebar active={active} />
                <div className="main-content">
                    <Header bigHeader='My Account' />
                    <div className="row save-now">
                        <div className="col-12">
                            <div className="dashoboard-iew-123132 madetommy-regular-normal-mountain-meadow-18px border-class-1">
                                Dashoboard / Account
                            </div>
                        </div>
                    </div>
                    <div className="account-content">
                        <div className="row">
                            <div className="col"></div>
                            <div className="col-xl-10 col-lg-12 xol-sm-12">
                                <h1>Account Details</h1>
                                <div className="edit">
                                    <button className="btn btn-primary float-right" onClick={this.edit} name="account_edit">Edit</button>
                                </div>
                                <form className="mt-2" onSubmit={this.updateAccount}>
                                    <div className="mb-3">
                                        <label for="username" className="form-label username-label">Username</label>
                                        <input type="text" className="form-control" id="username" onChange={this.onChange} value={this.state.username} name="username" readOnly={!this.state.account_edit} required/>
                                    </div>
                                    <div class="mb-3">
                                        <label for="full_name" className="form-label">Full Name</label>
                                        <input type="text" className="form-control" id="full_name" onChange={this.onChange} value={this.state.full_name} name="full_name" readOnly={!(!bvn_verified && this.state.account_edit)} required/>
                                        <div class="form-text">NB: This field cant be edited if your bvn is verified</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <div class="mb-3">
                                                <label for="first_name" className="form-label">First Name</label>
                                                <input type="text" className="form-control" id="first_name" onChange={this.onChange} value={this.state.first_name} name="first_name" readOnly={!(!bvn_verified && this.state.account_edit)} placeholder="First Name" />
                                                <div class="form-text">NB: This field cant be edited if your bvn is verified</div>
                                            </div>
                                        </div>
                                        <div className="col-6">        
                                            <div class="mb-3">
                                                <label for="last_name" className="form-label">Last Name</label>
                                                <input type="text" className="form-control" id="last_name" onChange={this.onChange} value={this.state.last_name} name="last_name" readOnly={!(!bvn_verified && this.state.account_edit)} placeholder="Last Name" />
                                                <div class="form-text">NB: This field cant be edited if your bvn is verified</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="phone_number" className="form-label">Phone Number</label>
                                        <input type="tel" className="form-control" id="phone_number" onChange={this.onChange} value={this.state.phone_number} name="phone_number" readOnly={!(!bvn_verified && this.state.account_edit)} required/>
                                        <div class="form-text">NB: This field cant be edited if your bvn is verified</div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="dob" className="form-label">date of birth</label>
                                        <input type="date" className="form-control" id="dob" onChange={this.onChange} value={this.state.dob} name="dob" readOnly={!(!bvn_verified && this.state.account_edit)}/>
                                        <div class="form-text">NB: This field cant be edited if your bvn is verified</div>
                                    </div>
                                    {this.state.account_edit ? (
                                        <button className="btn btn-primary" type="submit">Submit</button>
                                    ) : (<span></span>)}
                                </form>
                                <div id="paswords" className="mt-5">
                                <h2>Passwords</h2>
                                    <div className="row mt-4">
                                        <div className="col">
                                            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#changeAccountPassword">Change Account Password</button>
                                        </div>
                                        
                                        <div className="col">
                                            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#changeWalletPassword">Change Wallet Password</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5" id="verification">
                                    <h2>Verification</h2>
                                    {!bvn_verified ? (
                                        <form onSubmit={this.verifyBvn}>
                                            <div className="mb-3">
                                                <label for="bvnVerifiedFalse" className="form-label">Bank Verification Number</label>
                                                <input type="text" className="form-control is-invalid" id="bvnVerifiedFalse" aria-describedby="validationServer03Feedback" required onChange={this.onChange} value={this.state.bvn} name="bvn" placeholder="BVN Number"/>
                                                <div className="invalid-feedback">
                                                    Please, verify your account with your BVN
                                                </div>
                                            </div>
                                            <button className="btn btn-primary" type="submit">Submit</button>
                                        </form>  
                                    ) : (
                                        <div className="mb-3">
                                            <label for="bvnVerifiedTrue" className="form-label">Bank Verification Number</label>
                                            <input type="text" className="form-control is-valid" id="bvnVerifiedTrue" value="BVN Verified" required readOnly/>
                                            <div className="valid-feedback">
                                                You have Verified Your Account with your bvn
                                            </div>
                                        </div>
                                    )}
                                    {!email_verified ? (
                                        <div className="mb-3">
                                            <label for="emailVerifiedFalse" className="form-label">Email Verification</label>
                                            <input type="text" className="form-control is-invalid" id="emailVerifiedFalse" aria-describedby="validationServer03Feedback" required value={this.state.email} name="email" readOnly/>
                                            <div className="invalid-feedback">
                                                    Please, verify your email address
                                            </div>
                                            <button className="btn btn-primary" onClick={this.sendEmailVerification}>Send Verification Email</button>
                                        </div>
                                    ) : (
                                        <div className="mb-3">
                                            <label for="emailVerifiedTrue" className="form-label">Email Verification</label>
                                            <input type="text" className="form-control is-valid" id="emailVerifiedTrue" value={this.state.email} required readOnly/>
                                            <div className="valid-feedback">
                                                You have Verified Your Email address
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div id="changeEmail" className="mt-5">
                                    <h2>Email</h2>
                                    <div className="edit">
                                        <button className="btn btn-primary float-right" onClick={this.edit} name="email_edit">Edit</button>
                                    </div>
                                    <form onSubmit={this.changeEmail}>
                                        <div className="mb-3">
                                            <label for="change-email" className="form-label username-label">Change Email?</label>
                                            <input type="email" className="form-control" id="change-email" onChange={this.onChange} value={this.state.email} name="email" readOnly={!this.state.email_edit}/>
                                        </div>
                                        {this.state.email_edit ? (
                                            <button className="btn btn-primary" type="submit">Submit</button>
                                        ) : (<span></span>)}
                                    </form>
                                </div>

                                <div id="walletId" className="mt-5">
                                    <h2>Wallet ID</h2>
                                    <div className="edit">
                                        <button className="btn btn-primary float-right" onClick={this.edit} name="wallet_id_edit">Edit</button>
                                    </div>
                                    <form onSubmit={this.changeWalletId}>
                                        <div className="mb-3">
                                            <label for="walletId" className="form-label username-label">Wallet ID</label>
                                            <input type="text" className="form-control" id="walletId" onChange={this.onChange} value={this.state.wallet_id} name="wallet_id" readOnly={!this.state.wallet_id_edit}/>
                                        </div>
                                        {this.state.wallet_id_edit ? (
                                            <button className="btn btn-primary" type="submit">Submit</button>
                                        ) : (<span></span>)}
                                    </form>
                                </div>
                                <div id="bankAccount" className="mt-5">
                                    <h2>Bank Accounts</h2>
                                    <div className="edit">
                                        <button className="btn btn-primary float-right" onClick={this.edit} name="bank_account">{ this.state.bank_account ? ('Hide') : ('Show')}</button>
                                        <button className="btn btn-primary float-left" data-bs-toggle="modal" data-bs-target="#addAccount">Add Account</button>
                                    </div>
                                    <table className={this.state.bank_account ? ('table table-bordered bank-account') : ('table table-bordered form-hide mt-5 bank-account')}>
                                        <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Acct No</th>
                                            <th scope="col">Bank</th>
                                            <th scope="col">Delete</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            { this.props.accounts.map(account => (
                                                <tr key={account.id}>
                                                    <td>{account.name}</td>
                                                    <td>{account.number}</td>
                                                    <td>{account.bank.name}</td>
                                                    <td><button className="btn btn-danger" onClick={() => {this.props.deleteAccount({id: account.id})}}>Delete</button></td>
                                                </tr>
                                            )) }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col"></div>
                        </div>
                    </div>
                </div>
                <ChangePassword modalId="changeWalletPassword" change={this.props.changeWalletPassword} header="Change Wallet Password"/>
                <ChangePassword modalId="changeAccountPassword" change={this.props.changeAccountPassword} header="Change Account Password"/>
                <AddAccount modalId='addAccount' />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    accounts: state.payments.accounts
})

export default connect(mapStateToProps, { changeWalletId, changeWalletPassword, verifyBVN, updateAccount, changeAccountPassword, changeEmail, sendEmailVerification, getAccounts, deleteAccount })(MyAccount)
