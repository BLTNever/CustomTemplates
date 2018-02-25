import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';
import { updateActivePageDateObject } from '../../actions';
import styles from '../LocationChoose/LocationChoose.css';



class LayerSet extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    setBottom(elements, activeId) {
        let haveZero;
        elements.map((v, k) => {
            if (v.get('id') !== activeId) {
                if (v.get('style').get('zIndex') && v.get('style').get('zIndex') === 0) {
                    haveZero = true;
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
        this.props.actions.updateActivePageDateObject({ key: ['elements'], value: elements });
    }

    render() {
        return (
            <table className={styles.locationChoose}>
                <tbody>
                    <tr className={styles.tr} >
                        <td><div><Button onClick={() => this.handleClick(0)}>上一层</Button></div></td>
                        <td><div><Button onClick={() => this.handleClick(1)}>下一层</Button></div></td>
                        <td><div><Button onClick={() => this.handleClick(2)}>最上层</Button></div></td>
                        <td><div><Button onClick={() => this.handleClick(3)}>最下层</Button></div></td>
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
export default connect(mapStateToProps, mapDispatchToProps)(LayerSet);
