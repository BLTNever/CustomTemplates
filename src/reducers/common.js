import { handleActions } from 'redux-actions';
import { Map } from 'immutable';
import {
    updateInfo, updateTemplateData, updateActivePageDateObject,
    updateActivePageDateArrayPush, updateActivePageDateArrayRemove,
    updateActivePageDateArrayUpdate, updateTemplateDataArrayPush,
    updateTemplateDataArrayRemove, updateTemplateDataArrayUpdate, updateAudio
} from '../actions';
import { fetchTemplateData, fetchTemplateConfig, imageConvert, saveJson } from '../actions/http';
import { updateObject, arrayPush, arrayRemove, arrayUpdate } from '../utils/changeState';

const initialState = Map();

export const info = handleActions({
    [updateInfo]: (state, action) => {
        return state.set(action.payload.key, action.payload.value);
    },
}, initialState);

export const templateData = handleActions({
    [updateTemplateData]: (state, action) => {
        return updateObject(state, action);
    },
    [updateTemplateDataArrayPush]: (state, action) => {
        return arrayPush(state, action);
    },
    [updateTemplateDataArrayRemove]: (state, action) => {
        return arrayRemove(state, action);
    },
    [updateTemplateDataArrayUpdate]: (state, action) => {
        return arrayUpdate(state, action);
    },
}, initialState);

export const activePageData = handleActions({
    [updateActivePageDateObject]: (state, action) => {
        return updateObject(state, action);
    },
    [updateActivePageDateArrayPush]: (state, action) => {
        return arrayPush(state, action);
    },
    [updateActivePageDateArrayRemove]: (state, action) => {
        return arrayRemove(state, action);
    },
    [updateActivePageDateArrayUpdate]: (state, action) => {
        return arrayUpdate(state, action);
    },

}, initialState);

export const templateDataResult = handleActions({
    [fetchTemplateData]: (state, action) => action.payload,
    [`${fetchTemplateData}.failure`]: (state, action) => action.payload,
    [`${fetchTemplateData}.success`]: (state, action) => action.payload,
}, {});

export const templateConfigResult = handleActions({
    [fetchTemplateConfig]: (state, action) => action.payload,
    [`${fetchTemplateConfig}.failure`]: (state, action) => action.payload,
    [`${fetchTemplateConfig}.success`]: (state, action) => action.payload,
}, {});

export const imageConvertResult = handleActions({
    [imageConvert]: (state, action) => action.payload,
    [`${imageConvert}.failure`]: (state, action) => action.payload,
    [`${imageConvert}.success`]: (state, action) => action.payload,
}, {});

export const saveJsonResult = handleActions({
    [saveJson]: (state, action) => action.payload,
    [`${saveJson}.failure`]: (state, action) => action.payload,
    [`${saveJson}.success`]: (state, action) => action.payload,
}, {});


// export const info = (state = initialState, action) => {
//   switch (action.type) {
//     case 'updateInfo':
//       console.log(state.get(action.payload.key));
//       return state.set(action.payload.key, action.payload.value);
//     default:
//       return state;
//   }
// };
