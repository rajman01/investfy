import React, { Component } from 'react';

class Card extends Component {
    render() {
        const { icon, amount, text } = this.props;
        return (
            <div className="frame-52">
                <img className="rectangle-64" src={icon} />
                <h1 className="x650000-78181 madetommy-medium-black-34px border-class-1">#{ amount }</h1>
                <div className="x-total-inv-ents-78180 madetommy-medium-new-car-19px border-class-1">-{ text }</div>
            </div>
        )
    }
}

export default Card;
