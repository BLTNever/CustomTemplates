import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router } from '../index.js';

export default class Root extends Component {
    render() {
        const { store } = this.props;
        return (
            <Provider store={store}>
                <Router />
            </Provider>
        );
    }
}
