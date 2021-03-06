import { MutationTree } from 'vuex';

interface LoaderState {
  isLoading: boolean;
}

export const state = (): LoaderState => ({
  isLoading: false,
});

export const mutations: MutationTree<LoaderState> = {
  START_LOADING: (state) => {
    state.isLoading = true;
  },
  FINISH_LOADING: (state) => {
    state.isLoading = false;
  },
};
