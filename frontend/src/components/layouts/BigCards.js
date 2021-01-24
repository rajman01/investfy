import React, { Component } from 'react'

class BigCards extends Component {
    render() {
        return (
            <div className="row saving-balance">
            <div className="col-12">
                <div className="frame-48">
                    <div className="rrtu">
                    <h1 className="total-balance-82187 madetommy-regular-normal-black-30px border-class-1">{ this.props.text }</h1>
                    <h1 className="x120000-78177 madetommy-medium-black-34px border-class-1"># { this.props.amount }</h1>
                    <p className="text-muted">{ this.props.walletId }</p>
                        </div>
                    <div className="rrty">
                    <img className="rectangle-65" src={ this.props.icon } />
                    </div>
                    
                </div>
            </div>
        </div>
        )
    }
}

export default BigCards;