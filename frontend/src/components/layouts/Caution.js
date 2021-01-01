import React, { Component } from 'react'

class Caution extends Component {

    onClick = (e) => {
        const parent = e.target.parentNode;
        parent.style.dispaly = 'none';
    }

    render() {
        return (
                <div class="caution-card">
                    <img
                        class="attention--roroutline6"
                        src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/attention---error-outline@2x.svg"
                    />
                    <div class="hi-john-yo-mplete-9216 border-class-1 madetommy-regular-normal-black-17964704513549805px6">
                        Hi, {this.props.username} your registration is incomplete.
                    </div>
                    <div class="frame-486" >
                        <div class="complete-r-ration-9236 border-class-2 madetommy-medium-white-11976469993591309px6">
                        Complete Registration
                        </div>
                    </div>
                    <div onClick={this.onClick}>
                    <img
                        class="menu-closesmall"
                        src="https://anima-uploads.s3.amazonaws.com/projects/5fe43cde9fab0bd12ef8da9a/releases/5fe96bbf9924fde667e42a12/img/menu---close-small@2x.svg"
                    />
                    </div>
                </div>
        )
    }
}

export default Caution
