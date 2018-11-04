import React from 'react';
import { Component } from 'react';
import { getProfile } from '../data/data';
import { ContentLoader, Loading, Page, Header } from '../components/components';

export class ProfilePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: undefined
        }
        this.loadProfile();
    }

    loadProfile() {
        getProfile('Anton', (profile) => this.setState({profile: profile}));
    }

    getContent() {
        return (
            <Page>
                <Header/>
                <main className="flex-center">
                    <h1>{this.state.profile.username}</h1>
                    <div className="flex-left">
                        <h2>First name: {this.state.profile.firstName}</h2>
                        <h2>Last name: {this.state.profile.lastName}</h2>
                        <h2>Birthday: {this.state.profile.birthday}</h2>
                        <h2>Gender: {this.state.profile.gender}</h2>
                    </div>
                </main>
            </Page>
        );
    }
    
    render() {
        return (
            this.state.profile != null ? this.getContent() : <Loading/>
        );
    }
}