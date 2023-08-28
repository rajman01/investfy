import React, { Component } from 'react';

class Deposit extends Component {
    state = {
        id: null,
        amount: '',
        password: ''
    }

    onChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
    });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.deposit(this.state);
        this.setState({
          amount: '',
          password: ''
        })
    }

    // componentDidMount(){
    //   this.setState({
    //       id: this.props.id
    //     })
    // }
    
    componentDidUpdate(prevProps){
      if(this.props !== prevProps){
        this.setState({
          id: this.props.id
        });
      }
    }

    render() {
        return (
            <div className="modal fade" id={this.props.modalId} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">{this.props.header}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={this.onSubmit}>
                    <div className="mb-3">
                      <label for="amount" className="col-form-label">Amount</label>
                      <input type="number" name="amount" required step=".01" class="form-control" onChange={this.onChange} value={this.state.amount} placeholder="Amount To Save"/>
                    </div>
                    <div className="mb-3">
                      <label for="amount" className="col-form-label">Password</label>
                      <input type="password" name="password" required class="form-control" onChange={this.onChange} value={this.state.password} placeholder="Your Wallet Password"/>
                    </div>
                      <button type="submit" className="btn btn-primary">Save</button>
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

export default Deposit;