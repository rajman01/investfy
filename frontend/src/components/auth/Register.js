import React, {Component} from 'react'
import { Link, Redirect } from 'react-router-dom'
import { register } from '../../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

class Register extends Component{
    state = {
        email: '',
        full_name: '',
        phone_number: '',
        password: '',
    }

    static propTypes = {
        register: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.register(this.state)
    }

    render(){
        if(this.props.isAuthenticated) {
            return <Redirect to="/" />
        }
        const { email, password, full_name, phone_number } = this.state;
        return(
            <div className="row">
                <div className="col-lg-6 col-sm-12">
                    <div className="login-words">
                        <h1 className="log-in-to--count-6043 madetommy-medium-white-50px border-class-1">
                            <span className="span1-wwzu74">Create </span><span className="span5-wwzu74">Account</span>
                        </h1>
                        <div className="tech-is-ch-esses-6045 madetommy-regular-normal-black-20px border-class-1">
                            Tech is changing the way the world works, including the financial world. In recent years, how people and businesses.
                        </div>
                        <h1 className="no-account-6044 madetommy-medium-mountain-meadow-30px border-class-1">Have An Account?</h1>
                        <Link to="/login">
                            <div className="button2">
                                <div className="log-in-5828 madetommy-bold-white-20px border-class-1">Log in</div>
                            </div>
                        </Link>
                    </div>
                    <h1 className="investfy-502338 madetommy-medium-white-275625px border-class-1">
                        <span className="span1-j47KxE">i</span><span className="span2-j47KxE">nvestfy</span>
                    </h1>
                </div>
                <div className="col-lg-6 col-sm-12 log-in">
                    <form onSubmit={this.onSubmit}>
                        <div className="frame-30">
                            <h1 className="create-account-580 madetommy-medium-black-25px border-class-1">Create Account</h1>
                            <input className="frame-3 border-class-2" type="text" placeholder="Enter Fullname" onChange={this.onChange} required name="full_name" value={full_name} />
                            <input className="frame-3 border-class-2" type="email" placeholder="Enter Email Address" onChange={this.onChange} required name="email" value={email} />
                            <input className="frame-3 border-class-2" type="number" placeholder="Enter Phone Number" onChange={this.onChange} required name="phone_number" value={phone_number} />
                            <input className="frame-34 border-class-2" type="password" placeholder="Enter Password" onChange={this.onChange} required name="password" value={password} />
                            <button className="button" >
                                <div className="create-account-5769 madetommy-bold-white-18px border-class-1">Create Account</div>
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
})


export default connect(mapStateToProps, {register})(Register);