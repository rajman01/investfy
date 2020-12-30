import React, { Component } from 'react';

class Header extends Component {
    render() {
        const { bigHeader, fullName, email } = this.props;
        return (
            <div className="row dashboard-topnav">
            <div className="col-6">
                <h1 className="hi-john-4901 madetommy-medium-new-car-35px border-class-1">{ bigHeader }</h1>
                <p className="good-after-ard-123131 madetommy-regular-normal-black-14px border-class-1">
                    Good afternoon, welcome to your dashboard
                </p>
            </div>
            <div className="col-6">
                <div className="dashboard-profile">
                    <div className="username-email">
                        <div className="john-doe-13448 madetommy-regular-normal-black-12px border-class-1">{ fullName }</div>
                        <div className="johndoegma-lcom-13449 madetommy-regular-normal-black-8px border-class-1">{ email }</div>
                    </div>
                    <img className="ellipse-9" src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/ellipse-9@2x.png" />
                </div>
            </div>
        </div>
        )
    }
}

export default Header;
