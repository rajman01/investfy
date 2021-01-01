import React, { Component } from 'react';
import { logout } from '../../actions/auth';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

class Sidebar extends Component {

    static propTypes = {
        logout: PropTypes.func.isRequired,
    }

    render() {
        const { overview, savings, investments, payments, account, wallet } = this.props.active
        return (
            <div>
                <input type="checkbox" id="check" />
            <label for="check" id="icon">
                <i className="fas fa-bars" id="btn"></i>
                <i className="fas fa-times" id="cancle"></i>
            </label>
            <div className="sidebar">
                <div className="header">
                    <h1 className="investfy-651 madetommy-medium-white-30px border-class-1">
                        <span className="span1-VmTTxZ">i</span><span className="span2-VmTTxZ">nvestfy</span>
                    </h1>
                </div>
                <ul>
                    <li><Link to="/">
                            <div className={overview ? "active": "frame-45"}>
                                <img className="grid-dashboard" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/grid---dashboard@2x.svg" />
                                <div className="overview-681 madetommy-medium-new-car-20px border-class-1">Overview</div>
                            </div>
                        </Link></li>

                        <li><Link to="/wallet">
                            <div className={wallet ? "active": "frame-45"}>
                                <img className="user-usercircle" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/rectangle-64-4@2x.svg" />
                                <div className="salary-manager-6826 madetommy-medium-mountain-meadow-20px border-class-1">Wallet</div>
                            </div>
                        </Link></li>

                    <li><a href="">
                            <div className={savings ? "active": "frame-45"}>
                                <img className="user-usercircle" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/rectangle-65@2x.png" />
                                <div className="salary-manager-6826 madetommy-medium-mountain-meadow-20px border-class-1">Savings</div>
                            </div>
                        </a></li>
                    <li><a href="">
                            <div className={investments ? "active": "frame-45"}>
                                <img className="user-usercircle" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/chart---line-chart-up@2x.svg" />
                                <div className="salary-manager-6826 madetommy-medium-mountain-meadow-20px border-class-1">Investments</div>
                            </div>
                        </a></li>
                    <li><a href="">
                            <div className={payments ? "active": "frame-45"}>
                                <img className="user-usercircle" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/basic---credit-card-4@2x.svg" />
                                <div className="salary-manager-6826 madetommy-medium-mountain-meadow-20px border-class-1">Payments</div>
                            </div>
                        </a></li>
                    <li><a href="">
                            <div className={account ? "active": "frame-45"}>
                                <img className="user-usercircle" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/user---user-circle-8@2x.svg" />
                                <div className="salary-manager-6826 madetommy-medium-mountain-meadow-20px border-class-1">My Account</div>
                            </div>
                        </a></li>
                </ul>
                <ul>
                    <li>
                        <div className="frame-45 down" onClick={this.props.logout}>
                            <img className="user-usercircle" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/basic---exit@2x.svg" />
                            <div className="salary-manager-6826 madetommy-medium-mountain-meadow-20px border-class-1">Log Out</div>
                        </div>
                    </li>
                </ul>
            </div>
                    </div>
        )
    }
}

export default connect( null, { logout })(Sidebar);
