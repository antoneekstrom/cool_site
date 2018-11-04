import React from 'react';
import { Component } from 'react';
import { getProfile, Profile, parseCompleteURL } from '../data/data';

import { Loading } from "../components/components";

export class ProfileImage extends Component {
    constructor(props) {
        super(props);

        this.src = parseCompleteURL(this.props.profile.imagePath);
    }
    
    render() {
        return (
            <div>
                <img className="profile-image" src={this.src}></img>
            </div>
        );
    }
}

export function ProfileName(props) {
    return (
        <h3>{props.profile.username}</h3>
    );
}

export class ProfileSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {profile: undefined};
        this.refreshProfile();
    }

    refreshProfile() {
        getProfile(this.props.profileName, (profile) => {

            this.setState({profile: profile});
        });
    }

    getComponents() {
        return (
            <div className="profile-summary">
                <ProfileName profile={this.state.profile}/>
                <ProfileImage profile={this.state.profile}/>
            </div>
        );
    }

    render() {
        return this.state.profile == undefined ? <Loading/> : this.getComponents();
    }
}

export class Login extends Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <form action={undefined} className="flex-center">
                <h2>Login</h2>
                <input type='text' placeholder='Username'></input>
                <input type='text' placeholder='Password'></input>
            </form>
        );
    }
}