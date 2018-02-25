import { handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';
import { flowUpdate, flowAdd, flowDel } from '../actions';
import { updateObject, arrayPush, arrayRemove } from '../utils/changeState';
import config from '../constants/config.json';

const data = {
    // nodes: [
    //   {
    //     x: 240,
    //     y: 80,
    //     id: 'node_0',
    //     nodeKey: 'start',
    //   },
    // {
    //   x: 370,
    //   y: 30,
    //   id: 'node2',
    // },
    // ],
    // edges: [
    // {
    //   source: 'node1',
    //   id: 'edge2',
    //   target: 'node2',
    // },
    // ],
    // activeList: [
    // 'start',
    // ],
    // activeNode: {
    //   nodeKey: 'start',
    //   label: '开始',
    //   x: 240,
    //   y: 80,
    //   id: 'node_0',
    //   shape: 'rect',
    // },
    // nodes: [{
    //   // nodeKey: 'start',
    //   // label: '开始',
    //   x: 240,
    //   y: 80,
    //   id: 'node_0',
    //   shape: 'rect',
    // }],
    // edges: [],
    history: [
        {
            source: {
                nodes: [{
                    x: 240,
                    y: 80,
                    id: 'node_0',
                    shape: 'rect',
                }],
                edges: [],
            },
            buttons: config.buttons,
        }
    ],
    historyId: 0,
    // saveData: {
    //   source: {
    //     nodes: [{
    //       x: 240,
    //       y: 80,
    //       id: 'node_0',
    //       shape: 'rect',
    //     }],
    //     edges: [],
    //   },
    // },
    // buttons: config.buttons,
    // order: config.order,
    groups: config.groups,
};
const initialState = fromJS(data);

export const flow = handleActions({
    [flowAdd]: (state, action) => {
        return arrayPush(state, action);
    },
    [flowDel]: (state, action) => {
        return arrayRemove(state, action);
    },
    [flowUpdate]: (state, action) => {
        return updateObject(state, action);
    },
}, initialState);
