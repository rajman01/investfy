import React, { Component } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import Card from '../layouts/Card'

class Dashboard extends Component {
    render() {
        const active = { 'overview': true, 'savings': false, 'investments': false, 'payments': false, 'account': false }
        return (
            <div>
                <Sidebar active={active}/>
                <div class="main-content">
                    <Header bigHeader="Hi John," fullName="john Doe" email="johndoe@gmail.com" />
                </div>
            </div>
        )
    }
}

export default Dashboard;
