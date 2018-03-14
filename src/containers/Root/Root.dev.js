import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { RouterApp, DevTools } from '../index.js';

export default class Root extends Component {
    render() {
        const { store } = this.props;
        return (
            <Provider store={store}>
                <div>
                    <RouterApp />
                    <DevTools />
                </div>
            </Provider>
        );
    }
}
