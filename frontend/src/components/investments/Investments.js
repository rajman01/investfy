import React, { Component } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import InvestmentCard from '../layouts/InvestmentCard'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { getAllInvestments } from '../../actions/investments'
import InvestmentApply from '../modals/InvestmentApply'


class Investments extends Component {

    state = {
        investments: [],
        search: ''
    }

    onChange = (e) => {
        if (e.target.value === ''){
            this.setState({
                investments: this.props.all_investments
            })
        }else{
            this.setState({
                investments: this.props.all_investments.filter(investment => investment.name.toLowerCase().includes(e.target.value.toLowerCase()))
            })
        }
    }

    static propTypes = {
        getAllInvestments: PropTypes.func.isRequired,
        all_investments: PropTypes.array.isRequired
    }

    componentDidMount(){
        this.props.getAllInvestments()
    }

    componentDidUpdate(prevProps){
        if (prevProps !== this.props){
            this.setState({
                investments: this.props.all_investments
            })
        }
    }
    

    render() {
        const active = { 'overview': false, 'savings': false, 'investments': true, 'payments': false, 'account': false, 'wallet': false }
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
                        <div className="text-1 madetommy-medium-new-car-20px">Explore Investments</div>
                        <div className="investments-header">
                            <div className="frame-65 border-class-88">
                                <img
                                    className="edit-searchsmall"
                                    src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/edit---search-small@2x.svg"
                                />
                                <input type="text" placeholder="Search for investment" className="search-investment" name="search" onChange={this.onChange}/>
                            </div>
                            <div className="apply">
                                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#investmentApply">Apply</button>
                            </div>
                        </div>
                        <div className="row mt-4">
                            {this.state.investments.map(investment => (
                                <div className="col-xl-4 col-lg-6 col-md-12 mb-3" key={investment.id}>
                                    <Link to={`/investment/${investment.id}`}>
                                        <InvestmentCard name={investment.name} amount={investment.amount_per_unit} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                   </div>
                </div>
                <InvestmentApply />
         </div>
        )
    }
}

const mapStateToProps = (state) => ({
    all_investments: state.investments.all_investments
})

export default connect(mapStateToProps, { getAllInvestments })(Investments);
