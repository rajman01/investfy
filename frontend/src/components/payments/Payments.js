import React, { Component } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { getWallet } from '../../actions/wallet'
import AccountTransactions from '../layouts/AccountTransactions'
import MakePayment from '../modals/MakePayment'
import AddAccount from '../modals/AddAccount'


class Payments extends Component {

    static propTypes = {
        wallet: PropTypes.object.isRequired,
        getWallet: PropTypes.func.isRequired,
    }

    componentDidMount(){
        this.props.getWallet();
    }

    render() {
        const active = { 'overview': false, 'savings': false, 'investments': false, 'payments': true, 'account': false, 'wallet': false };
        const { balance, wallet_id, account_transactions } = this.props.wallet;
        return (
            <div>
                <Sidebar active={active} />
                <div className="main-content">
                    <Header bigHeader="Payments" />
                    <div className="row save-now">
                        <div className="col-12">
                            <div className="dashoboard-iew-123132 madetommy-regular-normal-mountain-meadow-18px border-class-1">
                                Dashoboard / Payments
                            </div>
                        </div>
                    </div>
                    <div className="row saving-balance">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-7">

                                    <div className="quick-save-lance-8344 madetommy-light-black-22px border-class-1">E-Wallet Balance</div>
                                    <h1 className="x650000-78181 madetommy-medium-black-34px border-class-1">#{balance}</h1>
                                    <p className="text-muted mt-3">{`WALLET ID : ${wallet_id}`}</p>
                                    <div className="row">
                                        <div className="col-lg-6 col-sm-12 border-class-100">
                                            <button className="frame-58" data-bs-toggle="modal" data-bs-target="#addAccount">
                                                Add Account+
                                            </button>
                                        </div>
                                        <div className="col">
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="opopo">
                                        <button className="btn btn-lg btn-primary mt-5 pt-2 pl-5 pr-5 pb-2 quick-save-now" data-bs-toggle="modal" data-bs-target="#makePayments">MAKE PAYMENTS</button>
                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="transaction-history">
                        <h1 className="quick-save-tory-88652 madetommy-medium-new-car-26px border-class-1">Payments History</h1>
                        <AccountTransactions transactions={account_transactions} />
                    </div>
                </div>
                <MakePayment />
                <AddAccount modalId='addAccount' />
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    wallet: state.wallet
})


export default connect(mapStateToProps, { getWallet })(Payments);
