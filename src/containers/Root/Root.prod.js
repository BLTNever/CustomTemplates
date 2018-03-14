import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { RouterApp } from '../index.js';

export default class Root extends Component {
    render() {
        const { store } = this.props;
        return (
            <Provider store={store}>
                <RouterApp />
            </Provider>
        );
    }
}
