const state = {
    isOpenCreateTask: false,
    isOpenEditTask: false,

};
const getters = {

};
const mutations = {
    SET_IS_OPEN_CREATE_TASK(state, value) {
        state.isOpenCreateTask = value;
    },
    SET_IS_OPEN_EDIT_TASK(state, value) {
        state.isOpenEditTask = value;
    },
};
const actions = {

};

export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true,
}