import React, { Component } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllTargetSave, createTargetSave } from "../../actions/savings";
import { Link } from 'react-router-dom'

class TargetSave extends Component {
    state = {
        name: '',
        description: '',
        targeted_amount: '',
    }

    static propTypes = {
        token: PropTypes.string.isRequired,
        getAllTargetSave: PropTypes.func.isRequired,
        createTargetSave: PropTypes.func.isRequired,
        all_target_save: PropTypes.array.isRequired
    }

    onChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
      });
      }
  
    onSubmit = (e) => {
        e.preventDefault();
        this.props.createTargetSave(this.state);
        this.setState({
            name: '',
            description: '',
            targeted_amount: '',
        })
        }

    componentDidMount(){
        this.props.getAllTargetSave()
    }

    render() {
        const active = { 'overview': false, 'savings': true, 'investments': false, 'payments': false, 'account': false, 'wallet': false }

        return (
            <div>
                <Sidebar active={active} />
                <div className="main-content pb-5">
                    <Header bigHeader="Target Save" />
                    <div className="row save-now">
                        <div className="col-6">
                            <div className="dashoboard-iew-123132 madetommy-regular-normal-mountain-meadow-18px border-class-1">
                                Dashoboard / Savings / TargetSave
                            </div>
                        </div>
                        <div className="col-6">
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createTargetSave">CREATE TARGET SAVE</button>
                        </div>
                    </div>
                    
                    {this.props.all_target_save.map(savings => (
                        <div className="row saving-balance mb-3" key={savings.id}>
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-lg-7 col-sm-12">
                                        <div className="targeted-saving-9628 border-class-1 madetommy-light-black-22px">Targeted Saving &nbsp;&nbsp;  <img className="arrow-chev-onbigright" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/arrow---chevron-big-right@2x.svg"/>
                                        &nbsp;&nbsp;Progress
                                        </div> 
                                        <div className="mt-3">
                                            <h1 class="x20000-9669 border-class-1 madetommy-medium-new-car-50px">#{savings.targeted_amount}&nbsp;
                                            <img className="arrow-chev-onbigright-big" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/arrow---chevron-big-right-1@2x.svg"/></h1>
                                            <span class="x4000-9683 border-class-1 madetommy-medium-mountain-meadow-26px">&nbsp;#{savings.progress}</span>
                                        </div>
                                    </div>
                                    <div className="col-lg-5 col-sm-12">
                                        <h2>{savings.name}</h2>
                                    </div>
                                </div>
                                <Link to={`/savings/targetsave/${savings.id}`} className="btn btn-primary view-full">View Full</Link>
                            </div>
                        </div>
                    ))}
                    
                    
                </div>


                <div className="modal fade" id="createTargetSave" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Create A New Target Save</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={this.onSubmit}>
                            <div className="mb-3">
                            <label for="name" className="col-form-label">Name</label>
                            <input type="text" name="name" required className="form-control" id="name" onChange={this.onChange} value={this.state.name} placeholder="Name Your Target Save"/>
                            <label for="description" className="col-form-label">Descriptiont</label>
                            <textarea name="description" class="form-control" id="description" onChange={this.onChange} value={this.state.description} placeholder="Describe Your Target Save (ooptional)"></textarea>
                            <label for="targeted_amount" className="col-form-label">Targeted Amount</label>
                            <input type="number" name="targeted_amount" required step=".01" class="form-control" id="targetedAmount" onChange={this.onChange} value={this.state.targeted_amount} placeholder="Set Your Target Amount"/>
                            </div>
                            <button type="submit" className="btn btn-primary">Create</button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                    </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    token: state.auth.token,
    all_target_save: state.savings.all_target_save
})

export default connect(mapStateToProps, { getAllTargetSave, createTargetSave })(TargetSave)
