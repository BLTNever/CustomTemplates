import 'babel-polyfill';
// React imports
import React from 'react';
import { render } from 'react-dom';
// import { HashRouter as Router, Route } from 'react-router-dom';
// import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
// app specific imports
import { Map, fromJS } from 'immutable';
import global from 'global';
import configureStore from './store/configureStore';
import rootSaga from './sagas';
import { Root } from './containers/index.js';
import './public.css';
// import { NODE_ENV } from './constants';

// import 'antd/dist/antd.css';

// const initialState = global.window.__INITIAL_STATE__ || {};
const initialState = Map();
// const initialState = fromJS(json);
const rootElement = global.document.getElementById('root');
const store = configureStore(initialState);
store.runSaga(rootSaga);

render(
    <AppContainer>
        <Root
            store={store}
        />
    </AppContainer>,
    rootElement,
);

if (module.hot) {
    module.hot.accept('./containers/Root/Root', () => {
        const RootContainer = require('./containers/Root/Root').default;
        render(
            <AppContainer>
                <RootContainer
                    store={store}
                />
            </AppContainer>,
            rootElement,
        );
    });
}

module.hot.accept();
