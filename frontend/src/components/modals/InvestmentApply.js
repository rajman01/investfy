import React, { Component } from 'react';
import { investmentApply } from '../../actions/investments';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class InvestmentApply extends Component {
    state = {
        name: '', 
        description: '', 
        payout_type: 'profit', 
        units: null, 
        amount_per_unit: '', 
        yearly_profit_percent: null, 
        duration: null
    }

  static propTypes = {
      investmentApply: PropTypes.func.isRequired,
  }

    onChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
    });
  }

    onSubmit = (e) => {
      e.preventDefault();
      console.log(this.state)
      this.props.investmentApply(this.state);
      this.setState({
        name: '', 
        description: '', 
        payout_type: 'profit', 
        units: null, 
        amount_per_unit: '', 
        yearly_profit_percent: null, 
        duration: null
      })
    }

    render() {
          return (
            <div className="modal fade" id="investmentApply" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Apply For An Investment</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={this.onSubmit}>
                    <div className="mb-3">
                      <label for="name" className="col-form-label">Name</label>
                      <input type="text" name="name" id="name" required className="form-control" onChange={this.onChange} value={this.state.name}/>
                    </div>
                    <div className="mb-3">
                    <label for="description" className="col-form-label">Descriptiont</label>
                    <textarea name="description" class="form-control" id="description" onChange={this.onChange} value={this.state.description} placeholder="Describe the purpose of this investment"></textarea>
                    </div>
                    <div className="mb-3">
                      <label for="payoutType" className="col-form-label">Payout Type</label><br />
                      <select id="payoutType" className="form-select form-select-sm mb-3" aria-label=".form-select-lg example" onChange={this.onChange} name="payout_type" required value={this.state.payout_type}>
                        <option value="profit">Profit</option>
                        <option value="capital + profit">Capital + Profit</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label for="unit" className="col-form-label">Units</label>
                      <input type="number" name="units" required className="form-control" id="unit" onChange={this.onChange} value={this.state.units} placeholder="How many units do you feel is available for this investments"/>
                    </div>
                    <div className="mb-3">
                      <label for="amountPerUnit" className="col-form-label">Amount Per Unit</label>
                      <input type="number" name="amount_per_unit" required step=".01" className="form-control" id="amountPerUnit" onChange={this.onChange} value={this.state.amount_per_unit} placeholder="How Much do you wish to sell each units"/>
                    </div>
                    <div className="mb-3">
                      <label for="percent" className="col-form-label">Yearly Profit Percent</label>
                      <input type="number" name="yearly_profit_percent" required className="form-control" id="percent" onChange={this.onChange} value={this.state.yearly_profit_percent} placeholder="What will be the yearly profit percentage of investors"/>
                    </div>
                    <div className="mb-3">
                      <label for="duration" className="col-form-label">Duration</label>
                      <input type="number" name="duration" required className="form-control" id="duration" onChange={this.onChange} value={this.state.duration} placeholder="How many years will the investment last"/>
                    </div>
                      <button type="submit" className="btn btn-primary">Submit</button>
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

export default connect( null, { investmentApply } )(InvestmentApply);