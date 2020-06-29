export default ({ store, app: { $axios } }) => {
  $axios.interceptors.request.use(
    (config) => {
      store.commit('loading/START_LOADING');
      return config;
    },
    (error) => {
      store.commit('loading/FINISH_LOADING');
      return Promise.reject(error);
    },
  );

  $axios.interceptors.response.use(
    (response) => {
      store.commit('loading/FINISH_LOADING');
      return response;
    },
    (error) => {
      store.commit('loading/FINISH_LOADING');
      return Promise.reject(error);
    },
  );
};
