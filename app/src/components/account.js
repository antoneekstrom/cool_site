import React from 'react';
import { Component } from 'react';
import { getProfile, Profile, parseCompleteURL, createUser, constructFetch, parseJSONFromResponse, login, getLoggedInProfile } from '../data/clientdata';

import { Loading } from "../components/components";
import { getNavigator, getProfileUpdator } from '../app';
import { NavigationButton } from './navigation';

export class ProfileImage extends Component {
    constructor(props) {
        super(props);

        console.log(this.props.profile);
        if (this.props.profile != null && this.props.profile.imagePath != null) {
            this.src = parseCompleteURL(this.props.profile.imagePath);
        }
    }

    handleClick() {

        if (this.props.profile != null) {
            getNavigator().navigateToProfilePage(this.props.profile.username);
        }
    }
    
    render() {
        if (this.src != null) {
            return <img onClick={() => this.handleClick()} className="profile-image" src={this.src}></img>;
        }
        else {
            return <div></div>;
        }
    }
}

export class ProfileName extends Component {
    handleClick() {

        if (this.props.profile != null) {
            getNavigator().navigateToProfilePage(this.props.profile.username);
        }
    }
    getProfileName() {
        if (this.props.profile != null) {
            return this.props.profile.username;
        }
        else {
            return 'user not found';
        }
    }
    render() {
        return (
            <h3 className="profile-name" onClick={() => this.handleClick()}>{this.getProfileName()}</h3>
        );
    }
}

export class ProfileSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: undefined,
            content: <Loading/>
        };
        getProfileUpdator().observe(() => this.refreshProfile());
    }

    componentDidMount() {
        this.refreshProfile();
    }

    refreshProfile() {
        this.setState({content: <Loading/>});

        let profileName = this.props.profileName;

        if (profileName == null) {

            getLoggedInProfile()
            .then((profile) => {
                this.setProfile(profile);
            });
        }
        else {
            getProfile(profileName, (profile) => {
                this.setProfile(profile);
            });
        }
    }

    notLoggedIn() {
        return (
            <div className="flex-center">
                <h2>Not logged in</h2>
            </div>
        );
    }

    loggedIn() {
        return (
            <div className="profile-summary">
                <ProfileName profile={this.state.profile}/>
                <ProfileImage profile={this.state.profile}/>
            </div>
        );
    }

    checkProfile() {
        return this.state.profile != null && this.state.profile != {};
    }

    setProfile(profile) {
        this.setState({
            profile: profile,
        });
        this.setState({
            content: this.getComponents()
        });
    }

    getComponents() {
        return this.checkProfile() ? this.loggedIn() : this.notLoggedIn();
    }

    render() {
        return this.state.content;
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
                <h1>Create Account</h1>
                <TextInput onChange={(e) => this.state.username = e.target.value} label="Username:" name="username">Username</TextInput>
                <TextInput type="password" onChange={(e) => this.state.password = e.target.value} label="Password:" name="password">Password</TextInput>
                <TextInput onChange={(e) => this.state.firstname = e.target.value} label="FirstName:" name="firstname">Firstname</TextInput>
                <TextInput onChange={(e) => this.state.lastname = e.target.value} label="LastName:" name="lastname">Lastname</TextInput>
                <input type="submit" value="Create"></input>
            </form>
        );
    }

    accountCreated() {
        return (
            <div>
                <h1>Epic</h1>
                <h2>Your account has been created.</h2>
                <NavigationButton route="/login">Login</NavigationButton>
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

        this.state = {
            username: '',
            password: '',
            inputText: 'Login'
        }
    }

    /**
     * @param {React.FormEvent} e 
     */
    handleSubmit(e) {
        e.preventDefault();

        login(this.state.username, this.state.password)
        .then((json) => {
            this.setState({inputText: json.valid ? 'Successful' : 'Incorrect'});
        });
    }
    
    render() {
        return (
            <form onSubmit={(e) => this.handleSubmit(e)} className="flex-center">
                <h1>Login</h1>
                <TextInput label="Username:" name="username" onChange={(e) => this.state.username = e.target.value}>Username</TextInput>
                <TextInput label="Password:" name="password" onChange={(e) => this.state.password = e.target.value}>Password</TextInput>
                <input type="submit" value={this.state.inputText}></input>
            </form>
        );
    }
}