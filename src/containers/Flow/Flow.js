import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';

import styles from './Flow.css';
import { fromJS, Map } from 'immutable';
import { flowUpdate, flowAdd, flowDel, updateTemplateData } from '../../actions';

let net;
class Flow extends Component {
    constructor(props) {
        super(props);
        this.nodeClick = this.nodeClick.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        net = this.createNet();
    }

    createNet(fitView) {
        net = new G6.Net({
            fitView,
            id: 'c1',      // 容器ID
            // width: 500,    // 画布宽
            height: 800,    // 画布高
            rollback: true,        // 是否启用回滚机制
            modes: {               // 模式集
                // 默认模式
                default: [
                    'dragNode', 'clickBlankClearActive', 'resizeEdge', 'clickActive',
                    'resizeNode', 'wheelZoom', 'dragBlank',
                ],
                // 编辑模式
                edit: [
                    'dragNode', 'clickBlankClearActive', 'resizeEdge', 'clickActive',
                    'multiSelect', 'resizeNode', 'wheelZoom',
                    // , 'shortcut', 'dragEdge'
                ],
            },
            mode: 'default',       // 当前模式
        });
        const { flow } = this.props;
        // const history = flow.get('history');
        const historyId = flow.get('historyId');
        const source = flow.getIn(['history', historyId, 'source']);
        // data = {
        //   nodes: [{
        //     x: 240,
        //     y: 80,
        //     id: 'node_0',
        //     shape: 'rect',
        //   }],
        //   edges: [],
        // };
        // net.source(saveData.nodes, saveData.edges);
        net.source(source.get('nodes').toJS(), source.get('edges').toJS());
        net.on('click', this.nodeClick);
        net.render();
        return net;
    }

    componentDidUpdate(prevProps) {
        const { flow } = this.props;
        // if (flow !== prevProps.flow) {
        //   net.changeData(flow.get('nodes').toJS(), flow.get('edges').toJS());
        // net.removeBehaviour(['dragNode']);
        // net.autoZoom();
        // }
        if (flow.get('historyId') !== prevProps.flow.get('historyId')) {
            this.read();
        }
    }

    // 节点点击事件
    nodeClick(ev) {
        console.log(ev);
        const item = ev.item;
        if (net.isNode(item)) {
            this.props.actions.flowUpdate({ key: ['activeNodeId'], value: item.get('model').id });
        }
    }

    // 按钮点击事件
    handleClick(id, name, event) {
        console.log(id);
        console.log(name);
        console.log(event);
        const { flow } = this.props;
        const activeNodeId = flow.get('activeNodeId');
        const activeNode = net.find(activeNodeId).get('model');
        if (!activeNode.label) {
            const activeNodeIndex = Number(activeNodeId.split('_')[1]);
            const activeNodeLabel = activeNode.label;
            const activeNodePosition = activeNode.position;
            const fatherId = activeNode.fatherId;
            const activeNodeX = activeNode.x;

            // 创建新节点和新连线
            const nodesSize = net.get('items').filter(x => x.get('type') === 'node').length;
            console.log(net);
            console.log(net.get('nodes'));
            console.log(nodesSize);

            let history = flow.get('history');
            const historyId = flow.get('historyId');
            // const source = flow.getIn(['history', historyId, 'source']);
            let buttons = flow.getIn(['history', historyId, 'buttons']);
            const button = buttons.get(id);
            const max = button.get('max');
            const count = button.get('count') || 0;
            const nextList = button.get('next') || [];
            const group = button.get('group');
            const excludeList = button.get('exclude');
            const childLabel = button.get('childLabel');

            if (historyId < history.size - 1) {
                console.log('historyId: ' + historyId + 1);
                history = history.slice(0, historyId + 1);
                console.log(history.toJS());
                this.props.actions.flowUpdate({ key: ['history'], value: history })
            }

            let shape;
            let childCount;
            switch (group) {
                case 'option':
                    shape = 'circle';
                    childCount = button.get('childCount');
                    break;
                case 'flag':
                    shape = 'rhombus';
                    childCount = 2;
                    break;
                default:
                    shape = 'rect';
                    childCount = 1;
                    break;
            }
            // 如果父节点是菱形或圆形，要增加对应的偏移量
            let offsetX = 0;
            if (fatherId) {
                const fatherNode = net.find(fatherId).get('model');
                const fatherShape = fatherNode.shape;
                if (shape !== 'rect' && (fatherShape === 'rhombus' || fatherShape === 'circle')) {
                    if (activeNodePosition === 0) {
                        offsetX = -100;
                    } else {
                        offsetX = 100;
                    }
                }
            }
            // 更新activeNode
            net.update(activeNodeId, {
                key: id, label: name, shape, x: (activeNodeX + offsetX), type: button.get('type')
            });
            if (shape === 'circle') {
                const edgeId = `edge_${activeNodeIndex}`;
                net.update(edgeId, {
                    targetAnchor: 0.5,
                });
            }
            console.log(activeNodeLabel);
            // 循环画下一个空白字节点和对应的连线
            const activeX = activeNode.x;
            const activeY = activeNode.y;
            if (id !== 'end') {
                for (let i = 0; i < childCount; i += 1) {
                    let x = activeX;
                    let y = activeY;

                    let sourceAnchor;
                    const targetAnchor = 0;
                    let edgeLabel;
                    let nodeLabel;
                    let position;
                    if (shape === 'rect') {
                        // x += offsetX;
                        y = activeY + 80;
                    }
                    if (shape === 'rhombus') {
                        y = activeY + 120;
                        if (i === 0) {
                            x = activeX - 60;
                            sourceAnchor = 3;
                            edgeLabel = 'yes';
                        }
                        if (i === 1) {
                            x = activeX + 60;
                            sourceAnchor = 1;
                            edgeLabel = 'no';
                        }
                        position = i;
                    }
                    if (shape === 'circle') {
                        y = activeY + 100;
                        x = activeX + 60;
                        edgeLabel = childLabel.get(i);
                        position = i;
                    }
                    console.log(nodesSize);
                    const newBlankNode = { x, y, id: `node_${nodesSize + i}`, shape: 'rect', label: nodeLabel, fatherId: activeNodeId, position };
                    const newBlankEdge = { shape: 'smoothArrow', source: `node_${activeNodeIndex}`, target: `node_${nodesSize + i}`, id: `edge_${nodesSize + i}`, sourceAnchor, targetAnchor, label: edgeLabel, fatherId: activeNodeId };
                    net.add('node', newBlankNode);
                    net.add('edge', newBlankEdge);
                    net.refresh();
                }
            }


            // 判断该按钮显示次数
            let visible;
            if (max === 1) {
                visible = false;
            } else if ((max > count + 1) || (max === -1)) {
                visible = true;
            } else {
                visible = false;
            }
            // 判断按钮互斥 + 次数
            if (excludeList) {
                if (visible === false) {
                    excludeList.map((exclude) => {
                        // return this.props.actions.flowUpdate({ key: ['buttons', exclude, 'visible'], value: false });
                        buttons = buttons.updateIn([exclude, 'visible'], (value) => {
                            return value = false;
                        })
                    });
                }
            }
            console.log(buttons.toJS());


            buttons = buttons.update(id, (value) => {
                return value.merge(fromJS({ count: count + 1, visible }));
            })
            // this.props.actions.flowUpdate({ key: ['buttons', id], value: { count: count + 1, visible } });
            // 点亮下一组按钮
            console.log(buttons.toJS());

            nextList.map((next) => {
                // return this.props.actions.flowUpdate({ key: ['buttons', next], value: { visible: true } });
                buttons = buttons.updateIn([next, 'visible'], (value) => {
                    return value = true;
                })
            });

            console.log(buttons.toJS());
            // const test = net.save();
            // console.error(test);
            const source = fromJS(net.save()).get('source');
            const data = new Map({ buttons, source });
            this.props.actions.flowAdd({ key: ['history'], value: data });
            this.props.actions.flowUpdate({ key: ['historyId'], value: historyId + 1 });
        }
    }

    changeModes(mode) {
        net.changeMode(mode);
    }

    save() {
        let routers = new Map();
        const history = this.props.flow.get('history');
        const historyId = this.props.flow.get('historyId');
        const nodes = history.getIn([historyId, 'source', 'nodes']);
        for (let i = nodes.size - 1; i >= 0; i--) {
            const fatherId = nodes.getIn([i, 'fatherId']);
            const key = nodes.getIn([i, 'key']);
            const position = nodes.getIn([i, 'position']);
            if (fatherId && key && key) {  // 是否有父级
                // 插入当前轮询到的node父级 next 为当前轮询到的node
                let fatherNode;
                nodes.map((v) => {
                    if (v.get('id') === fatherId) {
                        fatherNode = v;
                    }
                });
                const fatherKey = fatherNode.get('key');
                const fatherType = fatherNode.get('type');
                const fatherLabel = fatherNode.get('label');
                const router = fromJS(
                    {
                        name: fatherLabel,
                        type: fatherType,
                        next: position !== undefined ? new Map().set(position, key) : key,
                    },
                );
                routers = routers.update(fatherKey, value => value ? value.mergeDeep(router) : router);
            }
        }

        this.props.actions.updateTemplateData({ key: ['saveData'], value: net.save() });
        console.log('routers');
        const aaa = routers.toJS();
        console.log(JSON.stringify(aaa));
        console.log('routers');

        console.log('saveData');
        console.log(JSON.stringify(net.save()));
        console.log('saveData');
    }

    read() {
        net.destroy();
        net = this.createNet();
    }

    // 重置节点
    reset() {
        // const { flow } = this.props;
        // const activeNodeId = flow.get('activeNodeId');
        // net.update(activeNodeId, {
        //   shape: 'react',
        //   label: '',
        // });
        // // const nodesSize = net.get('items').filter(x => x.get('type') === 'node').length;
        // let arr = [];
        // arr = this.findChildren(activeNodeId, arr);
        // console.log(arr);
        // for (let i = 0; i < arr.length; i += 1) {
        //   const id = arr[i];
        //   net.remove(id);
        // }
        const { flow } = this.props;
        const activeNodeId = flow.get('activeNodeId');
        const activeNodeIndex = Number(activeNodeId.split('_')[1]);
        this.props.actions.flowUpdate({ key: ['historyId'], value: activeNodeIndex });
    }

    // findChildren(id, arr) {
    //   net.get('items').map((x) => {
    //     if (x.get('type') !== 'edge') {
    //       const model = x.get('model');
    //       if (model) {
    //         const fatherId = model.fatherId;
    //         if (fatherId === id) {
    //           arr.push(model.id);
    //           this.findChildren(x.get('id'), arr);
    //         }
    //       }
    //     }
    //   });
    //   return arr;
    // }

    previous() {
        // const { flow } = this.props;
        // const history = flow.get('history');
        // const historyActiveId = flow.get('historyActiveId');
        const { flow } = this.props;
        const history = flow.get('history');
        const historyId = flow.get('historyId');
        if (historyId > 0) {
            this.props.actions.flowUpdate({ key: ['historyId'], value: historyId - 1 });
        }
    }

    next() {
        const { flow } = this.props;
        const history = flow.get('history');
        const historyId = flow.get('historyId');
        if (historyId < history.size - 1) {
            this.props.actions.flowUpdate({ key: ['historyId'], value: historyId + 1 });
        }
    }

    render() {
        const { flow } = this.props;
        const groups = flow.get('groups');
        const history = flow.get('history');
        const historyId = flow.get('historyId');
        const buttons = flow.getIn(['history', historyId, 'buttons']);
        return (
            <div className={styles.normal}>
                <div className={styles.left}>
                    <div className={styles.topBar}>流程组件</div>
                    {groups.map((group, groupIndex) => {
                        const groupId = group.get('id');
                        const groupColor = group.get('color');
                        const groupName = group.get('name');
                        const groupButtons = buttons.filter(v => v.get('group') === groupId);
                        return (
                            <div key={groupId} className={styles.list} style={{ boxShadow: `1px 1px 10px 0px ${groupColor}` }}>
                                <div className={styles.itemTitleBar} style={{ background: groupColor }}>{groupName}</div>
                                {groupButtons.map((button, buttonIndex) => {
                                    const buttonName = button.get('name');
                                    return <Button key={buttonName} disabled={button.get('visible') !== true} onClick={this.handleClick.bind(this, buttonIndex, buttonName)}>{buttonName}</Button>;
                                })}
                            </div>
                        );
                    })}
                </div>
                <div id="c1" className={styles.right} />
                <button onClick={this.changeModes.bind(this, 'default')}>默认</button>
                <button onClick={this.changeModes.bind(this, 'edit')}>多选</button>
                {/*
                <button onClick={this.save.bind(this)}>保存</button>
                <button onClick={this.read.bind(this)}>读取</button>
                */}
                <button onClick={this.reset.bind(this)}>跳步</button>
                <button onClick={this.previous.bind(this)}>上一步</button>
                <button onClick={this.next.bind(this)}>下一步</button>
                <button onClick={this.save}>保存</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        flow: state.get('flow'),
    };
};
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        updateTemplateData,
        flowUpdate,
        flowAdd,
        flowDel,
    }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Flow);
