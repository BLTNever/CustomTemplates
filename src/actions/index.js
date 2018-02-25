import { createAction } from 'redux-actions';

export const updateInfo = createAction('updateInfo');
export const updateTemplateData = createAction('updateTemplateData');
export const updateActivePageDateObject = createAction('updateActivePageDateObject');
export const updateActivePageDateArrayPush = createAction('updateActivePageDateArrayPush');
export const updateActivePageDateArrayUpdate = createAction('updateActivePageDateArrayUpdate');
export const updateActivePageDateArrayRemove = createAction('updateActivePageDateArrayRemove');
export const updateTemplateDataArrayPush = createAction('updateTemplateDataArrayPush');
export const updateTemplateDataArrayRemove = createAction('updateTemplateDataArrayRemove');
export const updateTemplateDataArrayUpdate = createAction('updateTemplateDataArrayUpdate');

// flow
export const flowUpdate = createAction('flowUpdate');
export const flowAdd = createAction('flowAdd');
export const flowDel = createAction('flowDel');

// export function updateInfo(payload) {
//   return {
//     type: 'updateInfo',
//     payload,
//   };
// }
