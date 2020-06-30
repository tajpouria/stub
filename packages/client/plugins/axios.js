export default ({ store, app: { $axios } }) => {
  // Not to throw Error on 4xx and 5xx response http status
  $axios.defaults.validateStatus = () => true;

  $axios.interceptors.request.use(
    (config) => {
      store.commit('loading/START_LOADING');
      return config;
    },
    (error) => {
      store.commit('loading/FINISH_LOADING');
      return error;
    },
  );

  $axios.interceptors.response.use(
    (response) => {
      store.commit('loading/FINISH_LOADING');
      return response;
    },
    (error) => {
      store.commit('loading/FINISH_LOADING');
      return error;
    },
  );
};
