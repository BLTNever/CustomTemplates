import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';
import { updateActivePageDateObject } from '../../actions';
import styles from './LocationChoose.css';

class LocationChoose extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleLayerSetClick = this.handleLayerSetClick.bind(this);
    }

    setBottom(elements, activeId) {
        let haveZero;
        elements.map((v, k) => {
            if (v.get('id') !== activeId) {
                if (v.get('style').get('zIndex') && v.get('style').get('zIndex') === 0) {
                    haveZero = true;
                } else if (!v.get('style').get('zIndex')) {
                    elements = elements.updateIn([k, 'style', 'zIndex'], value => 1);
                }
            }
        });
        if (haveZero) {
            elements.map((v, k) => {
                if (v.get('id') !== activeId) {
                    // e.style.zIndex = e.style.zIndex ? e.style.zIndex + 1 : 1;
                    elements = elements.updateIn([k, 'style', 'zIndex'], value => value ? value + 1 : 1);
                }
            });
        } else {
            elements = elements.updateIn([activeId, 'style', 'zIndex'], value => 0);
        }
        return elements;
    }

    setTop(elements, activeId, zIndexResult) {
        elements.map((v) => {
            if (v.get('id') !== activeId) {
                if (v.get('style').get('zIndex') && v.get('style').get('zIndex') > zIndexResult) {
                    zIndexResult = v.get('style').get('zIndex') + 1;
                }
            }
        });
        return zIndexResult;
    }

    handleClick(id) {
        const { activePageData } = this.props;
        const activeId = this.props.info.get('activeId');
        // const copy = Object.assign({}, templateData);
        // const nowPage = copy.page[activePage];
        // const activeElement = nowPage.elements[activeId].style;
        const width = activePageData.get('elements').get(activeId).get('style').get('width');
        const height = activePageData.get('elements').get(activeId).get('style').get('height');
        switch (id) {
            case 0:
                // activeElement.left = 0;
                this.props.actions.updateActivePageDateObject({ key: ['elements', activeId, 'style', 'left'], value: 0 });
                break;
            case 1:
                // activeElement.left = 375 / 2 - width / 2;
                this.props.actions.updateActivePageDateObject({ key: ['elements', activeId, 'style', 'left'], value: (375 / 2) - (width / 2) });
                break;
            case 2:
                // activeElement.left = 375 - width;
                this.props.actions.updateActivePageDateObject({ key: ['elements', activeId, 'style', 'left'], value: 375 - width });
                break;
            case 3:
                // activeElement.top = 0;
                this.props.actions.updateActivePageDateObject({ key: ['elements', activeId, 'style', 'top'], value: 0 });
                break;
            case 4:
                // activeElement.top = 667 / 2 - height / 2;
                this.props.actions.updateActivePageDateObject({ key: ['elements', activeId, 'style', 'top'], value: (667 / 2) - (height / 2) });
                break;
            case 5:
                // activeElement.top = 667 - height;
                this.props.actions.updateActivePageDateObject({ key: ['elements', activeId, 'style', 'top'], value: 667 - height });
                break;
            default:
                break;
        }
    }

    handleLayerSetClick(id) {
        const { activePageData } = this.props;
        const activeId = this.props.info.get('activeId');
        const activeElement = activePageData.get('elements').get(activeId).get('style');
        const zIndex = activeElement.get('zIndex') ? activeElement.get('zIndex') : 0;
        let elements = activePageData.get('elements');
        let zIndexResult = 0;
        switch (id) {
            case 0:
                // zIndexResult = zIndex + 1;
                elements = elements.updateIn([activeId, 'style', 'zIndex'], value => zIndex + 1);
                break;
            case 1:
                if (zIndex === 0) {
                    elements = this.setBottom(elements, activeId);
                } else {
                    // zIndexResult = zIndex - 1;
                    elements = elements.updateIn([activeId, 'style', 'zIndex'], value => zIndex - 1);
                }
                break;
            case 2:
                zIndexResult = this.setTop(elements, activeId, zIndexResult);
                elements = elements.updateIn([activeId, 'style', 'zIndex'], value => zIndexResult);
                break;
            case 3:
                elements = this.setBottom(elements, activeId);
                break;
            default:
                break;
        }
        // activeElement.zIndex = zIndexResult;
        console.log(elements.toJS());
        this.props.actions.updateActivePageDateObject({ key: ['elements'], value: elements });
    }

    render() {
        return (
            <div>
                <table className={styles.locationChoose}>
                    <tbody>
                        <tr className={styles.tr} >
                            <td><div><Button type="primary" onClick={() => this.handleClick(0)}>居左</Button></div></td>
                            <td><div><Button type="primary" onClick={() => this.handleClick(1)}>水平居中</Button></div></td>
                            <td><div><Button type="primary" onClick={() => this.handleClick(2)}>居右</Button></div></td>
                        </tr>
                        <tr className={styles.tr}>
                            <td><div><Button type="primary" onClick={() => this.handleClick(3)}>居上</Button></div></td>
                            <td><div><Button type="primary" onClick={() => this.handleClick(4)}>垂直居中</Button></div></td>
                            <td><div><Button type="primary" onClick={() => this.handleClick(5)}>居下</Button></div></td>
                        </tr>
                    </tbody>
                </table>
                <table className={styles.locationChoose}>
                    <tbody>
                        <tr className={styles.tr} >
                            <td><div><Button type="primary" onClick={() => this.handleLayerSetClick(0)}>上一层</Button></div></td>
                            <td><div><Button type="primary" onClick={() => this.handleLayerSetClick(1)}>下一层</Button></div></td>
                            <td><div><Button type="primary" onClick={() => this.handleLayerSetClick(2)}>最上层</Button></div></td>
                            <td><div><Button type="primary" onClick={() => this.handleLayerSetClick(3)}>最下层</Button></div></td>
                        </tr>
                    </tbody>
                </table>
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
export default connect(mapStateToProps, mapDispatchToProps)(LocationChoose);
