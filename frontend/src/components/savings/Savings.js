import React, { Component } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import BigCards from '../layouts/BigCards'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class Savings extends Component {

    static propTypes = {
        total_savings: PropTypes.number.isRequired,
        wallet_id: PropTypes.string.isRequired
    }
    render() {
        const active = { 'overview': false, 'savings': true, 'investments': false, 'payments': false, 'account': false, 'wallet': false }
        const savingsIcon = "https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/rectangle-65@2x.svg"
        return (
            <div>
                <Sidebar active={active} />
                <div className="main-content">
                    <Header bigHeader="Savings" />
                    <div className="row save-now">
                        <div className="col-12">
                            <div className="dashoboard-iew-123132 madetommy-regular-normal-mountain-meadow-18px border-class-1">
                                Dashoboard / Savings
                            </div>
                        </div>
                    </div>
                    <BigCards text="Total Balance" amount={this.props.total_savings} icon={savingsIcon} walletId={`WALLET ID : ${this.props.wallet_id}`}/>
                    <div className="row saving-choices">
                        <div className="col-xl-4 col-lg-6 col-md-12">
                            <Link to="/savings/quicksave" className="card-link">
                                <div className="frame-saving">
                                    <img className="rectangle-64" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/rectangle-64@2x.svg" />
                                    <h1 class="quick-save-82240 border-class-1 madetommy-medium-black-25px">Quick Save</h1>
                                    <p class="text-1 border-class-1 madetommy-light-black-14px"> Some of us are building from scratch. No rich parents. No connections. No assistance. .</p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-12">
                            <Link to="/savings/jointsavings" className="card-link">
                                <div className="frame-saving">
                                    <img className="ellipse-12" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/ellipse-12@2x.png" />
                                    <img className="ellipse-10" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/ellipse-10@2x.png" />
                                    <img className="ellipse-11" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/ellipse-11@2x.png" />
                                    <h1 class="quick-save-82240 border-class-1 madetommy-medium-black-25px">Joint Save</h1>
                                    <p class="text-1 border-class-1 madetommy-light-black-14px"> Some of us are building from scratch. No rich parents. No connections. No assistance. .</p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-12">
                            <Link to="/savings/targetsavings" className="card-link">
                                <div className="frame-saving">
                                    <img className="rectangle-64" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/rectangle-64@2x.svg" />
                                    <h1 class="quick-save-82240 border-class-1 madetommy-medium-black-25px">Target Save</h1>
                                    <p class="text-1 border-class-1 madetommy-light-black-14px"> Some of us are building from scratch. No rich parents. No connections. No assistance. .</p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-12">
                            <Link to="/savings/targetsavings/joint" className="card-link">
                                <div className="frame-saving">
                                        <img className="ellipse-12" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/ellipse-12@2x.png" />
                                        <img className="ellipse-10" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/ellipse-10@2x.png" />
                                        <img className="ellipse-11" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/ellipse-11@2x.png" />
                                        <h1 class="quick-save-82240 border-class-1 madetommy-medium-black-25px">Joint Target Save</h1>
                                        <p class="text-1 border-class-1 madetommy-light-black-14px"> Some of us are building from scratch. No rich parents. No connections. No assistance. .</p>
                                </div>
                            </Link>
                        </div>                        
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    total_savings: state.auth.user.total_savings,
    wallet_id: state.auth.user.wallet.wallet_id
})


export default connect(mapStateToProps)(Savings);
