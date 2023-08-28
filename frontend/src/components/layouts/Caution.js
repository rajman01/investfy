import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Caution extends Component {
    state ={
        hide: false
    }
    onClick = (e) => {
        this.setState({
            hide: !this.state.hide
        })
    }

    render() {
        return (
                <div className={!this.state.hide ? ('caution-card') : ('caution-card form-hide')}>
                    <div className="row">
                        <div className="col-1">
                            <img
                            class="attention--roroutline6"
                            src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/attention---error-outline@2x.svg"
                                 />
                        </div>
                        <div className="col-6">
                            <div>
                                Hi, {this.props.username} your registration is incomplete.
                            </div>
                        </div>
                        <div className="col-4">
                            <Link to="/account/#verification" className="btn btn-info">
                                Complete registration
                            </Link>
                        </div>
                        <div className="col-1">
                            <div onClick={this.onClick} className="cancel">
                                <img
                                    class="menu-closesmall"
                                    src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/menu---close-small@2x.svg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

export default Caution
