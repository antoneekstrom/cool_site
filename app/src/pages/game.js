import React from 'react';
import { Component } from 'react';

import { NavigationBar } from '../components/navigation';
import { Game as CoolGame } from '../game/game';

import $ from 'jquery';
import { Header, Page } from '../components/components';

export class Game extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.game = new CoolGame(512, 512);

        $("#game").append(this.game.getView());
    }
    render() {
        return (
            <Page>
                <Header/>
                <main>
                    <h2>Cool Game</h2>
                    <div id="game" className="flex-center"></div>
                </main>
            </Page>
        );
    }
} 