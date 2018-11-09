import React from 'react';
import { Component } from 'react';

import { CodeBlock, Header, Page } from "../components/components";
import { Login, CreateAccount } from '../components/account';
import { NavigationLinks, NavigationButton } from '../components/navigation';
import { getNavigator } from '../app';

export class Welcome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            comp: this.create()
        };

        this.navigator = getNavigator();
    }

    create() {
        return (
            <div>
                <CreateAccount/>
                <button onClick={() => this.setState({comp: this.login()})}>Login to existing account</button>
            </div>
        );
    }

    login() {
        return (
            <div>
                <Login/>
                <button onClick={() => this.setState({comp: this.create()})}>Create new account</button>
            </div>
        );
    }

    render() {
        return (
            <Page>
                {this.state.comp}
            </Page>
        );
    }
}