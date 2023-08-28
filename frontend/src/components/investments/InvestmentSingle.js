import React, { Component } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { getInvestment, invest, investmentCashout } from '../../actions/investments'
import { timeStamp } from '../../actions/wallet'
import Password from '../modals/Password'


class InvestmentSingle extends Component {

    state = {
        units: '',
        password: ''
    }

    onChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
      });
    }

    static propTypes = {
        investment: PropTypes.object.isRequired,
        invest: PropTypes.func.isRequired,
        getInvestment: PropTypes.isRequired,
        investmentCashout: PropTypes.isRequired
    }

    componentDidMount(){
        this.props.getInvestment(this.props.match.params.id);
    }
    
    onSubmit = (e) => {
        e.preventDefault();
        const {units, password} = this.state;
        const id = this.props.investment.id
        this.props.invest({units, password, id});
        this.setState({
            units: '',
            password: '',
        })
    }

    render() {
        const active = { 'overview': false, 'savings': false, 'investments': true, 'payments': false, 'account': false, 'wallet': false }
        const {id, name, amount_per_unit, yearly_profit_percent, description, investment_type, payout_type, duration, units, units_left, no_of_investors, date_approved, data_type, sold_out } = this.props.investment;
        return (
            <div>
                <Sidebar active={active} />
                <div className="main-content">
                    <Header bigHeader="Investments" />
                    <div className="row save-now">
                        <div className="col-lg-6 col-sm-6">
                            <div className="dashoboard-iew-123132 madetommy-regular-normal-mountain-meadow-18px border-class-1">
                                Dashoboard / Investments / Make An Investments
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                        </div>
                    </div>
                   <div className="investments">
                       <div className="investments-header">
                       {data_type === "investment for owner" ? (
                            <div className="apply">
                                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#investmentCashout">Withdraw</button>
                            </div>
                            ) : (
                            <span></span>
                        )}
                        </div>
                       <div className="row">
                           <div className="col-xl-6 col-lg-12">
                               <div className="left-side-investments">
                                    <div className="text-1 madetommy-medium-new-car-20px">{name}</div>
                                    <p class="text-109 madetommy-regular-normal-black-16pxs">#{amount_per_unit}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ROI {yearly_profit_percent}%</p>
                                    <div class="frame-69">
                                        <div class="text-19 madetommy-regular-normal-mountain-meadow-16px">About the investment</div>
                                        <div class="frame-7">
                                            <div class="text-2 madetommy-regular-normal-black-12pxs">Description</div>
                                            <p class="text-3 madetommy-regular-normal-black-15px">{description}</p>
                                        </div>
                                        <div class="frame-7">
                                            <div class="text-2 madetommy-regular-normal-black-12pxs">Expected Returns</div>
                                            <p class="text-3 madetommy-regular-normal-black-15px">{yearly_profit_percent}% Interest rate Per Year</p>
                                        </div>
                                        <div class="frame-7">
                                            <div class="text-2 madetommy-regular-normal-black-12pxs">Investment Type</div>
                                            <div class="text-3 madetommy-regular-normal-black-15px">{investment_type}</div>
                                        </div>
                                        <div class="frame-7">
                                            <div class="text-2 madetommy-regular-normal-black-12pxs">Payout Type</div>
                                            <div class="text-3 madetommy-regular-normal-black-15px">{payout_type}</div>
                                        </div>
                                        <div class="frame-7">
                                            <div class="text-2 madetommy-regular-normal-black-12pxs">Investment Duration</div>
                                            <div class="text-3 madetommy-regular-normal-black-15px">{duration * 12} Months</div>
                                        </div>
                                        <div class="frame-7">
                                            <div class="text-2 madetommy-regular-normal-black-12pxs">Units Left / Investment Units</div>
                                            <div class="text-3 madetommy-regular-normal-black-15px">{units_left} / {units}</div>
                                        </div>
                                        <div class="frame-7">
                                            <div class="text-2 madetommy-regular-normal-black-12pxs">Amount Per Unit</div>
                                            <div class="text-3 madetommy-regular-normal-black-15px">#{amount_per_unit}</div>
                                        </div>
                                        {data_type === "investment for investors" ? (
                                            <div className="investors-div">
                                                <div class="frame-7">
                                                    <div class="text-2 madetommy-regular-normal-black-12pxs">Units Bought</div>
                                                    <div class="text-3 madetommy-regular-normal-black-15px">{this.props.investment.units_bought}</div>
                                                </div>
                                                <div class="frame-7">
                                                    <div class="text-2 madetommy-regular-normal-black-12pxs">Amount Invested</div>
                                                    <div class="text-3 madetommy-regular-normal-black-15px">#{this.props.investment.units_bought * amount_per_unit}</div>
                                                </div>
                                                <div class="frame-7">
                                                    <div class="text-2 madetommy-regular-normal-black-12pxs">Your Yearly Profit</div>
                                                    <div class="text-3 madetommy-regular-normal-black-15px">#{this.props.investment.yearly_profit}</div>
                                                </div>
                                                <div class="frame-7">
                                                    <div class="text-2 madetommy-regular-normal-black-12pxs">Your Yearly Gain</div>
                                                    <div class="text-3 madetommy-regular-normal-black-15px">#{this.props.investment.yearly_gain}</div>
                                                </div>
                                            </div>
                                        ) : (<span></span>)}
                                        {data_type === "investment for owner" ? (
                                            <div className="investors-div">
                                                <div class="frame-7">
                                                    <div class="text-2 madetommy-regular-normal-black-12pxs">Yearly Investors Money (Amount You are to pay investfy yearly)</div>
                                                    <div class="text-3 madetommy-regular-normal-black-15px">#{this.props.investment.yearly_investors_money}</div>
                                                </div>
                                                 <div class="frame-7">
                                                    <div class="text-2 madetommy-regular-normal-black-12pxs">Total Amount in this investment account</div>
                                                    <div class="text-3 madetommy-regular-normal-black-15px">#{this.props.investment.total_amount}</div>
                                                </div>
                                                <div class="frame-7">
                                                    <div class="text-2 madetommy-regular-normal-black-12pxs">Created On </div>
                                                    <div class="text-3 madetommy-regular-normal-black-15px">{this.props.investment.date_create}</div>
                                                </div>
                                            </div>
                                        ) : (<span></span>)}
                                        <div class="frame-7">
                                            <div class="text-2 madetommy-regular-normal-black-12pxs">Number of Investors</div>
                                            <div class="text-3 madetommy-regular-normal-black-15px">{no_of_investors} {no_of_investors == 1 ? ('Investor') : ('Investors') }</div>
                                        </div>
                                        <div class="frame-7">
                                            <div class="text-2 madetommy-regular-normal-black-12pxs">Started on </div>
                                            <div class="text-3 madetommy-regular-normal-black-15px">{date_approved}</div>
                                        </div>
                                        <div class="frame-7">
                                            <div class="text-2 madetommy-regular-normal-black-12pxs">Investment Insurance</div>
                                            <div class="text-3 madetommy-regular-normal-black-15px">Leadway Insurance</div>
                                        </div>
                                    </div>
                                   
                               </div>
                           </div>
                           <div className="col-xl-6 col-lg-12">
                               <div className="form-invest">
                                   <form onSubmit={this.onSubmit}>
                                    <div className="mb-3">
                                        <p class="text-1 madetommy-light-black-11px">Enter Amount of units @ #{amount_per_unit} per Unit</p>
                                        <input class="frame-70 black-border-1pxss" type="number" name="units" value={this.state.units} onChange={this.onChange} placeholder="units" disabled={sold_out}/>
                                    </div>
                                    <div className="mb-3">
                                        <p class="text-1 madetommy-light-black-11px">Password</p>                                
                                        <input class="frame-70 black-border-1pxss" type="password" name="password" value={this.state.password} onChange={this.onChange} placeholder="wallet password" disabled={sold_out}/>
                                    </div>
                                    {sold_out ? (
                                        
                                        <button class="btn btn-danger frame-71" type="submit" disabled><div class="invest-1848 madetommy-medium-white-20px">SOLD OUT</div></button>
                                    ) : (
                                        <button class="frame-71" type="submit"><div class="invest-1848 madetommy-medium-white-20px">INVEST</div></button>
                                    )}
                                   </form>
                               </div>
                           </div>
                          
                       </div>
                      
                   </div>
                   {data_type === "investment for owner" || data_type === "investment for investors" ? (
                        <div className="transaction-history">
                            <h1 className="quick-save-tory-88652 madetommy-medium-new-car-26px border-class-1">{name} Transaction History{data_type === "investment for owner" ? ('(All)') : ('(Yours)') }</h1>
                            <table class="table table-bordered">
                                <thead class="thead-light">
                                <tr>
                                    <th scope="col">Investor</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Units Bought</th>
                                    <th scope="col">Timestamp</th>
                                </tr>
                                </thead>
                                <tbody>
                                    { this.props.investment.transactions.map(transaction => (
                                        <tr key={transaction.id}>
                                            <td>{transaction.user.username}</td>
                                            <td>{transaction.amount}</td>
                                            <td>{transaction.units_bought}</td>
                                            <td>{timeStamp(transaction.timestamp)}</td>
                                        </tr>
                                    )) }
                                </tbody>
                            </table>
                        </div>
                    ) :(<span></span>)}
                </div>
           
                    <Password save={this.props.investmentCashout} bigHeader={`${name} Investment cashout`} header={`Cashout ${this.props.investment.total_amount} Naira To Your Wallet`} modalId='investmentCashout' id={id}/>
              
         </div>
        )
    }
}

const mapStateToProps = (state) => ({
    investment: state.investments.investment
})


export default connect(mapStateToProps, { getInvestment, invest, investmentCashout })(InvestmentSingle);
