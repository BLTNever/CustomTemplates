import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs } from 'antd';
import { Toolkit, Configure } from '../../containers/index';
import { updateTemplateData } from '../../actions';
import styles from '../Settings/Settings.css';
import '../../public.css';

function Settings({ info }) {
    const TabPane = Tabs.TabPane;
    return (
        <Tabs type="card" className={styles.main}>
            <TabPane tab={info.get('activeId') !== -1 ? '样式编辑' : '页面编辑'} key="1">
                <Toolkit />
            </TabPane>
            {
                // info.get('activeId') === -1 ? 
                    <TabPane tab="页面配置" key="2">
                        <Configure />
                    </TabPane> 
                    // : null
            }
        </Tabs>
    );

}

export default Settings;

