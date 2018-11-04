import React from 'react';
import ReactDOM from 'react-dom';

import Prism from 'prismjs';

import { App } from './app';

function getComponents() {
    return <App/>;
}

ReactDOM.render(getComponents(), document.getElementById('root'));

Prism.highlightAll();