import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Tabs, Modal, Button, Input, message } from 'antd';
import styles from './Configure.css';
import { updateInfo, updateActivePageDateObject, } from '../../actions';
import { Sudoku } from '../../containers/index'
class Configure extends Component {

    constructor(props) {
        super(props);

    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <Sudoku />
            </div>
        )
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
export default connect(mapStateToProps, mapDispatchToProps)(Configure);
