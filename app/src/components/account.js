import React from 'react';
import { Component } from 'react';
import { getProfile, Profile, parseCompleteURL, createUser } from '../data/clientdata';

import { Loading } from "../components/components";
import { getNavigator } from '../app';

export class ProfileImage extends Component {
    constructor(props) {
        super(props);

        this.src = parseCompleteURL(this.props.profile.imagePath);
    }

    handleClick() {
        getNavigator().navigateToProfilePage(this.props.profile.username);
    }
    
    render() {
        return <img onClick={() => this.handleClick()} className="profile-image" src={this.src}></img>;
    }
}

export class ProfileName extends Component {
    handleClick() {
        getNavigator().navigateToProfilePage(this.props.profile.username);
    }
    render() {
        return (
            <h3 className="profile-name" onClick={() => this.handleClick()}>{this.props.profile.username}</h3>
        );
    }
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

export class TextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {input: ''}
    }
    handleChange(event) {
        this.setState({input: event.target.value});
        this.props.onChange(event);
    }
    render() {
        return (
            <label>
                {this.props.label}
                <input
                type={this.props.type == null ? "text" : this.props.type}
                value={this.state.input}
                onChange={(e) => this.handleChange(e)}
                placeholder={this.props.children}
                />
            </label>
        );
    }
}

export class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            username: '',
            birthdate: '',
            password: '',

            content: this.createAccount()
        }
    }

    /**
     * @param {React.FormEvent} e event
     */
    handleSubmit(e) {
        e.preventDefault();
        createUser(
            this.state.firstname,
            this.state.lastname,
            this.state.birthdate,
            this.state.username,
            this.state.password
        )
        .then((val) => {
            console.log('create response: ' + val);
            if (val == 'nice') {
                this.setState({
                    content: this.accountCreated()
                });
            }
        });
    }

    createAccount() {
        return (
            <form onSubmit={(e) => this.handleSubmit(e)} className="flex-center">
                <h2>Create Account</h2>
                <TextInput onChange={(e) => this.state.username = e.target.value} label="Username:" name="username">Username</TextInput>
                <TextInput type="password" onChange={(e) => this.state.password = e.target.value} label="Password:" name="password">Password</TextInput>
                <TextInput onChange={(e) => this.state.firstname = e.target.value} label="FirstName:" name="firstname">Firstname</TextInput>
                <TextInput onChange={(e) => this.state.lastname = e.target.value} label="LastName:" name="lastname">Lastname</TextInput>
                <input type="submit" value="submit"></input>
            </form>
        );
    }

    accountCreated() {
        return (
            <div>
                <h1>Epic</h1>
                <h2>Your account has been created.</h2>
            </div>
        );
    }

    render() {
        return this.state.content;
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