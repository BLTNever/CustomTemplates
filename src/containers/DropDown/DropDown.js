import React from 'react';
import { Collapse } from 'antd';
import styles from './DropDown.css';
import { ProgressSet, Palette, Selector, LayerSet, LocationChoose, Jump } from '../../containers/index';


function DropDown({ dropDownInfo }) {
    const { name, options } = dropDownInfo;
    const result = options.map((option, index) => {
        switch (option.type) {
            case 'progress':
                return (<div key={index}><ProgressSet {...option.attrs} /></div>);
            case 'palette':
                return (<div key={index}><Palette {...option.attrs} /></div>);
            case 'selector':
                return (<div key={index}><Selector {...option.attrs} /></div>);
            case 'locationChoose':
                return (<div key={index}><LocationChoose {...option.attrs} /></div>);
            case 'layerSet':
                return (<div key={index}><LayerSet {...option.attrs} /></div>);
            //   case 'linkSet':
            //     return (<div key={index}><LinkSet {...option.attrs} /></div>);
            case 'jump':
                return (<div key={index}><Jump {...option.attrs} /></div>);
            default:
                break;
        }
    });
    return (
        <div>
            {result}
        </div>
    );
}
export default DropDown;
