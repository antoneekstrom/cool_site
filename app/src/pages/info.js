import React from 'react';
import { Component } from 'react';

import { NavigationLinks, NavigationButton } from '../components/navigation';
import { Header, Page, Loading } from '../components/components';

export class Info extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Page>
                <main className="flex-center">
                    <h1>Info</h1>
                    <p>Woah haha, look at all this epic information. Heck yeah.</p>
                    <Loading/>
                </main>
            </Page>
        );
    }
}