import React, { Component } from 'react';
import Sidebar from '../layouts/Sidebar';
import Header from '../layouts/Header';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SavingsTransactions from '../layouts/SavingsTransactions'
import  AutoSave from '../modals/AutoSave'
import  Deposit  from '../modals/Deposit'
import  Withdraw  from '../modals/Withdraw'
import Delete from '../modals/Delete'
import { getTargetSave, targetSaveAutoSave, targetSaveCashOut, targetSaveDeposit, deleteTargetSave } from '../../actions/targetSave'


class TargetSaveSingle extends Component {
    static propTypes = {
        targetSave: PropTypes.object.isRequired,
        getTargetSave: PropTypes.func.isRequired,
        targetSaveAutoSave: PropTypes.func.isRequired,
        targetSaveCashOut: PropTypes.func.isRequired,
        targetSaveDeposit: PropTypes.func.isRequired,
        deleteTargetSave: PropTypes.func.isRequired
    }

    componentDidMount(){
        let id = this.props.match.params.id;
        this.props.getTargetSave(id);
        
    }

    render() {
        const sidebarActive = { 'overview': false, 'savings': true, 'investments': false, 'payments': false, 'account': false, 'wallet': false }
        const { id, name, description, targeted_amount, progress, date_created, transactions} = this.props.targetSave;
        const { active, day_interval, autosave_amount } = this.props.targetSave.autosave
        return (
            <div>
                <Sidebar active={sidebarActive} />
                <div className="main-content">
                    <Header bigHeader={`Target Save (${name})`} />
                    <div className="row save-now">
                        <div className="col-12">
                            <div className="dashoboard-iew-123132 madetommy-regular-normal-mountain-meadow-18px border-class-1">
                                Dashoboard / Savings / TargetSave
                            </div>
                        </div>
                    </div>



                    <div className="row saving-balance">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-7">
                                    <div className="targeted-saving-9628 border-class-1 madetommy-light-black-22px">Targeted Saving &nbsp;&nbsp;  <img className="arrow-chev-onbigright" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/arrow---chevron-big-right@2x.svg"/>
                                    &nbsp;&nbsp;Progress
                                    </div> 
                                    <div className="mt-3">
                                        <h1 class="x650000-78181 madetommy-medium-black-34px border-class-1">#{targeted_amount}&nbsp;
                                        <img className="arrow-chev-onbigright-big" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/arrow---chevron-big-right-1@2x.svg"/></h1>
                                        <span class="x4000-9683 border-class-1 madetommy-medium-mountain-meadow-26px">&nbsp;#{progress}</span>
                                    </div>
                                    <div className="row">
                                        <div className="col-6 border-class-100">
                                            <button className="frame-58" data-bs-toggle="modal" data-bs-target="#targetSaveCashOut">
                                                Withdraw
                                            </button>
                                        </div>
                                        <div className="col-6 border-class-100">
                                        <button className="frame-58" data-bs-toggle="modal" data-bs-target="#targetSaveAutoSave">
                                                Autosave
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="opopo">
                                        <div className="auto-save-off-83109 madetommy-bold-black-17px border-class-1">AutoSave: {active ? 'on': 'off'}</div>
                                        <button className="btn btn-lg btn-primary mt-5 pt-2 pl-5 pr-5 pb-2 quick-save-now" data-bs-toggle="modal" data-bs-target="#targetSaveDeposit">Save Now</button>
                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row saving-balance mt-4">
                        <div className="description">
                            <h2>Name: {name}</h2>
                            {description ? <p className="mt-2">Description: {description}</p> : ''}
                            <p>Created on:  {date_created}</p>
                            <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteTargetSave">Delete</button>
                        </div>
                    </div>
                    <div className="transaction-history">
                        <h1 className="quick-save-tory-88652 madetommy-medium-new-car-26px border-class-1">{name} Transaction History</h1>
                        <SavingsTransactions transactions={transactions}/>
                    </div>
                </div>
                <Deposit modalId="targetSaveDeposit" header={`Save for Target Save (${name})`} deposit={this.props.targetSaveDeposit} id={id} />
                <Withdraw withdraw={this.props.targetSaveCashOut} amount={progress} modalId="targetSaveCashOut" header={`Cash Out For Target Save (${name})`} id={id} />
                <AutoSave modalId="targetSaveAutoSave" header="Change Autosave Status" autosave_amount={autosave_amount} day_interval={day_interval} autoSave={this.props.targetSaveAutoSave} status={active} id={id} />
                <Delete modalId="deleteTargetSave" header="Are you sure you want to delete this target save" bigHeader="Delete Target Save" id={id} delete={this.props.deleteTargetSave}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    targetSave: state.targetSave,
})

export default connect(mapStateToProps, { getTargetSave, targetSaveAutoSave, targetSaveCashOut, targetSaveDeposit, deleteTargetSave })(TargetSaveSingle)
