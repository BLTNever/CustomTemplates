import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Collapse } from 'antd';
import { updateInfo, updateTemplateData } from '../../actions';
import styles from './Toolkit.css';
import { DropDown, Sider } from '../index';
import { handleCSS } from '../../utils/common.js';

class Toolkit extends Component {
    constructor(props) {
        super(props);
        this.getStyleFromData = this.getStyleFromData.bind(this);
        this.initToolkit = this.initToolkit.bind(this);
        this.state = {
            initValue: {},
        };
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.info.get('activeId') !== this.props.info.get('activeId')) {
            const activeId = nextProps.info.get('activeId');
            if (activeId !== -1) {
                const initValue = {
                    dropDownInfoOne: {
                        name: '基础样式',
                        options: [
                            { type: 'palette', attrs: { text: '背景色', styleType: 'background', defaultValue: this.getStyleFromData(nextProps, 'background') || 'rgba(255,255,255,0)' } },
                            { type: 'progress', attrs: { text: '透明度', styleType: 'opacity', minValue: 0, maxValue: 100, defaultValue: this.getStyleFromData(nextProps, 'opacity') * 100 || 100 } },
                            { type: 'jump' }
                        ],
                    },
                    dropDownInfoTwo: {
                        name: '边框样式',
                        options: [
                            { type: 'palette', attrs: { text: '颜色', styleType: 'border-color', defaultValue: this.getStyleFromData(nextProps, 'border-color') || 'rgba(255,255,255,0)' } },
                            { type: 'progress', attrs: { text: '宽度', styleType: 'border-width', minValue: 0, maxValue: 10, defaultValue: this.getStyleFromData(nextProps, 'border-width') || 0 } },
                            { type: 'progress', attrs: { text: '角度', styleType: 'border-radius', minValue: 0, maxValue: 15, defaultValue: this.getStyleFromData(nextProps, 'border-radius') || 0 } },
                            { type: 'selector', attrs: { text: '类型', styleType: 'border-style', options: [{ name: '无', value: 'none' }, { name: '直线', value: 'solid' }, { name: '破折线', value: 'dashed' }, { name: '点状线', value: 'dotted' }, { name: '双划线', value: 'double' }], defaultValue: this.getStyleFromData(nextProps, 'border-style') || 'none' } },
                        ],
                    },
                    dropDownInfoThree: {
                        name: '阴影样式',
                        options: [
                            { type: 'palette', attrs: { text: '颜色', styleType: 'boxShadowColor', defaultValue: this.getStyleFromData(nextProps, 'boxShadowColor') || 'rgba(255,255,255,0)' } },
                            { type: 'progress', attrs: { text: '大小', styleType: 'boxShadowSize', minValue: 0, maxValue: 10, defaultValue: this.getStyleFromData(nextProps, 'boxShadowSize') || 0 } },
                            { type: 'progress', attrs: { text: '位移x', styleType: 'boxShadowX', minValue: -20, maxValue: 20, defaultValue: this.getStyleFromData(nextProps, 'boxShadowX') || 0 } },
                            { type: 'progress', attrs: { text: '位移y', styleType: 'boxShadowY', minValue: -20, maxValue: 20, defaultValue: this.getStyleFromData(nextProps, 'boxShadowY') || 0 } },
                            { type: 'progress', attrs: { text: '模糊', styleType: 'boxShadowClarity', minValue: 0, maxValue: 20, defaultValue: this.getStyleFromData(nextProps, 'boxShadowClarity') || 0 } },
                        ],
                    },
                    dropDownInfoFour: {
                        name: '位置',
                        options: [
                            { type: 'locationChoose' },
                        ],
                    },
                    dropDownInfoFive: {
                        name: '文字',
                        options: [
                            { type: 'palette', attrs: { text: '颜色', styleType: 'color', defaultValue: this.getStyleFromData(nextProps, 'color') || 'rgba(0,0,0,1)' } },
                            { type: 'progress', attrs: { text: '大小', styleType: 'font-size', minValue: 12, maxValue: 50, defaultValue: this.getStyleFromData(nextProps, 'font-size') || 16 } },
                            { type: 'selector', attrs: { text: '位置', styleType: 'text-align', options: [{ name: '居左', value: 'left' }, { name: '居中', value: 'center' }, { name: '居右', value: 'right' }], defaultValue: this.getStyleFromData(nextProps, 'text-align') || 'left' } },
                            { type: 'selector', attrs: { text: '加粗', styleType: 'font-weight', options: [{ name: '否', value: '' }, { name: '是', value: 'bold' }], defaultValue: this.getStyleFromData(nextProps, 'font-weight') || '' } },
                            { type: 'selector', attrs: { text: '字体', styleType: 'font-family', options: [{ name: '默认', value: 'sans-serif' }, { name: '黑体', value: 'Helvetica' }, { name: '微软雅黑', value: 'Microsoft Yahei' }], defaultValue: this.getStyleFromData(nextProps, 'font-family') || 'sans-serif' } },
                            { type: 'selector', attrs: { text: '装饰线', styleType: 'text-decoration', options: [{ name: '默认', value: 'none' }, { name: '下划线', value: 'underline' }, { name: '上划线', value: 'overline' }, { name: '删除线', value: 'line-through' }], defaultValue: this.getStyleFromData(nextProps, 'text-decoration') || 'none' } },
                        ],
                    },
                    dropDownInfoSix: {
                        name: '图层',
                        options: [
                            { type: 'layerSet' },
                        ],
                    },
                    //   dropDownInfoSeven: {
                    //     name: '外链',
                    //     options: [
                    //       { type: 'linkSet' },
                    //     ],
                    //   },
                };

                this.setState({ initValue });
            } else {
                this.setState({ initValue: {} });
            }
        }
    }

    getStyleFromData(nextProps, styleType) {
        const activeId = nextProps.info.get('activeId');
        const { activePageData } = nextProps;
        if (activeId < 0) return;
        const activeElementStyle = activePageData.getIn(['elements', activeId, 'style']);
        if (styleType.indexOf('box') === 0) {
            const shadowStyle = activeElementStyle.get('boxShadow') ? activeElementStyle.get('boxShadow') : 'rgba(255,255,255,0) 0 0 0 0';
            const shadowStyleArray = shadowStyle.split(' ');
            let arrayXY = [];
            let arrayColor = [];
            let arrayInset = [];
            if (shadowStyleArray[shadowStyleArray.length - 1] !== 'inset') {
                arrayXY = shadowStyleArray.slice(-4);
                arrayColor = shadowStyleArray.slice(0, shadowStyleArray.length - 4);
                arrayInset = [];
            } else {
                arrayXY = shadowStyleArray.slice(shadowStyleArray.length - 5, shadowStyleArray.length - 1);
                arrayColor = shadowStyleArray.slice(0, shadowStyleArray.length - 5);
                arrayInset = shadowStyleArray.slice(-1);
            }
            switch (styleType) {
                case 'boxShadowX':
                    return arrayXY[0];
                case 'boxShadowY':
                    return arrayXY[1];
                case 'boxShadowClarity':
                    return arrayXY[2];
                case 'boxShadowSize':
                    return arrayXY[3];
                case 'boxShadowColor':
                    return arrayColor.join(' ');
                case 'boxShadowType':
                    return arrayInset[0];
            }
        } else {
            return activeElementStyle.get(handleCSS(styleType));
        }
    }

    initToolkit() {
        const { activePageData } = this.props;
        const activeId = this.props.info.get('activeId');
        if (this.state.initValue.dropDownInfoOne) {
            const activeElement = activePageData.getIn(['elements', activeId]);
            return (
                <div>

                    <Collapse accordion defaultActiveKey={['1']}>
                        <Collapse.Panel header={this.state.initValue.dropDownInfoOne.name} key="1">
                            <DropDown dropDownInfo={this.state.initValue.dropDownInfoOne} />
                        </Collapse.Panel>
                        <Collapse.Panel header={this.state.initValue.dropDownInfoTwo.name} key="2">
                            <DropDown dropDownInfo={this.state.initValue.dropDownInfoTwo} />
                        </Collapse.Panel>
                        <Collapse.Panel header={this.state.initValue.dropDownInfoThree.name} key="3">
                            <DropDown dropDownInfo={this.state.initValue.dropDownInfoThree} />
                        </Collapse.Panel>
                        <Collapse.Panel header={this.state.initValue.dropDownInfoFour.name} key="4">
                            <DropDown dropDownInfo={this.state.initValue.dropDownInfoFour} />
                        </Collapse.Panel>
                        {/*
              activeElement && activeElement.get('tag') !== 'img' ?
                <Collapse.Panel header={this.state.initValue.dropDownInfoFive.name} key="5">
                  <DropDown dropDownInfo={this.state.initValue.dropDownInfoFive} />
                </Collapse.Panel> : null
              */
                        }
                        {/* {
              activeElement && activeElement.get('static') !== true ?
                <DropDown dropDownInfo={this.state.initValue.dropDownInfoSeven} /> : null
            }*/}
                    </Collapse>
                </div>
            );
        } else {
            return (
                <div>
                    <Sider />
                </div>
            );
        }
    }

    render() {
        return (
            <div className={styles.normal} >
                {this.initToolkit()}
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        info: state.get('info'),
        activePageData: state.get('activePageData'),
    };
};
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        updateInfo,
        updateTemplateData,
    }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Toolkit);
