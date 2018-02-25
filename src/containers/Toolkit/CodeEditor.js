import React, { Component } from 'react'
import CodeMirror from 'react-codemirror'
import { Modal, Button } from 'antd'
require('codemirror/mode/xml/xml');
require('codemirror/mode/htmlmixed/htmlmixed');

import './CodeEditor.css'
/**
 * <CodeEditor handleCallback={this.handleCallback}>插入代码</CodeEditor>
 */
export default class CodeEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code: '<div>adasda</div>',
            visible: false
        }
        this.updateCode = this.updateCode.bind(this)
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        console.log(this.state.code)
        this.props.handleCallback && this.props.handleCallback()
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
            code: ''
        });
    }

    updateCode(newCode) {
        this.setState({
            code: newCode,
        });
    }

    render() {
        var options = {
            lineNumbers: true,
            mode: 'htmlmixed'
        };
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>{this.props.children}</Button>
                <Modal title='代码块' visible={this.state.visible}
                    onOk={this.handleOk} onCancel={this.handleCancel}
                >
                    <CodeMirror value={this.state.code} onChange={this.updateCode} options={options} />
                </Modal>
            </div>
        )
    }
}