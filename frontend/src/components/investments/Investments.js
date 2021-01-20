import React, { Component } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'


class Investments extends Component {

    state = {

    }

    static propTypes = {
        
    }

    componentDidMount(){
        
    }
    

    render() {
        const active = { 'overview': false, 'savings': false, 'investments': true, 'payments': false, 'account': false, 'wallet': false }
        return (
            <div>
                <Sidebar active={active} />
                <div className="main-content">
                    <Header bigHeader="Wallet" />
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
                        <div className="frame-65 border-class-88">
                            <img
                                className="edit-searchsmall"
                                src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/edit---search-small@2x.svg"
                            />
                            <input type="text" placeholder="Search for investment" className="search-investment"/>
                        </div>
                        <div className="row mt-4">
                            <div className="col-xl-4 col-lg-6 col-md-12 mb-3">
                            <div class="investment-mini-card border-class-190">
                                <div class="overlap-group">
                                    <img
                                    class="rectangle-66"
                                    src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/rectangle-66-2@2x.png"
                                    />
                                    <div class="text-22 madetommy-medium-black-16px">Fixed income Transport Investment</div>
                                    <div class="price madetommy-regular-normal-black-18px">$250,000</div>
                                </div>
                                <div class="view-details-13121 madetommy-light-black-12px">View Details</div>
                             </div>
                            </div>

                            <div className="col-xl-4 col-lg-6 col-md-12 mb-3">
                            <div class="investment-mini-card border-class-190">
                                <div class="overlap-group">
                                    <img
                                    class="rectangle-66"
                                    src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/rectangle-66-2@2x.png"
                                    />
                                    <div class="text-22 madetommy-medium-black-16px">Fixed income Transport Investment</div>
                                    <div class="price madetommy-regular-normal-black-18px">$250,000</div>
                                </div>
                                <div class="view-details-13121 madetommy-light-black-12px">View Details</div>
                             </div>
                            </div>

                            <div className="col-xl-4 col-lg-6 col-md-12 mb-3">
                            <div class="investment-mini-card border-class-190">
                                <div class="overlap-group">
                                    <img
                                    class="rectangle-66"
                                    src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/rectangle-66-2@2x.png"
                                    />
                                    <div class="text-22 madetommy-medium-black-16px">Fixed income Transport Investment</div>
                                    <div class="price madetommy-regular-normal-black-18px">$250,000</div>
                                </div>
                                <div class="view-details-13121 madetommy-light-black-12px">View Details</div>
                             </div>
                            </div>
                        </div>
                   </div>
                </div>
         </div>
        )
    }
}

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps)(Investments);
