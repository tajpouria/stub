export default (isLoading, countModifier, { store }) => {
  isLoading
    ? store.commit('loading/START_LOADING')
    : store.commit('loading/FINISH_LOADING');
};
