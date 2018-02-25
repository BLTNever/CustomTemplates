import React from 'react';
import styles from './SelectorBox.css';

function SelectorBox({ display, width, height, left, top, rotate }) {
    function renderElements() {
        const addStyle = {
            active: {
                display: 'block',
            },
            inactive: {
                display: 'none',
            },
            selector: {
                width,
                height,
                left,
                top,
            },
        };
        const activeStyle = display ? addStyle.active : addStyle.inactive;
        const rotateSyle = { transform: `rotate(${rotate}deg)` };
        const selectorStyle = Object.assign({}, addStyle.selector, activeStyle, rotateSyle);
        return (
            <div id="selector" className={styles.selector} style={selectorStyle} rotate={rotate}>
                <div className={styles.circleNw} />
                <div className={styles.circleNe} />
                <div className={styles.circleSe} />
                <div className={styles.circleSw} />
                <div className={styles.lineN}>
                    <div className={styles.circleN} />
                </div>
                <div className={styles.lineE}>
                    <div className={styles.circleE} />
                </div>
                <div className={styles.lineS}>
                    <div className={styles.circleS} />
                </div>
                <div className={styles.lineW}>
                    <div className={styles.circleW} />
                </div>
                <div className={styles.barMidleLine} />
                <div className={styles.rotateLine} />
                <div className={styles.rotateCircle} />
            </div>
        );
    }
    return (
        renderElements()
    );
}

export default SelectorBox;
