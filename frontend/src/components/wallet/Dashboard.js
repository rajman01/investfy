import React, { Component } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import Card from '../layouts/Card'
import Caution from '../layouts/Caution'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import  Deposit  from '../modals/Deposit'
import {depositQuickSave} from '../../actions/quickSave'


class Dashboard extends Component {

    static propTypes = {
        user: PropTypes.object.isRequired,
        depositQuickSave: PropTypes.func.isRequired
    }

    render() {
        const { username, total_investments, total_savings, wallet } = this.props.user;
        const active = { 'overview': true, 'savings': false, 'investments': false, 'payments': false, 'account': false, 'wallet': false }
        const caution = () => {
            const { username, email_verified, bvn_verified } = this.props.user;
                if(!email_verified || !bvn_verified){
                    return <Caution username={username} />
                }
                else{
                    return <span></span>
                }
        }
        const walletIcon = "https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/rectangle-64-4@2x.svg";
        const investmentIcon = "https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/rectangle-64-3@2x.svg";
        const savingsIcon = "https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/rectangle-64-2@2x.svg"

        return (
            <div>
                <Sidebar active={active} />
                <div className="main-content">
                    <Header bigHeader={ 'Hi' + ' ' +  username + ',' }/>
                    <div className="row save-now">
                        <div className="col-4">
                            <div className="dashoboard-iew-123132 madetommy-regular-normal-mountain-meadow-18px border-class-1">
                                Dashoboard / Overview
                            </div>
                        </div>
                        <div className="col"></div>
                        <div className="col-4">
                           
                            <button className="btn btn-lg btn-primary quick-save-now" data-bs-toggle="modal" data-bs-target="#saveNow">SAVE NOW</button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            {caution()}
                        </div>
                    </div>

                    <div className="row overview">
                        <div className="col-xl-4 col-lg-6 col-md-12">
                            <Card icon={savingsIcon} amount={total_savings} text="Total Savings" />
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-12">
                            <Card icon={investmentIcon} amount={total_investments} text="Total Investments"/>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-sm-md">
                            <Card icon={walletIcon} amount={wallet.balance} text="My E-Wallet"/>
                        </div>
                    </div>
                </div>
                <Deposit modalId="saveNow" id={null} header="Save To Investfy Through QuickSave" deposit={this.props.depositQuickSave}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
})

export default connect(mapStateToProps, { depositQuickSave })(Dashboard);
