import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs } from 'antd';
import { updateInfo, updateTemplateData, updateActivePageDateObject } from '../../actions';
import { ShowFlow } from '../index';
import styles from '../FlowChart/FlowChart.css';
import pageData from '../../constants/initialState.json';

class FlowChart extends Component {
    constructor(props) {
        super(props);
        Object.assign(this, {
            //   state: {
            //     activePage: 'loading',
            //   },
            renderInsidePage: this.renderInsidePage.bind(this),
            renderSystemPage: this.renderSystemPage.bind(this),
            choosePage: this.choosePage.bind(this),
            handleDoubleClick: this.handleDoubleClick.bind(this)
        });
    }

    componentWillMount() {

    }

    componentDidMount() {

    }
    choosePage(e, name) {
        // const nowName = name;
        // this.setState({
        //   activePage: nowName,
        // });
        this.props.actions.updateInfo({ key: 'currentPage', value: name })
    }
    handleDoubleClick(e, name) {
        console.log(name)
    }
    renderInsidePage() {
        const insideData = pageData.insidePage;
        const renderInside = insideData.map((val, index) => {
            return (
                <li key={index} className={styles.chartBtn} 
                    onClick={() => { this.choosePage(this, val.router) }} 
                    onDoubleClick={() => { this.handleDoubleClick(this, val.name) }}
                >
                    {val.name}
                </li>
            );
        });
        return (
          <ul>
            {renderInside}
          </ul>
        );
    }

    renderSystemPage() {
        const systemData = pageData.systemPage;
        const renderSystem = systemData.map((val, index) => {
            return (
                <li key={index} className={styles.chartBtn} onClick={() => { this.choosePage(this, val.router) }}>
                    {val.name}
                </li>
            );
        });
        return (
            <ul>
                {renderSystem}
            </ul>
        );
    }

    render() {
        const TabPane = Tabs.TabPane;
        return (
            <Tabs defaultActiveKey="1" type="card">
                <TabPane tab="主流程页面" key="1"><ShowFlow /></TabPane>
                <TabPane tab="内部页面" key="2">{this.renderInsidePage()}</TabPane>
                <TabPane tab="系统页面" key="3">{this.renderSystemPage()}</TabPane>
            </Tabs>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        info: state.info,
        activePage: state.activePage,
    };
};
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        updateInfo,
        updateTemplateData,
        updateActivePageDateObject,
    }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(FlowChart);
