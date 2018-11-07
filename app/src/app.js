import React from 'react';
import { Component } from 'react';

import { Navigator } from './navigator';

import { newGame } from './game/game';
import { Welcome } from "./pages/welcome";
import { Info } from './pages/info';
import { Example } from './pages/example';
import { Game } from './pages/game';
import { ProfilePage } from './pages/profile';
import { LoginPage } from './pages/login';

let navigator = new Navigator();

export function getNavigator() {
    return navigator;
}

export class App extends Component {

    constructor(props) {
        super(props);

        this.navigator = getNavigator();

        this.pages = {
            '': <Welcome/>,
            'home': <Welcome/>,
            'info': <Info/>,
            'example': <Example/>,
            'profile': <ProfilePage/>,
            'login': <LoginPage/>
        };

        this.state = {
            content: this.getContent()
        };
    }

    /**
     * Retrieve content to be rendered into page.
     */
    getContent() {
        var page = <h1>page</h1>;

        for (var key in this.pages) {
            if (this.navigator.getRouteName() == key) {
                console.log('page: ' + key);
                page = this.pages[key];
            }
        }

        return page;
    }

    /**
     * Called when URL changes. This method updates content rendered on page.
     */
    updatePage(newpath) {
        this.setState({
            content: this.getContent()
        });
    }

    /**
     * The page where dynamic content will be rendered.
     */
    page(props) {
        return this.state.content;
    }

    componentDidMount() {
        this.navigator.observe((path) => {
            this.updatePage(path);
        });
    }

    render() {
        return (
            this.page()
        );
    }
}