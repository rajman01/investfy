import React, { Component } from 'react';

class ChangePassword extends Component {
    state = {
        current_password: '',
        new_password: ''
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.change(this.state);
        this.setState({
            current_password: '',
            new_password: ''
        })

    }

    onChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
      });
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
                            <label for="currentPassword" className="col-form-label">Current Password</label>
                            <input id="currentPassword" type="password" name="current_password" required class="form-control" onChange={this.onChange} value={this.state.current_password} placeholder="Your current Password"/>
                        </div>
                        <div className="mb-3">
                            <label for="newPassword" className="col-form-label">New Password</label>
                            <input id="newPassword" type="password" name="new_password" required class="form-control" onChange={this.onChange} value={this.state.new_password} placeholder="New Password"/>
                        </div>
                      <button type="submit" className="btn btn-primary">Change</button>
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

export default ChangePassword;
