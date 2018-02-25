import { createAction } from 'redux-actions';
// import { SERVER_ADD } from '../constants';
import { SERVER_ADD, REQUESTURLS } from '../constants/requestUrl.js';

export const cancelRequest = createAction('cancelRequest');
export const removeFetchRequest = createAction('cancelRequest');

export const getInfo = createAction('getInfo', ({ oid, callback }) => {
    const fetchUrl = `${SERVER_ADD}customTemplate/getInfo?oid=${oid}`;
    return {
        fetchUrl: fetchUrl,
        fetchOptions: {
            method: 'get',
        },
        success: createAction(`${getInfo}.success`),
        failure: createAction(`${getInfo}.failure`),
        callback,
    };
});

// 获取 TemplateData
export const fetchTemplateData = createAction('fetchTemplateData', ({ dataUrl, callback }) => {
    const fetchUrl = dataUrl;
    return {
        fetchUrl: fetchUrl,
        fetchOptions: {
            method: 'get',
        },
        success: createAction(`${fetchTemplateData}.success`),
        failure: createAction(`${fetchTemplateData}.failure`),
        callback,
    };
});
// 获取 TemplateConfig
export const fetchTemplateConfig = createAction('fetchTemplateConfig', ({ configUrl, callback }) => {
    return {
        fetchUrl: configUrl,
        fetchOptions: {
            method: 'get',
        },
        success: createAction(`${fetchTemplateConfig}.success`),
        failure: createAction(`${fetchTemplateConfig}.failure`),
        callback,
    };
});

/**
 *  图片转换接口
*/
export const imageConvert = createAction('imageConvert', ({ imgList, callback }) => {
    return {
        fetchUrl: `${SERVER_ADD}${REQUESTURLS.imageConvert}`,
        fetchOptions: {
            method: 'post',
            body: imgList,
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
        },
        success: createAction(`${fetchTemplateConfig}.success`),
        failure: createAction(`${fetchTemplateConfig}.failure`),
        callback,
    };
});

export const saveJson = createAction('saveJson', ({ jsonInfo, oid, callback }) => {
    return {
        fetchUrl: `${SERVER_ADD}customTemplate/custom`,
        fetchOptions: {
            method: 'post',
            body: `jsonInfo=${encodeURI(JSON.stringify(jsonInfo))}&oid=${oid}`,
        },
        success: createAction(`${saveJson}.success`),
        failure: createAction(`${saveJson}.failure`),
        callback,
    };
});


