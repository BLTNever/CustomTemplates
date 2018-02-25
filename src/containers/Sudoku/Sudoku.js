import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Tabs, Modal, Button, Radio, Layout } from 'antd';
import styles from './Sudoku.css';
import { updateInfo, updateActivePageDateObject } from '../../actions';
import { UploadFile } from '../../components/index';
class Sudoku extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.uploadImg = this.uploadImg.bind(this);
        this.state = {
            value : 8,
        }
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    handleChange(e) {
        this.setState({
            value : e.target.value,
        })
    }
    uploadImg(params) {
        console.log(params);
        this.setState({
            sudokuBg : params.value, 
        })
    }
    render() {
        const { Header, Footer, Sider, Content } = Layout;
        const RadioButton = Radio.Button;
        const RadioGroup = Radio.Group;

        return (
            <div className={styles.sodoku}>
                <Layout>
                    <Header className={styles.sudokuHeader}>九宫格页设置</Header>
                    <Content className={styles.sudokuCon}>
                        <Row className={styles.sudokuRow}>
                            <Col span={10} className={styles.leftCol}>
                                <span>*</span>
                                设置九宫格奖品数量&nbsp;&nbsp;:
                            </Col>
                            <Col span={14} className={styles.rightCol}>
                                <RadioGroup value={this.state.value} size="large" onChange={this.handleChange}>
                                    <RadioButton value={8}>8</RadioButton>
                                    <RadioButton value={10}>10</RadioButton>
                                    <RadioButton value={12}>12</RadioButton>
                                </RadioGroup>
                            </Col>
                        </Row>
                        <Row className={styles.sudokuRow}>
                            <Col span={10} className={styles.leftCol}>
                                <span>*</span>
                                上传背景图片&nbsp;&nbsp;:
                            </Col>
                            <Col span={14} className={styles.rightCol}>
                                <Button type="primary" size="large">
                                    <UploadFile params={{ accept: 'image/gif,image/jpeg,image/jpg,image/png', type: 'img', callback: this.uploadImg }}>
                                        上传图片
                                    </UploadFile>
                                </Button>
                            </Col>
                        </Row>
                        <Row className={styles.sudokuImg}>
                            <div className={styles.bgCon} style={{ backgroundImage: `${this.state.sudokuBg}`}}>
                                <img src={`http://ty-static-test.oss-cn-hangzhou.aliyuncs.com/m/1/images/sudoku${this.state.value}.png`} alt="" className={styles.maskImg} />
                                <img src={this.state.sudokuBg} alt="" className={styles.bgImg} />
                            </div>
                           
                          
                        </Row>
                        <Row className={styles.sudokuNote}>
                            注意: 九宫格的分割位置需要和示意图一致
                        </Row>
                    </Content>
                    <Footer className={styles.sudokuFooter}>
                        Footer
                    </Footer>
                </Layout>
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
export default connect(mapStateToProps, mapDispatchToProps)(Sudoku);
