import React from 'react';
import styles from './MainLayout.css';
import { Header } from '../../containers/index';

function MainLayout({ children, location, actions }) {
    return (
        <div className={styles.normal}>
            <Header />
            <div className={styles.content}>
                <div className={styles.main}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default MainLayout;

