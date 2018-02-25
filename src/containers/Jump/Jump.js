import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Radio, Select, Row, Col } from 'antd';
import { updateInfo, updateActivePageDateObject } from '../../actions';
import styles from '../Jump/Jump.css';
import { LinkSet, Selector } from '../../containers/index';
import inside from '../../constants/initialState.json';

class Jump extends Component {
    constructor(props) {
        super(props);
        this.state = { value: 'links' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }
    handleChange(e) {
        this.setState({
            value: e.target.value,
        });
        console.log(this.state.value)
        this.state.value === 'links' ? this.setState({ disabled: true }) : this.setState({ disabled: false })
    }
    handleSelect(value) {
        console.log(value)
        const { activePageData } = this.props;
        const activeId = this.props.info.get('activeId');
        this.props.actions.updateActivePageDateObject({ key: ['elements', activeId, 'action'], value: value });
    }
    render() {
        const RadioGroup = Radio.Group;
        const insideData = inside.insidePage;
        const insdeOps = insideData.map((ops) => {
            return (
                <Select.Option key={`option${ops.name}`} value={ops.router} >{ops.name}</Select.Option>
            );
        });
        return (
            <RadioGroup className={styles.jump} onChange={this.handleChange} value={this.state.value}>
                <Row className={styles.jumpRow}>
                    <Col span={8} className={styles.jumpText}>外链URL</Col>
                    <Col span={16}>
                        <Radio value={'links'} className={styles.jumpRadio}>
                            <LinkSet jumpDisabled={this.state.disabled}/>
                        </Radio>
                    </Col>
                </Row>
                <Row className={styles.jumpRow}>
                    <Col span={8} className={styles.jumpText}>内跳页面</Col>
                    <Col span={8}>
                        <Radio value={'jump'} className={styles.jumpRadio}>
                            <Select style={{ width: 162 }} disabled={this.state.value === 'links'} onChange={this.handleSelect}>
                                {insdeOps}
                            </Select>
                        </Radio>
                    </Col>
                </Row>
            </RadioGroup>
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
        updateActivePageDateObject,
    }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Jump);
