import React, { Component } from 'react';
import Sidebar from '../layouts/Sidebar';
import Header from '../layouts/Header';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SavingsTransactions from '../layouts/SavingsTransactions'
import Delete from '../modals/Delete'
import Invite from '../modals/Invite'
import Password from '../modals/Password'
import { getJointSave,  disbandJointSave, leaveJointSave, inviteJointSave, jointSaveDeposit } from '../../actions/jointSave'


class JointSaveSingle extends Component {
    state = {
        transactions: [],
        active: ''
    }

    static propTypes = {
        targetSave: PropTypes.object.isRequired,
        getJointSave: PropTypes.func.isRequired,
        disbandJointSave: PropTypes.func.isRequired,
        leaveJointSave: PropTypes.func.isRequired,
        inviteJointSave: PropTypes.func.isRequired,
        jointSaveDeposit: PropTypes.func.isRequired,
        username: PropTypes.string.isRequired,

    }

    componentDidMount(){
        let id = this.props.match.params.id;
        this.props.getJointSave(id);
    }

    componentDidUpdate(prevProps){
        if(this.props !== prevProps){
            const user = this.props.jointSave.members.find(member => member.username === this.props.username);
            if(user){
                this.setState({
                    active: this.props.username,
                    transactions: user.transactions
                })
            }
        }
    }

    changeTransaction = (username) => {
        const user = this.props.jointSave.members.find(member => member.username === username);
        this.setState({
            active: username,
            transactions: user.transactions
        })
    }

    render() {
        const sidebarActive = { 'overview': false, 'savings': true, 'investments': false, 'payments': false, 'account': false, 'wallet': false }
        const { id, name, admin, amount, total, date_created, can_invite_member, can_leave, can_disband, members} = this.props.jointSave;
        return (
            <div>
                <Sidebar active={sidebarActive} />
                <div className="main-content">
                    <Header bigHeader={`Joint Save (${name})`} />
                    <div className="row save-now">
                        <div className="col-12">
                            <div className="dashoboard-iew-123132 madetommy-regular-normal-mountain-meadow-18px border-class-1">
                                Dashoboard / Savings / Joint Save
                            </div>
                        </div>
                    </div>

                    <div className="row saving-balance">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-7">
                                    <div className="quick-save-lance-8344 madetommy-light-black-22px border-class-1">Total Savings</div>
                                    <h1 className="x40000-8385 madetommy-medium-new-car-50px border-class-1">#{total}</h1>
                                    {admin !== null ? (
                                        <div>
                                            {admin.username === this.props.username ? (
                                                <div className="row">
                                                    {can_invite_member ? (
                                                        <div className="col-6 border-class-100">
                                                            <button className="frame-58" data-bs-toggle="modal" data-bs-target="#jointSaveInvite">
                                                                Invite +
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="col-6">

                                                        </div>
                                                    )}
                                                    {can_disband ? (
                                                        <div className="col-6 border-class-100">
                                                            <button className="frame-58" data-bs-toggle="modal" data-bs-target="#jointSaveDisband">
                                                                Disband
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="col-6">

                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    {can_leave ? (
                                                        <div className="row">
                                                            <div className="col-8 border-class-100">
                                                                <button className="frame-58" data-bs-toggle="modal" data-bs-target="#jointSaveLeave">
                                                                    Leave
                                                                </button>
                                                            </div>
                                                            <div className="col">
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div></div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    

                                </div>
                                <div className="col-5">
                                    <div className="opopo">
                                         <button className="btn btn-lg btn-primary mt-5 pt-2 pl-5 pr-5 pb-2 quick-save-now" data-bs-toggle="modal" data-bs-target="#jointSaveDeposit">Save Now</button>                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row saving-balance mt-4">
                        <div className="description">
                            <h2>Name: {name}</h2>
                            <p>Amount To Be Saved Every Week: {amount} Naira</p>
                            <p>Created on:  {date_created}</p>
                            {admin !== null ? (
                                <div>
                                    {admin.username === this.props.username ? (
                                        <div>
                                            <button className="btn btn-info mr-3" data-bs-toggle="modal" data-bs-target="#jointSaveLeave">Leave</button>
                                        </div>
                                    
                                ) : (<span></span>)}
                                </div>
                            ) : (
                                <div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="transaction-history">
                        <h1 className="quick-save-tory-88652 madetommy-medium-new-car-26px border-class-1">{name} Transaction History</h1>
                        <div className="user-transactions mb-3">
                            {members.map(member => {
                                if(admin !== null){
                                    return (
                                        <div className={this.state.active === member.username ? "tran-button-active mr-3" : "tran-button mr-3"}><div className={this.state.active === member.username ? "tran-text-active" : "tran-text"}  onClick={() => {this.changeTransaction(member.username)}} data-type="wallet">{ member.username === admin.username ? (`${member.username} (Admin)`) : (member.username) }</div></div>
                                    )
                                }else{
                                    return (
                                        <div className={this.state.active === member.username ? "tran-button-active mr-3" : "tran-button mr-3"}><div className={this.state.active === member.username ? "tran-text-active" : "tran-text"}  onClick={() => {this.changeTransaction(member.username)}} data-type="wallet">{member.username}</div></div>
                                    )
                                }
                            })}
                        </div>
                        {<SavingsTransactions transactions={this.state.transactions}/>}
                    </div>
                </div>
                <Delete modalId="jointSaveDisband" header="Are you sure you want to disband this joint target save" bigHeader="Disband Joint Save" id={id} delete={this.props.disbandJointSave}/>
                <Delete modalId="jointSaveLeave" header="Are you sure you want to leave this joint save" bigHeader="Leave Joint Save" id={id} delete={this.props.leaveJointSave}/>
                <Invite modalId="jointSaveInvite" id={id} invite={this.props.inviteJointSave} header={`Invite new members to ${name}`}/>
                <Password modalId="jointSaveDeposit" header={`Save ${amount} naira to ${name}`} bigHeader={`Save To ${name}`} id={id} save={this.props.jointSaveDeposit}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    jointSave: state.jointSave,
    username: state.auth.user.username
})

export default connect(mapStateToProps, { getJointSave, disbandJointSave, leaveJointSave, inviteJointSave, jointSaveDeposit })(JointSaveSingle)
