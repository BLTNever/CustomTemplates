import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { document } from 'global';
import { SketchPicker } from 'react-color';
import { updateActivePageDateObject } from '../../actions';
import styles from './Palette.css';
import { handleBoxShadow, handleCSS } from '../../utils/common.js';

class Palette extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: this.handleColorValueToObject(props.defaultValue),
            displayColorPicker: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleAfterChange = this.handleAfterChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.info.get('activeId') !== this.props.info.get('activeId')) {
            this.setState({ color: this.handleColorValueToObject(nextProps.defaultValue) });
        }
    }

    setActiveElementStyle(activeElementStyle, styleType, value) {
        if (styleType === 'boxShadowColor') {
            activeElementStyle['box-shadow'] = handleBoxShadow(activeElementStyle['box-shadow'], styleType, value);
        } else {
            activeElementStyle[styleType] = value;
        }
    }

    handleColorValueToObject(value) {
        const color = value.toString().match(/\d+/g);
        return {
            r: color[0],
            g: color[1],
            b: color[2],
            a: color[3],
        };
    }

    handleChange(value) {
        const rgb = value.rgb;
        this.setState({ color: rgb });
        const { styleType } = this.props;
        const activeId = this.props.info.get('activeId');
        const activeElementStyle = document.getElementById(activeId).style;
        const color = `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
        this.setActiveElementStyle(activeElementStyle, styleType, color);
    }

    handleAfterChange() {
        const { activePageData, styleType } = this.props;
        const activeId = this.props.info.get('activeId');
        const publicKey = ['elements', activeId, 'style'];
        const prepStyle = activePageData.get('elements').get(activeId).get('style');
        const rgb = this.state.color;
        const color = `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
        if (styleType === 'boxShadowColor') {
            this.props.actions.updateActivePageDateObject({ key: publicKey.concat([handleCSS('box-shadow')]), value: handleBoxShadow(prepStyle.boxShadow, styleType, color) });
        } else {
            this.props.actions.updateActivePageDateObject({
                key: publicKey.concat([handleCSS(styleType)]),
                value: color
            });
        }
    }

    handleClick(e) {
        if (e.target.id !== 'cover' && e.target.id !== 'swatch' && e.target.id !== 'showColor') return;
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }
    render() {
        const { text } = this.props;
        const { color: rgb } = this.state;
        return (
            <div className={styles.normal}>
                <table className={styles.tableNormal}>
                    <tbody>
                        <tr>
                            <td className={styles.text}>{text}</td>
                            <td className={styles.colorChoose}>
                                <div id="swatch" className={styles.swatch} onClick={this.handleClick}>
                                    <div id="showColor" className={styles.showColor} style={{ background: `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})` }} />
                                </div>
                            </td>
                            <td className={styles.value} />
                        </tr>
                    </tbody>
                </table>
                {this.state.displayColorPicker ?
                    <div id="cover" className={styles.cover} onClick={this.handleClick}>
                        <div id="colorPicker" className={styles.colorPicker}>
                            <SketchPicker
                                color={this.state.color}
                                onChange={this.handleChange} onChangeComplete={this.handleAfterChange}
                            />
                        </div>
                    </div>
                    : null
                }
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
        updateActivePageDateObject,
    }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Palette);
