import React, { Component } from 'react';

class AutoSave extends Component {
    state = {
        day_interval: null,
        autosave_amount: ''
    }

    onChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
    });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.autoSave(this.state);
    }

    componentDidMount(){
      this.setState({
        day_interval: this.props.day_interval,
        autosave_amount: this.props.autosave_amount
      })
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
                    <form onSubmit={this.onSubmit}>
                    <div className="mb-3">
                      <label for="amount" className="col-form-label">Day Interval</label>
                      <input type="number" name="day_interval" required class="form-control" id="day_interval" onChange={this.onChange} value={this.state.day_interval} placeholder="AutoSave Day Interval"/>
                    </div>
                    <div className="mb-3">
                      <label for="amount" className="col-form-label">AutoSave Amount</label>
                      <input type="number" name="autosave_amount" required step=".01" class="form-control" id="autosave_amount" onChange={this.onChange} value={this.state.autosave_amount} placeholder="Amount To Save Every Day Interval"/>
                    </div>
                      <button type="submit" className="btn btn-primary">{this.props.status ? 'OFF': 'ON'}</button>
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

export default AutoSave;
