import { Map } from 'immutable';

export const updateObject = (state, action) => {
    return state.updateIn(action.payload.key, value => value && Map.isMap(value) ?
        value.merge(action.payload.value) : action.payload.value);
};

export const arrayPush = (state, action) => {
    return state.updateIn(action.payload.key, list => list.push(action.payload.value));
};

export const arrayRemove = (state, action) => {
    return state.updateIn(action.payload.key, list => list.delete(action.payload.index));
};

export const arrayUpdate = (state, action) => {
    return state.updateIn(action.payload.key, list =>
        list.update(action.payload.index, value => action.payload.value));
};
