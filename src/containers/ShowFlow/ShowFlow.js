import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs } from 'antd';
import { fromJS, Map, List } from 'immutable';
import { updateInfo, updateTemplateData, updateActivePageDateObject } from '../../actions';

let net;
class ShowFlow extends Component {
    constructor(props) {
        super(props);
        this.createNet = this.createNet.bind(this);
        this.nodeClick = this.nodeClick.bind(this);
        this.test = this.test.bind(this);
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
        if (prevProps.templateData.get('saveDate') !== this.props.templateData.get('saveDate')) {
            net = this.createNet();
        }
    }

    test() {
        net = this.createNet();
    }
    // 节点点击事件
    nodeClick(ev) {
        if (ev.item) {
            const model = ev.item._attrs.model;
            console.log(model);
            if (model.type === 'page') {
                this.props.actions.updateInfo({ key: 'currentPage', value: model.key });
            }
        }
    }

    createNet(fitView) {
        net = new G6.Net({
            fitView,
            id: 'c2',      // 容器ID
            width: 500,    // 画布宽
            height: 667,    // 画布高
            rollback: true,        // 是否启用回滚机制
            grid: null,
            modes: {               // 模式集
                // 默认模式
                default: [
                    'clickBlankClearActive', 'clickActive', 'wheelZoom', 'dragBlank',
                ],
            },
            mode: 'default',       // 当前模式
        });
        const data = this.props.templateData.get('saveData');
        net.read(Map.isMap(data) ? data.toJS() : data);
        net.on('click', this.nodeClick);
        net.render();
        return net;
    }

    render() {
        return (
            <div>
                <button onClick={this.test}>测试</button>
                <div id="c2" />
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        info: state.get('info'),
        templateData: state.get('templateData'),
        activePageData: state.get('activePageData'),
        flow: state.get('flow'),
    };
};
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        updateInfo,
        updateTemplateData,
        updateActivePageDateObject,
    }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(ShowFlow);
