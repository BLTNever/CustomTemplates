import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Menu, Tooltip } from 'antd';
import { fromJS, List } from 'immutable';
import { document } from 'global';
import {
    updateTemplateData, updateActivePageDateObject,
    updateActivePageDateArrayPush, updateTemplateDataArrayPush
} from '../../actions';
import { imageConvert, saveJson } from '../../actions/http';
import { UploadFile } from '../../components/index';

class Header extends Component {
    constructor(props) {
        super(props);
        // this.topBarClick = this.topBarClick.bind(this);
        // this.addElement = this.addElement.bind(this);
        // this.save = this.save.bind(this);
        this.getElementsLength = this.getElementsLength.bind(this);
        this.insertText = this.insertText.bind(this);
        this.insertBackground = this.insertBackground.bind(this);
        this.insertImg = this.insertImg.bind(this);
        this.insertAudio = this.insertAudio.bind(this);
        this.insertImgUrl = this.insertImgUrl.bind(this);
        this.handleImageConvertResult = this.handleImageConvertResult.bind(this);
        this.handleSaveJsonResult = this.handleSaveJsonResult.bind(this);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.imageConvertResult !== this.props.imageConvertResult) {
            this.handleImageConvertResult(nextProps);
        }

        if (nextProps.saveJsonResult !== this.props.saveJsonResult) {
            this.handleSaveJsonResult(nextProps);
        }
    }
    componentDidUpdate(prevProps) {
    }

    getElementsLength() {
        const { activePageData } = this.props;
        return activePageData.get('elements').size;
    }

    insertText() {
        const text = {
            tag: 'div',
            attr: {
                ref: this.getElementsLength(),
                id: this.getElementsLength(),
                key: this.getElementsLength(),
                draggable: false,
            },
            style: {
                textAlign: 'left',
                width: 150,
                height: 60,
                position: 'absolute',
                left: 0,
                top: 0,
                overflow: 'auto',
                wordBreak: 'break-all',
                color: 'rgba(0,0,0,1)',
                wordWrap: 'break-word',
            },
            value: '双击修改文本',
            static: false,
            visible: 'default',
        };
        this.props.actions.updateActivePageDateArrayPush({ key: ['elements'], value: fromJS(text) });
    }

    insertBackground(params) {
        const { value } = params;
        const style = {
            backgroundImage: `url(${value})`,
            backgroundPosition: 'center',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
        };
        this.props.actions.updateActivePageDateObject({ key: ['pageElement', 'style'], value: fromJS(style) });
    }

    insertImg(params) {
        const { value, width: imgWidth, height: imgHeight } = params;
        const img = {
            tag: 'img',
            attr: {
                ref: this.getElementsLength(),
                id: this.getElementsLength(),
                key: this.getElementsLength(),
                draggable: false,
                src: value,
            },
            style: {
                textAlign: 'left',
                width: imgWidth,
                height: imgHeight,
                position: 'absolute',
                left: 0,
                top: 0,
            },
            static: false,
            visible: 'default',
        };
        this.props.actions.updateActivePageDateArrayPush({ key: ['elements'], value: fromJS(img) });
    }

    insertAudio(params) {
        const { value, fileName } = params;
        const audio = {
            fileName,
            src: value,
        };
        this.props.actions.updateTemplateData({ key: ['audio'], value: fromJS(audio) });
    }

    handleImageConvertResult(nextProps) {
        const { imageConvertResult } = nextProps;
        if (imageConvertResult.payload) {
            const data = imageConvertResult.payload;
            if (data.success) {
                const urlList = data.data;
                const { info } = this.props;
                this.insertImgUrl(urlList);
                // const jsonInfo = JSON.stringify(copy)
                const oid = info.get('oid');
                const { templateData } = this.props;
                this.props.actions.saveJson({ jsonInfo: templateData.toJS(), oid });
            } else {
                // const text = '保存失败';
                // this.props.updatePopupInfo({ text, visible: true });
            }
        }
    }

    handleSaveJsonResult() {
        const { saveJsonResult } = this.props;
        if (saveJsonResult.payload) {
            const data = saveJsonResult.payload;
            // let text;
            // if (data.success) {
            //   text = '保存成功';
            // } else {
            //   text = '保存失败';
            // }
            // this.props.updatePopupInfo({ text, visible: true });
        }
    }

    getImgList(page, imgList, imgKeys) {
        page.map((value, key) => {
            if (value.get('pageElement')) {
                if (value.get('pageElement').get('style').get('backgroundImage') && value.get('pageElement').get('style').get('backgroundImage').includes('data:image')) {
                    imgList.push({ imageJson: value.get('pageElement').get('style').get('backgroundImage').substring(4, value.get('pageElement').get('style').get('backgroundImage').length - 1) });
                    imgKeys.push(['page', key, 'pageElement', 'style', 'backgroundImage']);
                }
            }
            value.get('elements').map((element, k) => {
                if (element.get('attr').get('src') && element.get('attr').get('src').includes('data:')) {
                    imgList.push({ imageJson: element.get('attr').get('src') });
                    imgKeys.push(['page', key, 'elements', k, 'attr', 'src']);
                }
            });
            if (value.get('children') && value.get('children').size > 0) {
                this.getImgList(value.get('children'), imgList, imgKeys);
            }
        });
        return { imgList, imgKeys };
    }

    insertImgUrl(urlList) {
        const imgKeys = this.state.imgKeys;
        let { templateData } = this.props;
        imgKeys.map((k, v) => {
            this.props.actions.updateTemplateData({ key: v, value: urlList[k] });
            templateData = templateData.updateIn(v, value => urlList[k]);
        });
        this.props.actions.updateTemplateData({ key: [], value: templateData });
    }

    save() {
        const { activePageData } = this.props;
        const { templateData } = this.props;
        const oid = this.props.info.get('oid');
        const editId = this.props.info.get('editId');
        const currentPage = this.props.info.get('currentPage');
        if (editId) {
            this.props.actions.updateActivePageDateObject({ key: ['elements', editId, 'value'], value: document.getElementById(editId).innerText });
        }
        this.props.actions.updateTemplateData({ key: ['page', currentPage], value: activePageData });
        const { imgList, imgKeys } = this.getImgList(templateData.get('page'), [], []);
        this.setState({ imgKeys });
        if (imgList.length > 0) {
            this.props.actions.imageConvert({ imgList });
        } else {
            this.props.actions.saveJson({ jsonInfo: templateData.toJS(), oid });
        }
    }

    render() {
        const option = this.props.info.get('option');
        return (
            <div >
                {option && option !== 'history' ?
                    <Menu mode="horizontal" theme="dark">
                        <Menu.Item>
                            <div onClick={this.insertText}>文字</div>
                        </Menu.Item>
                        <Menu.Item>
                            <Tooltip placement="bottomRight" title="推荐背景尺寸375*667(ihone6)">
                                <UploadFile params={{ accept: 'image/gif,image/jpeg,image/jpg,image/png', type: 'background', callback: this.insertBackground }}>
                                    背景
                </UploadFile>
                            </Tooltip>
                        </Menu.Item>
                        <Menu.Item>
                            <UploadFile params={{ accept: 'image/gif,image/jpeg,image/jpg,image/png', type: 'img', callback: this.insertImg }}>
                                图片
              </UploadFile>
                        </Menu.Item>
                        <Menu.Item>
                            <UploadFile params={{ accept: 'audio/mpeg,audio/mp3,audio/wav', errorMsg: '请上传mp3或wav格式的音乐', maxSize: '5MB', type: 'audio', callback: this.insertAudio }}>
                                音乐
              </UploadFile>
                        </Menu.Item>
                        <Menu.Item style={{ float: 'right' }}>
                            <span onClick={this.save}>保存</span>
                        </Menu.Item>
                    </Menu> :
                    <Menu mode="horizontal" theme="dark">
                        <Menu.Item>
                            <span style={{ opacity: 0 }}>首页</span>
                        </Menu.Item>
                    </Menu>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.get('info'),
        activePageData: state.get('activePageData'),
        templateData: state.get('templateData'),
        saveJsonResult: state.get('saveJsonResult'),
        imageConvertResult: state.get('imageConvertResult'),
    };
};
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        updateTemplateData,
        updateTemplateDataArrayPush,
        updateActivePageDateObject,
        updateActivePageDateArrayPush,
        imageConvert,
        saveJson,
    }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
