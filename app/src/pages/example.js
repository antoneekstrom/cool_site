import React from 'react';
import { Component } from 'react';
import { NavigationLinks } from '../components/navigation';
import { CodeBlock, Header, Page } from '../components/components';

export class Example extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Page>
                <main className="content">
                    <h1>Epic Example</h1>
                    <h2>Heck yeah</h2>
                    <CodeBlock src="/data/text/code-sample.js" lang="javascript"/>
                    <h2>How to declare a variable</h2>
                    <CodeBlock src="/data/text/variables1" lang="javascript"/>
                    <h2>How to assign a value to a variable</h2>
                    <CodeBlock src="/data/text/variables2" lang="javascript"></CodeBlock>
                    <h2>A function that promises nice things and then fullfills those promises.</h2>
                    <CodeBlock src="/data/text/promise.js" lang="javascript"/>
                </main>
            </Page>
        );
    }
}