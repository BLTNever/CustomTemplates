

import React, { Component } from 'react';
import { message } from 'antd';
import styles from './UploadFile.css';

/**
 * 上传图片组件
 * accept：上传文件类型
 * <UploadFile accept='image/gif,image/jpeg,,image/jpg,image/png'
 *  errorMsg='请上传png、jpg、gif格式的图片' maxSize='500K' type='img' callback='callback'></UploadFile>
 */
export default class UploadFile extends Component {
    render() {
        return (
            <div >
                <div onClick={() => { this.uploadFile.click(); }}>
                    {this.props.children}
                </div>
                <input
                    id="uploadFile"
                    ref={(c) => { this.uploadFile = c; }}
                    className={styles.upload} type="file" style={{ width: this.props.params.width ? this.props.params.width : '0', height: this.props.params.height ? this.props.params.height : '0' }}
                    accept={this.props.params.accept}
                    onChange={(e) => { uploadFile(e.target, this.props.params); }}
                />
            </div>
        );
    }
}



function uploadFile(event, params) {
    const file = event.files ? event.files[0] : null;
    const { accept = 'image/gif,image/jpeg,image/jpg,image/png', errorMsg = '请上传png、jpg、gif格式的图片', maxSize = '500K', type, callback } = params;
    if (file) {
        if (file.type && accept.indexOf(file.type) === -1) {
            event.value = '';
            message.error(errorMsg, 2);
            return;
        }

        if (file.size > parseFloat(maxSize.indexOf('K') > -1 ? maxSize : (parseFloat(maxSize) * 1024)) * 1024) {
            event.value = '';
            message.error(`请上传小于${maxSize}的文件`, 2);
            return;
        }

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (e) => {
            if (file.type.indexOf('image') > -1) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const width = img.width;
                    const height = img.height;
                    event.value = '';
                    return callback({
                        value: e.target.result,
                        type,
                        fileName: file.name,
                        width,
                        height
                    });
                };
            } else {
                // 有些（不靠谱的）游览器没有file type
                if (!file.type && accept) {
                    const fileValidation = accept.split(',').some((val) => {
                        return e.target.result.indexOf(val) > -1;
                    });
                    if (!fileValidation) {
                        message.error(errorMsg, 2);
                        return;
                    }
                }
                event.value = '';
                return callback({ value: e.target.result, fileName: file.name, type });
            }
        };
    } else {
        message.error('没有文件', 2);
    }
}
