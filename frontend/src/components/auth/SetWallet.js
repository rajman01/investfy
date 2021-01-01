import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { setWallet } from '../../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

class SetWallet extends Component {
    state = {
        wallet_id: '',
        password: '',
    }

    componentDidMount(){
        this.setState({
            wallet_id: this.props.user.wallet.wallet_id
        })
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object.isRequired,
        setWallet: PropTypes.func.isRequired,
        has_set_wallet: PropTypes.bool
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.setWallet(this.state);
    }
    render() {
        if(this.props.has_set_wallet) {
            return <Redirect to="/" />
        }
        const { wallet_id, password } = this.state;
        return (
            <div className="row">
            <div className="col-lg-6 col-sm-12">
                <div className="login-words">
                    <h1 className="log-in-to--count-6043 madetommy-medium-white-50px border-class-1">
                        <span className="span1-wwzu74">Set</span><span className="span2-wwzu74">&nbsp;</span><span className="span3-wwzu74">your</span><span className="span4-wwzu74">&nbsp;</span><span className="span5-wwzu74">E-Wallet</span>
                    </h1>
                    <div className="tech-is-ch-esses-6045 madetommy-regular-normal-black-20px border-class-1">
                        Tech is changing the way the world works, including the financial world. In recent years, how people and businesses.
                    </div>
                   
                </div>
                <h1 className="investfy-502338 madetommy-medium-white-275625px border-class-1">
                    <span className="span1-j47KxE">i</span><span className="span2-j47KxE">nvestfy</span>
                </h1>
            </div>
            <div className="col-lg-6 col-sm-12 log-in">
                <form onSubmit={this.onSubmit}>
                <div className="frame-30">
                    <h1 className="create-account-580 madetommy-medium-black-25px border-class-1">Set Wallet</h1>
                    
                        <input className="frame-3 border-class-2" type="text" placeholder="Enter Wallet-ID" name="wallet_id" onChange={this.onChange} value={wallet_id} required />
                        <input className="frame-34 border-class-2" type="password" placeholder="Enter Password (4 Digits)" name="password" onChange={this.onChange} value={password} required />
                        <button className="button">
                            <div className="create-account-5769 madetommy-bold-white-18px border-class-1">Set</div>
                        </button>
                </div>
                </form>
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    has_set_wallet: state.auth.has_set_wallet
})

export default connect(mapStateToProps, { setWallet })(SetWallet);
