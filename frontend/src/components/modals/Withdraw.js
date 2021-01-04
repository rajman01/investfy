import React, { Component } from 'react';

class Withdraw extends Component {

    onSubmit = (e) => {
        e.preventDefault();
        this.props.withdraw();

    }

    render() {
        return (
            <div className="modal fade" id={this.props.id} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">{this.props.header}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <h6>Withdraw #{this.props.amount} To Your Wallet</h6>
                    <form onSubmit={this.onSubmit}>
                      <button type="submit" className="btn btn-primary">Withdraw</button>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
        )
    }
}

export default Withdraw;
