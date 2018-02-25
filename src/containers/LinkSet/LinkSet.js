import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input, Button, message } from 'antd';
import { updateActivePageDateObject } from '../../actions';
import styles from '../LinkSet/LinkSet.css';

class LinkSet extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.handleChange = this.handleChange.bind(this);
        // this.handleClick = this.handleClick.bind(this);
        this.inputOnBlur = this.inputOnBlur.bind(this);
    }
    handleChange(e) {
        this.setState({
            value: e.target.value,

        });
    }
    // handleClick() {
    //     const { activePageData } = this.props;
    //     const activeId = this.props.info.get('activeId');
    //     if (this.state.value.length > 0) {
    //         this.props.actions.updateActivePageDateObject({ key: ['elements', activeId, 'href'], value: this.state.value });
    //         message.success('外链地址保存成功');
    //     } else {
    //         message.error('请输入外链地址');
    //     }
    // }
    inputOnBlur() {
        console.log(this.state.value, this.state.value.length)
        const { activePageData } = this.props;
        const activeId = this.props.info.get('activeId');
        this.state.value.length > 0 && this.props.actions.updateActivePageDateObject({ key: ['elements', activeId, 'href'], value: this.state.value });
    }
    render() {
        const InputGroup = Input.Group;
        return (
            <div className={styles.link}>
                <InputGroup size="default">
                    <div className={styles.input}>
                        <Input value={this.state.value} 
                            onChange={this.handleChange} 
                            disabled={this.props.jumpDisabled}
                            onBlur={this.inputOnBlur} />
                    </div>
                </InputGroup>
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
export default connect(mapStateToProps, mapDispatchToProps)(LinkSet);
