import React, { Component } from 'react'
import axios from 'axios'

class Invite extends Component {
    state = {
        id: null,
        members: [],
        users: [ null ],
        search: ''
    }

    onChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
      });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const members = this.state.members.map(member => member.username);
        this.props.invite({id: this.state.id, members});
    }

    componentDidUpdate(prevProps){
        if(this.props !== prevProps){
          this.setState({
            id: this.props.id
          });
        }
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
        })
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
                                <button className="btn btn-info mt-2" onClick={this.clear}>Clear</button>
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
                                    <h4>Members</h4>
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
                                <button type="submit" className="btn btn-primary">Invite</button>
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

export default Invite
