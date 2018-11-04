import React from 'react';
import { Component } from 'react';
import { getNavigator } from '../app';

const pages = {
    'Home': '/home',
    'Info': '/info',
    'Example': '/example',
}

export class NavigationButton extends Component {

    constructor(props) {
        super(props);
        this.navigator = getNavigator();
    }

    handleClick() {
        if (this.navigator != null) {
            this.navigator.navigate(this.props.route);
        }
        else {
            console.log(`Navigation button ${this} does not have a navigator.`);
        }
    }
    
    render() {
        return (
            <button onClick={() => this.handleClick()}>{this.props.children}</button>
        );
    }
}

/**
 * <nav> tag with links inside of it.
 */
export class NavigationBar extends Component {
    constructor(props) {
        super(props);
    }

    isExcluded(route) {
        const excluded = ['', '/'];
        return excluded.includes(route);
    }

    addLink(name, route, list) {
        list.push(<NavigationButton key={name} route={route}>{name}</NavigationButton>);
    }

    links() {
        var links = [];

        if (this.props.links != null && this.props.links.length > 0) {
            for (var name in this.props.links) {
                if (!this.isExcluded(name)) {
                    this.addLink(name, this.props.links[name], links);
                }
            }
        }
        else {
            for (var name in pages) {
                this.addLink(name, pages[name], links);
            }
        }

        return links;
    }
    
    render() {
        var links = this.links();
        return (
            <nav className="flex-row">{ links }</nav>
        );
    }
}