import React from 'react';
import { Component } from 'react';
import { getProfile, getUsernameFromURL } from '../data/clientdata';
import { ContentLoader, Loading, Page, Header, Sheet } from '../components/components';

export class ProfilePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: undefined
        }
        this.loadProfile();
    }

    loadProfile() {
        let username = getUsernameFromURL();
        console.log('profilePage - usernameFromURL: ' + username);
        getProfile(username, (profile) => this.setState({profile: profile}));
    }

    getDisplayData() {
        const exclude = [
            'imagePath',
            'username',
            'birthYear',
            'birthMonth',
            'birthDay',
        ];
        let obj = this.state.profile.getProfileAsObject();
        for (let key in obj) {
            if (exclude.includes(key)) {
                delete obj.key;
            }
            if (key == 'birthDate') {key = 'birthday';}
        }
        return obj;
    }

    getContent() {
        const data = this.getDisplayData();
        return (
            <Page>
                <main className="flex-center">
                    <h1>{this.state.profile.username}</h1>
                    <Sheet data={data}/>
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