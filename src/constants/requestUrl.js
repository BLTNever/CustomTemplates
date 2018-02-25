import { window } from 'global';

export const SERVER_ADD = window.location.href.includes('/manage-web/') ? '/manage-web/' : '';

export const REQUESTURLS = {
    getInfo: 'activityTemplate/getInfo',
    imageConvert: 'activityTemplate/imageConvert',
    saveJson: 'activityTemplate/custom',
    getHistoryInfo: 'activityTemplate/getHisInfo',
};
