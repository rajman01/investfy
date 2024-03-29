import React, { Component } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllJointSave, createJointSave } from "../../actions/savings";
import { Link } from 'react-router-dom'

class JointSave extends Component {
    state = {
        name: '',
        amount: '',
        members: [],
        users: [ null ],
        search: ''
    }

    static propTypes = {
        token: PropTypes.string.isRequired,
        getAllJointSave: PropTypes.func.isRequired,
        createJointSave: PropTypes.func.isRequired,
        username: PropTypes.string.isRequired,
        all_joint_save: PropTypes.array.isRequired
    }

    onChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
      });
      }
  
    onSubmit = (e) => {
        e.preventDefault();
        const { name, amount } = this.state;
        const members = this.state.members.map(member => member.username);
        this.props.createJointSave({name, amount, members});
        this.setState({
            name: '',
            amount: '',
            members: [],
            users: [ null ],
            search: ''
        })
     }

    search = (e) => {
        e.preventDefault();
        axios.get(`/auth/users?search=${this.state.search}`)
        .then(res => {
            this.setState({
                users: res.data
            });
        })
        .catch(err => this.props.returnErrors(err.response.data, err.response.status))
    }

    addUser = (id) => {
        const user = this.state.users.find(user => user.id === id);
        if(!this.state.members.some(member => member.id === id)){
            this.setState({
                members: [user, ...this.state.members]
            });
        }
    }

    removeUser = (id) => {
        let members = this.state.members.filter(member => member.id !== id);
        this.setState({
            members
        })
    }

    clear = () => {
        this.setState({
            users: [ null ]
        });
    }

    componentDidMount(){
        this.props.getAllJointSave()
    }

    render() {
        const active = { 'overview': false, 'savings': true, 'investments': false, 'payments': false, 'account': false, 'wallet': false }

        return (
            <div>
                <Sidebar active={active} />
                <div className="main-content pb-5">
                    <Header bigHeader="Joint Save" />
                    <div className="row save-now">
                        <div className="col-6">
                            <div className="dashoboard-iew-123132 madetommy-regular-normal-mountain-meadow-18px border-class-1">
                                Dashoboard / Savings / Joint Save
                            </div>
                        </div>
                        <div className="col-6">
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createJointSave">CREATE JOINT SAVE</button>
                        </div>
                    </div>
                    
                    {this.props.all_joint_save.map(savings => (
                        <div className="row saving-balance mb-3" key={savings.id}>
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-lg-7 col-sm-12">
                                        <div className="targeted-saving-9628 border-class-1 madetommy-light-black-22px">
                                            <h3>Total Savings</h3>
                                        </div> 
                                        <div className="mt-3">
                                            <h1 class="x650000-78181 madetommy-medium-black-34px border-class-1">#{savings.total}
                                            </h1><br/>
                                            <h4>{`${savings.amount} Naira to be saved every week`}</h4>
                                        </div>
                                    </div>
                                    <div className="col-lg-5 col-sm-12">
                                        <h1>{savings.name}</h1>
                                    </div>
                                </div>
                                <Link to={`/savings/jointsave/${savings.id}`} className="btn btn-primary view-full">View Full</Link>
                            </div>
                        </div>
                    ))}
                </div>


                <div className="modal fade" id="createJointSave" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Create A New Joint Save</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={this.search}>
                                <div class="input-group md-form form-sm form-2 pl-0">
                                    <input class="form-control my-0 py-1 red-border" name="search" type="text" placeholder="Search for users" aria-label="Search" onChange={this.onChange} value={this.state.search} required/>
                                    <div class="input-group-append">
                                        <button type="submit" class="input-group-text red lighten-3" id="basic-text1"><i class="fas fa-search text-grey"
                                            aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </form>
                            <div>
                                <button className="btn btn-primary mt-2" onClick={this.clear}>Clear</button>
                                { this.state.users.length > 0 ? (
                                    this.state.users.map(user => {
                                        if (user !== null){
                                            if(user.username !== this.props.username){
                                                return (<div className="user-card row" key={user.id}>
                                                <div className="col-2">
                                                    <img className="ellipse-9" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/ellipse-9@2x.png" />
                                                </div>
                                                <div className="col-10">
                                                    <h6>{user.full_name}</h6> <br/>
                                                    <p>Username: {user.username}</p> <br/>
                                                    <p className="text-muted">Wallet id: {user.wallet_id}</p>
                                                    {this.state.members.some(member => member.username === user.username) ? (<div className="remove" onClick={() => {this.removeUser(user.id)}}>Remove</div>) : (<div className="add" onClick={() => {this.addUser(user.id)}}>Add</div>)}
                                                </div>
                                            </div>)
                                            }
                                        }
                                    })
                                ) : (
                                    <div className="row no-result">
                                        <div className="col-12">
                                            <h4 className="no-result-text">No Result Found</h4>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <form onSubmit={this.onSubmit}>
                            <div className="mb-3">
                                <label for="name" className="col-form-label">Name</label>
                                <input type="text" name="name" required className="form-control" id="name" onChange={this.onChange} value={this.state.name} placeholder="Name Your Target Save"/>
                                <label for="amount" className="col-form-label">Amount</label>
                                <input type="number" name="amount" required step=".01" class="form-control" id="targetedAmount" onChange={this.onChange} value={this.state.amount} placeholder="Amount To Be Saved Weekly"/>
                                <label for="members" className="col-form-label">Members</label>
                                <div className="members" id="members">
                               { this.state.members.map(user => {
                                    return (<div className="user-card row" key={user.id}>
                                        <div className="col-2">
                                            <img className="ellipse-9" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/ellipse-9@2x.png" />
                                        </div>
                                        <div className="col-10">
                                            <h6>{user.full_name}</h6> <br/>
                                            <p>Username: {user.username}</p> <br/>
                                            <p className="text-muted">Wallet id: {user.wallet_id}</p>
                                            <div className="remove" onClick={() => {this.removeUser(user.id)}}>Remove</div>
                                        </div>
                                    </div>)
                                    })}
                                </div>
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
    username: state.auth.user.username,
    all_joint_save: state.savings.all_joint_save
})

export default connect(mapStateToProps, { getAllJointSave, createJointSave })(JointSave)
