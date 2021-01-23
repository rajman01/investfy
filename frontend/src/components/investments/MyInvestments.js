import React, { Component } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import InvestmentCard from '../layouts/InvestmentCard'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { getMyInvestments } from '../../actions/investments'



class MyInvestments extends Component {
    
    static propTypes = {
        total_investments: PropTypes.number.isRequired,
        token: PropTypes.string.isRequired,
        my_investments: PropTypes.array.isRequired,
        getMyInvestments: PropTypes.func.isRequired
    }

    componentDidMount(){
        this.props.getMyInvestments()
    }

    render() {
        const active = { 'overview': false, 'savings': false, 'investments': true, 'payments': false, 'account': false, 'wallet': false }
        return (
            <div>
                <Sidebar active={active} />
                <div className="main-content">
                    <Header bigHeader="Investments" />
                    <div className="row save-now">
                        <div className="col-12">
                            <div className="dashoboard-iew-123132 madetommy-regular-normal-mountain-meadow-18px border-class-1">
                                Dashoboard / Investments
                            </div>
                        </div>
                    </div>
                    <div className="row saving-balance">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-7">
                                    <div className="quick-save-lance-8344 madetommy-light-black-22px border-class-1">Total Investment Balance</div>
                                    <h1 className="x650000-78181 madetommy-medium-black-34px border-class-1">#{this.props.total_investments}</h1>
                                </div>
                                <div className="col-5">
                                    <div className="opopo">
                                        <Link to="/investments" className="btn btn-lg btn-primary mt-5 pt-2 pl-5 pr-5 pb-2 quick-save-now">Invest Now</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="investments">
                        <div className="text-1 madetommy-medium-new-car-20px">My Investments {this.props.my_investments.length}</div>
                        <div className="row mt-4">
                            {this.props.my_investments.map(investment => (
                                <div className="col-xl-4 col-lg-6 col-md-12 mb-3" key={investment.id}>
                                    <Link to={`/investment/${investment.id}`}>
                                        <InvestmentCard name={investment.name} amount={investment.amount_per_unit}/>
                                    </Link>
                                </div>    
                            ))}
                        </div>
                    </div>
                </div>
                 </div>
        )
    }
}

const mapStateToProps = (state) => ({
    total_investments: state.auth.user.total_investments,
    token: state.auth.token,
    my_investments: state.investments.my_investments
})


export default connect(mapStateToProps, { getMyInvestments })(MyInvestments);
