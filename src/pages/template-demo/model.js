
export default {
  namespace: 'administrator',
  state: {
    list: [],
    modalVisible: false,
    currentItem: {},
    modalType: 'create',
  },
  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },
  }
}
