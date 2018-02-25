import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Collapse, Button, message, Row, Col, Checkbox } from 'antd';
import { fromJS } from 'immutable';
import {
    updateActivePageDateObject, updateTemplateData, updateTemplateDataArrayRemove,
    updateTemplateDataArrayPush
} from '../../actions';
import { UploadFile } from '../../components/index';
import styles from './Sider.css';

class Sider extends Component {
    constructor(props) {
        super(props);
        this.setBgToAll = this.setBgToAll.bind(this);
        this.deletePublicMusic = this.deletePublicMusic.bind(this);
        this.replaceBg = this.replaceBg.bind(this);
        this.replacePublicMusic = this.replacePublicMusic.bind(this);
        this.changeMusicLoop = this.changeMusicLoop.bind(this);
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    setBgToAll() {
        const { templateData, activePageData } = this.props;
        const nowBg = activePageData.get('pageElement').get('style').get('backgroundImage');
        if (!nowBg) return;
        // templateData.page.public.pageElement.style.backgroundImage = nowBg;

        // for (const key in copy.page) {
        //   if (key !== 'public') {
        //     copy.page[key].pageElement.style.backgroundImage = '';
        //   }
        // }

        const nPage = templateData.get('page').map((v, k) => {
            if (k !== 'public') {
                // copy.page[key].pageElement.style.backgroundImage = '';
                return v.updateIn(['pageElement', 'style', 'backgroundImage'], value => '');
            } else {
                return v;
            }
        });
        this.props.actions.updateTemplateData({ key: ['page'], value: nPage });
        this.props.actions.updateTemplateData({ key: ['page', 'public', 'pageElement', 'style', 'backgroundImage'], value: nowBg });
        message.success('应用成功');
    }

    replaceBg(params) {
        const { value } = params;
        const style = {
            backgroundImage: `url(${value})`,
            backgroundPosition: 'center',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
        };
        this.props.actions.updateActivePageDateObject({ key: ['pageElement', 'style'], value: fromJS(style) });
    }

    replacePublicMusic(params) {
        const { value, fileName } = params;
        const audio = {
            fileName,
            src: value,
        };
        this.props.actions.updateTemplateData({ key: ['audio'], value: fromJS(audio) });
    }

    deletePublicMusic() {
        const audio = {
            fileName: '',
            src: '',
        };
        this.props.actions.updateTemplateData({ key: ['audio'], value: fromJS(audio) });
    }

    changeMusicLoop(e) {
        this.props.actions.updateTemplateData({ key: ['audio', 'loop'], value: e.target.checked });
    }

    render() {
        const { templateData } = this.props;
        const musicName = templateData.get('audio').get('fileName');
        const musicLoop = templateData.get('audio').get('loop');
        return (
            <div className={styles.sider}>
                <Collapse accordion defaultActiveKey="1">
                    <Collapse.Panel header="背景设置" key="1">
                        <div>
                            <Row>
                                <Col span={12} >
                                    <div className={styles.piece}>
                                        <UploadFile params={{ accept: 'image/gif,image/jpeg,image/jpg,image/png', type: 'background', callback: this.replaceBg }}>
                                            <Button type="primary" >替换背景</Button>
                                        </UploadFile>
                                    </div>
                                </Col>
                                <Col span={12}><div className={styles.piece}><Button type="primary" onClick={this.setBgToAll}>应用到全部</Button></div></Col>
                            </Row>
                        </div>
                    </Collapse.Panel>
                    <Collapse.Panel header="音乐设置" key="2">
                        <div>
                            <Row>
                                <Col span={12}><div className={styles.piece}><div className={styles.musicName}>文件名称:{musicName || '无'}</div></div></Col>
                                <Col span={12}>
                                    <div className={styles.piece}>
                                        <Checkbox onChange={this.changeMusicLoop} defaultChecked={musicLoop} disabled={musicName === ''} >循环播放</Checkbox>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className={styles.line}>
                            <Row>
                                <Col span={12}><div className={styles.piece}><Button type="primary" onClick={this.deletePublicMusic}>删除音乐</Button></div></Col>
                                <Col span={12}>
                                    <div className={styles.piece}>
                                        <UploadFile params={{ accept: 'audio/mpeg,audio/mp3,audio/wav', errorMsg: '请上传mp3或wav格式的音乐', maxSize: '5MB', type: 'audio', callback: this.replacePublicMusic }}>
                                            <Button type="primary">
                                                替换音乐
                      </Button>
                                        </UploadFile>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Collapse.Panel>
                    <Collapse.Panel header="系统元素" key="3">

                    </Collapse.Panel>
                </Collapse>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.get('info'),
        activePageData: state.get('activePageData'),
        templateData: state.get('templateData'),
    };
};
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        updateActivePageDateObject,
        updateTemplateData,
        updateTemplateDataArrayRemove,
        updateTemplateDataArrayPush,
    }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Sider);
