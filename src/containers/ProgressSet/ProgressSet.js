import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { document } from 'global';
import { Slider } from 'antd';
import { updateActivePageDateObject } from '../../actions';
import styles from './ProgressSet.css';
import { handleBoxShadow, handleCSS } from '../../utils/common.js';

class ProgressSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue,
        };
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleInputMouseUp = this.handleInputMouseUp.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.info.get('activeId') !== this.props.info.get('activeId')) {
            this.setState({ value: nextProps.defaultValue });
        }
    }

    setActiveElementStyle(activeElementStyle, styleType, value) {
        if (styleType === 'opacity') {
            activeElementStyle[styleType] = value / 100;
        } else if (styleType.indexOf('box') === 0) {
            activeElementStyle['box-shadow'] = handleBoxShadow(activeElementStyle['box-shadow'], styleType, value);
        } else if (styleType === 'z-index') {
            activeElementStyle[styleType] = value;
        } else {
            activeElementStyle[styleType] = `${value}px`;
        }
    }

    handleValueChange(value) {
        this.setState({ value });
        const { styleType } = this.props;
        const activeId = this.props.info.get('activeId');
        const activeElementStyle = document.getElementById(activeId).style;
        this.setActiveElementStyle(activeElementStyle, styleType, value);
    }

    handleInputMouseUp() {
        const { styleType, activePageData } = this.props;
        const activeId = this.props.info.get('activeId');
        const value = this.state.value;
        const publicKey = ['elements', activeId, 'style'];
        if (styleType === 'opacity') {
            this.props.actions.updateActivePageDateObject(
                { key: publicKey.concat([handleCSS(styleType)]), value: value / 100 });
        } else if (styleType.indexOf('box') === 0) {
            const prepElementStyle = activePageData.get('elements').get(activeId).get('style').get('boxShadow');
            this.props.actions.updateActivePageDateObject(
                { key: publicKey.concat([handleCSS('box-shadow')]), value: handleBoxShadow(prepElementStyle, styleType, value) });
        } else {
            this.props.actions.updateActivePageDateObject(
                { key: publicKey.concat([handleCSS(styleType)]), value: value });
        }
    }


    render() {
        const { styleType, text, minValue, maxValue } = this.props;

        return (
            <table className={styles.normal} >
                <tbody>
                    <tr>
                        <td className={styles.text}>{text}</td>
                        <td className={styles.progress}>
                            <Slider
                                min={minValue}
                                max={maxValue}
                                step={1}
                                value={isFinite(this.state.value) ? parseFloat(this.state.value) : this.state.value}
                                onChange={this.handleValueChange}
                                onAfterChange={this.handleInputMouseUp}
                            />
                        </td>
                        <td className={styles.value}>{styleType === 'opacity' ? `${this.state.value}%` : this.state.value}</td>
                    </tr>
                </tbody>
            </table>
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
export default connect(mapStateToProps, mapDispatchToProps)(ProgressSet);
