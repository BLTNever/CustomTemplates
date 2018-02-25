import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import { updateActivePageDateObject } from '../../actions';
import styles from './Selector.css';
import { handleBoxShadow, handleCSS } from '../../utils/common.js';

class Selector extends Component {

    constructor(props) {
        super(props);
        this.handleChooseOption = this.handleChooseOption.bind(this);
        this.state = {
            value: props.defaultValue,
        };
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.info.get('activeId') !== this.props.info.get('activeId')) {
            this.setState({ value: nextProps.defaultValue });
        }
    }

    handleChooseOption(value) {
        this.setState({ value });
        const { styleType, activePageData } = this.props;
        const activeId = this.props.info.get('activeId');
        const publicKey = ['elements', activeId, 'style'];
        const prepStyle = activePageData.get('elements').get(activeId).get('style');
        if (styleType === 'boxShadowType') {
            this.props.actions.updateActivePageDateObject({ key: publicKey.concat([handleCSS('box-shadow')]), value: handleBoxShadow(prepStyle.boxShadow, styleType, value) });
        } else {
            this.props.actions.updateActivePageDateObject({
                key: publicKey.concat([handleCSS(styleType)]), value: value
            });
        }
    }

    render() {
        const { text, options } = this.props;
        const ops = options.map((option) => {
            return (
                <Select.Option key={`option${option.name}`} value={option.value} >{option.name}</Select.Option>
            );
        });
        return (
            <table className={styles.normal} >
                <tbody>
                    <tr>
                        <td className={styles.text}>{text}</td>
                        <td className={styles.select} >
                            <Select
                                style={{ width: '100%' }}
                                value={this.state.value}
                                onChange={this.handleChooseOption}
                            >
                                {ops}
                            </Select>
                        </td>
                        <td style={{ width: '34%' }}></td>
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
export default connect(mapStateToProps, mapDispatchToProps)(Selector);
