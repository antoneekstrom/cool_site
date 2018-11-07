import React from 'react';
import { Component } from 'react';
import { Page } from '../components/components';
import { Login } from '../components/account';

export class LoginPage extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <Page>
                <Login/>
            </Page>
        );
    }
}