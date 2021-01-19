import React, { Component } from 'react';
import Sidebar from '../layouts/Sidebar';
import Header from '../layouts/Header';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SavingsTransactions from '../layouts/SavingsTransactions'
import  Deposit  from '../modals/Deposit'
import  Withdraw  from '../modals/Withdraw'
import Delete from '../modals/Delete'
import Invite from '../modals/Invite'
import { getJointTargetSave, jointTargetSaveCashOut, jointTargetSaveDeposit, deleteJointTargetSave, inviteJointTargetSave, leaveJointTargetSave } from '../../actions/jointTargetSave'


class JointTargetSaveSingle extends Component {
    state = {
        transactions: [],
        active: ''
    }

    static propTypes = {
        targetSave: PropTypes.object.isRequired,
        getJointTargetSavee: PropTypes.func.isRequired,
        jointTargetSaveCashOut: PropTypes.func.isRequired,
        jointTargetSaveDeposit: PropTypes.func.isRequired,
        deleteJointTargetSave: PropTypes.func.isRequired,
        inviteJointTargetSave: PropTypes.func.isRequired,
        leaveJointTargetSave: PropTypes.func.isRequired,
        username: PropTypes.string.isRequired,

    }

    componentDidMount(){
        let id = this.props.match.params.id;
        this.props.getJointTargetSave(id);
    }

    componentDidUpdate(prevProps){
        if(this.props !== prevProps){
            const user = this.props.jointTargetSave.members.find(member => member.username === this.props.username);
            if(user){
                this.setState({
                    active: this.props.username,
                    transactions: user.transactions
                })
            }
        }
    }

    changeTransaction = (username) => {
        const user = this.props.jointTargetSave.members.find(member => member.username === username);
        this.setState({
            active: username,
            transactions: user.transactions
        })
    }

    render() {
        const sidebarActive = { 'overview': false, 'savings': true, 'investments': false, 'payments': false, 'account': false, 'wallet': false }
        const { id, name, description, targeted_amount, progress, date_created, members, user} = this.props.jointTargetSave;
        return (
            <div>
                <Sidebar active={sidebarActive} />
                <div className="main-content">
                    <Header bigHeader={`Joint Target Save (${name})`} />
                    <div className="row save-now">
                        <div className="col-12">
                            <div className="dashoboard-iew-123132 madetommy-regular-normal-mountain-meadow-18px border-class-1">
                                Dashoboard / Savings / Joint Target Save
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
                                        <h1 class="x20000-9669 border-class-1 madetommy-medium-new-car-50px">#{targeted_amount}&nbsp;
                                        <img className="arrow-chev-onbigright-big" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/arrow---chevron-big-right-1@2x.svg"/></h1>
                                        <span class="x4000-9683 border-class-1 madetommy-medium-mountain-meadow-26px">&nbsp;#{progress}</span>
                                    </div>
                                    {user.username === this.props.username ? (
                                        <div className="row">
                                            <div className="col-6 border-class-100">
                                                <button className="frame-58" data-bs-toggle="modal" data-bs-target="#jointTargetSaveCashOut">
                                                    Withdraw
                                                </button>
                                            </div>
                                            <div className="col-6 border-class-100">
                                                <button className="frame-58" data-bs-toggle="modal" data-bs-target="#jointSaveInvite">
                                                    Invite
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="row">
                                            <div className="col-8 border-class-100">
                                                <button className="frame-58" data-bs-toggle="modal" data-bs-target="#leaveJointTargetSave">
                                                    Leave
                                                </button>
                                            </div>
                                            <div className="col">
                                            </div>
                                        </div>
                                    )}
                                   

                                </div>
                                <div className="col-5">
                                    <div className="opopo">
                                        <button className="btn btn-lg btn-primary mt-5 pt-2 pl-5 pr-5 pb-2 quick-save-now" data-bs-toggle="modal" data-bs-target="#jointTargetSaveDeposit">Save Now</button>
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
                            {user.username === this.props.username ? (
                                <div>
                                    <button className="btn btn-info mr-3" data-bs-toggle="modal" data-bs-target="#leaveJointTargetSave">Leave</button>
                                    <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteJointTargetSave">Delete</button>
                                </div>
                                
                            ) : (<span></span>)}
                        </div>
                    </div>
                    <div className="transaction-history">
                        <h1 className="quick-save-tory-88652 madetommy-medium-new-car-26px border-class-1">{name} Transaction History</h1>
                        <div className="user-transactions mb-3">
                            {members.map(member => (
                                <div className={this.state.active === member.username ? "tran-button-active mr-3" : "tran-button mr-3"}><div className={this.state.active === member.username ? "tran-text-active" : "tran-text"}  onClick={() => {this.changeTransaction(member.username)}} data-type="wallet">{ member.username === user.username ? (`${member.username} (Admin)`) : (member.username) }</div></div>
                            ))}
                        </div>
                        {<SavingsTransactions transactions={this.state.transactions}/>}
                    </div>
                </div>
                <Deposit modalId="jointTargetSaveDeposit" header={`Save for Joint Target Save (${name})`} deposit={this.props.jointTargetSaveDeposit} id={id} />
                <Withdraw withdraw={this.props.jointTargetSaveCashOut} amount={progress} modalId="jointTargetSaveCashOut" header={`Cash Out For Joint Target Save (${name})`} id={id} />
                <Delete modalId="deleteJointTargetSave" header="Are you sure you want to delete this joint target save" bigHeader="Delete Joint Target Save" id={id} delete={this.props.deleteJointTargetSave}/>
                <Delete modalId="leaveJointTargetSave" header="Are you sure you want to leave this joint target save" bigHeader="Leave Joint Target Save" id={id} delete={this.props.leaveJointTargetSave}/>
                <Invite modalId="jointSaveInvite" id={id} invite={this.props.inviteJointTargetSave} header={`Invite new members to ${name}`}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    jointTargetSave: state.jointTargetSave,
    username: state.auth.user.username
})

export default connect(mapStateToProps, { getJointTargetSave, jointTargetSaveCashOut, jointTargetSaveDeposit, deleteJointTargetSave, inviteJointTargetSave, leaveJointTargetSave })(JointTargetSaveSingle)
