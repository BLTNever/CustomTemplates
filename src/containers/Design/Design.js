import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { document } from 'global';
import { fromJS, Map, List } from 'immutable';
import { Row, Col, Tabs, Modal, Button, Input, message } from 'antd';
import styles from './Design.css';
import { updateInfo, updateTemplateData, updateActivePageDateObject, updateActivePageDateArrayRemove } from '../../actions';
import { Toolkit } from '../../containers/index';
import { MainLayout, SelectorBox, PlayAudio, Settings } from '../../components/index';
import { px2Number, getAngle, selectText, getUrlParameter } from '../../utils/common';
import json from '../../constants/initialState.json';
import RichText from '../Toolkit/RichText';
import CodeEditor from '../Toolkit/CodeEditor';
import FlowChart from '../FlowChart/FlowChart';

class Design extends Component {

    constructor(props) {
        super(props);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        // this.handleDoubleImgClick = this.handleDoubleImgClick.bind(this);
        this.canEdit = this.canEdit.bind(this);
        this.handleEditText = this.handleEditText.bind(this);
        // this.switchImg = this.switchImg.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.changePageName = this.changePageName.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.richTextCallback = this.richTextCallback.bind(this);
        this.state = {
            isDragging: false, // 是否正在拖动
            rotate: 0, // 旋转角度
            visible: false,
            pageName: '',
            richText: ''
        };
    }
    componentWillMount() {
        const param = getUrlParameter(this.props.location.search);
        const { option, oid } = param;
        this.props.actions.updateInfo({ key: 'option', value: option });
        this.props.actions.updateInfo({ key: 'oid', value: oid });
        this.props.actions.updateTemplateData({ key: [], value: fromJS(json) });
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.templateData !== this.props.templateData) &&
            this.props.templateData.size === 0) {
            this.props.actions.updateInfo({ key: 'activeId', value: -1 });
            this.props.actions.updateInfo({ key: 'currentPage', value: 'loadingPage' });
        }
        if (nextProps.activePageData !== this.props.activePageData) {
            this.setState({ editId: '' });
        }

        if (nextProps.info.get('currentPage') !== this.props.info.get('currentPage')) {
            if (this.props.templateData.get('page').keySeq().includes(this.props.info.get('currentPage'))) {
                if (this.props.activePageData !== this.props.templateData.getIn(['page', this.props.info.get('currentPage')])) {
                    this.props.actions.updateTemplateData({ key: ['page', this.props.info.get('currentPage')], value: this.props.activePageData });
                }
            } else if (this.props.info.get('currentPage')) {
                const routeName = this.props.info.get('currentPage').split('_')[0];
                if (this.props.templateData.getIn(['page', routeName, 'children']).keySeq().includes(this.props.info.get('currentPage'))) {
                    if (this.props.activePageData !== this.props.templateData.getIn(['page', routeName, 'children'])) {
                        this.props.actions.updateTemplateData({ key: ['page', routeName, 'children', this.props.info.get('currentPage')], value: this.props.activePageData });
                    }
                } else {
                    this.props.actions.updateTemplateData({ key: ['page', routeName, 'children', this.props.info.get('currentPage')], value: this.props.activePageData });
                }
            }
            if (this.props.templateData.get('page').keySeq().includes(nextProps.info.get('currentPage'))) {
                this.props.actions.updateActivePageDateObject({ key: [], value: nextProps.templateData.getIn(['page', nextProps.info.get('currentPage')]) });
            } else if (nextProps.info.get('currentPage')) {
                const routeName = this.props.info.get('currentPage').split('_')[0];
                this.props.actions.updateActivePageDateObject({ key: [], value: nextProps.templateData.getIn(['page', routeName, 'children', nextProps.info.get('currentPage')]) });
            }
        }
    }


    canEdit(id) {
        const { editId } = this.state;
        if (id === 'main') { // 点击背景
            if (editId !== '' && editId >= 0) {
                this.refs[editId].children[0].contentEditable = false;
                this.refs[editId].children[1].style.pointerEvents = 'auto';
                this.refs[editId].children[0].querySelector('.quill').style.pointerEvents = 'none'
                this.refs[editId].children[0].querySelector('.ql-toolbar').style.display = 'none'
                this.refs[editId].style.zIndex = 0;
                this.handleEditText(editId);
                this.setState({ editId: '' });
                this.props.actions.updateInfo({ key: 'editId', value: '' });
            }
        } else { // 点击元素
            const child = this.refs[id] && this.refs[id].children ? this.refs[id].children[0] : undefined
            if (editId !== '' && editId >= 0) {
                child.contentEditable = false;
                this.refs[id].children[1].style.pointerEvents = 'auto';
                child.querySelector('.quill').style.pointerEvents = 'none'
                child.querySelector('.ql-toolbar').style.display = 'none'
                this.refs[editId].style.zIndex = 0;
                this.handleEditText(editId);
            }
            if (child) {
                if (child.tagName !== 'IMG') {
                    child.contentEditable = true;
                    this.refs[id].children[1].style.pointerEvents = 'none';
                    child.querySelector('.quill').style.pointerEvents = 'auto'
                    child.querySelector('.ql-toolbar').style.display = 'block'
                    this.refs[id].style.zIndex = 20;
                    this.refs[id].focus();
                    selectText(id);
                    this.setState({ editId: id });
                    this.props.actions.updateInfo({ key: 'editId', value: id });
                } else if (child.tagName === 'IMG') {
                    // 图片双击
                    this.refs.file.click();
                    this.setState({ doubleImgId: id });
                }
            }
        }
    }

    handleEditText(id) {
        // this.props.actions.updateTemplateDate({
        // key: ['page', currentPage, 'elements', id], value: this.refs[id].innerText });
        // this.props.actions.updateActivePageDateObject({ key: ['elements', id, 'value'], value: this.refs[id].innerText });
        console.log(this.state.richText)
        this.props.actions.updateActivePageDateObject({ key: ['elements', id, 'value'], value: this.state.richText });

    }

    handleDoubleClick(e) {
        const className = e.target.className;
        if (className && className.indexOf('selector') === -1) return;
        const activeId = this.props.info.get('activeId');
        this.canEdit(activeId, e.target, 'double');
    }

    handleMouseDown(e) {
        const id = e.target.id;
        let className = e.target.className;
        if (className && className.split('___')) {
            className = className.split('___')[0];
        }
        const activeId = this.props.info.get('activeId');
        const { relativeRotate, width, height } = this.state;
        if (id === 'main') { // 点击空白区域
            // this.setState({ activeId: -1 });
            // this.props.dispatch({
            //   type: 'design/save',
            //   payload: { activeId: -1 },
            // });
            this.props.actions.updateInfo({ key: 'activeId', value: -1 });
            this.canEdit(id);
        } else if (id && Number(id) > -1) { // 点击的是元素
            const style = this.refs[id].style;
            const { width, height, left, top, transform } = style;
            let rotate = 0;
            if (transform) {
                const reg = /\((\S*)deg\)/;
                rotate = Number(transform.match(reg)[1]);
            }
            // 点击的dom和之前双击的dom不是同个元素，取消可编辑和事件阻止
            if (this.state.editId !== '' && this.state.editId >= 0 && id !== this.state.editId) {
                this.refs[this.state.editId].children[0].contentEditable = false;
                this.refs[this.state.editId].children[1].style.pointerEvents = 'auto';
                this.refs[this.state.editId].children[0].querySelector('.quill').style.pointerEvents = 'none'
                this.refs[this.state.editId].children[0].querySelector('.ql-toolbar').style.display = 'none'
            }

            this.setState({
                left: px2Number(left),
                top: px2Number(top),
                width: px2Number(width),
                height: px2Number(height),
                relativeRotate: rotate,  // 这里的relativeRotate是相对动态的的rotate，每次旋转之后都会改变值} });
                // activeId: Number(id),
            });
            // this.props.dispatch({
            //   type: 'design/save',
            //   payload: { activeId: Number(id) },
            // });
            this.props.actions.updateInfo({ key: 'activeId', value: Number(id) });
        } else if (className && activeId > -1) {
            if (this.state.editId !== '' && this.state.editId >= 0) {
                this.refs[this.state.editId].children[0].contentEditable = false;
                this.refs[this.state.editId].children[1].style.pointerEvents = 'auto';
                this.refs[this.state.editId].children[0].querySelector('.quill').style.pointerEvents = 'none'
                this.refs[this.state.editId].children[0].querySelector('.ql-toolbar').style.display = 'none'
                this.setState({ editId: '' })
            }
            this.setState({
                className,
                isDragging: true,
                relativeX: e.pageX, // 这里的relativeX是相对动态的的pageX，每次mousemove之后都会改变值
                relativeY: e.pageY, // 这里的relativeY是相对动态的的pageY，每次mousemove之后都会改变值
                rotate: relativeRotate, // 固定不变的rotate
                pageX: e.pageX, // 固定不变的pageX
                pageY: e.pageY,  // 固定不变的pageY
                staticWidth: width, // 固定不变的
                staticHeight: height, // 固定不变的
            });
        }
    }

    handleMouseMove(e) {
        const { isDragging, className, relativeX, relativeY, left,
            top, width, height, staticWidth, staticHeight, pageX, pageY, rotate } = this.state;
        // console.log(`isDragging:${isDragging}`);
        if (!isDragging) return false;
        const activeId = this.props.info.get('activeId');
        const moveX = e.pageX - relativeX;
        const moveY = e.pageY - relativeY;
        // const { activeId } = this.props;
        if (!this.refs[activeId]) return;
        const style = this.refs[activeId].style;
        const ratio = staticWidth / staticHeight; // 拖拽之前的宽高比
        let ratioMoveX;
        let nextWidth;
        let nextHeight;

        switch (className) {
            case 'selector':
                this.setState({
                    left: moveX + left,
                    top: moveY + top,
                    relativeX: e.pageX,
                    relativeY: e.pageY,
                });
                style.left = `${moveX + left}px`;
                style.top = `${moveY + top}px`;
                // console.log(moveX);
                break;
            case 'circleN': // 上
            case 'lineN':
                this.setState({ top: top + moveY, height: height - moveY, relativeY: e.pageY });
                style.top = `${top + moveY}px`;
                style.height = `${height - moveY}px`;
                break;
            case 'circleS': // 下
            case 'lineS':
                this.setState({ height: height + moveY, relativeY: e.pageY });
                style.height = `${height + moveY}px`;
                break;
            case 'circleW': // 左
            case 'lineW':
                this.setState({ left: left + moveX, width: width - moveX, relativeX: e.pageX });
                style.left = `${left + moveX}px`;
                style.width = `${width - moveX}px`;
                break;
            case 'circleE': // 右
            case 'lineE':
                this.setState({ width: width + moveX, relativeX: e.pageX });
                style.width = `${width + moveX}px`;
                break;
            case 'circleNw': // 左上
                ratioMoveX = ratio * moveY;
                nextHeight = height - moveY;
                if (nextHeight === height) return;
                if (nextHeight > 0) {
                    nextWidth = nextHeight * ratio;
                    this.setState({ top: top + moveY, left: left + ratioMoveX, width: nextWidth, height: nextHeight, relativeY: e.pageY });
                }
                style.top = `${top + moveY}px`;
                style.left = `${left + ratioMoveX}px`;
                style.width = `${nextWidth}px`;
                style.height = `${nextHeight}px`;
                break;
            case 'circleNe': // 右上
                nextHeight = height - moveY;
                if (nextHeight === height) return;
                if (nextHeight > 0) {
                    nextWidth = nextHeight * ratio;
                    this.setState({
                        top: top + moveY,
                        width: nextWidth,
                        height: nextHeight,
                        relativeY: e.pageY
                    });
                }
                style.top = `${top + moveY}px`;
                style.width = `${nextWidth}px`;
                style.height = `${nextHeight}px`;
                break;
            case 'circleSe': // 右下
                nextHeight = height + moveY;
                if (nextHeight === height) return;
                if (nextHeight > 0) {
                    nextWidth = nextHeight * ratio;
                    this.setState({ width: nextWidth, height: nextHeight, relativeY: e.pageY });
                }
                style.width = `${nextWidth}px`;
                style.height = `${nextHeight}px`;
                break;
            case 'circleSw': // 左下
                ratioMoveX = ratio * moveY;
                nextHeight = height + moveY;
                if (nextHeight === height) return;
                if (nextHeight > 0) {
                    nextWidth = nextHeight * ratio;
                    this.setState({ left: left - ratioMoveX, width: nextWidth, height: nextHeight, relativeY: e.pageY });
                }
                style.left = `${left - ratioMoveX}px`;
                style.width = `${nextWidth}px`;
                style.height = `${nextHeight}px`;
                break;
            case 'rotateCircle': // 旋转角度
                const rotateCenter = { x: pageX, y: pageY + height };
                const angle = getAngle(rotateCenter.x, rotateCenter.y, e.pageX, e.pageY) + rotate;
                this.setState({ relativeRotate: angle, relativeX: e.pageX, relativeY: e.pageY });
                style.transform = `rotate(${angle}deg)`;
                break;
            default:
                break;
        }
    }

    handleMouseUp(e) {
        const { relativeRotate, left, top, height, width } = this.state;
        const activeId = this.props.info.get('activeId');
        if (activeId < 0) return;
        this.setState({ isDragging: false });
        const rotateSyle = { transform: `rotate(${relativeRotate}deg)` };
        // let copy = Object.assign({}, templateData);
        // const copy = JSON.parse(JSON.stringify(templateData));
        // const style = copy.page[activePage].elements[activeId].style;
        const newStyle = Object.assign({}, { left, top, height, width }, rotateSyle);
        // copy.page[activePage].elements[activeId].style = newStyle;

        // this.props.dispatch({
        //   type: 'design/save',
        //   payload: { templateData: copy },
        // });
        this.props.actions.updateActivePageDateObject({ key: ['elements', activeId, 'style'], value: newStyle });
    }

    handleKeyDown(e) {
        const { activePageData } = this.props;
        const activeId = this.props.info.get('activeId');
        if (activeId !== '' && activeId >= 0) {
            const style = this.refs[activeId].style;
            let newStyle;
            // 按上下左右移动元素位置
            if (e.keyCode >= 37 && e.keyCode <= 40) {
                if (activeId === this.state.editId) return;
                e.preventDefault();
                const move = e.shiftKey ? 10 : 1;
                switch (e.keyCode) {
                    case 37:
                        newStyle = { ...style, left: px2Number(style.left) - move };
                        break;
                    case 38:
                        newStyle = { ...style, top: px2Number(style.top) - move };
                        break;
                    case 39:
                        newStyle = { ...style, left: px2Number(style.left) + move };
                        break;
                    case 40:
                        newStyle = { ...style, top: px2Number(style.top) + move };
                        break;
                }
                this.refs[activeId].style.left = `${newStyle.left}px`;
                this.refs[activeId].style.top = `${newStyle.top}px`;
                this.setState({ left: newStyle.left, top: newStyle.top });
            }
            // 按delete删除元素

            if (e.keyCode === 8 || e.keyCode === 46) {
                if (activeId === this.state.editId) return;
                e.preventDefault();
                // todo
                if (activePageData.get('elements').get(activeId).get('static')) return;
                this.props.actions.updateActivePageDateArrayRemove({ key: ['elements'], index: activeId });
                // this.props.dispatch({
                //   display: false,
                //   type: 'design/save',
                //   payload: { templateData: copy, activeId: -1 },
                // });
                this.props.actions.updateInfo({ key: 'activeId', value: -1 });
                this.setState({ display: false });
            }
            if (e.keyCode === 13) {
                // e.preventDefault();
                // this.canEdit(activeId);
            }
        }
    }

    changePageName() {
        this.setState({ visible: true, pageName: '' });
    }
    handleOk = () => {
        if (this.state.pageName) {
            this.props.actions.updateActivePageDateObject({ key: ['name'], value: this.state.pageName });
            message.success('修改成功');
            this.setState({ visible: false });
        } else {
            message.warning('页面名称不能为空');
        }
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }

    renderElements() {
        // const { name, pageElement, elements } = this.props.activePage;
        const templateData = this.props.templateData;
        const activeId = this.props.info.get('activeId');
        const currentPage = this.props.info.get('currentPage');
        const activePageData = this.props.activePageData;
        const pageElement = activePageData.get('pageElement');
        const elements = activePageData.get('elements');
        const children = [];
        elements.map((v, k) => {
            const tag = v.get('tag');
            let attr = v.get('attr');
            const style = v.get('style');
            const value = v.get('value');
            const specimen = v.get('specimen');
            // if (specimen) {
            //   attr.ref = specimen;
            // } else {
            //   attr.ref = index;
            // }
            attr = attr.set('id', k);
            // attr.key = index;
            attr = attr.set('draggable', false);
            // 数字不能是string
            let fontSize = style.get('fontSize');
            fontSize && (fontSize *= 1);
            // 元素

            // const child = React.createElement(tag,
            //   Object.assign({},
            //     attr,
            //     { style: Object.assign({}, style) },
            //   ), value);
            let childStyle = style.delete('position').delete('transform');
            const boxStyleKeys = ['width', 'height', 'left', 'top', 'transform', 'position', 'zIndex'];
            const boxStyle = style.takeWhile((v, k) => {
                if (boxStyleKeys.includes(k)) {
                    return v;
                }
            });
            // if (tag === 'div') {
            //   childStyle = childStyle.set('padding', 5);
            // }

            const selectorAttr = { key: `selector_${k}` };
            selectorAttr.display = activeId === k;
            let child

            if (tag === 'pre' && value) {
                child = React.createElement(tag, { ...attr.toJS(), style: childStyle.toJS() }, <RichText style={style} rid={k} value={value} callback={this.richTextCallback}></RichText>);
            } else {
                child = React.createElement(tag, { ...attr.toJS(), style: childStyle.toJS() },
                    value && Map.isMap(value) ? value.toJS() : value);
            }
            const selector = React.createElement(SelectorBox, selectorAttr);
            const box = React.createElement('div', { className: 'box', key: `box_${k}`, ref: k, style: boxStyle.toJS() }, child, selector);
            children.push(box);
        });

        // page页面
        const tag = pageElement.get('tag');
        let attr = pageElement.get('attr');
        let style = pageElement.get('style');
        const value = pageElement.get('value');

        attr = attr.set('id', 'main');
        if (currentPage === 'loading') {
            style = style.delete('position');
            style = style.delete('zIndex');
        }
        // 应用到全部
        if (!style.get('backgroundImage') && templateData.get('page').get('public') && templateData.get('page').get('public').get('pageElement') && templateData.get('page').get('public').get('pageElement').get('style')) {
            style = style.set('backgroundImage', templateData.get('page').get('public').get('pageElement').get('style')
                .get('backgroundImage'));
        }
        return React.createElement(tag, { ...attr.toJS(), style: style.toJS() }, children);
    }

    //富文本回调
    richTextCallback(value) {
        this.setState({ richText: value })
    }


    render() {
        const { activePageData } = this.props;
        const option = this.props.info.get('option');
        return (
            <MainLayout>
                <div
                    className={styles.normal} onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}
                    onDoubleClick={this.handleDoubleClick}
                >
                    <Row type="flex" justify="center">
                        <Col span={7}>
                            <div className={styles.flowChart}>
                                <FlowChart />
                            </div>
                        </Col>
                        <Col span={8} style={{ zIndex: 999 }}>
                            <Tabs type="card" style={{ width: '375px' }} onTabClick={this.changePageName}>
                                <Tabs.TabPane tab={activePageData ? activePageData.get('name') : null} key="1">
                                    <div className={styles.middle}>
                                        <PlayAudio />
                                        <div className={styles.player}>
                                            {activePageData && activePageData.size > 0 && this.renderElements()}
                                        </div>
                                    </div>
                                </Tabs.TabPane>
                            </Tabs>
                        </Col>
                        <Col span={7}>
                            <div className={styles.toolkit}>
                                {option && option !== 'history' ? <Settings info={this.props.info} /> : null}
                            </div>
                        </Col>
                    </Row>
                </div>
                <Modal
                    visible={this.state.visible}
                    title="修改页面名称"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
                            确认
            </Button>,
                    ]}
                >
                    <Input
                        size="large" value={this.state.pageName} onChange={(e) => {
                            this.setState({ pageName: e.target.value });
                        }} placeholder="请输入页面名称"
                    />
                </Modal>
                {/*<RichText></RichText>*/}
                {/* <CodeEditor>插入代码</CodeEditor>*/}

            </MainLayout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        info: state.get('info'),
        templateData: state.get('templateData'),
        activePageData: state.get('activePageData'),
    };
};
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        updateInfo,
        updateTemplateData,
        updateActivePageDateObject,
        updateActivePageDateArrayRemove,
    }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Design);
