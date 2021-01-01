import React, { Component } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import BigCards from '../layouts/BigCards'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { getWallet } from '../../actions/wallet'
import WalletTransactions from '../layouts/WalletTransactions'
import WalletSavingTransactions from '../layouts/WalletSavingTransactions'
import AccountTransactions from '../layouts/AccountTransactions'
import FundWallet from '../modals/FundWallet'


class Wallet extends Component {

    state = {
        wallet_transactions: false,
        savings_transactions: false,
        account_transactions: false
    }

    static propTypes = {
        wallet: PropTypes.object.isRequired,
        getWallet: PropTypes.func.isRequired,
        email: PropTypes.string.isRequired,
        full_name: PropTypes.string.isRequired,
    }

    componentDidMount(){
        this.props.getWallet();
        this.setState({
            wallet_transactions: true
        })
    }

    changeTransaction = (e) => {

        if (e.target.dataset.type === 'saving'){
            this.setState({
                wallet_transactions: false,
                savings_transactions: true,
                account_transactions: false
            })
        } else if(e.target.dataset.type === 'account'){
            this.setState({
                wallet_transactions: false,
                savings_transactions: false,
                account_transactions: true
            })
        } else if (e.target.dataset.type === 'wallet'){
            this.setState({
                wallet_transactions: true,
                savings_transactions: false,
                account_transactions: false
            })
        }
    }

    

    render() {
        console.log(this.props)
        console.log(this.props.wallet.account_transactions)
        const active = { 'overview': false, 'savings': false, 'investments': false, 'payments': false, 'account': false, 'wallet': true }
        const full_name = this.props.full_name
        const { balance, wallet_id, sent_transactions, recieved_transactions, savings_transactions, account_transactions } = this.props.wallet;
        const walletIcon = "https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/rectangle-64-4@2x.svg";
        const transaction = () => {
            if(this.state.account_transactions){
                return <AccountTransactions transactions={[account_transactions]} />
            } else if(this.state.savings_transactions){
                return <WalletSavingTransactions transactions={savings_transactions} />
            } else{
                return <WalletTransactions transactions={[...sent_transactions, ...recieved_transactions]} />
            }
        }

        return (
            <div>
                <Sidebar active={active} />
                <div className="main-content">
                    <Header bigHeader="Wallet" fullName={ full_name } email={this.props.email} />
                    <div className="row save-now">
                        <div className="col-4">
                            <div className="dashoboard-iew-123132 madetommy-regular-normal-mountain-meadow-18px border-class-1">
                                Dashoboard / Wallet
                            </div>
                        </div>
                        <div className="col">
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">SEND CASH</button>
                        </div>
                        <div className="col-4">
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#fundWallet">FUND WALLET</button>
                        </div>
                    </div>
                    <BigCards text="Wallet Balance" amount={this.props.wallet.balance} icon={walletIcon} walletId={`WALLET ID : ${wallet_id}`}/>

                    <div className="transactions">
                        <div className="row mb-5">
                            <div className="col-4">
                            <div className={this.state.wallet_transactions ? "tran-button-active" : "tran-button"}><div className={this.state.wallet_transactions ? "tran-text-active" : "tran-text"}  onClick={this.changeTransaction} data-type="wallet">Wallet Transactions</div></div>
                            </div>
                            <div className="col-4">
                                <div className={this.state.savings_transactions ? "tran-button-active" : "tran-button"}><div className={this.state.savings_transactions ? "tran-text-active" : "tran-text"} onClick={this.changeTransaction} data-type="saving">Savings Transactions</div></div>
                            </div>
                            <div className="col-4">
                                <div className={this.state.account_transactions ? "tran-button-active" : "tran-button"}><div className={this.state.account_transactions ? "tran-text-active" : "tran-text"} onClick={this.changeTransaction} data-type="account">Accounts Transactions</div></div>
                            </div>
                        </div>

                        { transaction() }

                    </div>
                </div>
                <FundWallet />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    wallet: state.wallet,
    email: state.auth.user.email,
    full_name: state.auth.user.full_name
})


export default connect(mapStateToProps, { getWallet })(Wallet);
