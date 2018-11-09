import React from 'react';
import { Component } from 'react';

import Prism from 'prismjs';
import { readResponseText, getLoggedInProfile } from '../data/clientdata';
import { NavigationLinks } from './navigation';
import { getNavigator } from '../app';
import { ProfileSummary } from './account';

export class Page extends Component {
    navigation() {
        return aside == null ? <NavigationLinks className="left-nav"/> : aside;
    }
    render() {
        let aside = this.props.aside;
        return (
            <div className="flex-center page">
                <Header/>
                <div className="main-container">
                    <aside className="flex-center">
                    </aside>
                    <main className="flex-center">
                        {this.props.children}
                    </main>
                </div>
            </div>
        );
    }
}

export class Header extends Component {

    constructor(props) {
        super(props);
        this.navigator = getNavigator();
        this.state = {hidden: false}
    }

    toggleButton() {
        return <button onClick={() => this.toggleVisibility()}>{this.state.hidden ? "Show" : "Hide"}</button>;
    }

    toggleVisibility() { this.setState({hidden: !this.state.hidden}); }

    hidden() {
        return <div className="hidden"> {this.toggleButton()} </div>;
    }

    visible() {
        return (
            <header>
                <div className="header-left flex-row">
                    {this.toggleButton()}
                </div>
                <NavigationLinks className="flex-row"/>
                <div className="header-right flex-row">
                    <ProfileSummary/>
                </div>
            </header>
        );
    }
    
    render() {        
        return this.state.hidden ? this.hidden() : this.visible();
    }
}

export class CodeBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {text: 'let code = EPIC;'};
        this.ref = React.createRef();
        this.useSource();
    }
    useSource() {
        if (this.props.src != null) {
            fetch(window.location.origin + this.props.src)
            .then((res) => {
                readResponseText(res, (text) => this.setState({text: text}));
            },
            (err) => console.log(err));
        }
        else if (this.state.text != this.props.children) {
            this.setState({text: this.props.children});
        }
    }
    componentDidUpdate() {
        this.highlight();
    }
    highlight() {
        if (this.ref != null && this.ref.current != null) {
            Prism.highlightElement(this.ref.current);
        }
    }
    render() {
        return (
            <pre className="code">
                <code ref={this.ref} className={`language-${this.props.lang}`}>{this.state.text}</code>
            </pre>
        );
    }
}

export class Sheet extends Component {
    constructor(props) {
        super(props);
        this.suffix = this.props.suffix == null ? ':' : this.props.suffix;
    }
    Row(props) {
        return (
            <li className="sheet-row">
                <h2 className="row-left">{props.left}</h2>
                <h2 className="row-right">{props.right}</h2>
            </li>
        );
    }
    getComponents() {
        let comps = [];
        let data = this.props.data;

        for (let key in data) {
            comps.push(
                <this.Row key={key} left={key + this.suffix} right={data[key]}/>
            );
        }

        return comps;
    }
    render() {
        return (
            <ul className="sheet">{this.getComponents()}</ul>
        );
    }
}

export class Loading extends Component {
    constructor(props) {
        super(props);

        /** Length of trail */
        this.minLength = this.props.minLength == null ? 0 : this.props.minLength;
        this.maxLength = this.props.maxLength == null ? 4 : this.props.maxLength;
        /** trail symbol */
        this.symbol = this.props.symbol == null ? '.' : this.props.symbol;
        /** interval */
        this.interval = this.props.interval == null ? 500 : this.props.interval;

        this.state = {
            length: this.minLength
        }
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.updateTrail();
        },
        this.interval);
    }
    
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    updateTrail() {
        let length = this.state.length + 1;

        if (length > this.maxLength) {length = this.minLength;}

        this.setState({
            length: length
        });
    }

    getTrail() {
        let trail = "";

        for (var i = 0; i < this.state.length; i++) {trail += this.symbol;}

        return (
            <span className="trail">{trail}</span>
        );
    }
    
    render() {
        return (
            <div className="loading-container flex-center">
                <h2>Loading{this.getTrail()}</h2>
            </div>
        );
    }
}