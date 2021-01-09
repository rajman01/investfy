import React, { Component } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { getQuickSave, quickSaveAutoSave, depositQuickSave, quickSaveCashOut } from '../../actions/quickSave'
import SavingsTransactions from '../layouts/SavingsTransactions'
import  AutoSave from '../modals/AutoSave'
import  Deposit  from '../modals/Deposit'
import  Withdraw  from '../modals/Withdraw'


class QuickSave extends Component {

    static propTypes = {
        quickSave: PropTypes.object.isRequired,
        getQuickSave: PropTypes.func.isRequired,
        quickSaveAutoSave: PropTypes.func.isRequired,
        depositQuickSave: PropTypes.func.isRequired, 
        quickSaveCashOut: PropTypes.func.isRequired
    }

    componentDidMount(){
        this.props.getQuickSave();
    }

    render() {
        const active = { 'overview': false, 'savings': true, 'investments': false, 'payments': false, 'account': false, 'wallet': false }
        const { balance, autosave, transactions, autosave_amount, day_interval } = this.props.quickSave
        return (
            <div>
                <Sidebar active={active} />
                <div className="main-content">
                    <Header bigHeader="Quick Save" />
                    <div className="row save-now">
                        <div className="col-12">
                            <div className="dashoboard-iew-123132 madetommy-regular-normal-mountain-meadow-18px border-class-1">
                                Dashoboard / Savings / Quicksave
                            </div>
                        </div>
                    </div>
                    <div className="row saving-balance">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-7">

                                    <div className="quick-save-lance-8344 madetommy-light-black-22px border-class-1">Quick Save Balance</div>
                                    <h1 className="x40000-8385 madetommy-medium-new-car-50px border-class-1">#{balance}</h1>
                                    <div className="row">
                                        <div className="col-6 border-class-100">
                                            <button className="frame-58" data-bs-toggle="modal" data-bs-target="#quickSaveCashOut">
                                                Withdraw
                                            </button>
                                        </div>
                                        <div className="col-6 border-class-100">
                                        <button className="frame-58" data-bs-toggle="modal" data-bs-target="#quickSaveAutoSave">
                                                Autosave
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="opopo">
                                        <div className="auto-save-off-83109 madetommy-bold-black-17px border-class-1">AutoSave: {autosave ? 'on': 'off'}</div>
                                        <button className="btn btn-lg btn-primary mt-5 pt-2 pl-5 pr-5 pb-2 quick-save-now" data-bs-toggle="modal" data-bs-target="#quickSaveDeposit">Save Now</button>
                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="transaction-history">
                        <h1 className="quick-save-tory-88652 madetommy-medium-new-car-26px border-class-1">Quick Save Transaction History</h1>
                        <SavingsTransactions transactions={transactions}/>
                    </div>
                </div>
                <Deposit modalId="quickSaveDeposit" header="Save To Investfy Through QuickSave" deposit={this.props.depositQuickSave} id={null} />
                <Withdraw withdraw={this.props.quickSaveCashOut} amount={balance} modalId="quickSaveCashOut" header="Quick Save Withdraw" id={null} />
                <AutoSave modalId="quickSaveAutoSave" header="Change Autosave Status" autosave_amount={autosave_amount} day_interval={day_interval} autoSave={this.props.quickSaveAutoSave} status={autosave} id={null} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    quickSave: state.quickSave
})


export default connect(mapStateToProps, { getQuickSave, quickSaveAutoSave, depositQuickSave, quickSaveCashOut })(QuickSave);
