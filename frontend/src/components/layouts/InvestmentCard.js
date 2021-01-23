import React, { Component } from 'react'

class InvestmentCard extends Component {
    render() {
        return (
            <div class="investment-mini-card border-class-190">
                <div class="overlap-group">
                    <img
                    class="rectangle-66"
                    src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/rectangle-66-2@2x.png"
                    />
                    <div class="text-22 madetommy-medium-black-16px">{this.props.name}</div>
                    <div class="price madetommy-regular-normal-black-18px">#{this.props.amount}</div>
                </div>
                <div class="view-details-13121 madetommy-light-black-12px">View Details</div>
            </div>
        )
    }
}

export default InvestmentCard;
