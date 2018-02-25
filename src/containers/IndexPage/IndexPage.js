import React from 'react';
import { connect } from 'react-redux';
import { MainLayout } from '../../components';

function IndexPage({ location }) {
    return (
        <MainLayout location={location}>

        </MainLayout>
    );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
