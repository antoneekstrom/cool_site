import React from 'react';
import { Component } from 'react';

import { CodeBlock, Header, Page } from "../components/components";
import { Login, CreateAccount } from '../components/account';
import { NavigationBar, NavigationButton } from '../components/navigation';
import { getNavigator } from '../app';
import { isLoggedIn } from "../data/clientdata";

export class Welcome extends Component {

    constructor(props) {
        super(props);

        this.navigator = getNavigator();
    }

    FormComponent(props) {
        return isLoggedIn() ? <Login/> : <CreateAccount/>;
    }

    render() {
        return (
            <Page>
                <Header/>
                <main className="flex-center">
                    <h1>Welcome</h1>
                    <this.FormComponent/>
                </main>
            </Page>
        );
    }
}