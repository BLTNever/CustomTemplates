import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import {
    IndexPage,
    Design,
    NotFound,
    Flow,
} from '../index.js';

export default class RouterApp extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={IndexPage} />
                    <Route path="/flow" component={Flow} />
                    <Route path="/design" component={Design} />
                    <Route path="/notFound" component={NotFound} />
                </div>
            </Router>
        );
    }
}
