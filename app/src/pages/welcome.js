import React from 'react';
import { Component } from 'react';

import { CodeBlock, Header, Page } from "../components/components";
import { Login } from '../components/account';
import { NavigationBar, NavigationButton } from '../components/navigation';
import { getNavigator } from '../app';

export class Welcome extends Component {

    constructor(props) {
        super(props);

        this.navigator = getNavigator();
    }

    render() {
        return (
            <Page>
                <Header/>
                <main className="flex-center">
                    <h1>Welcome</h1>
                    <Login/>
                    <NavigationButton>Start</NavigationButton>
                </main>
            </Page>
        );
    }
}